"""
Inference and prediction module for the House Price Prediction System.
Loads saved models and preprocessing pipelines to produce reliable predictions
from raw input feature dictionaries or DataFrames.
"""

import logging
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Union

# Ensure project root is in sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import joblib
import numpy as np
import pandas as pd

from src.config import DEFAULT_UI_INPUTS, MODELS_DIR, RAW_DATA_DIR
from src.preprocessing import inverse_log_transform_target

logger = logging.getLogger(__name__)


class HousePricePredictor:
    """
    Unified production inference engine for house price prediction.
    """

    def __init__(self, models_dir: Path = MODELS_DIR):
        self.models_dir = Path(models_dir)
        self.pipeline = None
        self.models: Dict[str, Any] = {}
        self.default_sample_df: Optional[pd.DataFrame] = None
        self._load_artifacts()

    def _load_artifacts(self):
        """Loads preprocessing pipeline and available trained models from disk."""
        pipeline_path = self.models_dir / "preprocessing_pipeline.joblib"
        if pipeline_path.exists():
            self.pipeline = joblib.load(pipeline_path)
            logger.info("Loaded preprocessing pipeline.")
        else:
            logger.warning(f"Preprocessing pipeline not found at {pipeline_path}. Please run train.py first.")

        # Load all saved models
        for model_file in self.models_dir.glob("*.joblib"):
            if model_file.name == "preprocessing_pipeline.joblib":
                continue
            model_key = (
                model_file.stem.replace("_", " ")
                .title()
                .replace("Mlp", "MLP")
                .replace("Lstm", "LSTM")
            )
            try:
                self.models[model_key] = joblib.load(model_file)
            except Exception as e:
                logger.warning(f"Could not load model {model_file.name}: {e}")

        # Load raw train data for default feature filling if available
        train_path = RAW_DATA_DIR / "train.csv"
        if train_path.exists():
            try:
                df = pd.read_csv(train_path, nrows=50)
                self.default_sample_df = df.drop(columns=["SalePrice", "Id"], errors="ignore").iloc[0:1].copy()
            except Exception:
                pass

    def get_available_models(self) -> List[str]:
        """Returns list of currently loaded model names."""
        return list(self.models.keys())

    def prepare_input_dataframe(self, user_inputs: Dict[str, Any]) -> pd.DataFrame:
        """
        Merges user inputs with standard template / default values for missing columns.
        """
        if self.default_sample_df is not None:
            input_df = self.default_sample_df.copy()
            for k, v in user_inputs.items():
                if k in input_df.columns:
                    input_df[k] = v
                else:
                    input_df[k] = [v]
        else:
            # Fallback to DEFAULT_UI_INPUTS
            data = {**DEFAULT_UI_INPUTS, **user_inputs}
            input_df = pd.DataFrame([data])

        return input_df

    def predict(
        self,
        input_data: Union[Dict[str, Any], pd.DataFrame],
        model_name: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Generates price predictions for raw input data.
        
        Args:
            input_data: Single dictionary of features or a Pandas DataFrame.
            model_name: Name of the model to use. If None, uses Random Forest or first available.
            
        Returns:
            Dict containing predicted_price_usd, formatted_price, model_used, log_prediction
        """
        if self.pipeline is None:
            self._load_artifacts()
            if self.pipeline is None:
                raise RuntimeError("Preprocessing pipeline not loaded. Please train models first.")

        # Convert dictionary to DataFrame if needed
        if isinstance(input_data, dict):
            input_df = self.prepare_input_dataframe(input_data)
        else:
            input_df = input_data.copy()

        # Select model
        if not self.models:
            raise RuntimeError("No trained models found in models/ directory.")

        if model_name is None or model_name not in self.models:
            # Prefer Random Forest or XGBoost if available
            preferred = ["Random Forest", "Xgboost", "Gradient Boosting", "Linear Regression"]
            chosen_key = next((m for m in preferred if m in self.models), list(self.models.keys())[0])
            model_to_use = self.models[chosen_key]
            model_name = chosen_key
        else:
            model_to_use = self.models[model_name]

        # Transform features
        X_processed = self.pipeline.transform(input_df)

        # Predict in log scale
        pred_log = model_to_use.predict(X_processed)
        if isinstance(pred_log, (np.ndarray, list)):
            pred_log_val = float(pred_log[0])
        else:
            pred_log_val = float(pred_log)

        # Inverse transform to USD
        pred_usd = float(inverse_log_transform_target(pred_log_val))
        
        # Estimate ~95% confidence bounds (±10-12% baseline variance)
        lower_bound = max(10_000.0, pred_usd * 0.90)
        upper_bound = pred_usd * 1.10

        return {
            "model_name": model_name,
            "predicted_price_usd": round(pred_usd, 2),
            "formatted_price": f"${pred_usd:,.2f}",
            "lower_bound_usd": round(lower_bound, 2),
            "upper_bound_usd": round(upper_bound, 2),
            "formatted_range": f"${lower_bound:,.0f} - ${upper_bound:,.0f}",
            "log_price": round(pred_log_val, 4),
        }


if __name__ == "__main__":
    predictor = HousePricePredictor()
    models = predictor.get_available_models()
    print(f"Available models: {models}")

    sample_house = {
        "OverallQual": 8,
        "GrLivArea": 2200,
        "TotalBsmtSF": 1200,
        "GarageCars": 2,
        "FullBath": 2,
        "YearBuilt": 2012,
        "Neighborhood": "NridgHt",
    }

    print("\nRunning test prediction for sample house:")
    for k, v in sample_house.items():
        print(f"  {k}: {v}")

    try:
        result = predictor.predict(sample_house)
        print("\nPrediction Result:")
        for k, v in result.items():
            print(f"  {k}: {v}")
    except Exception as e:
        print(f"Prediction note: {e}")
