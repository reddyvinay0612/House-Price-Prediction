"""
Tests for preprocessing, transformers, feature engineering, and pipeline transformations.
"""

import numpy as np
import pandas as pd
import pytest

from src.preprocessing import (
    HouseFeatureEngineer,
    OrdinalFeatureEncoder,
    SkewnessLogTransformer,
    create_full_data_pipeline,
    inverse_log_transform_target,
    log_transform_target,
    remove_outliers,
)


def test_log_and_inverse_transforms():
    """Verify log1p and expm1 exact round-trip reconstruction."""
    prices = np.array([50000.0, 180000.0, 450000.0, 750000.0])
    log_prices = log_transform_target(prices)
    recovered_prices = inverse_log_transform_target(log_prices)
    np.testing.assert_allclose(prices, recovered_prices, rtol=1e-5)


def test_remove_outliers():
    """Verify outlier filter drops GrLivArea > 4000 with low SalePrice."""
    df = pd.DataFrame(
        {
            "GrLivArea": [1500, 2000, 4500, 4200],
            "SalePrice": [200000, 250000, 150000, 500000],  # 4500 with 150k is an outlier
        }
    )
    cleaned = remove_outliers(df, threshold=4000, target_threshold=300000)
    assert len(cleaned) == 3
    assert not ((cleaned["GrLivArea"] > 4000) & (cleaned["SalePrice"] < 300000)).any()


def test_feature_engineering_transformer():
    """Verify synthesis of domain features like TotalSF, TotalBath, and HouseAge."""
    df = pd.DataFrame(
        {
            "TotalBsmtSF": [1000],
            "1stFlrSF": [1000],
            "2ndFlrSF": [500],
            "FullBath": [2],
            "HalfBath": [1],
            "BsmtFullBath": [1],
            "BsmtHalfBath": [0],
            "YrSold": [2008],
            "YearBuilt": [2000],
            "YearRemodAdd": [2005],
            "OpenPorchSF": [50],
            "EnclosedPorch": [0],
            "3SsnPorch": [0],
            "ScreenPorch": [0],
            "GarageArea": [400],
            "Fireplaces": [1],
        }
    )
    transformer = HouseFeatureEngineer()
    engineered = transformer.fit_transform(df)

    assert engineered["TotalSF"].iloc[0] == 2500
    assert engineered["TotalBath"].iloc[0] == 3.5
    assert engineered["HouseAge"].iloc[0] == 8
    assert engineered["HasGarage"].iloc[0] == 1


def test_full_pipeline_output_shape_and_no_nans():
    """Verify end-to-end pipeline produces finite numerical matrix without NaNs."""
    df = pd.DataFrame(
        {
            "Id": [1, 2, 3, 4],
            "OverallQual": [7, 6, 8, 5],
            "GrLivArea": [1700, 1400, 2100, 1100],
            "TotalBsmtSF": [800, 900, 1200, 600],
            "1stFlrSF": [900, 800, 1100, 600],
            "2ndFlrSF": [800, 600, 1000, 500],
            "FullBath": [2, 1, 2, 1],
            "HalfBath": [1, 0, 1, 0],
            "YearBuilt": [2003, 1976, 2001, 1950],
            "YearRemodAdd": [2003, 1976, 2002, 1960],
            "Neighborhood": ["CollgCr", "Veenker", "CollgCr", "Crawfor"],
            "ExterQual": ["Gd", "TA", "Ex", "Fa"],
            "BsmtQual": ["Gd", "Gd", "Ex", "TA"],
            "KitchenQual": ["Gd", "TA", "Ex", "TA"],
            "SalePrice": [208500, 181500, 325000, 120000],
        }
    )

    pipeline, X_proc_df, y_log = create_full_data_pipeline(df, scale_numeric=True)
    assert X_proc_df.shape[0] == 4
    assert not np.isnan(X_proc_df.values).any()
    assert y_log is not None
    assert len(y_log) == 4
