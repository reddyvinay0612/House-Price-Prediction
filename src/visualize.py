"""
Visualization module for the House Price Prediction System.
Generates publication-quality charts (Matplotlib, Seaborn, and Plotly) for:
- Missing-data analysis
- Target distribution before & after log transform (with Q-Q plots)
- Outlier scatter plots (before & after cleaning)
- Correlation heatmap & Top-correlated features bar chart
- Key feature scatter plots (bathrooms, year built, garage cars, material quality)
- Model comparison charts (R2, RMSE, MAE, CV error bars)
- Actual vs Predicted and Residual diagnostic plots
- Feature importance rankings
"""

import logging
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Union

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import scipy.stats as stats
import seaborn as sns

from src.config import FIGURES_DIR, TARGET_COLUMN, TOP_CORRELATED_FEATURES

logger = logging.getLogger(__name__)

# Configure publication aesthetics
plt.style.use("seaborn-v0_8-whitegrid" if "seaborn-v0_8-whitegrid" in plt.style.available else "default")
plt.rcParams["font.family"] = "sans-serif"
plt.rcParams["font.size"] = 11
plt.rcParams["axes.titlesize"] = 13
plt.rcParams["axes.labelsize"] = 12


def plot_missing_values(df: pd.DataFrame, save_path: Optional[Path] = None) -> plt.Figure:
    """
    Plots a bar chart showing features with missing values and their percentages.
    """
    missing_pct = (df.isnull().sum() / len(df)) * 100
    missing_pct = missing_pct[missing_pct > 0].sort_values(ascending=False)

    fig, ax = plt.subplots(figsize=(10, 6))
    if not missing_pct.empty:
        sns.barplot(x=missing_pct.values, y=missing_pct.index, palette="viridis", ax=ax)
        ax.set_xlabel("Missing Data Percentage (%)")
        ax.set_ylabel("Features")
        ax.set_title("Missing Values by Feature (Percentage)", fontweight="bold")
        for i, v in enumerate(missing_pct.values):
            ax.text(v + 0.5, i, f"{v:.1f}%", va="center", fontsize=10)
    else:
        ax.text(0.5, 0.5, "No missing values found!", ha="center", va="center", fontsize=14)
        ax.set_title("Missing Values Summary")

    plt.tight_layout()
    if save_path:
        fig.savefig(save_path, dpi=300, bbox_inches="tight")
        logger.info(f"Saved missing values plot to {save_path}")
    return fig


def plot_target_distribution(
    y_raw: Union[pd.Series, np.ndarray],
    y_log: Union[pd.Series, np.ndarray],
    save_path: Optional[Path] = None,
) -> plt.Figure:
    """
    Generates a 2x2 comparison grid:
    - Top row: Raw SalePrice Histogram+KDE and Q-Q Plot
    - Bottom row: Log-transformed SalePrice Histogram+KDE and Q-Q Plot
    """
    y_raw_arr = np.asarray(y_raw, dtype=float)
    y_log_arr = np.asarray(y_log, dtype=float)

    fig, axes = plt.subplots(2, 2, figsize=(14, 10))

    # 1. Raw Distribution
    sns.histplot(y_raw_arr, kde=True, color="#1f77b4", ax=axes[0, 0], stat="density", bins=40)
    axes[0, 0].set_title(
        f"Raw SalePrice Distribution\n(Skewness: {stats.skew(y_raw_arr):.2f}, Kurtosis: {stats.kurtosis(y_raw_arr):.2f})",
        fontweight="bold",
    )
    axes[0, 0].set_xlabel("SalePrice ($)")
    axes[0, 0].set_ylabel("Density")

    # 2. Raw Q-Q Plot
    stats.probplot(y_raw_arr, dist="norm", plot=axes[0, 1])
    axes[0, 1].set_title("Normal Q-Q Plot (Raw SalePrice)", fontweight="bold")
    axes[0, 1].get_lines()[0].set_color("#1f77b4")
    axes[0, 1].get_lines()[1].set_color("red")

    # 3. Log-transformed Distribution
    sns.histplot(y_log_arr, kde=True, color="#2ca02c", ax=axes[1, 0], stat="density", bins=40)
    axes[1, 0].set_title(
        f"Log-Transformed SalePrice: log(1 + SalePrice)\n(Skewness: {stats.skew(y_log_arr):.2f}, Kurtosis: {stats.kurtosis(y_log_arr):.2f})",
        fontweight="bold",
    )
    axes[1, 0].set_xlabel("log(1 + SalePrice)")
    axes[1, 0].set_ylabel("Density")

    # 4. Log Q-Q Plot
    stats.probplot(y_log_arr, dist="norm", plot=axes[1, 1])
    axes[1, 1].set_title("Normal Q-Q Plot (Log-Transformed SalePrice)", fontweight="bold")
    axes[1, 1].get_lines()[0].set_color("#2ca02c")
    axes[1, 1].get_lines()[1].set_color("red")

    plt.tight_layout()
    if save_path:
        fig.savefig(save_path, dpi=300, bbox_inches="tight")
        logger.info(f"Saved target distribution plot to {save_path}")
    return fig


