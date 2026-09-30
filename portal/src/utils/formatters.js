/**
 * Official Indian Real Estate Currency & Number Formatters
 * Adheres to Indian standard Lakhs / Crores and en-IN digit grouping
 */

/**
 * Format price in lakhs to readable Indian currency (e.g. ₹45.50 Lakh or ₹1.85 Crore)
 * @param {number} lakhs - Price in Lakhs (e.g. 85.5)
 * @returns {string} Formatted price string
 */
export function formatIndianPrice(lakhs) {
  if (lakhs === null || lakhs === undefined || isNaN(lakhs)) {
    return '₹0.00';
  }

  const numericLakhs = Number(lakhs);

  if (numericLakhs >= 100) {
    const crores = numericLakhs / 100;
    return `₹${crores.toFixed(2)} Crore`;
  }

  return `₹${numericLakhs.toFixed(2)} Lakh`;
}

/**
 * Format total rupees with Indian comma separation (e.g. ₹12,50,000)
 * @param {number} amountRupees - Total amount in INR
 * @returns {string} Formatted Indian Rupee string
 */
export function formatIndianCurrency(amountRupees) {
  if (amountRupees === null || amountRupees === undefined || isNaN(amountRupees)) {
    return '₹0';
  }

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });

  return formatter.format(Math.round(amountRupees));
}

/**
 * Format price per square foot (e.g. ₹7,250/sq.ft)
 * @param {number} rate - Rate in INR per sq.ft
 * @returns {string} Formatted rate string
 */
export function formatPricePerSqft(rate) {
  if (!rate || isNaN(rate)) return '₹0/sq.ft';
  const formatter = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  });
  return `₹${formatter.format(Math.round(rate))}/sq.ft`;
}

/**
 * Format standard number using en-IN grouping (e.g. 12,50,000)
 * @param {number} num 
 * @returns {string}
 */
export function formatNumberIN(num) {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
}

/**
 * Calculate Monthly EMI for home loan in INR
 * Formula: P * r * (1+r)^n / ((1+r)^n - 1)
 * @param {number} principal - Loan amount in INR
 * @param {number} annualRate - Annual interest rate percentage (e.g. 8.5)
 * @param {number} tenureYears - Loan tenure in years (e.g. 20)
 * @returns {number} Monthly EMI in INR
 */
export function calculateHomeLoanEMI(principal, annualRate = 8.5, tenureYears = 20) {
  if (!principal || principal <= 0) return 0;
  const monthlyRate = annualRate / (12 * 100);
  const totalMonths = tenureYears * 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  return Math.round(emi);
}
