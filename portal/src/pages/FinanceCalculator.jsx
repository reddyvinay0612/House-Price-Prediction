import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Calculator,
  IndianRupee,
  PieChart as PieIcon,
  TrendingUp,
  Table as TableIcon,
  ShieldAlert,
  Info,
  ArrowRight,
  Scale,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';

/**
 * M4: Comprehensive EMI & Buy-vs-Rent Financial Feasibility Calculator (/finance)
 * Features:
 * - Loan amount, Interest rate, Tenure, Down payment, Expected monthly rent
 * - Monthly EMI, Total Interest, Total Payable
 * - Principal vs Interest Donut Chart
 * - Year-wise Loan Amortization Schedule Table
 * - Buy vs Rent 10-Year Wealth Accumulation Break-Even Crossover Chart
 */
export default function FinanceCalculator() {
  const location = useLocation();
  const initialPriceLakhs = location.state?.initialPrice || 75.0;

  const [propertyPriceLakhs, setPropertyPriceLakhs] = useState(initialPriceLakhs);
  const [downPaymentPct, setDownPaymentPct] = useState(20); // 20%
  const [interestRate, setInterestRate] = useState(8.5); // 8.5%
  const [tenureYears, setTenureYears] = useState(20);
  const [monthlyRentRupees, setMonthlyRentRupees] = useState(25000); // ₹25,000/mo rent
  const [propertyAppreciationRate, setPropertyAppreciationRate] = useState(7.5); // 7.5% YoY
  const [investmentReturnRate, setInvestmentReturnRate] = useState(10.0); // 10% mutual fund return

  const propertyPrice = propertyPriceLakhs * 100000;
  const downPayment = Math.round((propertyPrice * downPaymentPct) / 100);
  const loanAmount = propertyPrice - downPayment;

  // Monthly EMI Calculation
  const financialStats = useMemo(() => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;

    if (P <= 0 || r <= 0 || n <= 0) {
      return { monthlyEmi: 0, totalInterest: 0, totalPayable: 0, amortization: [] };
    }

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayable = emi * n;
    const totalInterest = totalPayable - P;

    // Build year-wise amortization table
    let balance = P;
    const amortization = [];

    for (let year = 1; year <= tenureYears; year++) {
      let yearlyInterest = 0;
      let yearlyPrincipal = 0;

      for (let m = 1; m <= 12; m++) {
        const mInterest = balance * r;
        const mPrincipal = emi - mInterest;
        yearlyInterest += mInterest;
        yearlyPrincipal += mPrincipal;
        balance = Math.max(0, balance - mPrincipal);
      }

      amortization.push({
        year,
        openingBalance: Math.round(balance + yearlyPrincipal),
        principalPaid: Math.round(yearlyPrincipal),
        interestPaid: Math.round(yearlyInterest),
        totalInstallment: Math.round(emi * 12),
        closingBalance: Math.round(balance),
      });
    }

    return {
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayable: Math.round(totalPayable),
      amortization,
    };
  }, [loanAmount, interestRate, tenureYears]);

  // Buy vs Rent 10-Year Simulation Data
  const buyVsRentData = useMemo(() => {
    const data = [];
    let currentPropValue = propertyPrice;
    let buyerEquity = downPayment;
    let renterWealth = downPayment; // Renter invests down payment in market (10% CAGR)
    let rentPerMonth = monthlyRentRupees;

    for (let yr = 1; yr <= 10; yr++) {
      // Property appreciates
      currentPropValue = currentPropValue * (1 + propertyAppreciationRate / 100);

      // Remaining loan principal from amortization
      const amortRow = financialStats.amortization[yr - 1];
      const remainingLoan = amortRow ? amortRow.closingBalance : 0;
      buyerEquity = Math.round(currentPropValue - remainingLoan);

      // Rent inflation 5% YoY
      rentPerMonth = rentPerMonth * 1.05;
      const annualRentPaid = rentPerMonth * 12;
      const annualEmiPaid = financialStats.monthlyEmi * 12;
      const monthlySavings = Math.max(0, annualEmiPaid - annualRentPaid);

      // Renter compound returns
      renterWealth = renterWealth * (1 + investmentReturnRate / 100) + monthlySavings;

      data.push({
        year: `Yr ${yr}`,
        buyerNetWorthLakhs: Number((buyerEquity / 100000).toFixed(2)),
        renterNetWorthLakhs: Number((renterWealth / 100000).toFixed(2)),
      });
    }
    return data;
  }, [propertyPrice, downPayment, propertyAppreciationRate, investmentReturnRate, monthlyRentRupees, financialStats]);

  const pieData = [
    { name: 'Principal Loan Amount', value: loanAmount, color: '#0b3d91' },
    { name: 'Total Interest Payable', value: financialStats.totalInterest, color: '#ff9933' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 text-white p-5 sm:p-7 rounded-xl shadow-md border-l-4 border-saffron flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-saffron text-navy-950 font-extrabold uppercase px-2 py-0.5 rounded tracking-wider">
              Milestone 4 Engine
            </span>
            <span className="text-xs text-slate-300">Financial Feasibility & Wealth Modeling</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight">
            Home Loan EMI & Buy vs Rent Calculator • गृह ऋण एवं वित्तीय विश्लेषण (M4)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Plan your home acquisition finances with standard reducing-balance amortization schedules and 10-year wealth accumulation comparisons.
          </p>
        </div>

        <div className="bg-navy-950/60 p-3.5 rounded-lg border border-white/10 text-center self-start md:self-auto">
          <p className="text-[11px] text-slate-400 uppercase font-bold">Monthly EMI</p>
          <p className="text-xl sm:text-2xl font-black text-saffron font-mono">
            ₹{financialStats.monthlyEmi.toLocaleString('en-IN')}/mo
          </p>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Sliders & Donut Chart (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Input Controls Card */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-navy-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <Calculator className="w-4 h-4 text-navy-700" />
              <span>Loan & Property Parameters</span>
            </h2>

            <div className="space-y-4">
              {/* Property Valuation */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <label htmlFor="fin-property-price" className="font-bold text-slate-700">Property Valuation (₹ in Lakhs)</label>
                  <span className="font-mono font-bold text-navy-900">
                    ₹{propertyPriceLakhs} Lakh
                  </span>
                </div>
                <input
                  id="fin-property-price"
                  type="range"
                  min="15"
                  max="500"
                  step="2.5"
                  value={propertyPriceLakhs}
                  onChange={(e) => setPropertyPriceLakhs(Number(e.target.value))}
                  className="w-full accent-navy-700 h-2 bg-slate-200 rounded cursor-pointer"
                />
              </div>

              {/* Down Payment % */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <label htmlFor="fin-down-payment" className="font-bold text-slate-700">Down Payment ({downPaymentPct}%)</label>
                  <span className="font-mono font-bold text-emerald-700">
                    ₹{(downPayment / 100000).toFixed(2)} Lakh
                  </span>
                </div>
                <input
                  id="fin-down-payment"
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={downPaymentPct}
                  onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                  className="w-full accent-navy-700 h-2 bg-slate-200 rounded cursor-pointer"
                />
              </div>

              {/* Interest Rate */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <label htmlFor="fin-interest-rate" className="font-bold text-slate-700">Annual Interest Rate (%)</label>
                  <span className="font-mono font-bold text-navy-900">{interestRate}% p.a.</span>
                </div>
                <input
                  id="fin-interest-rate"
                  type="range"
                  min="6.5"
                  max="13.0"
                  step="0.25"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-navy-700 h-2 bg-slate-200 rounded cursor-pointer"
                />
              </div>

              {/* Loan Tenure */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <label htmlFor="fin-tenure" className="font-bold text-slate-700">Loan Tenure (Years)</label>
                  <span className="font-mono font-bold text-navy-900">{tenureYears} Years</span>
                </div>
                <input
                  id="fin-tenure"
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-navy-700 h-2 bg-slate-200 rounded cursor-pointer"
                />
              </div>

              {/* Expected Monthly Rent for Comparison */}
              <div className="space-y-1 bg-slate-50 p-2.5 rounded border border-slate-200">
                <div className="flex justify-between text-xs">
                  <label htmlFor="fin-monthly-rent" className="font-bold text-slate-700">Alternative Monthly Rent (₹)</label>
                  <span className="font-mono font-bold text-navy-900">
                    ₹{monthlyRentRupees.toLocaleString('en-IN')}/mo
                  </span>
                </div>
                <input
                  id="fin-monthly-rent"
                  type="range"
                  min="8000"
                  max="120000"
                  step="1000"
                  value={monthlyRentRupees}
                  onChange={(e) => setMonthlyRentRupees(Number(e.target.value))}
                  className="w-full accent-navy-700 h-1.5 bg-slate-200 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Principal vs Interest Donut Chart Card */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 sm:p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <PieIcon className="w-3.5 h-3.5 text-saffron-dark" />
              <span>Total Payment Breakdown</span>
            </h3>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => `₹${(val / 100000).toFixed(2)} Lakh`}
                    contentStyle={{ fontSize: '11px', borderRadius: '4px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1 border-t border-slate-100">
              <div className="p-2 bg-navy-50 rounded">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Principal Loan</p>
                <p className="font-extrabold text-navy-900 font-mono">
                  ₹{(loanAmount / 100000).toFixed(2)} Lakh
                </p>
              </div>
              <div className="p-2 bg-amber-50 rounded">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Total Interest</p>
                <p className="font-extrabold text-saffron-dark font-mono">
                  ₹{(financialStats.totalInterest / 100000).toFixed(2)} Lakh
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Buy vs Rent Chart & Amortization Table (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Buy vs Rent 10-Year Break-Even Chart */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 sm:p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-navy-900 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-navy-700" />
                <span>10-Year Buy vs. Rent Wealth Accumulation</span>
              </h3>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                7.5% Property vs 10% Equity CAGR
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Compares equity created in home ownership against investing down payment and monthly rental savings into a diversified portfolio.
            </p>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={buyVsRentData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${v}L`} />
                  <Tooltip formatter={(v) => `₹${v} Lakh`} contentStyle={{ fontSize: '11px', borderRadius: '4px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Line
                    type="monotone"
                    dataKey="buyerNetWorthLakhs"
                    name="Home Buyer Net Equity"
                    stroke="#0b3d91"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="renterNetWorthLakhs"
                    name="Renter + Market Portfolio"
                    stroke="#ff9933"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Year-Wise Amortization Schedule Table */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-navy-900 flex items-center gap-1.5">
                <TableIcon className="w-4 h-4 text-navy-700" />
                <span>Year-Wise Loan Amortization Schedule</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Tenure: {tenureYears} Years</span>
            </div>

            <div className="max-h-60 overflow-y-auto border border-slate-200 rounded">
              <table className="w-full text-xs text-left text-slate-700">
                <thead className="bg-navy-900 text-white uppercase text-[10px] tracking-wider sticky top-0">
                  <tr>
                    <th className="py-2 px-2.5">Year</th>
                    <th className="py-2 px-2.5 text-right">Opening (₹)</th>
                    <th className="py-2 px-2.5 text-right">Principal (₹)</th>
                    <th className="py-2 px-2.5 text-right">Interest (₹)</th>
                    <th className="py-2 px-2.5 text-right">Closing Balance (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {financialStats.amortization.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-50">
                      <td className="py-1.5 px-2.5 font-sans font-bold text-navy-900">Year {row.year}</td>
                      <td className="py-1.5 px-2.5 text-right">{row.openingBalance.toLocaleString('en-IN')}</td>
                      <td className="py-1.5 px-2.5 text-right text-emerald-700 font-bold">
                        {row.principalPaid.toLocaleString('en-IN')}
                      </td>
                      <td className="py-1.5 px-2.5 text-right text-saffron-dark font-bold">
                        {row.interestPaid.toLocaleString('en-IN')}
                      </td>
                      <td className="py-1.5 px-2.5 text-right font-bold text-slate-800">
                        {row.closingBalance.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Statutory Disclaimer */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] text-slate-500 italic flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <span>
          <strong>STATUTORY NOTICE:</strong> All calculations, loan EMIs, and wealth projections are indicative mathematical models based on reducing balance formulas and historical market indices. Not formal financial advice.
        </span>
      </div>
    </div>
  );
}
