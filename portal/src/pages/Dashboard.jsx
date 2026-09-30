import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  User,
  Shield,
  FileSpreadsheet,
  Download,
  Trash2,
  PlusCircle,
  Building2,
  Calendar,
  Layers,
  MapPin,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Clock,
  Sparkles,
  LogOut,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { useAuth } from '../context/AuthContext';
import { mockAuthService } from '../services/mockAuthService';
import { formatIndianPrice, formatPricePerSqft } from '../utils/formatters';

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [estimates, setEstimates] = useState([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [notification, setNotification] = useState(null);

  // Load saved estimates for the active citizen
  useEffect(() => {
    if (user?.id) {
      const list = mockAuthService.getSavedEstimates(user.id);
      setEstimates(list);
    }
  }, [user]);

  // Format date helper
  const formatDate = (isoString) => {
    if (!isoString) return 'Recent';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  // Delete estimate handler
  const handleDeleteEstimate = (id) => {
    if (user?.id) {
      const updated = mockAuthService.deleteEstimate(user.id, id);
      setEstimates(updated);
      setDeleteConfirmId(null);
      setNotification({
        type: 'success',
        text: 'Valuation record deleted successfully from your saved records.',
      });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  // Generate and Download PDF Summary Certificate
  const handleDownloadPDF = (est) => {
    try {
      const doc = new jsPDF();

      // Top Header Navy Banner
      doc.setFillColor(11, 61, 145); // #0B3D91 Navy
      doc.rect(0, 0, 210, 24, 'F');

      // Header Saffron Line
      doc.setFillColor(255, 153, 51); // #FF9933 Saffron
      doc.rect(0, 24, 210, 2, 'F');

      // Title in Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(255, 255, 255);
      doc.text('DIRECTORATE OF HOUSING ANALYTICS (GOVT. DEMO)', 105, 12, { align: 'center' });
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Bharat House Price Valuation Summary Certificate', 105, 18, { align: 'center' });

      // Certificate Meta Box
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`Certificate Ref: DHA-${est.id || '2026-REC'}`, 14, 36);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Generated On: ${formatDate(new Date().toISOString())}`, 14, 42);
      doc.text(`Beneficiary: ${user?.fullName || 'Citizen User'} (${user?.userType || 'Citizen'})`, 14, 48);
      doc.text(`Location: ${est.locality || 'Key Area'}, ${est.city || user?.district || 'India'}`, 14, 54);

      // Divider
      doc.setDrawColor(203, 213, 225);
      doc.line(14, 58, 196, 58);

      // Section: Property Particulars
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(11, 61, 145);
      doc.text('1. Property Particulars', 14, 66);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      const startY = 74;
      const leftCol = [
        `City / District: ${est.city || 'N/A'}`,
        `Locality: ${est.locality || 'N/A'}`,
        `Super Built-up Area: ${est.total_sqft || 1200} sq. ft.`,
        `Configuration: ${est.bhk || 2} BHK (${est.bath || 2} Bath, ${est.balcony || 1} Balcony)`,
      ];
      const rightCol = [
        `Area Type: ${est.area_type || 'Super built-up Area'}`,
        `Construction Status: ${est.availability || 'Ready to Move'}`,
        `Econometric Model: ${est.model_name || 'Gradient Boosting Regressor'}`,
        `Evaluation Date: ${formatDate(est.date)}`,
      ];

      leftCol.forEach((text, i) => doc.text(text, 14, startY + i * 6));
      rightCol.forEach((text, i) => doc.text(text, 110, startY + i * 6));

      // Divider
      doc.line(14, 102, 196, 102);

      // Section: Valuation Assessment
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(11, 61, 145);
      doc.text('2. Econometric Valuation Assessment', 14, 110);

      // Highlight Box for Price
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(14, 114, 182, 28, 2, 2, 'F');
      doc.setDrawColor(11, 61, 145);
      doc.roundedRect(14, 114, 182, 28, 2, 2, 'D');

      const priceVal = est.predicted_price_lakhs || 75.0;
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text('Estimated Indicative Market Price:', 20, 124);

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(11, 61, 145);
      doc.text(`${formatIndianPrice(priceVal)}`, 20, 134);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      const rateSqft = est.price_per_sqft ? `₹${est.price_per_sqft.toLocaleString('en-IN')}/sq.ft.` : 'Market Benchmarked';
      doc.text(`Unit Rate: ${rateSqft}`, 120, 124);
      doc.text(`Advisory Range: ₹${(priceVal * 0.92).toFixed(2)}L – ₹${(priceVal * 1.08).toFixed(2)}L`, 120, 134);

      // Statutory Financial Estimates
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(11, 61, 145);
      doc.text('3. Indicative Statutory & Transaction Breakdown', 14, 150);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      const approxRupees = priceVal * 100000;
      const stampDuty = Math.round(approxRupees * 0.06);
      const downPayment = Math.round(approxRupees * 0.20);
      const loanEmi = Math.round((approxRupees * 0.80 * 0.008678)); // ~8.5% 20yr EMI factor

      doc.text(`• Estimated Stamp Duty & Registration (approx 6%): ₹${stampDuty.toLocaleString('en-IN')}`, 14, 158);
      doc.text(`• Recommended 20% Initial Down Payment: ₹${downPayment.toLocaleString('en-IN')}`, 14, 164);
      doc.text(`• Indicative Monthly Bank EMI (@ 8.5% p.a. for 20 Yrs): ₹${loanEmi.toLocaleString('en-IN')}/month`, 14, 170);

      // Advisory Disclaimer
      doc.setDrawColor(226, 232, 240);
      doc.line(14, 180, 196, 180);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 116, 139);
      doc.text(
        'Statutory Disclaimer: This estimate is computed using statistical machine learning models for guidance only.',
        14,
        188
      );
      doc.text(
        'It is NOT a legal valuation, bank sanctioned appraisal, or circle rate certification under RERA.',
        14,
        193
      );
      doc.text(
        'Please verify title deeds, encumbrances, and RERA registration directly on the state RERA portal.',
        14,
        198
      );

      // Green Footer Strip
      doc.setFillColor(19, 136, 8); // #138808 India Green
      doc.rect(0, 285, 210, 12, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('DIRECTORATE OF HOUSING ANALYTICS • NATIONAL REAL ESTATE DEMO ENGINE', 105, 292, {
        align: 'center',
      });

      // Save file
      const filename = `DHA_Valuation_${(est.city || 'Property').replace(/\s+/g, '_')}_${est.id}.pdf`;
      doc.save(filename);

      setNotification({
        type: 'success',
        text: `Valuation Certificate (${filename}) downloaded successfully.`,
      });
      setTimeout(() => setNotification(null), 4000);
    } catch (error) {
      console.error('PDF export error', error);
      setNotification({
        type: 'error',
        text: 'Failed to generate PDF document. Please try again.',
      });
    }
  };

  // Role Badge Color Mapper
  const getRoleBadge = (role) => {
    switch (role) {
      case 'Bank Officer':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Agent':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Seller':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Buyer':
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  // Calculate quick stats
  const totalSaved = estimates.length;
  const avgPriceLakhs =
    totalSaved > 0
      ? (
          estimates.reduce((acc, curr) => acc + (curr.predicted_price_lakhs || 0), 0) /
          totalSaved
        ).toFixed(2)
      : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Banner with Tricolour Accent */}
      <div className="bg-navy-900 text-white rounded-lg shadow-md border-t-4 border-saffron overflow-hidden">
        <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* User Info & Role */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-saffron flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>Verified Citizen Portal</span>
              </span>
              <span className="text-slate-400">•</span>
              <span
                className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${getRoleBadge(
                  user?.userType || 'Buyer'
                )}`}
              >
                {user?.userType || 'Citizen Buyer'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome, {user?.fullName || 'Citizen'}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-saffron" />
                <span>
                  {user?.district ? `${user.district}, ` : ''}
                  {user?.state || 'All India'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Last Session: {formatDate(user?.lastLogin)}</span>
              </div>
            </div>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              onClick={() => navigate('/estimate')}
              variant="primary"
              className="bg-saffron hover:bg-saffron-dark text-slate-950 font-extrabold px-5 py-2.5 text-xs sm:text-sm flex items-center gap-2 shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Property Estimate</span>
            </Button>

            <button
              type="button"
              onClick={logout}
              className="px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white bg-navy-950/60 hover:bg-navy-950 border border-navy-700 rounded-md transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Sub-bar with active session info */}
        <div className="bg-navy-950/80 px-6 py-2.5 border-t border-navy-800 text-[11px] text-slate-300 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="font-semibold text-slate-200">Registered Citizen ID:</span>{' '}
            <code className="font-mono text-saffron">{user?.email || user?.mobile}</code>
          </div>
          <div className="text-slate-400">
            Protected by 15-minute inactive session timeout with statutory data isolation
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <Alert
          variant={notification.type === 'error' ? 'danger' : 'success'}
          className="animate-fadeIn"
        >
          <div className="flex items-center gap-2">
            {notification.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-green-700" />
            )}
            <span className="text-xs font-semibold">{notification.text}</span>
          </div>
        </Alert>
      )}

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Saved Valuations
            </p>
            <p className="text-2xl font-black text-navy-900 mt-1">{totalSaved}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-navy-50 text-navy-800 flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Avg. Property Value
            </p>
            <p className="text-2xl font-black text-navy-900 mt-1">
              {totalSaved > 0 ? `₹${avgPriceLakhs}L` : '—'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Registered Region
            </p>
            <p className="text-base font-bold text-navy-900 mt-1 truncate max-w-[150px]">
              {user?.district || user?.state || 'India'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-indiagreen flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Account Status
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-indiagreen" />
              <span className="text-sm font-bold text-emerald-800">Active Citizen</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-indiagreen" />
          </div>
        </Card>
      </div>

      {/* Main Section: Saved Property Valuations */}
      <Card className="bg-white border border-slate-300 shadow-md overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-navy-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-saffron" />
              <span>Saved Property Valuations & Reports</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Historical econometric valuations computed under your citizen profile.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => navigate('/estimate')}
            variant="outline"
            className="text-xs font-bold text-navy-800 border-navy-700 hover:bg-navy-50 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Valuation</span>
          </Button>
        </div>

        {estimates.length === 0 ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-700">No saved property estimates found</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Use our automated econometric tool to evaluate apartment, independent house, or villa valuations across India.
              </p>
            </div>
            <Button
              type="button"
              onClick={() => navigate('/estimate')}
              variant="primary"
              className="bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs px-4 py-2"
            >
              Start First Calculation
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th scope="col" className="py-3 px-4">Property / Location</th>
                  <th scope="col" className="py-3 px-4">Configuration</th>
                  <th scope="col" className="py-3 px-4">Area (Sq. Ft)</th>
                  <th scope="col" className="py-3 px-4">Model Applied</th>
                  <th scope="col" className="py-3 px-4">Estimated Value</th>
                  <th scope="col" className="py-3 px-4">Valuation Date</th>
                  <th scope="col" className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {estimates.map((est) => (
                  <tr key={est.id} className="hover:bg-slate-50/80 transition">
                    {/* Location */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="font-bold text-navy-900">{est.locality || 'Key Locality'}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-saffron" />
                        <span>{est.city || 'District'}</span>
                      </div>
                    </td>

                    {/* Configuration */}
                    <td className="py-3.5 px-4 text-slate-700">
                      <span className="font-bold">{est.bhk || 2} BHK</span>
                      <div className="text-[11px] text-slate-500">
                        {est.bath || 2} Bath • {est.balcony || 1} Balc
                      </div>
                    </td>

                    {/* Area */}
                    <td className="py-3.5 px-4 text-slate-700 font-mono">
                      {est.total_sqft ? `${est.total_sqft.toLocaleString('en-IN')} sq.ft.` : '—'}
                    </td>

                    {/* Model */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="inline-block bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-mono">
                        {est.model_name ? est.model_name.replace(' Regressor', '') : 'GradBoost'}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-navy-900 text-sm">
                        {est.formatted_price || formatIndianPrice(est.predicted_price_lakhs)}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {est.price_per_sqft ? `₹${est.price_per_sqft.toLocaleString('en-IN')}/sq.ft.` : ''}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                      {formatDate(est.date)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      {/* Download PDF Button */}
                      <button
                        type="button"
                        onClick={() => handleDownloadPDF(est)}
                        title="Download Official Valuation Certificate (PDF)"
                        className="p-1.5 text-navy-700 hover:text-navy-950 hover:bg-navy-50 rounded transition inline-flex items-center"
                      >
                        <Download className="w-4 h-4 text-navy-800" />
                      </button>

                      {/* Recalculate Button */}
                      <button
                        type="button"
                        onClick={() => navigate('/estimate')}
                        title="Recalculate with New Parameters"
                        className="p-1.5 text-slate-600 hover:text-navy-900 hover:bg-slate-100 rounded transition inline-flex items-center"
                      >
                        <RotateCcw className="w-4 h-4 text-slate-600" />
                      </button>

                      {/* Delete Button */}
                      {deleteConfirmId === est.id ? (
                        <span className="inline-flex items-center gap-1 bg-red-50 p-1 rounded border border-red-200">
                          <button
                            type="button"
                            onClick={() => handleDeleteEstimate(est.id)}
                            className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold"
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] font-bold"
                          >
                            Cancel
                          </button>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(est.id)}
                          title="Delete saved estimate"
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition inline-flex items-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Citizen Profile & Statutory Compliance Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Profile Details Card */}
        <Card className="p-5 bg-white border border-slate-300 shadow-sm md:col-span-1 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 flex items-center gap-1.5 border-b border-slate-200 pb-2">
            <User className="w-4 h-4 text-saffron" />
            <span>Citizen Profile Details</span>
          </h3>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Full Name:</span>
              <span className="font-bold text-slate-800">{user?.fullName || 'Citizen User'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Registered Email:</span>
              <span className="font-mono text-slate-800">{user?.email || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Mobile Number:</span>
              <span className="font-mono text-slate-800">+91 {user?.mobile || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Primary State & District:</span>
              <span className="font-semibold text-slate-800">
                {user?.district ? `${user.district}, ` : ''}
                {user?.state || 'Karnataka'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Citizen Category:</span>
              <span className="font-semibold text-slate-800">{user?.userType || 'Property Buyer'}</span>
            </div>
          </div>
        </Card>

        {/* RERA Advisory Card */}
        <Card className="p-5 bg-white border border-slate-300 shadow-sm md:col-span-2 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 flex items-center gap-1.5 border-b border-slate-200 pb-2">
            <Shield className="w-4 h-4 text-indiagreen" />
            <span>Statutory Real Estate & RERA Citizen Advisory</span>
          </h3>

          <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
            <p>
              Under the <strong>Real Estate (Regulation and Development) Act, 2016 (RERA)</strong>, all commercial and residential real estate projects where the land is over 500 square meters or 8 apartments must be registered with the respective State RERA authority before marketing or sale.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800 block text-[11px]">
                  1. Title & Encumbrance Check
                </span>
                <p className="text-[11px] text-slate-500">
                  Always inspect the Encumbrance Certificate (EC) for the last 30 years from the sub-registrar office before committing transactions.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800 block text-[11px]">
                  2. Carpet Area Standards
                </span>
                <p className="text-[11px] text-slate-500">
                  All property transactions must legally be executed based on RERA Net Carpet Area rather than ambiguous super built-up claims.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
