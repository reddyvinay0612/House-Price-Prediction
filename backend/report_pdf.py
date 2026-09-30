"""
Government-Style PDF Valuation Report Generator
Bharat House Price Estimator • Directorate of Housing Analytics

Generates official valuation summaries with:
- Unique Report Certificate ID & Generation Timestamp
- Property Specifications Table
- Indicative Valuation Range & Unit Rates
- Feature Contribution Attribution
- QR Code Verification Block & Official Disclaimer
"""

import io
import time
from typing import Dict, Any

try:
    from reportlab.lib.pagesizes import letter, A4
    from reportlab.lib import colors
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
    HAS_REPORTLAB = True
except ImportError:
    HAS_REPORTLAB = False


def generate_pdf_report_bytes(estimate_data: Dict[str, Any]) -> bytes:
    """Generate a clean 1-page PDF valuation report"""
    buffer = io.BytesIO()
    
    if not HAS_REPORTLAB:
        # Fallback simple text PDF buffer header
        text_content = f"""%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >> endobj
4 0 obj << /Length 200 >> stream
BT
/F1 18 Tf 50 720 Td (BHARAT HOUSE PRICE ESTIMATION CERTIFICATE) Tj
/F1 12 Tf 50 680 Td (Directorate of Housing Analytics - Fictional Demo) Tj
/F1 10 Tf 50 640 Td (Property: {estimate_data.get('bhk', 2)} BHK in {estimate_data.get('city', 'City')}) Tj
/F1 10 Tf 50 620 Td (Estimated Valuation: Rs. {estimate_data.get('predicted_price_lakhs', 0)} Lakh) Tj
/F1 8 Tf 50 580 Td (Indicative estimate only. Not a legal valuation.) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000214 00000 n 
trailer << /Size 5 /Root 1 0 R >>
startxref
465
%%EOF"""
        return text_content.encode('utf-8', errors='ignore')

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36,
    )
    
    styles = getSampleStyleSheet()
    story = []

    # Colors
    c_navy = colors.HexColor("#0b3d91")
    c_saffron = colors.HexColor("#ff9933")
    c_green = colors.HexColor("#138808")
    c_slate = colors.HexColor("#334155")
    c_bg = colors.HexColor("#f8fafc")

    # Header Title
    title_style = ParagraphStyle(
        'HeaderTitle',
        parent=styles['Heading1'],
        fontSize=16,
        leading=20,
        textColor=c_navy,
        fontName='Helvetica-Bold',
        alignment=1,
    )
    sub_style = ParagraphStyle(
        'HeaderSub',
        parent=styles['Normal'],
        fontSize=9,
        leading=12,
        textColor=c_slate,
        alignment=1,
    )
    
    story.append(Paragraph("DIRECTORATE OF HOUSING ANALYTICS", title_style))
    story.append(Paragraph("GOVERNMENT OF INDIA DEMO • ECONOMETRIC VALUATION DIVISION", sub_style))
    story.append(Spacer(1, 8))

    # Tricolor rule line
    story.append(HRFlowable(width="100%", thickness=2, color=c_saffron, spaceAfter=2))
    story.append(HRFlowable(width="100%", thickness=1, color=c_green, spaceAfter=12))

    report_id = f"BHARAT-VAL-{int(time.time())}"
    date_str = time.strftime("%d %B %Y, %H:%M IST")

    meta_data = [
        [Paragraph(f"<b>Certificate ID:</b> {report_id}", styles['Normal']), Paragraph(f"<b>Issue Date:</b> {date_str}", styles['Normal'])],
        [Paragraph(f"<b>Valuation Model:</b> Champion GBR v2.0", styles['Normal']), Paragraph("<b>Jurisdiction:</b> Pan-India Benchmark", styles['Normal'])],
    ]
    t_meta = Table(meta_data, colWidths=[260, 260])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), c_bg),
        ('PADDING', (0, 0), (-1, -1), 6),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 14))

    # Valuation Highlight Card
    price_val = estimate_data.get('predicted_price_lakhs', 75.0)
    low_val = estimate_data.get('lower_bound_lakhs', price_val * 0.93)
    high_val = estimate_data.get('upper_bound_lakhs', price_val * 1.07)
    rate_sqft = estimate_data.get('price_per_sqft', 6500)

    val_data = [
        [
            Paragraph("<font size=10 color='#64748b'>INDICATIVE VALUATION</font><br/><font size=20 color='#0b3d91'><b>₹" + f"{price_val:,.2f}" + " Lakh</b></font>", styles['Normal']),
            Paragraph(f"<font size=10 color='#64748b'>ESTIMATED RANGE (±7%)</font><br/><font size=13 color='#334155'><b>₹{low_val:.2f}L – ₹{high_val:.2f}L</b></font><br/><font size=9 color='#64748b'>Unit Rate: ₹{rate_sqft:,}/sq.ft</font>", styles['Normal']),
        ]
    ]
    t_val = Table(val_data, colWidths=[260, 260])
    t_val.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#eff6ff")),
        ('PADDING', (0, 0), (-1, -1), 10),
        ('BOX', (0, 0), (-1, -1), 1, c_navy),
    ]))
    story.append(t_val)
    story.append(Spacer(1, 14))

    # Property Specifications Table
    story.append(Paragraph("<b>Property Specifications</b>", styles['Heading3']))
    specs_data = [
        ["Parameter", "Citizen Submission", "Parameter", "Citizen Submission"],
        ["Target City", str(estimate_data.get('city', 'N/A')), "Layout Configuration", f"{estimate_data.get('bhk', 2)} BHK, {estimate_data.get('bath', 2)} Bath"],
        ["Locality / Micro-Market", str(estimate_data.get('locality', 'N/A')), "Total Built-up Area", f"{estimate_data.get('total_sqft', 0):,g} sq.ft"],
        ["Area Standard", str(estimate_data.get('area_type', 'Super built-up')), "Construction Status", str(estimate_data.get('availability', 'Ready To Move'))],
    ]
    t_specs = Table(specs_data, colWidths=[130, 130, 130, 130])
    t_specs.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0b3d91")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('PADDING', (0, 0), (-1, -1), 5),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ('FONTSIZE', (0, 0), (-1, -1), 8.5),
    ]))
    story.append(t_specs)
    story.append(Spacer(1, 14))

    # Econometric Attribution
    story.append(Paragraph("<b>Econometric Contribution Factors (SHAP Decomposition)</b>", styles['Heading3']))
    contribs = estimate_data.get('feature_contributions', [])[:5]
    contrib_rows = [["Factor Description", "Submission Value", "Valuation Impact (₹ Lakh)", "Impact Direction"]]
    for c in contribs:
        impact = c.get('impact_lakhs', 0.0)
        direction = "▲ Premium" if impact >= 0 else "▼ Deduction"
        contrib_rows.append([
            str(c.get('feature', '')),
            str(c.get('raw_value', '')),
            f"{impact:+0.2f} L",
            direction,
        ])

    if len(contrib_rows) > 1:
        t_contrib = Table(contrib_rows, colWidths=[180, 120, 110, 110])
        t_contrib.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#334155")),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('PADDING', (0, 0), (-1, -1), 5),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
        ]))
        story.append(t_contrib)
        story.append(Spacer(1, 14))

    # Statutory Disclaimer
    disclaimer_text = (
        "<b>STATUTORY DISCLAIMER:</b> This automated digital valuation certificate is generated for informational "
        "and econometric guidance purposes only by the fictional Directorate of Housing Analytics demo platform. "
        "It constitutes an indicative econometric estimate and DOES NOT serve as a legal, municipal circle rate, "
        "or registered chartered valuer deed under RERA or Indian Stamp Act provisions."
    )
    story.append(Paragraph(disclaimer_text, ParagraphStyle('Disclaimer', parent=styles['Normal'], fontSize=7.5, leading=10, textColor=colors.HexColor("#64748b"))))

    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
