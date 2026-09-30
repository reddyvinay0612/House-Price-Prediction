"""
Tests for data loading, fetching, and statistical summary functions.
"""

import numpy as np
import pandas as pd
import pytest

from src.data_loader import get_dataset_summary, load_california_housing, load_raw_data


def test_data_loader_raw_ames():
    """Verify that Ames dataset loads correctly with expected columns and non-empty rows."""
    train_df, _ = load_raw_data()
    assert isinstance(train_df, pd.DataFrame)
    assert train_df.shape[0] > 1000
    assert "SalePrice" in train_df.columns
    assert "GrLivArea" in train_df.columns
    assert "OverallQual" in train_df.columns


def test_get_dataset_summary():
    """Verify statistical summary generation."""
    dummy_df = pd.DataFrame(
        {
            "Id": [1, 2, 3],
            "SalePrice": [150000, 200000, 250000],
            "GrLivArea": [1200, 1500, 1800],
            "Neighborhood": ["CollgCr", "Veenker", "CollgCr"],
        }
    )
    summary = get_dataset_summary(dummy_df)
    assert summary["num_rows"] == 3
    assert summary["num_columns"] == 4
    assert summary["numeric_features"] == 3
    assert "target_statistics" in summary
    assert summary["target_statistics"]["mean"] == 200000.0


def test_california_housing_loader():
    """Verify secondary California housing dataset loads properly."""
    cal_df = load_california_housing()
    assert isinstance(cal_df, pd.DataFrame)
    assert "SalePrice" in cal_df.columns
    assert cal_df.shape[0] > 1000
