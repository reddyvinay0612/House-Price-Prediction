import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  Building2,
  FileCheck,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: 'Bengaluru',
    inquiryType: 'valuation',
    organization: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const generatedId = 'DHA-IN-' + Math.floor(100000 + Math.random() * 900000);
      setTicketId(generatedId);
      setSubmitted(true);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b-2 border-navy-700 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-saffron-dark bg-amber-50 border border-amber-200 px-2.5 py-0.5 inline-block rounded mb-1">
          Citizen Grievance & Technical Inquiries
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 font-sans">
          Contact Directorate of Housing Analytics (संपर्क करें)
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Submit official queries regarding property valuations, model methodologies, institutional API access, or state RERA data alignment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7">
          <Card title="Public Inquiry & Grievance Registration">
            {submitted ? (
              <div className="space-y-4 py-4">
                <Alert
                  type="success"
                  title="Inquiry Registered Successfully"
                  content={`Your inquiry has been officially logged in the Directorate of Housing Analytics system under Reference ID: ${ticketId}. Our technical valuation team will respond within 2 business days.`}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      fullName: '',
                      email: '',
                      phone: '',
                      city: 'Bengaluru',
                      inquiryType: 'valuation',
                      organization: '',
                      message: '',
                    });
                  }}
                >
                  Submit Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <Input
                  label="Full Name (पूरा नाम) *"
                  placeholder="e.g. Rajesh Kumar"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Email Address *"
                    type="email"
                    placeholder="name@domain.in or personal email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />

                  <Input
                    label="Mobile Number (Optional)"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Inquiry Classification *"
                    value={formData.inquiryType}
                    onChange={(e) =>
                      setFormData({ ...formData, inquiryType: e.target.value })
                    }
                    options={[
                      { value: 'valuation', label: 'Property Valuation Discrepancy' },
                      { value: 'rera', label: 'RERA Benchmark Query' },
                      { value: 'api', label: 'Institutional / Bank API Access' },
                      { value: 'methodology', label: 'ML Algorithm & Dataset Inquiries' },
                      { value: 'general', label: 'General Citizen Support' },
                    ]}
                  />

                  <Select
                    label="Relevant City / State *"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    options={[
                      { value: 'Bengaluru', label: 'Bengaluru (Karnataka)' },
                      { value: 'Mumbai', label: 'Mumbai (Maharashtra)' },
                      { value: 'Delhi', label: 'Delhi-NCR' },
                      { value: 'Hyderabad', label: 'Hyderabad (Telangana)' },
                      { value: 'Pune', label: 'Pune (Maharashtra)' },
                      { value: 'Chennai', label: 'Chennai (Tamil Nadu)' },
                      { value: 'Kolkata', label: 'Kolkata (West Bengal)' },
                      { value: 'Other', label: 'Other Indian Regions' },
                    ]}
                  />
                </div>

                <Input
                  label="Organization / Bank Affiliation (Optional)"
                  placeholder="e.g. State Bank of India / HDFC / Municipal Body"
                  value={formData.organization}
                  onChange={(e) =>
                    setFormData({ ...formData, organization: e.target.value })
                  }
                />

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Message & Property Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Provide details regarding your property inquiry, locality parameters, or API integration request..."
                    className="w-full border border-slate-300 p-2.5 text-xs text-slate-900 rounded focus:outline-none focus:ring-1 focus:ring-navy-700 focus:border-navy-700 font-sans"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={loading}
                    className="bg-navy-700 hover:bg-navy-800 text-white font-bold w-full sm:w-auto"
                  >
                    <Send className="w-4 h-4 mr-2 text-saffron" />
                    Submit Official Grievance / Inquiry
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>

        {/* Right Column: Office Directory */}
        <div className="lg:col-span-5 space-y-6">
          <Card title="Directorate Headquarters">
            <div className="space-y-4 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-navy-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-navy-900">National Analytics Bureau</p>
                  <p className="text-slate-600">Directorate of Housing Analytics (Demo)</p>
                  <p className="text-slate-600">Nirman Bhawan, Maulana Azad Road</p>
                  <p className="text-slate-600">New Delhi - 110011, India</p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-slate-100 pt-3">
                <Phone className="w-5 h-5 text-navy-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-navy-900">Telephone Lines</p>
                  <p className="text-slate-600">Toll-Free Helpline: 1800-11-DHA-GOV (342-468)</p>
                  <p className="text-slate-600">Direct Desk: +91 (011) 2306-1199</p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-slate-100 pt-3">
                <Clock className="w-5 h-5 text-navy-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-navy-900">Working Hours</p>
                  <p className="text-slate-600">Monday – Friday: 9:00 AM – 5:30 PM IST</p>
                  <p className="text-slate-600">Automated ML Portal: 24/7 Availability</p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-slate-100 pt-3">
                <ShieldCheck className="w-5 h-5 text-indiagreen shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-navy-900">Security & Compliance</p>
                  <p className="text-slate-600">
                    GIGW 3.0 Standard • CERT-In Framework Aligned
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
