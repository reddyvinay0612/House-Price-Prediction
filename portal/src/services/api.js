/**
 * Bharat Portal API Service
 * Centralized client for all econometric valuation, what-if simulation, comparison,
 * forecast, district benchmarks, metrics, and PDF generation endpoints.
 * Automatically falls back to offline mathematical demoModel if backend is unreachable.
 */

import axios from 'axios';
import { demoModel } from './demoModel';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isBackendOffline = false;

export const api = {
  getIsOffline: () => isBackendOffline,

  /**
   * Health Check
   */
  async checkHealth() {
    try {
      const res = await apiClient.get('/health');
      isBackendOffline = false;
      return res.data;
    } catch {
      isBackendOffline = true;
      return { status: 'offline', assistant: 'Griha Mitra (Offline Mode)' };
    }
  },

  /**
   * Predict Property Price + SHAP Explainability + Amenities
   */
  async predictPrice(payload) {
    try {
      const res = await apiClient.post('/predict', payload);
      isBackendOffline = false;
      return { ...res.data, isDemo: false };
    } catch (err) {
      console.warn('Backend /predict unreachable. Using local calibrated demoModel.', err);
      isBackendOffline = true;
      return { ...demoModel.predict(payload), isDemo: true };
    }
  },

  /**
   * What-If Simulator
   */
  async simulateWhatIf(payload) {
    try {
      const res = await apiClient.post('/whatif', payload);
      isBackendOffline = false;
      return { ...res.data, isDemo: false };
    } catch (err) {
      console.warn('Backend /whatif unreachable. Using local demoModel.', err);
      isBackendOffline = true;
      return { ...demoModel.simulateWhatIf(payload), isDemo: true };
    }
  },

  /**
   * Compare 2 Properties
   */
  async compareProperties(propertyA, propertyB) {
    try {
      const res = await apiClient.post('/compare', { property_a: propertyA, property_b: propertyB });
      isBackendOffline = false;
      return { ...res.data, isDemo: false };
    } catch (err) {
      console.warn('Backend /compare unreachable. Using local demoModel.', err);
      isBackendOffline = true;
      return { ...demoModel.compareProperties(propertyA, propertyB), isDemo: true };
    }
  },

  /**
   * Get Indexed Districts
   */
  async getDistricts(state = null) {
    try {
      const params = state ? { state } : {};
      const res = await apiClient.get('/districts', { params });
      isBackendOffline = false;
      return res.data;
    } catch (err) {
      isBackendOffline = true;
      return demoModel.getDistricts(state);
    }
  },

  /**
   * Get 5-Year Projections
   */
  async getForecast(cityOrDistrict) {
    try {
      const res = await apiClient.get('/forecast', { params: { city: cityOrDistrict } });
      isBackendOffline = false;
      return res.data;
    } catch (err) {
      isBackendOffline = true;
      return demoModel.getForecast(cityOrDistrict);
    }
  },

  /**
   * Get 0-100 Investment Scores
   */
  async getInvestmentScores(limit = 30) {
    try {
      const res = await apiClient.get('/investment-score', { params: { limit } });
      isBackendOffline = false;
      return res.data;
    } catch (err) {
      isBackendOffline = true;
      return demoModel.getInvestmentScores(limit);
    }
  },

  /**
   * Get Certified Model Training Metrics
   */
  async getMetrics() {
    try {
      const res = await apiClient.get('/metrics');
      isBackendOffline = false;
      return res.data;
    } catch (err) {
      isBackendOffline = true;
      return demoModel.getMetrics();
    }
  },

  /**
   * Download PDF Valuation Summary
   */
  async downloadReportPdf(estimateData) {
    try {
      const res = await apiClient.post('/report', estimateData, { responseType: 'blob' });
      return new Blob([res.data], { type: 'application/pdf' });
    } catch (err) {
      console.warn('Backend /report failed. Triggering frontend PDF generation fallback.', err);
      return null;
    }
  },
};

// Named Export Helpers
export const checkHealth = () => api.checkHealth();
export const predictPrice = (payload) => api.predictPrice(payload);
export const simulateWhatIf = (payload) => api.simulateWhatIf(payload);
export const compareProperties = (a, b) => api.compareProperties(a, b);
export const getDistricts = (state) => api.getDistricts(state);
export const getForecast = (city) => api.getForecast(city);
export const getInvestmentScores = (limit) => api.getInvestmentScores(limit);
export const getMetrics = () => api.getMetrics();
export const downloadReportPdf = (data) => api.downloadReportPdf(data);

export default api;
