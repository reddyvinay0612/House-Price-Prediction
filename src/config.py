"""
Configuration module for the House Price Prediction System.
Defines paths, feature schemas, hyperparameters, random seeds, and constants.
"""

from pathlib import Path
from typing import Dict, List

# -----------------------------------------------------------------------------
# Base Directories
# -----------------------------------------------------------------------------
SRC_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SRC_DIR.parent

DATA_DIR = PROJECT_ROOT / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
PROCESSED_DATA_DIR = DATA_DIR / "processed"

MODELS_DIR = PROJECT_ROOT / "models"
REPORTS_DIR = PROJECT_ROOT / "reports"
FIGURES_DIR = REPORTS_DIR / "figures"
RESULTS_CSV_PATH = REPORTS_DIR / "results.csv"
NOTEBOOKS_DIR = PROJECT_ROOT / "notebooks"

# Ensure runtime directories exist
for path in [RAW_DATA_DIR, PROCESSED_DATA_DIR, MODELS_DIR, FIGURES_DIR]:
    path.mkdir(parents=True, exist_ok=True)

# -----------------------------------------------------------------------------
# Global Constants & Experiment Settings
# -----------------------------------------------------------------------------
RANDOM_SEED = 0
TEST_SIZE = 0.2
CV_FOLDS = 5
TARGET_COLUMN = "SalePrice"
ID_COLUMN = "Id"

# Outlier threshold rule (as recommended in the Ames dataset documentation)
OUTLIER_GRLIVAREA_THRESHOLD = 4000

# Columns with >50% missing values to drop
COLUMNS_TO_DROP = [
    "PoolQC",
    "MiscFeature",
    "Alley",
    "Fence",
    "FireplaceQu",
]

# -----------------------------------------------------------------------------
# Ordinal Feature Mappings
# -----------------------------------------------------------------------------
QUALITY_MAPPING: Dict[str, int] = {
    "None": 0,
    "Po": 1,   # Poor
    "Fa": 2,   # Fair
    "TA": 3,   # Typical/Average
    "Gd": 4,   # Good
    "Ex": 5,   # Excellent
}

BSMT_EXPOSURE_MAPPING: Dict[str, int] = {
    "None": 0,
    "No": 1,
    "Mn": 2,
    "Av": 3,
    "Gd": 4,
}

BSMT_FIN_TYPE_MAPPING: Dict[str, int] = {
    "None": 0,
    "Unf": 1,
    "LwQ": 2,
    "Rec": 3,
    "BLQ": 4,
    "ALQ": 5,
    "GLQ": 6,
}

GARAGE_FINISH_MAPPING: Dict[str, int] = {
    "None": 0,
    "Unf": 1,
    "RFn": 2,
    "Fin": 3,
}

ORDINAL_MAPPINGS: Dict[str, Dict[str, int]] = {
    "ExterQual": QUALITY_MAPPING,
    "ExterCond": QUALITY_MAPPING,
    "BsmtQual": QUALITY_MAPPING,
    "BsmtCond": QUALITY_MAPPING,
    "HeatingQC": QUALITY_MAPPING,
    "KitchenQual": QUALITY_MAPPING,
    "GarageQual": QUALITY_MAPPING,
    "GarageCond": QUALITY_MAPPING,
    "BsmtExposure": BSMT_EXPOSURE_MAPPING,
    "BsmtFinType1": BSMT_FIN_TYPE_MAPPING,
    "BsmtFinType2": BSMT_FIN_TYPE_MAPPING,
    "GarageFinish": GARAGE_FINISH_MAPPING,
}

# -----------------------------------------------------------------------------
# Key Features for Fast UI Input & Top Feature Analysis
# -----------------------------------------------------------------------------
TOP_CORRELATED_FEATURES: List[str] = [
    "OverallQual",
    "GrLivArea",
    "GarageCars",
    "GarageArea",
    "TotalBsmtSF",
    "1stFlrSF",
    "FullBath",
    "TotRmsAbvGrd",
    "YearBuilt",
    "YearRemodAdd",
]

DEFAULT_UI_INPUTS: Dict[str, any] = {
    "OverallQual": 7,
    "GrLivArea": 1800,
    "TotalBsmtSF": 1000,
    "1stFlrSF": 1100,
    "2ndFlrSF": 700,
    "GarageCars": 2,
    "GarageArea": 500,
    "FullBath": 2,
    "HalfBath": 1,
    "TotRmsAbvGrd": 7,
    "YearBuilt": 2005,
    "YearRemodAdd": 2008,
    "Neighborhood": "CollgCr",
    "BldgType": "1Fam",
    "HouseStyle": "2Story",
    "KitchenQual": "Gd",
    "ExterQual": "Gd",
    "BsmtQual": "Gd",
    "Fireplaces": 1,
    "LotArea": 9500,
    "CentralAir": "Y",
}

# -----------------------------------------------------------------------------
# Default Model Hyperparameters
# -----------------------------------------------------------------------------
MODEL_HYPERPARAMS = {
    "LinearRegression": {},
    "Ridge": {"alpha": 10.0, "random_state": RANDOM_SEED},
    "Lasso": {"alpha": 0.0005, "random_state": RANDOM_SEED, "max_iter": 5000},
    "DecisionTree": {
        "max_depth": 10,
        "min_samples_split": 5,
        "min_samples_leaf": 2,
        "random_state": RANDOM_SEED,
    },
    "RandomForest": {
        "n_estimators": 1200,
        "max_depth": 60,
        "min_samples_split": 2,
        "min_samples_leaf": 1,
        "random_state": RANDOM_SEED,
        "n_jobs": -1,
    },
    "RandomForestFast": {
        "n_estimators": 200,
        "max_depth": 30,
        "random_state": RANDOM_SEED,
        "n_jobs": -1,
    },
    "GradientBoosting": {
        "n_estimators": 500,
        "learning_rate": 0.03,
        "max_depth": 4,
        "subsample": 0.8,
        "random_state": RANDOM_SEED,
    },
    "XGBoost": {
        "n_estimators": 500,
        "learning_rate": 0.03,
        "max_depth": 4,
        "subsample": 0.8,
        "colsample_bytree": 0.8,
        "random_state": RANDOM_SEED,
        "n_jobs": -1,
    },
    "MLP": {
        "hidden_layer_sizes": (128, 64, 32),
        "activation": "relu",
        "solver": "adam",
        "alpha": 0.001,
        "learning_rate_init": 0.01,
        "max_iter": 1000,
        "early_stopping": False,
        "random_state": RANDOM_SEED,
    },
    "LSTM": {
        "hidden_units": 64,
        "dense_units": 32,
        "dropout_rate": 0.2,
        "learning_rate": 0.005,
        "epochs": 120,
        "batch_size": 32,
        "random_state": RANDOM_SEED,
    },
}
