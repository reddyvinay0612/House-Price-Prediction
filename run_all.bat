@echo off
echo =========================================================================
echo   BHARAT HOUSE PRICE ESTIMATOR - STARTUP LAUNCHER
echo   Directorate of Housing Analytics (Government of India Demo)
echo =========================================================================
echo.

echo [1/3] Verifying and Seeding Benchmark Data...
python seed_data.py
echo.

echo [2/3] Starting FastAPI Backend (Valuation Engine + Griha Mitra AI)...
start "Bharat Housing Backend API" cmd /k "cd backend && python -m uvicorn main:app --reload --port 8000"
echo.

echo [3/3] Starting React 18 + Vite Frontend Portal...
start "Bharat Housing React Portal" cmd /k "cd portal && npm run dev"
echo.

echo =========================================================================
echo   Both services are launching:
echo   - Frontend Portal:  http://localhost:5173
echo   - Backend API Docs: http://127.0.0.1:8000/docs
echo =========================================================================
