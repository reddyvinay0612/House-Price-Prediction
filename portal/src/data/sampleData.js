/**
 * Official Sample Reference Data & Benchmarks (Ames Iowa Housing Dataset)
 * Clearly labelled as statistical benchmark reference data.
 */

export const SAMPLE_BENCHMARKS = [
  {
    model: "Gradient Boosting (GBR)",
    r2: 0.9435,
    rmse: 19908,
    mae: 13929,
    cvRmse: 0.1236,
    cvStd: 0.0145,
    trainTime: "3.03s",
    tier: "Primary Champion",
    isPrimary: true,
  },
  {
    model: "XGBoost Regressor",
    r2: 0.9416,
    rmse: 20245,
    mae: 14370,
    cvRmse: 0.1226,
    cvStd: 0.0148,
    trainTime: "2.02s",
    tier: "High Accuracy Ensemble",
    isPrimary: false,
  },
  {
    model: "Ridge Regression (L2)",
    r2: 0.9416,
    rmse: 20248,
    mae: 13978,
    cvRmse: 0.1157,
    cvStd: 0.0167,
    trainTime: "0.01s",
    tier: "Regularized Linear",
    isPrimary: false,
  },
  {
    model: "Lasso Regression (L1)",
    r2: 0.9400,
    rmse: 20509,
    mae: 14023,
    cvRmse: 0.1152,
    cvStd: 0.0166,
    trainTime: "0.08s",
    tier: "Sparse Linear",
    isPrimary: false,
  },
  {
    model: "Linear Regression (OLS)",
    r2: 0.9328,
    rmse: 21721,
    mae: 15091,
    cvRmse: 0.1274,
    cvStd: 0.0105,
    trainTime: "0.04s",
    tier: "Standard Baseline",
    isPrimary: false,
  },
  {
    model: "Random Forest (1200 Trees)",
    r2: 0.9187,
    rmse: 23884,
    mae: 16437,
    cvRmse: 0.1405,
    cvStd: 0.0167,
    trainTime: "1.88s",
    tier: "Bagged Ensemble",
    isPrimary: false,
  },
  {
    model: "Decision Tree Regressor",
    r2: 0.8165,
    rmse: 35886,
    mae: 24856,
    cvRmse: 0.1932,
    cvStd: 0.0188,
    trainTime: "0.02s",
    tier: "Decision Tree",
    isPrimary: false,
  },
  {
    model: "Multi-Layer Perceptron (MLP)",
    r2: 0.5699,
    rmse: 54936,
    mae: 35770,
    cvRmse: 0.2961,
    cvStd: 0.0342,
    trainTime: "1.60s",
    tier: "Deep Neural Network",
    isPrimary: false,
  },
  {
    model: "LSTM Tabular Regressor",
    r2: 0.4363,
    rmse: 62888,
    mae: 42782,
    cvRmse: 0.3529,
    cvStd: 0.0220,
    trainTime: "5.53s",
    tier: "Recurrent Sequence (Exploratory)",
    isPrimary: false,
  },
];

export const SAMPLE_CORRELATIONS = [
  { feature: "Overall Quality (OverallQual)", correlation: 0.791, impact: "Very High" },
  { feature: "Above Ground Living Area (GrLivArea)", correlation: 0.709, impact: "Very High" },
  { feature: "Garage Car Capacity (GarageCars)", correlation: 0.640, impact: "High" },
  { feature: "Garage Area (GarageArea)", correlation: 0.623, impact: "High" },
  { feature: "Total Basement SF (TotalBsmtSF)", correlation: 0.614, impact: "High" },
  { feature: "1st Floor Area (1stFlrSF)", correlation: 0.606, impact: "High" },
  { feature: "Full Bathrooms (FullBath)", correlation: 0.561, impact: "Moderate" },
  { feature: "Total Rooms Above Ground (TotRmsAbvGrd)", correlation: 0.534, impact: "Moderate" },
  { feature: "Year Built (YearBuilt)", correlation: 0.523, impact: "Moderate" },
  { feature: "Year Remodeled (YearRemodAdd)", correlation: 0.507, impact: "Moderate" },
];

