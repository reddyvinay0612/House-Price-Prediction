/**
 * EstateAI - Real-Time House Price Prediction & Visualization Client
 */

let radarChartInstance = null;
let r2ChartInstance = null;
let rmseChartInstance = null;
let corrChartInstance = null;
let neighborhoodChartInstance = null;
let scatterChartInstance = null;

// DOM Elements
const sqftSlider = document.getElementById("sqftSlider");
const sqftDisplay = document.getElementById("sqftDisplay");
const qualSlider = document.getElementById("qualSlider");
const qualDisplay = document.getElementById("qualDisplay");
const bsmtSlider = document.getElementById("bsmtSlider");
const bsmtDisplay = document.getElementById("bsmtDisplay");
const garageSlider = document.getElementById("garageSlider");
const garageDisplay = document.getElementById("garageDisplay");
const carsSelect = document.getElementById("carsSelect");
const bathsSelect = document.getElementById("bathsSelect");
const roomsSelect = document.getElementById("roomsSelect");
const yearBuiltInput = document.getElementById("yearBuiltInput");
const yearRemodInput = document.getElementById("yearRemodInput");
const neighborhoodSelect = document.getElementById("neighborhoodSelect");
const kitchenQualSelect = document.getElementById("kitchenQualSelect");
const exterQualSelect = document.getElementById("exterQualSelect");
const modelSelect = document.getElementById("modelSelect");
const predictBtn = document.getElementById("predictBtn");

// Output Elements
const predictedPriceText = document.getElementById("predictedPriceText");
const priceRangeText = document.getElementById("priceRangeText");
const pricePerSqftText = document.getElementById("pricePerSqftText");
const activeModelBadge = document.getElementById("activeModelBadge");
const monthlyTotalText = document.getElementById("monthlyTotalText");
const mortgageText = document.getElementById("mortgageText");
const taxText = document.getElementById("taxText");
const insText = document.getElementById("insText");
const benchmarkTableBody = document.getElementById("benchmarkTableBody");

const QUAL_LABELS = {
    1: "Grade 1 - Very Poor",
    2: "Grade 2 - Poor",
    3: "Grade 3 - Fair",
    4: "Grade 4 - Below Average",
    5: "Grade 5 - Average",
    6: "Grade 6 - Above Average",
    7: "Grade 7 - Good",
    8: "Grade 8 - Very Good",
    9: "Grade 9 - Excellent",
    10: "Grade 10 - Luxury/Custom",
};

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
    initEventListeners();
    fetchModelsAndBenchmarks();
    fetchEdaStats();
    calculateValuation();
});

function initEventListeners() {
    // Sliders Live Display & Debounced Recalculation
    sqftSlider.addEventListener("input", (e) => {
        sqftDisplay.textContent = `${Number(e.target.value).toLocaleString()} sq ft`;
        debounceCalculate();
    });

    qualSlider.addEventListener("input", (e) => {
        const val = Number(e.target.value);
        qualDisplay.textContent = QUAL_LABELS[val] || `Grade ${val}`;
        debounceCalculate();
    });

    bsmtSlider.addEventListener("input", (e) => {
        bsmtDisplay.textContent = `${Number(e.target.value).toLocaleString()} sq ft`;
        debounceCalculate();
    });

    garageSlider.addEventListener("input", (e) => {
        garageDisplay.textContent = `${Number(e.target.value).toLocaleString()} sq ft`;
        debounceCalculate();
    });

    [
        carsSelect,
        bathsSelect,
        roomsSelect,
        yearBuiltInput,
        yearRemodInput,
        neighborhoodSelect,
        kitchenQualSelect,
        exterQualSelect,
        modelSelect,
    ].forEach((el) => {
        if (el) {
            el.addEventListener("change", calculateValuation);
        }
    });

    if (predictBtn) {
        predictBtn.addEventListener("click", calculateValuation);
    }
}

let debounceTimer = null;
function debounceCalculate() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(calculateValuation, 200);
}

function getPayload() {
    const sqft = parseFloat(sqftSlider.value);
    const firstFlr = Math.min(sqft, Math.round(sqft * 0.65));
    const secondFlr = Math.max(0, sqft - firstFlr);

    return {
        OverallQual: parseInt(qualSlider.value),
        GrLivArea: sqft,
        TotalBsmtSF: parseFloat(bsmtSlider.value),
        "1stFlrSF": firstFlr,
        "2ndFlrSF": secondFlr,
        LotArea: 9500,
        YearBuilt: parseInt(yearBuiltInput.value) || 2005,
        YearRemodAdd: parseInt(yearRemodInput.value) || 2008,
        GarageCars: parseInt(carsSelect.value),
        GarageArea: parseFloat(garageSlider.value),
        FullBath: parseInt(bathsSelect.value),
        HalfBath: 1,
        TotRmsAbvGrd: parseInt(roomsSelect.value),
        Fireplaces: 1,
        Neighborhood: neighborhoodSelect.value,
        KitchenQual: kitchenQualSelect.value,
        ExterQual: exterQualSelect.value,
        BsmtQual: "Gd",
        BldgType: "1Fam",
        HouseStyle: secondFlr > 0 ? "2Story" : "1Story",
        CentralAir: "Y",
        model_name: modelSelect.value,
    };
}

