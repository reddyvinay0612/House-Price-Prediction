"""
Feature analysis and selection module for the House Price Prediction System.
Provides correlation analysis, top feature rankings, feature importance extractors,
and domain feature utilities.
"""

import logging
from typing import List, Optional, Tuple

import numpy as np
import pandas as pd

from src.config import TARGET_COLUMN, TOP_CORRELATED_FEATURES

logger = logging.getLogger(__name__)


def compute_correlation_matrix(df: pd.DataFrame, method: str = "pearson") -> pd.DataFrame:
    """
    Computes the correlation matrix for all numeric columns in the dataset.
    """
    numeric_df = df.select_dtypes(include=[np.number])
    return numeric_df.corr(method=method)


def get_top_correlated_features(
    df: pd.DataFrame,
    target_column: str = TARGET_COLUMN,
    top_n: int = 10,
) -> pd.Series:
    """
    Extracts the top N numerical features most correlated with the target variable.
    
    Args:
        df: Input DataFrame containing target and numerical features.
        target_column: Name of the target column (default: 'SalePrice').
        top_n: Number of top features to return.
        
    Returns:
        pd.Series: Sorted series of absolute Pearson correlation coefficients.
    """
    if target_column not in df.columns:
        logger.warning(f"{target_column} not in DataFrame. Returning default list.")
        return pd.Series({feat: 0.0 for feat in TOP_CORRELATED_FEATURES[:top_n]})

    corr_matrix = compute_correlation_matrix(df)
    if target_column not in corr_matrix:
        return pd.Series({feat: 0.0 for feat in TOP_CORRELATED_FEATURES[:top_n]})

    target_corr = corr_matrix[target_column].drop(labels=[target_column], errors="ignore")
    # Sort by absolute correlation descending
    sorted_corr = target_corr.reindex(target_corr.abs().sort_values(ascending=False).index)
    return sorted_corr.head(top_n)


def compute_skewness_summary(df: pd.DataFrame, threshold: float = 0.75) -> pd.DataFrame:
    """
    Computes skewness across all numeric columns and flags features exceeding the threshold.
    """
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    skew_series = df[numeric_cols].skew().sort_values(ascending=False)
    summary_df = pd.DataFrame(
        {
            "Feature": skew_series.index,
            "Skewness": skew_series.values,
            "HighlySkewed": skew_series.abs().values > threshold,
        }
    )
    return summary_df


def extract_feature_importances(
    model,
    feature_names: List[str],
    top_n: Optional[int] = 20,
) -> pd.DataFrame:
    """
    Extracts and ranks feature importances from tree-based or linear models.
    """
    importances = None
    if hasattr(model, "feature_importances_"):
        importances = model.feature_importances_
    elif hasattr(model, "coef_"):
        importances = np.abs(model.coef_)
        if importances.ndim > 1:
            importances = importances.ravel()

    if importances is None or len(importances) != len(feature_names):
        # Fallback uniform ranking
        return pd.DataFrame({"Feature": feature_names, "Importance": np.ones(len(feature_names)) / len(feature_names)})

    importance_df = pd.DataFrame(
        {
            "Feature": feature_names,
            "Importance": importances,
        }
    ).sort_values(by="Importance", ascending=False)

    if top_n:
        importance_df = importance_df.head(top_n)

    return importance_df.reset_index(drop=True)
