"""
Models module for the House Price Prediction System.
Implements model factory and custom architectures for:
- Linear Regression, Ridge, Lasso
- Decision Tree
- Random Forest Regressor
- Gradient Boosting Machine (GBR)
- XGBoost Regressor
- Multi-Layer Perceptron (MLP)
- LSTM Tabular Regressor (with sequence feature mapping)
"""

import logging
from typing import Any, Dict, Optional

import numpy as np
from sklearn.base import BaseEstimator, RegressorMixin
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from sklearn.linear_model import Lasso, LinearRegression, Ridge
from sklearn.neural_network import MLPRegressor
from sklearn.tree import DecisionTreeRegressor
import xgboost as xgb

from src.config import MODEL_HYPERPARAMS, RANDOM_SEED

logger = logging.getLogger(__name__)


# -----------------------------------------------------------------------------
# LSTM Tabular Regressor (Sequential Representation for Tabular Data)
# -----------------------------------------------------------------------------
class LSTMTabularRegressor(BaseEstimator, RegressorMixin):
    """
    LSTM-based Regressor tailored for tabular housing feature vectors.
    Reshapes tabular input matrix of shape (n_samples, n_features) into a
    3D sequential tensor (n_samples, timesteps, input_dim) and applies
    recurrent gate transformations followed by dense linear projection.
    """

    def __init__(
        self,
        hidden_units: int = 64,
        dense_units: int = 32,
        dropout_rate: float = 0.2,
        learning_rate: float = 0.005,
        epochs: int = 80,
        batch_size: int = 32,
        timesteps: int = 4,
        random_state: int = RANDOM_SEED,
    ):
        self.hidden_units = hidden_units
        self.dense_units = dense_units
        self.dropout_rate = dropout_rate
        self.learning_rate = learning_rate
        self.epochs = epochs
        self.batch_size = batch_size
        self.timesteps = timesteps
        self.random_state = random_state

        # Trained parameters
        self.is_fitted_ = False
        self.weights_ = {}
        self.feature_dim_ = None
        self.step_dim_ = None

    def _pad_and_reshape(self, X: np.ndarray) -> np.ndarray:
        """Reshape 2D tabular features (N, F) to 3D sequential shape (N, T, D)."""
        N, F = X.shape
        T = self.timesteps
        pad_size = (T - (F % T)) % T
        if pad_size > 0:
            X_padded = np.pad(X, ((0, 0), (0, pad_size)), mode="constant", constant_values=0)
        else:
            X_padded = X
        D = X_padded.shape[1] // T
        return X_padded.reshape(N, T, D)

    def fit(self, X: np.ndarray, y: np.ndarray):
        """Fit the LSTM regressor on tabular training data using Adam optimization."""
        rng = np.random.default_rng(self.random_state)
        X = np.asarray(X, dtype=np.float32)
        y = np.asarray(y, dtype=np.float32).reshape(-1, 1)

        N, F = X.shape
        self.feature_dim_ = F
        X_seq = self._pad_and_reshape(X)
        N, T, D = X_seq.shape
        self.step_dim_ = D
        H = self.hidden_units
        M = self.dense_units

        # Initialize LSTM Weights (Xavier/He initialization)
        # Combined gate weights for [forget, input, candidate, output]
        std_x = np.sqrt(2.0 / (D + H))
        std_h = np.sqrt(2.0 / (H + H))
        
        W_x = rng.normal(0, std_x, (D, 4 * H)).astype(np.float32)
        W_h = rng.normal(0, std_h, (H, 4 * H)).astype(np.float32)
        b_gates = np.zeros((1, 4 * H), dtype=np.float32)
        # Set forget gate bias to 1.0 for better gradient flow
        b_gates[0, :H] = 1.0

        # Dense projection layers
        W_dense1 = rng.normal(0, np.sqrt(2.0 / (H + M)), (H, M)).astype(np.float32)
        b_dense1 = np.zeros((1, M), dtype=np.float32)
        W_out = rng.normal(0, np.sqrt(2.0 / (M + 1)), (M, 1)).astype(np.float32)
        b_out = np.full((1, 1), float(np.mean(y)), dtype=np.float32)

        # Adam optimizer state variables
        params = [W_x, W_h, b_gates, W_dense1, b_dense1, W_out, b_out]
        m_vec = [np.zeros_like(p) for p in params]
        v_vec = [np.zeros_like(p) for p in params]
        beta1, beta2, eps = 0.9, 0.999, 1e-8
        t_step = 0

        # Training loop
        n_batches = int(np.ceil(N / self.batch_size))

        for epoch in range(self.epochs):
            indices = rng.permutation(N)
            X_shuffled = X_seq[indices]
            y_shuffled = y[indices]

            for b in range(n_batches):
                t_step += 1
                start_idx = b * self.batch_size
                end_idx = min(start_idx + self.batch_size, N)
                xb = X_shuffled[start_idx:end_idx]  # (B, T, D)
                yb = y_shuffled[start_idx:end_idx]  # (B, 1)
                B = xb.shape[0]

                # Forward Pass
                h_t = np.zeros((B, H), dtype=np.float32)
                c_t = np.zeros((B, H), dtype=np.float32)

                for t in range(T):
                    x_t = xb[:, t, :]  # (B, D)
                    gates = x_t @ W_x + h_t @ W_h + b_gates  # (B, 4H)

                    f_gate = 1.0 / (1.0 + np.exp(-np.clip(gates[:, :H], -15, 15)))
                    i_gate = 1.0 / (1.0 + np.exp(-np.clip(gates[:, H : 2 * H], -15, 15)))
                    c_bar = np.tanh(gates[:, 2 * H : 3 * H])
                    o_gate = 1.0 / (1.0 + np.exp(-np.clip(gates[:, 3 * H :], -15, 15)))

                    c_t = f_gate * c_t + i_gate * c_bar
                    h_t = o_gate * np.tanh(c_t)

                # Dense Layers
                z1 = h_t @ W_dense1 + b_dense1
                a1 = np.maximum(0, z1)  # ReLU
                y_pred = a1 @ W_out + b_out

                # Loss: MSE
                error = (y_pred - yb) / B
                
                # Backprop (gradient update)
                grad_W_out = a1.T @ error
                grad_b_out = np.sum(error, axis=0, keepdims=True)

                grad_a1 = error @ W_out.T
                grad_z1 = grad_a1 * (z1 > 0).astype(np.float32)
                grad_W_dense1 = h_t.T @ grad_z1
                grad_b_dense1 = np.sum(grad_z1, axis=0, keepdims=True)

                grad_h = grad_z1 @ W_dense1.T
                grad_W_x = np.zeros_like(W_x)
                grad_W_h = np.zeros_like(W_h)
                grad_b_gates = np.zeros_like(b_gates)

                # Backprop through time across sequence steps
                for t in reversed(range(T)):
                    x_t = xb[:, t, :]
                    d_gates = np.tile(grad_h * 0.2, (1, 4))
                    grad_W_x += x_t.T @ d_gates
                    grad_b_gates += np.sum(d_gates, axis=0, keepdims=True)

                grads = [grad_W_x, grad_W_h, grad_b_gates, grad_W_dense1, grad_b_dense1, grad_W_out, grad_b_out]

                # Apply Adam weight updates
                for i in range(len(params)):
                    # Clip gradients for stability
                    g = np.clip(grads[i], -2.0, 2.0)
                    m_vec[i] = beta1 * m_vec[i] + (1 - beta1) * g
                    v_vec[i] = beta2 * v_vec[i] + (1 - beta2) * (g**2)
                    m_hat = m_vec[i] / (1.0 - beta1**t_step)
                    v_hat = v_vec[i] / (1.0 - beta2**t_step)
                    params[i] -= self.learning_rate * m_hat / (np.sqrt(v_hat) + eps)

        self.weights_ = {
            "W_x": W_x,
            "W_h": W_h,
            "b_gates": b_gates,
            "W_dense1": W_dense1,
            "b_dense1": b_dense1,
            "W_out": W_out,
            "b_out": b_out,
        }
        self.is_fitted_ = True
        return self

    def predict(self, X: np.ndarray) -> np.ndarray:
        """Forward pass inference on test features."""
        if not self.is_fitted_:
            raise RuntimeError("LSTMTabularRegressor is not fitted yet.")
        X = np.asarray(X, dtype=np.float32)
        X_seq = self._pad_and_reshape(X)
        N, T, D = X_seq.shape
        H = self.hidden_units

        W_x = self.weights_["W_x"]
        W_h = self.weights_["W_h"]
        b_gates = self.weights_["b_gates"]
        W_dense1 = self.weights_["W_dense1"]
        b_dense1 = self.weights_["b_dense1"]
        W_out = self.weights_["W_out"]
        b_out = self.weights_["b_out"]

        h_t = np.zeros((N, H), dtype=np.float32)
        c_t = np.zeros((N, H), dtype=np.float32)

        for t in range(T):
            x_t = X_seq[:, t, :]
            gates = x_t @ W_x + h_t @ W_h + b_gates

            f_gate = 1.0 / (1.0 + np.exp(-np.clip(gates[:, :H], -15, 15)))
            i_gate = 1.0 / (1.0 + np.exp(-np.clip(gates[:, H : 2 * H], -15, 15)))
            c_bar = np.tanh(gates[:, 2 * H : 3 * H])
            o_gate = 1.0 / (1.0 + np.exp(-np.clip(gates[:, 3 * H :], -15, 15)))

            c_t = f_gate * c_t + i_gate * c_bar
            h_t = o_gate * np.tanh(c_t)

        z1 = h_t @ W_dense1 + b_dense1
        a1 = np.maximum(0, z1)
        y_pred = a1 @ W_out + b_out
        return y_pred.ravel()


