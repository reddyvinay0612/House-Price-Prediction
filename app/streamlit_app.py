"""
Streamlit Web Application: House Price Prediction System
Provides an interactive dashboard for property price valuation, data exploration,
model comparison benchmarks, and feature explainability.
"""

import sys
from pathlib import Path

# Add project root to path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st

from src.config import (
    DEFAULT_UI_INPUTS,
    FIGURES_DIR,
    MODELS_DIR,
    RAW_DATA_DIR,
    RESULTS_CSV_PATH,
    TOP_CORRELATED_FEATURES,
)
from src.predict import HousePricePredictor

# -----------------------------------------------------------------------------
# Page Configuration & Styling
# -----------------------------------------------------------------------------
st.set_page_config(
    page_title="House Price Prediction System",
    page_icon="🏡",
    layout="wide",
    initial_sidebar_state="expanded",
)

st.markdown(
    """
    <style>
    .main-header {
        font-size: 2.2rem;
        font-weight: 700;
        color: #1E3A8A;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        font-size: 1.1rem;
        color: #4B5563;
        margin-bottom: 1.5rem;
    }
    .metric-card {
        background-color: #F8FAFC;
        border-radius: 10px;
        padding: 1.2rem;
        border-left: 5px solid #3B82F6;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .price-display {
        font-size: 2.5rem;
        font-weight: 800;
        color: #059669;
    }
    .price-range {
        font-size: 1.1rem;
        color: #6B7280;
        font-weight: 500;
    }
    </style>
    """,
    unsafe_allow_html=True,
)


@st.cache_resource
def get_cached_predictor():
    """Cache the predictor object to speed up repeated queries."""
    return HousePricePredictor()


@st.cache_data
def load_cached_raw_data():
    """Loads and caches raw dataset for visualization."""
    train_path = RAW_DATA_DIR / "train.csv"
    if train_path.exists():
        return pd.read_csv(train_path)
    return None


@st.cache_data
def load_cached_results():
    """Loads model benchmark results if available."""
    if RESULTS_CSV_PATH.exists():
        return pd.read_csv(RESULTS_CSV_PATH)
    return None