def plot_outliers_before_after(
    df_raw: pd.DataFrame,
    df_cleaned: pd.DataFrame,
    save_path: Optional[Path] = None,
) -> plt.Figure:
    """
    Plots GrLivArea vs SalePrice before and after removing abnormal outliers (>4000 sq ft & <300k).
    """
    fig, axes = plt.subplots(1, 2, figsize=(14, 6))

    # Before
    sns.scatterplot(
        data=df_raw,
        x="GrLivArea",
        y="SalePrice",
        color="#d62728",
        alpha=0.6,
        ax=axes[0],
    )
    # Highlight potential outliers
    if "GrLivArea" in df_raw.columns and "SalePrice" in df_raw.columns:
        outlier_mask = (df_raw["GrLivArea"] > 4000) & (df_raw["SalePrice"] < 300000)
        axes[0].scatter(
            df_raw.loc[outlier_mask, "GrLivArea"],
            df_raw.loc[outlier_mask, "SalePrice"],
            color="black",
            s=100,
            marker="x",
            label="Outliers (>4000 sqft & <$300k)",
        )
        axes[0].legend()

    axes[0].set_title(f"Before Outlier Removal (N={len(df_raw)})", fontweight="bold")
    axes[0].set_xlabel("Above Ground Living Area (GrLivArea sq ft)")
    axes[0].set_ylabel("SalePrice ($)")

    # After
    sns.scatterplot(
        data=df_cleaned,
        x="GrLivArea",
        y="SalePrice",
        color="#2ca02c",
        alpha=0.6,
        ax=axes[1],
    )
    axes[1].set_title(f"After Outlier Removal (N={len(df_cleaned)})", fontweight="bold")
    axes[1].set_xlabel("Above Ground Living Area (GrLivArea sq ft)")
    axes[1].set_ylabel("SalePrice ($)")

    plt.tight_layout()
    if save_path:
        fig.savefig(save_path, dpi=300, bbox_inches="tight")
        logger.info(f"Saved outlier comparison plot to {save_path}")
    return fig


def plot_correlation_heatmap(
    df: pd.DataFrame,
    top_k: int = 15,
    save_path: Optional[Path] = None,
) -> plt.Figure:
    """
    Plots Pearson correlation heatmap for top K features most correlated with SalePrice.
    """
    numeric_df = df.select_dtypes(include=[np.number])
    if TARGET_COLUMN not in numeric_df.columns:
        corrs = numeric_df.corr().iloc[:top_k, :top_k]
    else:
        top_cols = (
            numeric_df.corr()[TARGET_COLUMN]
            .abs()
            .sort_values(ascending=False)
            .head(top_k)
            .index
        )
        corrs = numeric_df[top_cols].corr()

    fig, ax = plt.subplots(figsize=(12, 10))
    sns.heatmap(
        corrs,
        annot=True,
        fmt=".2f",
        cmap="coolwarm",
        square=True,
        cbar_kws={"shrink": 0.8},
        ax=ax,
        linewidths=0.5,
    )
    ax.set_title(f"Pearson Correlation Matrix (Top {top_k} Features)", fontweight="bold", pad=15)

    plt.tight_layout()
    if save_path:
        fig.savefig(save_path, dpi=300, bbox_inches="tight")
        logger.info(f"Saved correlation heatmap to {save_path}")
    return fig


def plot_top_correlated_bar(
    top_features_series: pd.Series,
    save_path: Optional[Path] = None,
) -> plt.Figure:
    """
    Plots horizontal bar chart of top correlated features with SalePrice.
    """
    fig, ax = plt.subplots(figsize=(10, 6))
    colors = ["#1f77b4" if x > 0 else "#d62728" for x in top_features_series.values]
    
    sns.barplot(
        x=top_features_series.values,
        y=top_features_series.index,
        palette=colors,
        ax=ax,
    )
    ax.set_xlabel("Pearson Correlation Coefficient (r)")
    ax.set_ylabel("Features")
    ax.set_title("Top Correlated Features with SalePrice", fontweight="bold")
    ax.set_xlim(0, 1.0)

    for i, v in enumerate(top_features_series.values):
        ax.text(v + 0.02, i, f"{v:.3f}", va="center", fontsize=10, fontweight="bold")

    plt.tight_layout()
    if save_path:
        fig.savefig(save_path, dpi=300, bbox_inches="tight")
        logger.info(f"Saved top correlated bar chart to {save_path}")
    return fig