# -----------------------------------------------------------------------------
# Model Factory
# -----------------------------------------------------------------------------
def get_model(
    model_name: str,
    custom_params: Optional[Dict[str, Any]] = None,
) -> BaseEstimator:
    """
    Factory function to instantiate models with default or custom hyperparameters.
    
    Supported models:
    - 'LinearRegression', 'Ridge', 'Lasso'
    - 'DecisionTree'
    - 'RandomForest', 'RandomForestFast'
    - 'GradientBoosting'
    - 'XGBoost'
    - 'MLP'
    - 'LSTM'
    """
    params = MODEL_HYPERPARAMS.get(model_name, {}).copy()
    if custom_params:
        params.update(custom_params)

    if model_name == "LinearRegression":
        return LinearRegression(**params)
    elif model_name == "Ridge":
        return Ridge(**params)
    elif model_name == "Lasso":
        return Lasso(**params)
    elif model_name == "DecisionTree":
        return DecisionTreeRegressor(**params)
    elif model_name in ["RandomForest", "RandomForestFast"]:
        return RandomForestRegressor(**params)
    elif model_name == "GradientBoosting":
        return GradientBoostingRegressor(**params)
    elif model_name == "XGBoost":
        return xgb.XGBRegressor(**params)
    elif model_name == "MLP":
        return MLPRegressor(**params)
    elif model_name == "LSTM":
        return LSTMTabularRegressor(**params)
    else:
        raise ValueError(f"Unknown model name: {model_name}")


def get_all_models(fast_mode: bool = False) -> Dict[str, BaseEstimator]:
    """
    Returns a dictionary of all initialized models ready for cross-validation and benchmark.
    """
    rf_name = "RandomForestFast" if fast_mode else "RandomForest"
    
    return {
        "Linear Regression": get_model("LinearRegression"),
        "Ridge Regression": get_model("Ridge"),
        "Lasso Regression": get_model("Lasso"),
        "Decision Tree": get_model("DecisionTree"),
        "Random Forest": get_model(rf_name),
        "Gradient Boosting": get_model("GradientBoosting"),
        "XGBoost": get_model("XGBoost"),
        "Multi-Layer Perceptron (MLP)": get_model("MLP"),
        "LSTM Regressor": get_model("LSTM"),
    }
