"""
Preprocessing module for the House Price Prediction System.
Implements custom scikit-learn transformers, outlier removal, missing-value imputation,
log transformations, ordinal/one-hot encoding, and unified ColumnTransformers to guarantee
zero data leakage.
"""

import logging
from typing import List, Optional, Tuple, Union

import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from src.config import (
    COLUMNS_TO_DROP,
    ID_COLUMN,
    ORDINAL_MAPPINGS,
    OUTLIER_GRLIVAREA_THRESHOLD,
    RANDOM_SEED,
    TARGET_COLUMN,
)

logger = logging.getLogger(__name__)


def remove_outliers(
    df: pd.DataFrame,
    threshold: float = OUTLIER_GRLIVAREA_THRESHOLD,
    target_threshold: float = 300_000,
) -> pd.DataFrame:
    """
    Removes documented abnormal outliers from the Ames dataset (e.g., GrLivArea > 4000 with SalePrice < 300k).
    Applies only to training data where SalePrice is present.
    """
    if TARGET_COLUMN in df.columns and "GrLivArea" in df.columns:
        outlier_mask = (df["GrLivArea"] > threshold) & (df[TARGET_COLUMN] < target_threshold)
        num_outliers = outlier_mask.sum()
        if num_outliers > 0:
            logger.info(f"Removing {num_outliers} outlier records (GrLivArea > {threshold} & SalePrice < {target_threshold})")
            df = df[~outlier_mask].copy()
    return df


def log_transform_target(y: Union[pd.Series, np.ndarray]) -> np.ndarray:
    """Apply log1p transformation to target price: log(1 + y)."""
    return np.log1p(np.asarray(y, dtype=float))


def inverse_log_transform_target(y_log: Union[pd.Series, np.ndarray]) -> np.ndarray:
    """Apply expm1 inverse transformation to log prices: exp(y_log) - 1."""
    return np.expm1(np.asarray(y_log, dtype=float))


class OrdinalFeatureEncoder(BaseEstimator, TransformerMixin):
    """
    Custom transformer to map ordinal categorical ratings (Ex, Gd, TA, Fa, Po, None)
    to structured numeric integer scales.
    """

    def __init__(self, mappings: dict = None):
        self.mappings = mappings or ORDINAL_MAPPINGS

    def fit(self, X: pd.DataFrame, y=None):
        return self

    def transform(self, X: pd.DataFrame) -> pd.DataFrame:
        X_out = X.copy()
        for col, mapping in self.mappings.items():
            if col in X_out.columns:
                # Fill missing with 'None' before mapping
                X_out[col] = X_out[col].fillna("None").astype(str).map(mapping).fillna(0).astype(float)
        return X_out


class SkewnessLogTransformer(BaseEstimator, TransformerMixin):
    """
    Log-transforms numeric features whose training distribution skewness exceeds a threshold.
    """

    def __init__(self, skew_threshold: float = 0.75):
        self.skew_threshold = skew_threshold
        self.skewed_cols_: List[str] = []

    def fit(self, X: pd.DataFrame, y=None):
        numeric_cols = X.select_dtypes(include=[np.number]).columns
        self.skewed_cols_ = []
        for col in numeric_cols:
            # Check non-negative features
            if (X[col].dropna() >= 0).all():
                skew_val = X[col].dropna().skew()
                if abs(skew_val) > self.skew_threshold:
                    self.skewed_cols_.append(col)
        return self

    def transform(self, X: pd.DataFrame) -> pd.DataFrame:
        X_out = X.copy()
        for col in self.skewed_cols_:
            if col in X_out.columns:
                # Clip negative values to 0 before log1p
                vals = np.maximum(0, X_out[col].values)
                X_out[col] = np.log1p(vals)
        return X_out


class HouseFeatureEngineer(BaseEstimator, TransformerMixin):
    """
    Domain-specific feature engineering transformer:
    - TotalSF: Total square footage (TotalBsmtSF + 1stFlrSF + 2ndFlrSF)
    - TotalBath: Total weighted bathrooms (FullBath + 0.5*HalfBath + BsmtFullBath + 0.5*BsmtHalfBath)
    - TotalPorchSF: OpenPorchSF + EnclosedPorch + 3SsnPorch + ScreenPorch
    - HouseAge: YrSold - YearBuilt
    - RemodAge: YrSold - YearRemodAdd
    - IsNew: Whether YrSold == YearBuilt
    - HasGarage, HasPool, HasBsmt, HasFireplace boolean indicators
    """

    def fit(self, X: pd.DataFrame, y=None):
        return self

    def transform(self, X: pd.DataFrame) -> pd.DataFrame:
        X_out = X.copy()

        # Helper to get numeric column safely with 0 fallback
        def get_col(name: str) -> pd.Series:
            if name in X_out.columns:
                return pd.to_numeric(X_out[name], errors="coerce").fillna(0)
            return pd.Series(0, index=X_out.index)

        # 1. Total Square Footage
        X_out["TotalSF"] = get_col("TotalBsmtSF") + get_col("1stFlrSF") + get_col("2ndFlrSF")
        
        # 2. Total Bathrooms
        X_out["TotalBath"] = (
            get_col("FullBath")
            + 0.5 * get_col("HalfBath")
            + get_col("BsmtFullBath")
            + 0.5 * get_col("BsmtHalfBath")
        )

        # 3. Total Porch Area
        X_out["TotalPorchSF"] = (
            get_col("OpenPorchSF")
            + get_col("EnclosedPorch")
            + get_col("3SsnPorch")
            + get_col("ScreenPorch")
        )

        # 4. Property Age at Sale
        yr_sold = get_col("YrSold")
        yr_built = get_col("YearBuilt")
        yr_remod = get_col("YearRemodAdd")
        
        # If YrSold is 0 or missing, default to modern year
        effective_yr_sold = yr_sold.apply(lambda y: y if y > 1900 else 2010)
        X_out["HouseAge"] = np.maximum(0, effective_yr_sold - yr_built)
        X_out["RemodAge"] = np.maximum(0, effective_yr_sold - yr_remod)
        X_out["IsNew"] = (effective_yr_sold == yr_built).astype(int)

        # 5. Presence indicators
        X_out["HasGarage"] = (get_col("GarageArea") > 0).astype(int)
        X_out["HasBsmt"] = (get_col("TotalBsmtSF") > 0).astype(int)
        X_out["HasFireplace"] = (get_col("Fireplaces") > 0).astype(int)

        return X_out