def plot_key_features_scatter(df: pd.DataFrame, save_path: Optional[Path] = None) -> plt.Figure:
    """
    Plots 2x2 grid of key features vs SalePrice:
    - OverallQual vs SalePrice (box/strip)
    - GrLivArea vs SalePrice (scatter with regression trend)
    - GarageCars vs SalePrice (box plot)
    - YearBuilt vs SalePrice (scatter with trend)
    """
    fig, axes = plt.subplots(2, 2, figsize=(14, 10))

    # 1. Overall Quality
    if "OverallQual" in df.columns:
        sns.boxplot(x="OverallQual", y=TARGET_COLUMN, data=df, palette="Blues", ax=axes[0, 0])
        axes[0, 0].set_title("SalePrice vs Overall Material & Finish Quality (1-10)", fontweight="bold")
        axes[0, 0].set_ylabel("SalePrice ($)")

    # 2. Living Area
    if "GrLivArea" in df.columns:
        sns.regplot(
            x="GrLivArea",
            y=TARGET_COLUMN,
            data=df,
            scatter_kws={"alpha": 0.5, "color": "#2ca02c"},
            line_kws={"color": "red"},
            ax=axes[0, 1],
        )
        axes[0, 1].set_title("SalePrice vs Above Ground Living Area (sq ft)", fontweight="bold")
        axes[0, 1].set_ylabel("SalePrice ($)")

    # 3. Garage Cars Capacity
    if "GarageCars" in df.columns:
        sns.boxplot(x="GarageCars", y=TARGET_COLUMN, data=df, palette="Greens", ax=axes[1, 0])
        axes[1, 0].set_title("SalePrice vs Garage Capacity (Cars)", fontweight="bold")
        axes[1, 0].set_ylabel("SalePrice ($)")

    # 4. Year Built
    if "YearBuilt" in df.columns:
        sns.regplot(
            x="YearBuilt",
            y=TARGET_COLUMN,
            data=df,
            scatter_kws={"alpha": 0.4, "color": "#9467bd"},
            line_kws={"color": "darkblue"},
            ax=axes[1, 1],
        )
        axes[1, 1].set_title("SalePrice vs Year Built", fontweight="bold")
        axes[1, 1].set_ylabel("SalePrice ($)")

    plt.tight_layout()
    if save_path:
        fig.savefig(save_path, dpi=300, bbox_inches="tight")
        logger.info(f"Saved key features scatter plot to {save_path}")
    return fig