async function calculateValuation() {
    const payload = getPayload();
    if (activeModelBadge) activeModelBadge.textContent = payload.model_name;

    try {
        const response = await fetch("/api/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Valuation calculation failed");
        const data = await response.json();

        // Update UI
        if (predictedPriceText) {
            predictedPriceText.textContent = data.formatted_price;
            predictedPriceText.classList.remove("price-pulse");
            void predictedPriceText.offsetWidth; // Trigger reflow
            predictedPriceText.classList.add("price-pulse");
        }

        if (priceRangeText) priceRangeText.textContent = data.formatted_range;
        if (pricePerSqftText) pricePerSqftText.textContent = `$${data.price_per_sqft} / sq ft`;

        if (data.financials) {
            if (monthlyTotalText) monthlyTotalText.textContent = `$${data.financials.total_monthly_est.toLocaleString()} / mo`;
            if (mortgageText) mortgageText.textContent = `$${data.financials.monthly_mortgage.toLocaleString()}`;
            if (taxText) taxText.textContent = `$${data.financials.monthly_tax.toLocaleString()}`;
            if (insText) insText.textContent = `$${data.financials.monthly_insurance.toLocaleString()}`;
        }

        // Update Radar Chart
        if (data.radar_profile) {
            updateRadarChart(data.radar_profile);
        }

        // Update Scatter chart with current point
        if (scatterChartInstance && data.predicted_price_usd) {
            updateScatterPoint(payload.GrLivArea, data.predicted_price_usd);
        }
    } catch (err) {
        console.error(err);
    }
}

function updateRadarChart(profile) {
    const ctx = document.getElementById("radarChart");
    if (!ctx) return;

    const labels = Object.keys(profile);
    const values = Object.values(profile);

    if (radarChartInstance) {
        radarChartInstance.data.datasets[0].data = values;
        radarChartInstance.update();
        return;
    }

    radarChartInstance = new Chart(ctx, {
        type: "radar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Selected Property",
                    data: values,
                    backgroundColor: "rgba(59, 130, 246, 0.25)",
                    borderColor: "#2563EB",
                    pointBackgroundColor: "#1D4ED8",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "#1D4ED8",
                    borderWidth: 2,
                },
                {
                    label: "Market Average",
                    data: [50, 50, 50, 50, 50],
                    borderColor: "rgba(148, 163, 184, 0.6)",
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0,
                    borderWidth: 1.5,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: "rgba(226, 232, 240, 0.8)" },
                    grid: { color: "rgba(226, 232, 240, 0.8)" },
                    pointLabels: { font: { size: 11, weight: "bold" } },
                    suggestedMin: 0,
                    suggestedMax: 100,
                    ticks: { display: false, stepSize: 20 },
                },
            },
            plugins: {
                legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 10 } } },
            },
        },
    });
}

async function fetchModelsAndBenchmarks() {
    try {
        const res = await fetch("/api/models");
        const data = await res.json();

        if (data.benchmarks && data.benchmarks.length > 0) {
            renderBenchmarkTable(data.benchmarks);
            renderBenchmarkCharts(data.benchmarks);
        }
    } catch (err) {
        console.error("Failed to load benchmarks:", err);
    }
}

function renderBenchmarkTable(benchmarks) {
    if (!benchmarkTableBody) return;
    benchmarkTableBody.innerHTML = "";

    benchmarks.forEach((row) => {
        const r2 = parseFloat(row.R2_Score || 0);
        const rmse = parseFloat(row.RMSE_USD || 0);
        const mae = parseFloat(row.MAE_USD || 0);
        const cvMean = parseFloat(row.CV_RMSE_Mean_log || 0);
        const cvStd = parseFloat(row.CV_RMSE_Std_log || 0);
        const latency = parseFloat(row.TrainTime_sec || 0);

        let tierBadge = '<span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">Standard</span>';
        if (r2 >= 0.94) {
            tierBadge = '<span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">★ S-Tier Champion</span>';
        } else if (r2 >= 0.90) {
            tierBadge = '<span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">A-Tier High Acc</span>';
        }

        const tr = document.createElement("tr");
        tr.className = "hover:bg-slate-50/80 transition";
        tr.innerHTML = `
            <td class="py-3.5 px-6 font-bold text-slate-800 flex items-center space-x-2">
                <i class="fa-solid fa-cube text-xs text-blue-500"></i>
                <span>${row.Model}</span>
            </td>
            <td class="py-3.5 px-6 font-extrabold ${r2 >= 0.90 ? 'text-emerald-600' : 'text-slate-700'}">${r2.toFixed(4)}</td>
            <td class="py-3.5 px-6 font-bold text-slate-800">$${rmse.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
            <td class="py-3.5 px-6 text-slate-600">$${mae.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
            <td class="py-3.5 px-6 text-slate-600">${cvMean.toFixed(4)} ± ${cvStd.toFixed(4)}</td>
            <td class="py-3.5 px-6 text-slate-500 font-mono text-xs">${latency.toFixed(2)}s</td>
            <td class="py-3.5 px-6">${tierBadge}</td>
        `;
        benchmarkTableBody.appendChild(tr);
    });
}

