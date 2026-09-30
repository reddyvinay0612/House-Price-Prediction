import React, { useState } from 'react';
import { FileDown, Check, Loader2, ShieldCheck, Printer } from 'lucide-react';
import api from '../../services/api';
import jsPDF from 'jspdf';

/**
 * M10: High-Resolution PDF Valuation Report Generator
 * Generates an official 1-page certificate with property specifications,
 * indicative valuation range, SHAP feature attributions, and statutory disclaimers.
 */
export default function PdfReportButton({ estimateData }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadPdf = async () => {
    if (!estimateData) return;
    setIsGenerating(true);
    setDownloadSuccess(false);

    try {
      // 1. Attempt backend generated PDF
      const blob = await api.downloadReportPdf(estimateData);
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Bharat_Valuation_Certificate_${estimateData.city || 'Property'}_${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        setDownloadSuccess(true);
        setIsGenerating(false);
        return;
      }
    } catch (e) {
      console.warn('Backend PDF endpoint failed, triggering frontend jsPDF renderer', e);
    }

    // 2. Client-side jsPDF fallback generator
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const reportId = `BHARAT-VAL-${Math.floor(100000 + Math.random() * 900000)}`;
      const issueDate = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      // Top Government Header Banner
      doc.setFillColor(11, 61, 145); // Navy #0b3d91
      doc.rect(0, 0, 210, 24, 'F');

      doc.setFillColor(255, 153, 51); // Saffron #ff9933
      doc.rect(0, 24, 210, 2.5, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('DIRECTORATE OF HOUSING ANALYTICS', 105, 12, { align: 'center' });
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('ECONOMETRIC HOUSING VALUATION DIVISION • GOVERNMENT OF INDIA DEMO', 105, 18, { align: 'center' });

      // Certificate Meta Row
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(8.5);
      doc.text(`Certificate Ref: ${reportId}`, 15, 34);
      doc.text(`Issue Date: ${issueDate}`, 150, 34);
      doc.text(`Model: Gradient Boosting Regressor (Champion v2.0)`, 15, 39);
      doc.text(`Status: Indicative Econometric Estimate`, 150, 39);

      // Main Valuation Box
      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(11, 61, 145);
      doc.setLineWidth(0.6);
      doc.roundedRect(15, 45, 180, 28, 2, 2, 'FD');

      doc.setTextColor(100, 116, 139);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('INDICATIVE ECONOMIC VALUATION', 22, 53);
      doc.text('ESTIMATED VALUATION RANGE (±7%)', 115, 53);

      const priceVal = estimateData.predicted_price_lakhs || 75.0;
      const lowVal = estimateData.lower_bound_lakhs || (priceVal * 0.93).toFixed(2);
      const highVal = estimateData.upper_bound_lakhs || (priceVal * 1.07).toFixed(2);
      const rateSqft = estimateData.price_per_sqft || 6500;

      doc.setTextColor(11, 61, 145);
      doc.setFontSize(18);
      doc.text(`Rs. ${priceVal.toFixed(2)} Lakh`, 22, 63);

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(11);
      doc.text(`Rs. ${lowVal}L - Rs. ${highVal}L`, 115, 61);
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`Unit Rate: Rs. ${rateSqft.toLocaleString('en-IN')}/sq.ft`, 115, 67);

      // Property Specifications Table
      doc.setFillColor(11, 61, 145);
      doc.rect(15, 78, 180, 6.5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.text('PROPERTY SPECIFICATIONS & INPUT ATTRIBUTES', 18, 82.5);

      const specs = [
        ['Target City / State:', `${estimateData.city || 'N/A'} (Pan-India)`, 'Layout Layout:', `${estimateData.bhk || 2} BHK, ${estimateData.bath || 2} Bath`],
        ['Locality / Micro-Market:', estimateData.locality || 'Key Central Area', 'Total Built-up Area:', `${(estimateData.total_sqft || 1200).toLocaleString('en-IN')} sq.ft`],
        ['Area Measurement Type:', estimateData.area_type || 'Super built-up  Area', 'Possession Status:', estimateData.availability || 'Ready To Move'],
      ];

      let yPos = 91;
      doc.setTextColor(51, 65, 85);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);

      specs.forEach((row, i) => {
        doc.setFillColor(i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 252);
        doc.rect(15, yPos - 4.5, 180, 6, 'F');
        doc.setFont('helvetica', 'bold');
        doc.text(row[0], 18, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(row[1], 62, yPos);

        doc.setFont('helvetica', 'bold');
        doc.text(row[2], 108, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(row[3], 150, yPos);

        yPos += 6;
      });

      // Feature Attribution Table
      yPos += 5;
      doc.setFillColor(51, 65, 85);
      doc.rect(15, yPos, 180, 6.5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text('ECONOMETRIC ATTRIBUTION FACTORS (SHAP DECOMPOSITION)', 18, yPos + 4.5);

      yPos += 11;
      const contribs = (estimateData.feature_contributions || []).slice(0, 5);
      if (contribs.length > 0) {
        contribs.forEach((c, idx) => {
          doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
          doc.rect(15, yPos - 4, 180, 5.5, 'F');
          doc.setTextColor(30, 41, 59);
          doc.setFont('helvetica', 'bold');
          doc.text(c.feature || '', 18, yPos);

          doc.setFont('helvetica', 'normal');
          doc.text(String(c.raw_value || ''), 85, yPos);

          const imp = c.impact_lakhs || 0;
          doc.setTextColor(imp >= 0 ? 16 : 220, imp >= 0 ? 140 : 38, imp >= 0 ? 70 : 38);
          doc.setFont('helvetica', 'bold');
          doc.text(`${imp >= 0 ? '+' : ''}Rs. ${imp.toFixed(2)} Lakh (${c.pct}%)`, 155, yPos);

          yPos += 5.5;
        });
      }

      // Statutory Disclaimer Box
      yPos += 10;
      doc.setFillColor(254, 242, 242);
      doc.setDrawColor(239, 68, 68);
      doc.setLineWidth(0.3);
      doc.roundedRect(15, yPos, 180, 22, 1.5, 1.5, 'FD');

      doc.setTextColor(185, 28, 28);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text('STATUTORY DISCLAIMER & CITIZEN NOTICE', 18, yPos + 4.5);

      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      const disclaimer =
        'This automated valuation report is generated for informational and econometric demonstration purposes only by the Directorate of Housing Analytics demo platform. It constitutes an indicative econometric model estimate and DOES NOT serve as a legal property valuation, circle rate deed, or statutory chartered valuation under RERA or Indian Stamp Act provisions.';
      doc.text(doc.splitTextToSize(disclaimer, 172), 18, yPos + 9);

      // Save PDF
      doc.save(`Bharat_Valuation_Report_${estimateData.city || 'Property'}_${Date.now()}.pdf`);
      setDownloadSuccess(true);
    } catch (err) {
      console.error('PDF generation error', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleDownloadPdf}
        disabled={isGenerating || !estimateData}
        className="py-2.5 px-4 bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs uppercase tracking-wider rounded shadow-md transition duration-150 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-saffron" />
            <span>Generating Official PDF...</span>
          </>
        ) : downloadSuccess ? (
          <>
            <Check className="w-4 h-4 text-emerald-400" />
            <span>PDF Downloaded</span>
          </>
        ) : (
          <>
            <FileDown className="w-4 h-4 text-saffron" />
            <span>Download PDF Valuation Report (M10)</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={() => window.print()}
        className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-300 transition"
        title="Print Valuation Sheet"
        aria-label="Print Valuation Sheet"
      >
        <Printer className="w-4 h-4" />
      </button>
    </div>
  );
}
