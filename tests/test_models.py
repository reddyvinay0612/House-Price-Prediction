"""
Tests for model instantiation, training interface, and predictions.
"""

import numpy as np
import pytest

from src.models import LSTMTabularRegressor, get_all_models, get_model


def test_model_factory():
    """Verify all models can be instantiated properly."""
    models = get_all_models(fast_mode=True)
    assert "Linear Regression" in models
    assert "Random Forest" in models
    assert "Gradient Boosting" in models
    assert "XGBoost" in models
    assert "Multi-Layer Perceptron (MLP)" in models
    assert "LSTM Regressor" in models


def test_lstm_tabular_regressor_fit_predict():
    """Verify custom LSTM tabular regressor fits and produces valid predictions."""
    rng = np.random.default_rng(42)
    X_train = rng.normal(0, 1, (40, 16)).astype(np.float32)
    y_train = rng.normal(12, 0.5, (40,)).astype(np.float32)

    X_test = rng.normal(0, 1, (10, 16)).astype(np.float32)

    lstm = LSTMTabularRegressor(epochs=5, hidden_units=16, dense_units=8, batch_size=16)
    lstm.fit(X_train, y_train)

    assert lstm.is_fitted_
    preds = lstm.predict(X_test)
    assert preds.shape == (10,)
    assert not np.isnan(preds).any()
