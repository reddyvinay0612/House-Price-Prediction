"""
Training and benchmark orchestration module for the House Price Prediction System.
Coordinates:
1. Data loading and 80/20 train-test split (random_state=0)
2. Leakage-free preprocessing and feature engineering
3. Model training & 5-fold cross validation across 8+ algorithms
4. Hyperparameter tuning (GridSearchCV / RandomizedSearchCV)
5. Metric evaluation and serialization to models/ and reports/
6. High-resolution figure generation to reports/figures/
"""

import logging
import sys
import time
from pathlib import Path
from typing import Dict, Tuple

# Ensure project root is in sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import GridSearchCV, RandomizedSearchCV, train_test_split

from src.config import (
    FIGURES_DIR,
    MODELS_DIR,
    PROCESSED_DATA_DIR,
    RANDOM_SEED,
    RESULTS_CSV_PATH,
    TARGET_COLUMN,
    TEST_SIZE,
)
from src.data_loader import load_raw_data
from src.evaluate import evaluate_single_model, save_results_to_csv
from src.features import compute_skewness_summary, extract_feature_importances, get_top_correlated_features
from src.models import get_all_models, get_model
from src.preprocessing import (
    create_full_data_pipeline,
    inverse_log_transform_target,
    log_transform_target,
    remove_outliers,
)
from src.visualize import (
    plot_actual_vs_predicted,
    plot_correlation_heatmap,
    plot_feature_importance_bar,
    plot_key_features_scatter,
    plot_missing_values,
    plot_model_comparison,
    plot_outliers_before_after,
    plot_target_distribution,
    plot_top_correlated_bar,
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


def run_hyperparameter_tuning(
    X_train: np.ndarray,
    y_train_log: np.ndarray,
    model_name: str,
) -> Tuple[object, dict]:
    """
    Performs grid / randomized search hyperparameter tuning for a given model type.
    """
    logger.info(f"Running hyperparameter tuning for {model_name}...")
    
    if model_name == "DecisionTree":
        param_grid = {
            "max_depth": [5, 8, 10, 15, 20],
            "min_samples_split": [2, 5, 10],
            "min_samples_leaf": [1, 2, 4],
        }
        search = GridSearchCV(
            get_model("DecisionTree"),
            param_grid,
            cv=5,
            scoring="neg_root_mean_squared_error",
            n_jobs=-1,
        )
    elif model_name == "RandomForest":
        param_dist = {
            "n_estimators": [300, 600, 1200],
            "max_depth": [20, 40, 60, None],
            "min_samples_split": [2, 5],
            "min_samples_leaf": [1, 2],
        }
        search = RandomizedSearchCV(
            get_model("RandomForestFast"),
            param_dist,
            n_iter=6,
            cv=5,
            scoring="neg_root_mean_squared_error",
            random_state=RANDOM_SEED,
            n_jobs=-1,
        )
    elif model_name == "XGBoost":
        param_dist = {
            "n_estimators": [300, 500, 800],
            "learning_rate": [0.01, 0.03, 0.05],
            "max_depth": [3, 4, 6],
            "subsample": [0.7, 0.8, 1.0],
            "colsample_bytree": [0.7, 0.8, 1.0],
        }
        search = RandomizedSearchCV(
            get_model("XGBoost"),
            param_dist,
            n_iter=6,
            cv=5,
            scoring="neg_root_mean_squared_error",
            random_state=RANDOM_SEED,
            n_jobs=-1,
        )
    else:
        return get_model(model_name), {}

    search.fit(X_train, y_train_log)
    logger.info(f"Best params for {model_name}: {search.best_params_} (Best CV RMSE: {-search.best_score_:.4f})")
    return search.best_estimator_, search.best_params_


def train_and_evaluate_all(
    fast_mode: bool = False,
    tune_hyperparameters: bool = False,
) -> Tuple[pd.DataFrame, Dict[str, object], object]:
    """
    Executes the full end-to-end training and evaluation workflow.
    
    Args:
        fast_mode: If True, uses lighter tree estimators for rapid testing.
        tune_hyperparameters: If True, runs Grid/Random search before final fit.
        
    Returns:
        Tuple[pd.DataFrame, Dict[str, object], object]:
            (results_df, trained_models_dict, fitted_pipeline)
    """
    logger.info("=" * 70)
    logger.info("HOUSE PRICE PREDICTION SYSTEM - TRAINING & BENCHMARK PIPELINE")
    logger.info("=" * 70)

    # 1. Load Raw Data
    train_raw, _ = load_raw_data()
    logger.info(f"Raw dataset dimensions: {train_raw.shape}")

    # 2. Generate Initial EDA Visualizations
    logger.info("Generating EDA and statistical distribution figures...")
    plot_missing_values(train_raw, save_path=FIGURES_DIR / "missing_values.png")
    
    # 3. Outlier Handling & Visual Comparison
    train_cleaned = remove_outliers(train_raw)
    plot_outliers_before_after(
        train_raw,
        train_cleaned,
        save_path=FIGURES_DIR / "outlier_removal_comparison.png",
    )

    # 4. Target Distribution Analysis (Before & After Log Transform)
    y_raw = train_cleaned[TARGET_COLUMN].values
    y_log_full = log_transform_target(y_raw)
    plot_target_distribution(
        y_raw,
        y_log_full,
        save_path=FIGURES_DIR / "target_distribution_qq_plot.png",
    )

    # 5. Correlation and Feature Analysis
    plot_correlation_heatmap(train_cleaned, top_k=15, save_path=FIGURES_DIR / "correlation_heatmap.png")
    top_corr_series = get_top_correlated_features(train_cleaned, top_n=10)
    plot_top_correlated_bar(top_corr_series, save_path=FIGURES_DIR / "top_correlated_features.png")
    plot_key_features_scatter(train_cleaned, save_path=FIGURES_DIR / "key_features_scatter.png")

    # 6. Train / Test Split (80/20 with fixed random seed)
    logger.info(f"Splitting data into 80% train and 20% test sets (random_state={RANDOM_SEED})...")
    df_train_split, df_test_split = train_test_split(
        train_cleaned,
        test_size=TEST_SIZE,
        random_state=RANDOM_SEED,
    )

    # 7. Fit Preprocessor ONLY on Training Split to Prevent Data Leakage
    logger.info("Fitting feature engineering and preprocessing pipeline on training split...")
    pipeline, X_train_processed_df, y_train_log = create_full_data_pipeline(df_train_split, scale_numeric=True)

    # Transform Test Set
    X_test_raw = df_test_split.drop(columns=[TARGET_COLUMN, "Id"], errors="ignore")
    y_test_dollars = df_test_split[TARGET_COLUMN].values
    y_test_log = log_transform_target(y_test_dollars)
    
    X_test_processed = pipeline.transform(X_test_raw)
    X_train_processed = X_train_processed_df.values
    feature_names = (
        X_train_processed_df.columns.tolist()
        if hasattr(X_train_processed_df, "columns")
        else [f"f_{i}" for i in range(X_train_processed.shape[1])]
    )

    logger.info(f"Engineered feature matrix shape: Training {X_train_processed.shape}, Test {X_test_processed.shape}")

    # Save Processed Datasets
    pd.DataFrame(X_train_processed, columns=feature_names).to_parquet(
        PROCESSED_DATA_DIR / "X_train.parquet", index=False
    )
    pd.DataFrame(X_test_processed, columns=feature_names).to_parquet(
        PROCESSED_DATA_DIR / "X_test.parquet", index=False
    )
    pd.Series(y_train_log, name="y_train_log").to_frame().to_parquet(
        PROCESSED_DATA_DIR / "y_train.parquet", index=False
    )
    pd.Series(y_test_log, name="y_test_log").to_frame().to_parquet(
        PROCESSED_DATA_DIR / "y_test.parquet", index=False
    )
    joblib.dump(pipeline, MODELS_DIR / "preprocessing_pipeline.joblib")
    logger.info("Saved preprocessing pipeline to models/preprocessing_pipeline.joblib")

    # 8. Model Training, Tuning & Evaluation
    models_dict = get_all_models(fast_mode=fast_mode)
    results_list = []
    trained_models = {}

    for model_name, model_inst in models_dict.items():
        # Optional Hyperparameter Tuning
        if tune_hyperparameters and model_name in ["Decision Tree", "Random Forest", "XGBoost"]:
            model_key = "DecisionTree" if "Tree" in model_name else ("RandomForest" if "Forest" in model_name else "XGBoost")
            tuned_model, _ = run_hyperparameter_tuning(X_train_processed, y_train_log, model_key)
            model_inst = tuned_model

        metrics = evaluate_single_model(
            model_name=model_name,
            model=model_inst,
            X_train=X_train_processed,
            y_train_log=y_train_log,
            X_test=X_test_processed,
            y_test_log=y_test_log,
            run_cv=True,
        )
        results_list.append(metrics)
        trained_models[model_name] = model_inst

        # Save model artifact
        safe_filename = model_name.lower().replace(" ", "_").replace("(", "").replace(")", "") + ".joblib"
        joblib.dump(model_inst, MODELS_DIR / safe_filename)

        # Plot Actual vs. Predicted & Residuals
        y_pred_log = model_inst.predict(X_test_processed)
        y_pred_usd = inverse_log_transform_target(y_pred_log)
        plot_actual_vs_predicted(
            y_true_usd=y_test_dollars,
            y_pred_usd=y_pred_usd,
            model_name=model_name,
            save_path=FIGURES_DIR / f"diagnostics_{safe_filename.replace('.joblib', '')}.png",
        )

    # 9. Save Evaluation Results
    results_df = save_results_to_csv(results_list, output_path=RESULTS_CSV_PATH)
    logger.info("\n" + "=" * 70 + "\nMODEL BENCHMARK RESULTS:\n" + "=" * 70)
    logger.info("\n" + results_df.to_string(index=False))

    # 10. Model Comparison Visualization (Matching Research Papers)
    plot_model_comparison(results_df, save_path=FIGURES_DIR / "model_comparison_charts.png")

    # 11. Feature Importance (Random Forest & XGBoost)
    if "Random Forest" in trained_models:
        rf_imp = extract_feature_importances(trained_models["Random Forest"], feature_names, top_n=20)
        plot_feature_importance_bar(
            rf_imp,
            title="Random Forest - Top 20 Feature Importances",
            save_path=FIGURES_DIR / "feature_importance_random_forest.png",
        )

    if "XGBoost" in trained_models:
        xgb_imp = extract_feature_importances(trained_models["XGBoost"], feature_names, top_n=20)
        plot_feature_importance_bar(
            xgb_imp,
            title="XGBoost - Top 20 Feature Importances",
            save_path=FIGURES_DIR / "feature_importance_xgboost.png",
        )

    logger.info("Training and evaluation completed successfully.")
    return results_df, trained_models, pipeline


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="House Price Prediction - Model Training Pipeline")
    parser.add_argument("--fast", action="store_true", help="Run with lighter estimators for fast testing")
    parser.add_argument("--tune", action="store_true", help="Run GridSearchCV/RandomizedSearchCV tuning")
    args = parser.parse_args()

    train_and_evaluate_all(fast_mode=args.fast, tune_hyperparameters=args.tune)