def build_preprocessor_pipeline(
    df_train_sample: pd.DataFrame,
    scale_numeric: bool = True,
) -> ColumnTransformer:
    """
    Constructs a robust, leakage-free ColumnTransformer pipeline.
    
    Args:
        df_train_sample: Sample DataFrame to infer column names and types.
        scale_numeric: Whether to apply StandardScaler to numerical features.
        
    Returns:
        ColumnTransformer: Preprocessor ready to fit on training data.
    """
    # Exclude ID and target if present
    cols_to_exclude = set(COLUMNS_TO_DROP + [ID_COLUMN, TARGET_COLUMN])
    available_cols = [c for c in df_train_sample.columns if c not in cols_to_exclude]

    # Partition columns into numeric, ordinal, and nominal categorical
    ordinal_cols = [c for c in available_cols if c in ORDINAL_MAPPINGS]
    
    numeric_cols = [
        c for c in available_cols
        if c not in ordinal_cols and pd.api.types.is_numeric_dtype(df_train_sample[c])
    ]
    
    categorical_cols = [
        c for c in available_cols
        if c not in ordinal_cols and c not in numeric_cols
    ]

    # Numeric Pipeline
    num_steps = [
        ("imputer", SimpleImputer(strategy="median")),
    ]
    if scale_numeric:
        num_steps.append(("scaler", StandardScaler()))
    numeric_pipeline = Pipeline(steps=num_steps)

    # Ordinal Pipeline
    ord_steps = [
        ("encoder", OrdinalFeatureEncoder()),
        ("imputer", SimpleImputer(strategy="median")),
    ]
    if scale_numeric:
        ord_steps.append(("scaler", StandardScaler()))
    ordinal_pipeline = Pipeline(steps=ord_steps)

    # Categorical Pipeline
    cat_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="constant", fill_value="None")),
            ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
        ]
    )

    transformers = []
    if numeric_cols:
        transformers.append(("num", numeric_pipeline, numeric_cols))
    if ordinal_cols:
        transformers.append(("ord", ordinal_pipeline, ordinal_cols))
    if categorical_cols:
        transformers.append(("cat", cat_pipeline, categorical_cols))

    preprocessor = ColumnTransformer(
        transformers=transformers,
        remainder="drop",
        verbose_feature_names_out=False,
    )

    return preprocessor


def create_full_data_pipeline(
    train_df: pd.DataFrame,
    scale_numeric: bool = True,
) -> Tuple[Pipeline, pd.DataFrame, np.ndarray]:
    """
    Creates complete feature engineering + preprocessing pipeline,
    fits it on training data, and returns (fitted_pipeline, X_processed, y_log).
    """
    # 1. Clean outliers
    clean_train = remove_outliers(train_df)
    
    # 2. Extract target
    if TARGET_COLUMN in clean_train.columns:
        y_raw = clean_train[TARGET_COLUMN].values
        y_log = log_transform_target(y_raw)
        X_raw = clean_train.drop(columns=[TARGET_COLUMN], errors="ignore")
    else:
        y_log = None
        X_raw = clean_train.copy()

    # Drop ID if present
    X_raw = X_raw.drop(columns=[ID_COLUMN], errors="ignore")
    
    # 3. Engineer features first
    feat_eng = HouseFeatureEngineer()
    X_eng = feat_eng.fit_transform(X_raw)
    
    # 4. Skewness correction
    skew_trans = SkewnessLogTransformer(skew_threshold=0.75)
    X_skew = skew_trans.fit_transform(X_eng)
    
    # 5. Build ColumnTransformer
    preprocessor = build_preprocessor_pipeline(X_skew, scale_numeric=scale_numeric)
    
    # 6. Combined end-to-end pipeline
    full_pipeline = Pipeline(
        steps=[
            ("feature_engineer", feat_eng),
            ("skewness_transformer", skew_trans),
            ("column_preprocessor", preprocessor),
        ]
    )
    
    # Fit pipeline
    X_processed = full_pipeline.fit_transform(X_raw)
    
    # Extract feature names if available
    try:
        feature_names = full_pipeline.named_steps["column_preprocessor"].get_feature_names_out()
        X_processed_df = pd.DataFrame(X_processed, columns=feature_names, index=X_raw.index)
    except Exception:
        X_processed_df = pd.DataFrame(X_processed, index=X_raw.index)

    return full_pipeline, X_processed_df, y_log
