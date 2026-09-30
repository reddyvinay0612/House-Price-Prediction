"""
Tests for inference engine and prediction format validation.
"""

import numpy as np
import pandas as pd
import pytest

from src.predict import HousePricePredictor


def test_predictor_input_preparation():
    """Verify input preparation adds default features safely."""
    predictor = HousePricePredictor()
    user_inputs = {"OverallQual": 8, "GrLivArea": 2000}
    df = predictor.prepare_input_dataframe(user_inputs)
    
    assert isinstance(df, pd.DataFrame)
    assert df["OverallQual"].iloc[0] == 8
    assert df["GrLivArea"].iloc[0] == 2000
