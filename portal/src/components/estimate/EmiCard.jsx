import React, { useState, useMemo } from 'react';
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
import { Calculator, IndianRupee, PieChart as PieIcon, ArrowRight, Info, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * M4: Embedded EMI & Financial Feasibility Card
 * Placed directly below property estimates to give instant home loan and buy-vs-rent insights.
 */
export default function EmiCard({ estimatedPriceLakhs = 75.0 }) {
  const propertyPrice = (estimatedPriceLakhs || 75.0) * 100000;
  const defaultLoanAmount = Math.round(propertyPrice * 0.8); // 80% LTV

  const [loanAmount, setLoanAmount] = useState(defaultLoanAmount);
  const [interestRate, setInterestRate] = useState(8.5); // 8.5%
  const [tenureYears, setTenureYears] = useState(20);

  // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const financialStats = useMemo(() => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;

    if (P <= 0 || r <= 0 || n <= 0) {
      return { monthlyEmi: 0, totalInterest: 0, totalPayable: 0 };
    }

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayable = emi * n;
    const totalInterest = totalPayable - P;

    return {
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayable: Math.round(totalPayable),
    };
  }, [loanAmount, interestRate, tenureYears]);

  const pieData = [
    { name: 'Principal Loan Amount', value: loanAmount, color: '#0b3d91' },
    { name: 'Total Interest Payable', value: financialStats.totalInterest, color: '#ff9933' },
  ];

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-navy-50 text-navy-800">
            <Calculator className="w-4 h-4 text-saffron-dark" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-navy-900">
              Loan EMI & Financing Overview • गृह ऋण अनुमान (M4)
            </h3>
            <p className="text-xs text-slate-500">
              Estimated repayment structure based on standard 80% LTV banking terms
            </p>
          </div>
        </div>

        <Link
          to="/finance"
          state={{ initialPrice: estimatedPriceLakhs }}
          className="text-xs font-bold text-navy-800 hover:text-navy-950 flex items-center gap-1 hover:underline self-start sm:self-auto"
        >
          <span>Full Buy-vs-Rent Amortization</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Sliders & Inputs */}
        <div className="md:col-span-2 space-y-3">
          {/* Loan Amount */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <label htmlFor="emi-loan-amount-range" className="font-bold text-slate-700">Loan Amount (80% default)</label>
              <span className="font-mono font-bold text-navy-900">
                ₹{(loanAmount / 100000).toFixed(2)} Lakh
              </span>
            </div>
            <input
              id="emi-loan-amount-range"
              aria-label="Loan Amount Range"
              type="range"
              min={Math.round(propertyPrice * 0.2)}
              max={Math.round(propertyPrice * 0.95)}
              step={50000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full accent-navy-700 h-1.5 bg-slate-200 rounded cursor-pointer"
            />
          </div>

          {/* Interest Rate & Tenure */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <label htmlFor="emi-interest-rate-range" className="font-bold text-slate-700">Interest Rate</label>
                <span className="font-mono font-bold text-navy-900">{interestRate}%</span>
              </div>
              <input
                id="emi-interest-rate-range"
                aria-label="Interest Rate Range"
                type="range"
                min="6.5"
                max="12.0"
                step="0.25"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-navy-700 h-1.5 bg-slate-200 rounded cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <label htmlFor="emi-tenure-range" className="font-bold text-slate-700">Tenure</label>
                <span className="font-mono font-bold text-navy-900">{tenureYears} Years</span>
              </div>
              <input
                id="emi-tenure-range"
                aria-label="Loan Tenure Range in Years"
                type="range"
                min="5"
                max="30"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full accent-navy-700 h-1.5 bg-slate-200 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded border border-slate-200 text-center">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Monthly EMI</p>
              <p className="text-xs sm:text-sm font-extrabold text-navy-900 font-mono">
                ₹{financialStats.monthlyEmi.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Total Interest</p>
              <p className="text-xs sm:text-sm font-bold text-saffron-dark font-mono">
                ₹{(financialStats.totalInterest / 100000).toFixed(2)}L
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Total Payable</p>
              <p className="text-xs sm:text-sm font-bold text-slate-800 font-mono">
                ₹{(financialStats.totalPayable / 100000).toFixed(2)}L
              </p>
            </div>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="h-36 flex flex-col items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={32}
                outerRadius={50}
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
          <div className="flex items-center gap-3 text-[10px] text-slate-600 font-semibold mt-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-navy-800" /> Principal
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-saffron" /> Interest
            </span>
          </div>
        </div>
      </div>

      <div className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-100 flex items-center justify-between">
        <span>Indicative calculation based on reducing balance method. Not financial advice.</span>
        <span>Eligible for Section 80C & 24(b) tax rebates</span>
      </div>
    </div>
  );
}
