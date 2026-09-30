import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HelpCircle, Search, Mail, FileText, PhoneCall } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Accordion from '../components/ui/Accordion';
import Button from '../components/ui/Button';
import { INDIAN_FAQS } from '../data/indianData';

const EXTENDED_INDIAN_FAQS = [
  ...INDIAN_FAQS,
  {
    question: 'How do Stamp Duty and Registration charges vary across Indian states?',
    answer:
      'Stamp duty is a state subject in India and typically ranges from 4% to 7% of the property value (e.g., 5% in Maharashtra + 1% metro cess, 5.6% in Karnataka, 5% to 7% in Delhi). Registration fee is typically 1% of the property valuation.',
  },
  {
    question: 'How is the 90% confidence interval computed for Indian properties?',
    answer:
      'The confidence interval uses residual variance bounds derived from 5-fold cross-validation on holdout test properties, formulating a ±6.5% boundary around the primary point prediction.',
  },
  {
    question: 'Can banks or lending institutions access an automated batch API?',
    answer:
      'Yes. The backend architecture exposes a RESTful FastAPI endpoint at `/api/predict` that accepts standardized JSON payloads for single or multi-property bulk valuations.',
  },
];

export default function FAQ() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(queryParam);

  useEffect(() => {
    if (queryParam) {
      setSearchTerm(queryParam);
    }
  }, [queryParam]);

  const filteredFaqs = useMemo(() => {
    if (!searchTerm.trim()) return EXTENDED_INDIAN_FAQS;
    const q = searchTerm.toLowerCase();
    return EXTENDED_INDIAN_FAQS.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  const accordionItems = useMemo(() => {
    return filteredFaqs.map((faq) => ({
      title: faq.question,
      content: <p className="text-xs text-slate-700 leading-relaxed">{faq.answer}</p>,
    }));
  }, [filteredFaqs]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b-2 border-navy-700 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-saffron-dark bg-amber-50 border border-amber-200 px-2.5 py-0.5 inline-block rounded mb-1">
          Citizen Assistance & RERA Inquiries
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 font-sans">
          Frequently Asked Questions (अक्सर पूछे जाने वाले प्रश्न)
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Comprehensive answers to common questions regarding automated Indian real estate valuations, RERA compliance, bank home loans, and area calculations.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl">
        <Input
          label="Search Knowledge Base & RERA Guides"
          placeholder="Filter by keyword (e.g., bank loan, RERA, builder price, carpet area)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Accordion */}
      <div className="space-y-4">
        {accordionItems.length > 0 ? (
          <Accordion items={accordionItems} allowMultiple={true} />
        ) : (
          <div className="text-center py-10 bg-slate-50 border border-slate-200 rounded">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No matching questions found</p>
            <p className="text-xs text-slate-500 mt-1">
              Try searching with different terms or submit an official inquiry to our helpdesk.
            </p>
          </div>
        )}
      </div>

      {/* Helpline Desk Card */}
      <div className="bg-slate-100 border border-slate-300 p-5 sm:p-6 rounded flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm sm:text-base font-bold text-navy-900">
            Have a question regarding your property valuation?
          </h3>
          <p className="text-xs text-slate-600">
            Reach out to the Directorate of Housing Analytics technical support & grievance cell.
          </p>
        </div>
        <Link to="/contact">
          <Button
            variant="primary"
            size="md"
            className="bg-navy-700 hover:bg-navy-800 text-white font-bold"
          >
            <Mail className="w-4 h-4 mr-2 text-saffron" />
            Contact Housing Desk
          </Button>
        </Link>
      </div>
    </div>
  );
}
