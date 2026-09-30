"""
Evaluation module for the House Price Prediction System.
Calculates regression metrics (R2, RMSE, MAE, MSE), computes inverse dollar transformations,
performs 5-fold cross validation, and exports evaluation benchmarks to CSV.
"""

import logging
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple, Union

import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import KFold, cross_val_score

from src.config import CV_FOLDS, RANDOM_SEED, RESULTS_CSV_PATH
from src.preprocessing import inverse_log_transform_target

logger = logging.getLogger(__name__)


def compute_regression_metrics(
    y_true_dollars: np.ndarray,
    y_pred_dollars: np.ndarray,
    y_true_log: Optional[np.ndarray] = None,
    y_pred_log: Optional[np.ndarray] = None,
) -> Dict[str, float]:
    """
    Computes standard regression metrics in both Dollar ($) units and Log space.
    
    Returns:
        Dict[str, float]: R2, RMSE_USD, MAE_USD, MSE_USD, RMSE_log, MAE_log
    """
    # Dollar-space metrics
    r2 = float(r2_score(y_true_dollars, y_pred_dollars))
    mae_usd = float(mean_absolute_error(y_true_dollars, y_pred_dollars))
    mse_usd = float(mean_squared_error(y_true_dollars, y_pred_dollars))
    rmse_usd = float(np.sqrt(mse_usd))

    metrics = {
        "R2_Score": r2,
        "RMSE_USD": rmse_usd,
        "MAE_USD": mae_usd,
        "MSE_USD": mse_usd,
    }

    # Log-space metrics if provided
    if y_true_log is not None and y_pred_log is not None:
        mse_log = mean_squared_error(y_true_log, y_pred_log)
        metrics["RMSE_log"] = float(np.sqrt(mse_log))
        metrics["MAE_log"] = float(mean_absolute_error(y_true_log, y_pred_log))

    return metrics


def evaluate_model_cv(
    model: Any,
    X: np.ndarray,
    y_log: np.ndarray,
    cv_folds: int = CV_FOLDS,
    random_state: int = RANDOM_SEED,
) -> Tuple[float, float]:
    """
    Performs K-Fold Cross Validation on the training set in log-target space.
    
    Returns:
        Tuple[float, float]: (cv_rmse_mean, cv_rmse_std)
    """
    kf = KFold(n_splits=cv_folds, shuffle=True, random_state=random_state)
    
    # Custom CV loop to ensure compatibility with all model types (sklearn, xgboost, custom LSTM)
    rmse_scores = []
    for train_idx, val_idx in kf.split(X):
        X_train_fold, X_val_fold = X[train_idx], X[val_idx]
        y_train_fold, y_val_fold = y_log[train_idx], y_log[val_idx]

        # Clone or re-fit model
        try:
            from sklearn.base import clone
            fold_model = clone(model)
        except Exception:
            fold_model = model

        fold_model.fit(X_train_fold, y_train_fold)
        val_pred = fold_model.predict(X_val_fold)
        
        fold_rmse = np.sqrt(mean_squared_error(y_val_fold, val_pred))
        rmse_scores.append(fold_rmse)

    return float(np.mean(rmse_scores)), float(np.std(rmse_scores))


def evaluate_single_model(
    model_name: str,
    model: Any,
    X_train: np.ndarray,
    y_train_log: np.ndarray,
    X_test: np.ndarray,
    y_test_log: np.ndarray,
    run_cv: bool = True,
) -> Dict[str, Any]:
    """
    Fits model (if not already fitted), records training time, evaluates test metrics
    in dollars, and computes 5-fold CV statistics.
    """
    logger.info(f"Evaluating model: {model_name}...")
    
    # Measure Training Time
    start_time = time.time()
    model.fit(X_train, y_train_log)
    train_time = time.time() - start_time

    # Predictions in log space
    y_pred_log = model.predict(X_test)
    
    # Inverse transform to USD
    y_test_dollars = inverse_log_transform_target(y_test_log)
    y_pred_dollars = inverse_log_transform_target(y_pred_log)

    # Calculate Test Metrics
    metrics = compute_regression_metrics(
        y_true_dollars=y_test_dollars,
        y_pred_dollars=y_pred_dollars,
        y_true_log=y_test_log,
        y_pred_log=y_pred_log,
    )

    metrics["Model"] = model_name
    metrics["TrainTime_sec"] = round(train_time, 3)

    # Compute 5-Fold Cross Validation Scores
    if run_cv:
        cv_mean, cv_std = evaluate_model_cv(model, X_train, y_train_log)
        metrics["CV_RMSE_Mean_log"] = round(cv_mean, 4)
        metrics["CV_RMSE_Std_log"] = round(cv_std, 4)
    else:
        metrics["CV_RMSE_Mean_log"] = np.nan
        metrics["CV_RMSE_Std_log"] = np.nan

    return metrics


def save_results_to_csv(
    results_list: List[Dict[str, Any]],
    output_path: Union[str, Path] = RESULTS_CSV_PATH,
) -> pd.DataFrame:
    """
    Saves evaluated model metrics to CSV report.
    """
    df = pd.DataFrame(results_list)
    # Reorder columns for clean presentation
    cols_order = [
        "Model",
        "R2_Score",
        "RMSE_USD",
        "MAE_USD",
        "RMSE_log",
        "CV_RMSE_Mean_log",
        "CV_RMSE_Std_log",
        "TrainTime_sec",
    ]
    cols_present = [c for c in cols_order if c in df.columns] + [
        c for c in df.columns if c not in cols_order
    ]
    df = df[cols_present]
    
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(output_path, index=False)
    logger.info(f"Saved evaluation benchmark table to {output_path}")
    return df