def plot_model_comparison(
    results_df: pd.DataFrame,
    save_path: Optional[Path] = None,
) -> plt.Figure:
    """
    Plots a comprehensive 4-panel comparison of all models:
    - 1. Test R² Score
    - 2. Test RMSE ($ USD)
    - 3. Test MAE ($ USD)
    - 4. 5-Fold Cross Validation Mean RMSE with Standard Deviation Error Bars
    """
    fig, axes = plt.subplots(2, 2, figsize=(16, 11))
    palette = sns.color_palette("tab10", len(results_df))

    # 1. R² Score
    sns.barplot(data=results_df, x="R2_Score", y="Model", palette=palette, ax=axes[0, 0])
    axes[0, 0].set_title("Test Set R² Score (Higher is Better)", fontweight="bold")
    axes[0, 0].set_xlabel("R² Score")
    for i, v in enumerate(results_df["R2_Score"]):
        axes[0, 0].text(v * 0.95, i, f"{v:.3f}", va="center", ha="right", color="white", fontweight="bold")

    # 2. RMSE USD
    sns.barplot(data=results_df, x="RMSE_USD", y="Model", palette=palette, ax=axes[0, 1])
    axes[0, 1].set_title("Test Set Root Mean Squared Error (Lower is Better)", fontweight="bold")
    axes[0, 1].set_xlabel("RMSE ($ USD)")
    for i, v in enumerate(results_df["RMSE_USD"]):
        axes[0, 1].text(v + 500, i, f"${v:,.0f}", va="center", fontsize=9, fontweight="bold")

    # 3. MAE USD
    sns.barplot(data=results_df, x="MAE_USD", y="Model", palette=palette, ax=axes[1, 0])
    axes[1, 0].set_title("Test Set Mean Absolute Error (Lower is Better)", fontweight="bold")
    axes[1, 0].set_xlabel("MAE ($ USD)")
    for i, v in enumerate(results_df["MAE_USD"]):
        axes[1, 0].text(v + 300, i, f"${v:,.0f}", va="center", fontsize=9, fontweight="bold")

    # 4. 5-Fold CV Mean vs Std (Error Bar Chart matching paper)
    if "CV_RMSE_Mean_log" in results_df.columns and not results_df["CV_RMSE_Mean_log"].isnull().all():
        models = results_df["Model"].values
        cv_means = results_df["CV_RMSE_Mean_log"].values
        cv_stds = results_df["CV_RMSE_Std_log"].fillna(0).values
        y_pos = np.arange(len(models))

        axes[1, 1].barh(y_pos, cv_means, xerr=cv_stds, align="center", alpha=0.8, color="#ff7f0e", capsize=5)
        axes[1, 1].set_yticks(y_pos)
        axes[1, 1].set_yticklabels(models)
        axes[1, 1].set_title("5-Fold CV Mean RMSE with Std Dev (Log Space)", fontweight="bold")
        axes[1, 1].set_xlabel("CV RMSE (Mean ± Std)")
        for i, (m, s) in enumerate(zip(cv_means, cv_stds)):
            axes[1, 1].text(m + s + 0.005, i, f"{m:.3f}±{s:.3f}", va="center", fontsize=9)
    else:
        axes[1, 1].text(0.5, 0.5, "CV Data not available", ha="center", va="center")

    plt.tight_layout()
    if save_path:
        fig.savefig(save_path, dpi=300, bbox_inches="tight")
        logger.info(f"Saved model comparison plot to {save_path}")
    return fig


def plot_actual_vs_predicted(
    y_true_usd: np.ndarray,
    y_pred_usd: np.ndarray,
    model_name: str = "Model",
    save_path: Optional[Path] = None,
) -> plt.Figure:
    """
    Plots Actual vs. Predicted values and Residuals for a given model.
    """
    residuals = y_true_usd - y_pred_usd
    fig, axes = plt.subplots(1, 2, figsize=(14, 6))

    # 1. Actual vs Predicted
    axes[0].scatter(y_true_usd, y_pred_usd, alpha=0.5, color="#1f77b4", edgecolor="k", linewidth=0.5)
    min_val = min(y_true_usd.min(), y_pred_usd.min())
    max_val = max(y_true_usd.max(), y_pred_usd.max())
    axes[0].plot([min_val, max_val], [min_val, max_val], "r--", lw=2, label="Perfect Fit (y = x)")
    axes[0].set_xlabel("Actual SalePrice ($)")
    axes[0].set_ylabel("Predicted SalePrice ($)")
    axes[0].set_title(f"{model_name}: Actual vs Predicted", fontweight="bold")
    axes[0].legend()

    # 2. Residual Plot
    axes[1].scatter(y_pred_usd, residuals, alpha=0.5, color="#2ca02c", edgecolor="k", linewidth=0.5)
    axes[1].axhline(y=0, color="red", linestyle="--", lw=2)
    axes[1].set_xlabel("Predicted SalePrice ($)")
    axes[1].set_ylabel("Residuals: (Actual - Predicted) ($)")
    axes[1].set_title(f"{model_name}: Residual Distribution", fontweight="bold")

    plt.tight_layout()
    if save_path:
        fig.savefig(save_path, dpi=300, bbox_inches="tight")
        logger.info(f"Saved actual vs predicted plot to {save_path}")
    return fig


def plot_feature_importance_bar(
    importance_df: pd.DataFrame,
    title: str = "Feature Importance Ranking",
    save_path: Optional[Path] = None,
) -> plt.Figure:
    """
    Plots feature importance rankings as a horizontal bar chart.
    """
    fig, ax = plt.subplots(figsize=(10, 8))
    sns.barplot(
        data=importance_df.head(20),
        x="Importance",
        y="Feature",
        palette="mako",
        ax=ax,
    )
    ax.set_title(title, fontweight="bold", pad=15)
    ax.set_xlabel("Relative Importance Score")
    ax.set_ylabel("Feature")

    plt.tight_layout()
    if save_path:
        fig.savefig(save_path, dpi=300, bbox_inches="tight")
        logger.info(f"Saved feature importance plot to {save_path}")
    return fig
