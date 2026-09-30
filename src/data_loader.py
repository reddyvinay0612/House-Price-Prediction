"""
Data loader module for the House Price Prediction System.
Handles automated fetching, caching, loading, and initial validation of the Ames Housing dataset
and California Housing secondary benchmark dataset.
"""

import logging
import sys
from pathlib import Path
from typing import Optional, Tuple

# Ensure project root is in sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import numpy as np
import pandas as pd
import requests

from src.config import DATA_DIR, RAW_DATA_DIR, TARGET_COLUMN

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Fast, reliable raw mirror URLs for the Kaggle Ames Housing Dataset
TRAIN_URLS = [
    "https://raw.githubusercontent.com/selva86/datasets/master/HousePrices_train.csv",
    "https://raw.githubusercontent.com/jovian-ai/datasets/master/house-prices/train.csv",
    "https://raw.githubusercontent.com/manan-rawat/House-Price-Prediction/master/train.csv",
]

TEST_URLS = [
    "https://raw.githubusercontent.com/selva86/datasets/master/HousePrices_test.csv",
    "https://raw.githubusercontent.com/jovian-ai/datasets/master/house-prices/test.csv",
]


def download_file(url: str, destination: Path, timeout: int = 15) -> bool:
    """Download a file from URL to destination path with custom headers and timeout."""
    try:
        logger.info(f"Downloading data from {url} to {destination}...")
        destination.parent.mkdir(parents=True, exist_ok=True)
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
        resp = requests.get(url, headers=headers, timeout=timeout)
        if resp.status_code == 200 and len(resp.content) > 1000:
            with open(destination, "wb") as f:
                f.write(resp.content)
            logger.info(f"Successfully downloaded {destination.name} ({destination.stat().st_size / 1024:.1f} KB)")
            return True
        else:
            logger.warning(f"Download failed with status {resp.status_code}")
            return False
    except Exception as e:
        logger.warning(f"Failed to download from {url}: {e}")
        return False


def fetch_ames_from_openml() -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Fetch Ames Housing dataset using scikit-learn's OpenML interface."""
    logger.info("Fetching Ames Housing dataset from OpenML...")
    from sklearn.datasets import fetch_openml
    
    # OpenML dataset 'house_prices' (ID 42165)
    data = fetch_openml(name="house_prices", as_frame=True, parser="auto")
    df = data.frame.copy()
    
    # Rename target column if necessary
    if "SalePrice" not in df.columns and "target" in df.columns:
        df = df.rename(columns={"target": "SalePrice"})
    
    # Add synthetic Id if missing
    if "Id" not in df.columns:
        df.insert(0, "Id", range(1, len(df) + 1))
        
    return df


def ensure_datasets_exist() -> Tuple[Path, Optional[Path]]:
    """
    Ensure train.csv and test.csv exist in RAW_DATA_DIR.
    If missing, attempts downloading from mirrors or OpenML.
    """
    train_path = RAW_DATA_DIR / "train.csv"
    test_path = RAW_DATA_DIR / "test.csv"
    
    if train_path.exists():
        logger.info(f"Found existing train dataset at {train_path}")
        return train_path, test_path if test_path.exists() else None

    # Try downloading from raw mirror
    downloaded = False
    for url in TRAIN_URLS:
        if download_file(url, train_path):
            downloaded = True
            break

    if not downloaded:
        try:
            df = fetch_ames_from_openml()
            df.to_csv(train_path, index=False)
            downloaded = True
            logger.info(f"Saved OpenML Ames dataset to {train_path}")
        except Exception as e:
            logger.error(f"Error fetching from OpenML: {e}")

    # Try downloading test set if available
    for url in TEST_URLS:
        download_file(url, test_path)

    if not train_path.exists():
        raise FileNotFoundError(
            f"Could not automatically download train.csv to {train_path}. "
            "Please place the Kaggle Ames train.csv into data/raw/train.csv"
        )

    return train_path, test_path if test_path.exists() else None


def load_raw_data() -> Tuple[pd.DataFrame, Optional[pd.DataFrame]]:
    """
    Loads raw training and test dataframes.
    
    Returns:
        Tuple[pd.DataFrame, Optional[pd.DataFrame]]: (train_df, test_df)
    """
    train_path, test_path = ensure_datasets_exist()
    
    train_df = pd.read_csv(train_path)
    logger.info(f"Loaded train.csv with shape: {train_df.shape}")
    
    test_df = None
    if test_path and test_path.exists():
        try:
            test_df = pd.read_csv(test_path)
            logger.info(f"Loaded test.csv with shape: {test_df.shape}")
        except Exception as e:
            logger.warning(f"Could not load test.csv: {e}")
            
    return train_df, test_df


def load_california_housing() -> pd.DataFrame:
    """
    Load the secondary California Housing dataset from scikit-learn.
    Used for multi-dataset visualization and comparison.
    """
    logger.info("Loading California Housing dataset...")
    from sklearn.datasets import fetch_california_housing
    
    cal_data = fetch_california_housing(as_frame=True)
    df = cal_data.frame.copy()
    # MedHouseVal is in units of $100,000s, convert to dollars
    df["SalePrice"] = df["MedHouseVal"] * 100_000
    logger.info(f"Loaded California Housing dataset with shape: {df.shape}")
    return df


def get_dataset_summary(df: pd.DataFrame) -> dict:
    """
    Compute statistical profile and summary of the dataset.
    """
    summary = {
        "num_rows": int(df.shape[0]),
        "num_columns": int(df.shape[1]),
        "numeric_features": int(df.select_dtypes(include=[np.number]).shape[1]),
        "categorical_features": int(df.select_dtypes(exclude=[np.number]).shape[1]),
        "total_missing_values": int(df.isnull().sum().sum()),
        "columns_with_missing": int((df.isnull().sum() > 0).sum()),
    }
    
    if TARGET_COLUMN in df.columns:
        target_stats = df[TARGET_COLUMN].describe().to_dict()
        target_stats["skewness"] = float(df[TARGET_COLUMN].skew())
        target_stats["kurtosis"] = float(df[TARGET_COLUMN].kurt())
        summary["target_statistics"] = target_stats
        
    return summary


if __name__ == "__main__":
    print("=" * 60)
    print("House Price Prediction - Data Loader Execution")
    print("=" * 60)
    train_df, test_df = load_raw_data()
    summary = get_dataset_summary(train_df)
    print("\nDataset Summary:")
    for k, v in summary.items():
        if k != "target_statistics":
            print(f"  - {k}: {v}")
    if "target_statistics" in summary:
        print("\nSalePrice Statistics (USD):")
        for k, v in summary["target_statistics"].items():
            print(f"  - {k}: {v:,.2f}" if isinstance(v, (int, float)) else f"  - {k}: {v}")
    print("\nData loading completed successfully.")