function renderBenchmarkCharts(benchmarks) {
    const models = benchmarks.map((b) => b.Model);
    const r2Scores = benchmarks.map((b) => parseFloat(b.R2_Score || 0));
    const rmseScores = benchmarks.map((b) => parseFloat(b.RMSE_USD || 0));

    // R2 Bar Chart
    const ctxR2 = document.getElementById("r2BarChart");
    if (ctxR2) {
        r2ChartInstance = new Chart(ctxR2, {
            type: "bar",
            data: {
                labels: models,
                datasets: [
                    {
                        label: "R² Score",
                        data: r2Scores,
                        backgroundColor: r2Scores.map(v => v >= 0.90 ? "#10B981" : "#3B82F6"),
                        borderRadius: 6,
                    },
                ],
            },
            options: {
                indexAxis: "y",
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { suggestedMin: 0, suggestedMax: 1.0, grid: { color: "#F1F5F9" } },
                    y: { grid: { display: false }, ticks: { font: { size: 10, weight: "bold" } } },
                },
            },
        });
    }

    // RMSE Bar Chart
    const ctxRmse = document.getElementById("rmseBarChart");
    if (ctxRmse) {
        rmseChartInstance = new Chart(ctxRmse, {
            type: "bar",
            data: {
                labels: models,
                datasets: [
                    {
                        label: "RMSE ($ USD)",
                        data: rmseScores,
                        backgroundColor: "#F43F5E",
                        borderRadius: 6,
                    },
                ],
            },
            options: {
                indexAxis: "y",
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: "#F1F5F9" } },
                    y: { grid: { display: false }, ticks: { font: { size: 10, weight: "bold" } } },
                },
            },
        });
    }
}

async function fetchEdaStats() {
    try {
        const res = await fetch("/api/eda_stats");
        const data = await res.json();

        if (data.top_correlations) {
            renderCorrChart(data.top_correlations);
        }

        if (data.neighborhood_averages) {
            renderNeighborhoodChart(data.neighborhood_averages);
        }

        if (data.sample_scatter) {
            renderScatterChart(data.sample_scatter);
        }
    } catch (err) {
        console.error("Failed to load EDA stats:", err);
    }
}

function renderCorrChart(corrs) {
    const ctx = document.getElementById("corrBarChart");
    if (!ctx) return;

    corrChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: corrs.map(c => c.feature),
            datasets: [
                {
                    data: corrs.map(c => c.correlation),
                    backgroundColor: "#6366F1",
                    borderRadius: 6,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { min: 0, max: 1.0, grid: { color: "#F1F5F9" } },
                x: { grid: { display: false }, ticks: { font: { size: 10 } } },
            },
        },
    });
}

function renderNeighborhoodChart(neighborhoods) {
    const ctx = document.getElementById("neighborhoodChart");
    if (!ctx) return;

    neighborhoodChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: neighborhoods.map(n => n.neighborhood),
            datasets: [
                {
                    data: neighborhoods.map(n => n.avg_price),
                    backgroundColor: "#0EA5E9",
                    borderRadius: 6,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: "#F1F5F9" } },
                x: { grid: { display: false }, ticks: { font: { size: 10 } } },
            },
        },
    });
}

function renderScatterChart(scatterData) {
    const ctx = document.getElementById("scatterChart");
    if (!ctx) return;

    const points = scatterData.map(d => ({ x: d.GrLivArea, y: d.SalePrice }));

    scatterChartInstance = new Chart(ctx, {
        type: "scatter",
        data: {
            datasets: [
                {
                    label: "Historical Sales",
                    data: points,
                    backgroundColor: "rgba(59, 130, 246, 0.45)",
                    pointRadius: 4,
                },
                {
                    label: "Current Input Estimate",
                    data: [{ x: 1800, y: 228000 }],
                    backgroundColor: "#EF4444",
                    borderColor: "#FFFFFF",
                    borderWidth: 2,
                    pointRadius: 9,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: "Living Area (sq ft)" }, grid: { color: "#F1F5F9" } },
                y: { title: { display: true, text: "SalePrice ($)" }, grid: { color: "#F1F5F9" } },
            },
        },
    });
}

function updateScatterPoint(sqft, price) {
    if (!scatterChartInstance) return;
    scatterChartInstance.data.datasets[1].data = [{ x: sqft, y: price }];
    scatterChartInstance.update();
}