export const SAMPLE_NEIGHBORHOODS = [
  { code: "NridgHt", name: "Northridge Heights", avgPrice: 316270, sampleCount: 77 },
  { code: "NoRidge", name: "Northridge", avgPrice: 335295, sampleCount: 41 },
  { code: "StoneBr", name: "Stone Brook", avgPrice: 310499, sampleCount: 25 },
  { code: "Timber", name: "Timberland", avgPrice: 242247, sampleCount: 38 },
  { code: "Veenker", name: "Veenker", avgPrice: 238772, sampleCount: 11 },
  { code: "Somerst", name: "Somerset", avgPrice: 225379, sampleCount: 86 },
  { code: "ClearCr", name: "Clear Creek", avgPrice: 212565, sampleCount: 28 },
  { code: "Crawfor", name: "Crawford", avgPrice: 210624, sampleCount: 51 },
  { code: "CollgCr", name: "College Creek", avgPrice: 197965, sampleCount: 150 },
  { code: "Blmngtn", name: "Bloomington Heights", avgPrice: 194870, sampleCount: 17 },
  { code: "Gilbert", name: "Gilbert", avgPrice: 192854, sampleCount: 79 },
  { code: "SawyerW", name: "Sawyer West", avgPrice: 186555, sampleCount: 59 },
  { code: "NWAmes", name: "Northwest Ames", avgPrice: 189050, sampleCount: 73 },
  { code: "NAmes", name: "North Ames", avgPrice: 145847, sampleCount: 225 },
  { code: "OldTown", name: "Old Town", avgPrice: 128640, sampleCount: 113 },
  { code: "Edwards", name: "Edwards", avgPrice: 128219, sampleCount: 100 },
];

export const SAMPLE_HISTOGRAM = [
  { priceRange: "$30k-$100k", count: 123, pct: "8.4%" },
  { priceRange: "$100k-$150k", count: 425, pct: "29.1%" },
  { priceRange: "$150k-$200k", count: 480, pct: "32.9%" },
  { priceRange: "$200k-$250k", count: 215, pct: "14.7%" },
  { priceRange: "$250k-$300k", count: 110, pct: "7.5%" },
  { priceRange: "$300k-$400k", count: 75, pct: "5.1%" },
  { priceRange: "$400k-$600k", count: 28, pct: "1.9%" },
  { priceRange: "$600k+", count: 4, pct: "0.4%" },
];

export const SAMPLE_SCATTER_POINTS = [
  { grLivArea: 850, salePrice: 110000, qual: 5 },
  { grLivArea: 1040, salePrice: 125000, qual: 5 },
  { grLivArea: 1200, salePrice: 149000, qual: 6 },
  { grLivArea: 1350, salePrice: 162000, qual: 6 },
  { grLivArea: 1480, salePrice: 175000, qual: 7 },
  { grLivArea: 1600, salePrice: 188000, qual: 7 },
  { grLivArea: 1750, salePrice: 208000, qual: 7 },
  { grLivArea: 1900, salePrice: 225000, qual: 8 },
  { grLivArea: 2100, salePrice: 255000, qual: 8 },
  { grLivArea: 2350, salePrice: 290000, qual: 8 },
  { grLivArea: 2600, salePrice: 325000, qual: 9 },
  { grLivArea: 2850, salePrice: 375000, qual: 9 },
  { grLivArea: 3200, salePrice: 430000, qual: 9 },
  { grLivArea: 3600, salePrice: 510000, qual: 10 },
];

export const FAQ_ITEMS = [
  {
    question: "Is this estimate a formal legal appraisal?",
    answer:
      "No. This portal produces indicative machine learning estimates derived from historical residential transaction records and structural features. It is intended for public informational guidance, policy research, and indicative benchmarking, and does not replace a licensed professional appraisal.",
  },
  {
    question: "How are the machine learning models trained?",
    answer:
      "Models are trained on 1,460 certified residential property records using 80 structural, material, spatial, and temporal attributes. Preprocessing includes zero-leakage 5-fold cross-validation, median/mode imputation, outlier filtration, and log-transformed target normalization.",
  },
  {
    question: "Which algorithm delivers the highest accuracy?",
    answer:
      "Empirical testing demonstrates that Gradient Boosting (GBR) and XGBoost Regressors achieve the lowest error rates (R² ≈ 0.9435, RMSE ≈ $19,908 USD), closely followed by Ridge and Lasso Regularized Regression.",
  },
  {
    question: "Why is Overall Quality such an impactful feature?",
    answer:
      "Overall Quality rates the construction material, architectural finish, and workmanship of the structure on a 1–10 scale. In tree-based split gains, Overall Quality accounts for over 40% of variance explanation because it correlates strongly with market valuation tiers.",
  },
  {
    question: "How is data privacy handled?",
    answer:
      "No personal identifiable information (PII) is stored or transmitted. Property characteristics inputted into the estimator are processed in real time and stored only in your local browser storage if you choose to review recent calculations.",
  },
];