def main():
    st.markdown('<div class="main-header">🏡 House Price Prediction System</div>', unsafe_allow_html=True)
    st.markdown(
        '<div class="sub-header">End-to-End Machine Learning, Deep Learning (MLP & LSTM), and Valuation Analytics (Ames, Iowa Dataset)</div>',
        unsafe_allow_html=True,
    )

    predictor = get_cached_predictor()
    raw_df = load_cached_raw_data()
    results_df = load_cached_results()

    # -------------------------------------------------------------------------
    # Sidebar: Property Input Parameters & Model Selection
    # -------------------------------------------------------------------------
    st.sidebar.header("⚙️ House Configuration")
    st.sidebar.caption("Adjust key property characteristics to estimate market value.")

    # Model Selection
    available_models = predictor.get_available_models()
    if not available_models:
        available_models = [
            "Random Forest",
            "XGBoost",
            "Gradient Boosting",
            "Linear Regression",
            "Ridge Regression",
            "Lasso Regression",
            "Decision Tree",
            "Multi-Layer Perceptron (MLP)",
            "LSTM Regressor",
        ]
    
    selected_model = st.sidebar.selectbox(
        "Select Prediction Algorithm",
        options=available_models,
        index=0 if "Random Forest" in available_models else 0,
    )

    st.sidebar.subheader("📐 Core Dimensions & Living Area")
    gr_liv_area = st.sidebar.slider(
        "Above Ground Living Area (sq ft)", min_value=400, max_value=5000, value=1800, step=25
    )
    first_flr_sf = st.sidebar.slider("1st Floor Area (sq ft)", min_value=300, max_value=3500, value=1100, step=25)
    second_flr_sf = st.sidebar.slider("2nd Floor Area (sq ft)", min_value=0, max_value=2500, value=700, step=25)
    total_bsmt_sf = st.sidebar.slider("Basement Area (sq ft)", min_value=0, max_value=3500, value=1000, step=25)
    lot_area = st.sidebar.number_input("Lot Area (sq ft)", min_value=1000, max_value=100000, value=9500, step=250)

    st.sidebar.subheader("⭐ Quality & Construction")
    overall_qual = st.sidebar.slider(
        "Overall Material & Finish Quality (1-10)",
        min_value=1,
        max_value=10,
        value=7,
        help="Rates overall material and finish of the house (10=Very Excellent, 1=Very Poor)",
    )
    year_built = st.sidebar.slider("Year Built", min_value=1870, max_value=2024, value=2005)
    year_remod = st.sidebar.slider("Year Remodeled / Additions", min_value=1950, max_value=2024, value=2008)

    st.sidebar.subheader("🚗 Rooms & Utilities")
    garage_cars = st.sidebar.selectbox("Garage Capacity (Cars)", options=[0, 1, 2, 3, 4], index=2)
    garage_area = st.sidebar.slider("Garage Area (sq ft)", min_value=0, max_value=1500, value=garage_cars * 250, step=20)
    full_bath = st.sidebar.selectbox("Full Bathrooms", options=[1, 2, 3, 4], index=1)
    half_bath = st.sidebar.selectbox("Half Bathrooms", options=[0, 1, 2], index=1)
    tot_rooms = st.sidebar.slider("Total Rooms Above Ground", min_value=2, max_value=14, value=7)
    fireplaces = st.sidebar.selectbox("Fireplaces", options=[0, 1, 2, 3], index=1)

    st.sidebar.subheader("📍 Location & Quality Grades")
    neighborhood_options = [
        "CollgCr", "Veenker", "Crawfor", "NoRidge", "Mitchel", "Somerst", "NWAmes", "OldTown",
        "BrkSide", "Sawyer", "NridgHt", "NAmes", "SawyerW", "IDOTRR", "MeadowV", "Edwards",
        "Timber", "Gilbert", "StoneBr", "ClearCr", "NPkVill", "Blmngtn", "BrDale", "SWISU", "Blueste"
    ]
    neighborhood = st.sidebar.selectbox("Neighborhood", options=neighborhood_options, index=0)
    kitchen_qual = st.sidebar.selectbox("Kitchen Quality", options=["Ex", "Gd", "TA", "Fa", "Po"], index=1)
    exter_qual = st.sidebar.selectbox("Exterior Material Quality", options=["Ex", "Gd", "TA", "Fa", "Po"], index=1)
    bsmt_qual = st.sidebar.selectbox("Basement Height/Quality", options=["Ex", "Gd", "TA", "Fa", "Po", "None"], index=1)
    bldg_type = st.sidebar.selectbox("Building Type", options=["1Fam", "2fmCon", "Duplex", "TwnhsE", "Twnhs"], index=0)
    house_style = st.sidebar.selectbox("House Style", options=["1Story", "2Story", "1.5Fin", "1.5Unf", "SFoyer", "SLvl"], index=1)
    central_air = st.sidebar.selectbox("Central Air Conditioning", options=["Y", "N"], index=0)

    # Collect user dictionary
    user_inputs = {
        "OverallQual": overall_qual,
        "GrLivArea": gr_liv_area,
        "TotalBsmtSF": total_bsmt_sf,
        "1stFlrSF": first_flr_sf,
        "2ndFlrSF": second_flr_sf,
        "LotArea": lot_area,
        "YearBuilt": year_built,
        "YearRemodAdd": year_remod,
        "GarageCars": garage_cars,
        "GarageArea": garage_area,
        "FullBath": full_bath,
        "HalfBath": half_bath,
        "TotRmsAbvGrd": tot_rooms,
        "Fireplaces": fireplaces,
        "Neighborhood": neighborhood,
        "KitchenQual": kitchen_qual,
        "ExterQual": exter_qual,
        "BsmtQual": bsmt_qual,
        "BldgType": bldg_type,
        "HouseStyle": house_style,
        "CentralAir": central_air,
    }

    # -------------------------------------------------------------------------
    # Main Navigation Tabs
    # -------------------------------------------------------------------------
    tab_pred, tab_eda, tab_benchmark, tab_importance, tab_docs = st.tabs(
        [
            "🔮 Predict Price",
            "📊 Data Exploration (EDA)",
            "🏆 Model Benchmarks",
            "🧠 Feature Importance & Diagnostics",
            "📚 Project Report & Documentation",
        ]
    )

    # =========================================================================
    # TAB 1: Real-Time Valuation & Prediction
    # =========================================================================
    with tab_pred:
        st.subheader("Property Valuation Estimator")
        
        col_res, col_details = st.columns([1.2, 1])

        with col_res:
            st.markdown('<div class="metric-card">', unsafe_allow_html=True)
            st.write(f"**Selected Model:** `{selected_model}`")

            # Predict Button or Automatic Calculation
            try:
                pred_result = predictor.predict(user_inputs, model_name=selected_model)
                st.markdown(f'<div class="price-display">{pred_result["formatted_price"]}</div>', unsafe_allow_html=True)
                st.markdown(
                    f'<div class="price-range">Estimated Fair Market Range: <b>{pred_result["formatted_range"]}</b> (90% Conf.)</div>',
                    unsafe_allow_html=True,
                )
            except Exception as e:
                # Fallback estimation if model artifacts not yet compiled
                base_sqft = gr_liv_area * 95
                qual_mult = 1.0 + (overall_qual - 5) * 0.15
                age_penalty = max(0, (2024 - year_built) * 400)
                est_val = max(50_000, (base_sqft + total_bsmt_sf * 40 + garage_cars * 12000) * qual_mult - age_penalty)
                st.markdown(f'<div class="price-display">${est_val:,.2f}</div>', unsafe_allow_html=True)
                st.markdown(f'<div class="price-range">Estimated Price: ${est_val*0.90:,.0f} - ${est_val*1.10:,.0f}</div>', unsafe_allow_html=True)
                st.caption(f"Note: Using baseline estimator. Run `python src/train.py` to fit all models. ({e})")

            st.markdown("</div>", unsafe_allow_html=True)

            st.markdown("#### Feature Summary Breakdown")
            c1, c2, c3 = st.columns(3)
            c1.metric("Total Living Area", f"{gr_liv_area:,} sq ft", f"+{second_flr_sf} upper" if second_flr_sf else "Single Story")
            c2.metric("Quality Score", f"{overall_qual}/10", f"Built {year_built}")
            c3.metric("Garage & Baths", f"{garage_cars} Cars | {full_bath + 0.5*half_bath} Baths", f"{neighborhood}")

        with col_details:
            st.markdown("#### Property Attribute Radar")
            radar_categories = ["Quality", "Living Area", "Basement", "Garage", "Modernity"]
            radar_values = [
                (overall_qual / 10.0) * 100,
                min(100, (gr_liv_area / 3500.0) * 100),
                min(100, (total_bsmt_sf / 2000.0) * 100),
                min(100, (garage_cars / 4.0) * 100),
                min(100, ((year_built - 1900) / 124.0) * 100),
            ]

            fig_radar = go.Figure()
            fig_radar.add_trace(
                go.Scatterpolar(
                    r=radar_values + [radar_values[0]],
                    theta=radar_categories + [radar_categories[0]],
                    fill="toself",
                    fillcolor="rgba(59, 130, 246, 0.3)",
                    line=dict(color="#1D4ED8", width=2),
                    name="Property Profile",
                )
            )
            fig_radar.update_layout(
                polar=dict(radialaxis=dict(visible=True, range=[0, 100])),
                showlegend=False,
                margin=dict(l=20, r=20, t=30, b=20),
                height=300,
            )
            st.plotly_chart(fig_radar, use_container_width=True)

        st.divider()
        st.subheader("Price Sensitivity vs. Living Area & Quality")
        
        # Sensitivity Curve
        sample_areas = np.linspace(800, 3500, 30)
        sim_prices = []
        for a in sample_areas:
            mod_inputs = user_inputs.copy()
            mod_inputs["GrLivArea"] = a
            mod_inputs["1stFlrSF"] = a * 0.6
            mod_inputs["2ndFlrSF"] = a * 0.4
            try:
                res = predictor.predict(mod_inputs, model_name=selected_model)
                sim_prices.append(res["predicted_price_usd"])
            except Exception:
                sim_prices.append(a * 120 * (overall_qual / 6))

        fig_sens = px.line(
            x=sample_areas,
            y=sim_prices,
            labels={"x": "Living Area (GrLivArea sq ft)", "y": "Predicted Price ($ USD)"},
            title=f"Predicted Valuation Curve vs. Square Footage ({selected_model})",
        )
        fig_sens.add_vline(x=gr_liv_area, line_dash="dash", line_color="red", annotation_text="Your Input")
        st.plotly_chart(fig_sens, use_container_width=True)

    # =========================================================================
    # TAB 2: Data Exploration & EDA
    # =========================================================================
    with tab_eda:
        st.subheader("Exploratory Data Analysis (Ames Housing Dataset)")
        st.write(
            "Statistical summary and distributions across 1,460 residential properties with 79 explanatory features."
        )

        if raw_df is not None:
            c1, c2, c3, c4 = st.columns(4)
            c1.metric("Total Records", f"{len(raw_df):,}")
            c2.metric("Total Features", f"{raw_df.shape[1]}")
            c3.metric("Mean Sale Price", f"${raw_df['SalePrice'].mean():,.0f}")
            c4.metric("Median Sale Price", f"${raw_df['SalePrice'].median():,.0f}")

            st.divider()

            # EDA Plot Columns
            col_eda1, col_eda2 = st.columns(2)

            with col_eda1:
                st.markdown("#### Target Distribution & Skewness Correction")
                target_fig_path = FIGURES_DIR / "target_distribution_qq_plot.png"
                if target_fig_path.exists():
                    st.image(str(target_fig_path), use_container_width=True)
                else:
                    fig_dist = px.histogram(
                        raw_df,
                        x="SalePrice",
                        nbins=40,
                        marginal="box",
                        title=f"Raw SalePrice Distribution (Skewness: {raw_df['SalePrice'].skew():.2f})",
                    )
                    st.plotly_chart(fig_dist, use_container_width=True)

            with col_eda2:
                st.markdown("#### Outlier Removal (GrLivArea > 4000 sq ft)")
                outlier_fig_path = FIGURES_DIR / "outlier_removal_comparison.png"
                if outlier_fig_path.exists():
                    st.image(str(outlier_fig_path), use_container_width=True)
                else:
                    fig_out = px.scatter(
                        raw_df,
                        x="GrLivArea",
                        y="SalePrice",
                        color="OverallQual",
                        title="GrLivArea vs. SalePrice Outlier Analysis",
                    )
                    st.plotly_chart(fig_out, use_container_width=True)

            st.divider()

            col_eda3, col_eda4 = st.columns(2)
            with col_eda3:
                st.markdown("#### Pearson Correlation Heatmap")
                corr_path = FIGURES_DIR / "correlation_heatmap.png"
                if corr_path.exists():
                    st.image(str(corr_path), use_container_width=True)

            with col_eda4:
                st.markdown("#### Missing Values Percentage")
                missing_path = FIGURES_DIR / "missing_values.png"
                if missing_path.exists():
                    st.image(str(missing_path), use_container_width=True)

            st.divider()
            st.markdown("#### Interactive Feature Explorer")
            feat_x = st.selectbox("Select X Feature", options=["GrLivArea", "TotalBsmtSF", "YearBuilt", "OverallQual", "GarageCars", "LotArea"], index=0)
            feat_color = st.selectbox("Select Color Category", options=["OverallQual", "Neighborhood", "KitchenQual", "BldgType"], index=0)
            fig_custom = px.scatter(
                raw_df,
                x=feat_x,
                y="SalePrice",
                color=feat_color,
                hover_data=["Id", "YearBuilt", "FullBath"],
                title=f"SalePrice vs {feat_x} colored by {feat_color}",
            )
            st.plotly_chart(fig_custom, use_container_width=True)
        else:
            st.warning("Raw dataset not found. Please run `python src/data_loader.py`.")

    # =========================================================================
    # TAB 3: Model Comparison & Benchmarks
    # =========================================================================
    with tab_benchmark:
        st.subheader("Model Performance Benchmarks & Comparison")
        st.write(
            "Evaluation across 8+ regression algorithms on the 20% holdout test set (dollars inverse-transformed) and 5-fold cross-validation."
        )

        if results_df is not None:
            # Metrics Table
            st.dataframe(
                results_df.style.highlight_max(subset=["R2_Score"], color="#D1FAE5")
                .highlight_min(subset=["RMSE_USD", "MAE_USD", "CV_RMSE_Mean_log"], color="#D1FAE5")
                .format(
                    {
                        "R2_Score": "{:.4f}",
                        "RMSE_USD": "${:,.2f}",
                        "MAE_USD": "${:,.2f}",
                        "RMSE_log": "{:.4f}",
                        "CV_RMSE_Mean_log": "{:.4f}",
                        "CV_RMSE_Std_log": "{:.4f}",
                        "TrainTime_sec": "{:.3f}s",
                    }
                ),
                use_container_width=True,
            )

            st.divider()

            # Interactive Comparison Bar Charts
            c_m1, c_m2 = st.columns(2)
            with c_m1:
                fig_r2 = px.bar(
                    results_df.sort_values(by="R2_Score", ascending=True),
                    x="R2_Score",
                    y="Model",
                    orientation="h",
                    color="R2_Score",
                    color_continuous_scale="Blues",
                    title="Test Set R² Score (Higher is Better)",
                )
                st.plotly_chart(fig_r2, use_container_width=True)

            with c_m2:
                fig_rmse = px.bar(
                    results_df.sort_values(by="RMSE_USD", ascending=False),
                    x="RMSE_USD",
                    y="Model",
                    orientation="h",
                    color="RMSE_USD",
                    color_continuous_scale="Reds_r",
                    title="Test Set RMSE ($ USD - Lower is Better)",
                )
                st.plotly_chart(fig_rmse, use_container_width=True)

            st.divider()
            comp_fig_path = FIGURES_DIR / "model_comparison_charts.png"
            if comp_fig_path.exists():
                st.markdown("#### Publication Benchmark Summary Grid")
                st.image(str(comp_fig_path), use_container_width=True)
        else:
            st.info("Benchmark results will appear after running `python src/train.py`.")

    # =========================================================================
    # TAB 4: Feature Importance & Explainability
    # =========================================================================
    with tab_importance:
        st.subheader("Model Explainability & Feature Importance")
        st.write("Understand which property characteristics drive the predicted valuation.")

        col_imp1, col_imp2 = st.columns(2)
        with col_imp1:
            rf_imp_path = FIGURES_DIR / "feature_importance_random_forest.png"
            if rf_imp_path.exists():
                st.image(str(rf_imp_path), use_container_width=True)
            else:
                st.caption("Random Forest importance plot will generate during training.")

        with col_imp2:
            xgb_imp_path = FIGURES_DIR / "feature_importance_xgboost.png"
            if xgb_imp_path.exists():
                st.image(str(xgb_imp_path), use_container_width=True)
            else:
                st.caption("XGBoost importance plot will generate during training.")

        st.divider()
        st.subheader("Model Residual & Diagnostic Gallery")
        diag_files = list(FIGURES_DIR.glob("diagnostics_*.png"))
        if diag_files:
            selected_diag = st.selectbox(
                "Select Model Diagnostic Plot",
                options=[f.stem.replace("diagnostics_", "").replace("_", " ").title() for f in diag_files],
            )
            matching_file = next(
                (f for f in diag_files if f.stem.replace("diagnostics_", "").replace("_", " ").title() == selected_diag),
                diag_files[0],
            )
            st.image(str(matching_file), use_container_width=True)

    # =========================================================================
    # TAB 5: Project Report & Documentation
    # =========================================================================
    with tab_docs:
        st.subheader("Academic Project Report Outline")
        st.markdown(
            """
            ### Abstract
            This project presents an end-to-end Machine Learning and Deep Learning system for automated residential valuation. Using the benchmark Ames Housing dataset (80 features), we implement a leakage-free preprocessing pipeline featuring ordinal encoding, skewness log-transforms, domain feature engineering, and robust outlier filtering. We evaluate 9 algorithms: Linear Regression, Ridge, Lasso, Decision Trees, Random Forests, Gradient Boosting Machines, XGBoost, Multi-Layer Perceptrons (MLP), and sequence-reshaped Long Short-Term Memory (LSTM) networks.

            ### Methodology Highlights
            1. **Preprocessing**: Missing values >50% dropped (`PoolQC`, `MiscFeature`, `Alley`, `Fence`, `FireplaceQu`). Skewed numeric features and target variable are transformed via $\\log(1 + y)$.
            2. **Feature Engineering**: Synthesized `TotalSF`, `TotalBath`, `HouseAge`, `RemodAge`, `HasGarage`, and `TotalPorchSF`.
            3. **Cross-Validation**: 5-Fold CV on training split to eliminate data leakage.
            4. **Evaluation**: Inverse transformed predictions back to real USD currency to calculate MAE, MSE, RMSE, and $R^2$.

            ### Limitations & Future Scope
            - **Temporal Dynamics**: Ames dataset captures 2006-2010 transactions; future iterations should incorporate macroeconomic interest rate trends.
            - **Geographic Expansion**: Integrating multi-metro MLS feeds, real-time spatial GIS mapping, and satellite imagery.
            - **Augmented Reality UI**: Real-time camera appraisal using computer vision for room condition detection.
            """
        )


if __name__ == "__main__":
    main()
