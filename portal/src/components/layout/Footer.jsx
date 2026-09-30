import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Shield, ExternalLink, HelpCircle, Mail, Phone, MapPin, Users } from 'lucide-react';
import TricolourBar from './TricolourBar';

/**
 * Official Indian Government Footer with Tricolour Ribbon & GIGW Compliance Notice
 */
export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="bg-navy-950 text-slate-300 text-xs mt-auto">
      {/* Tricolour Stripe at top of footer */}
      <TricolourBar height="h-1.5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Department Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-navy-800 border border-saffron flex items-center justify-center text-white flex-shrink-0">
                <Home className="w-5 h-5 text-saffron" />
              </div>
              <div>
                <span className="font-extrabold text-white text-sm block leading-tight">
                  {t('app.title')}
                </span>
                <span className="text-[11px] text-slate-400">{t('app.subtitle')}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Standardized econometric residential valuation models and market transparency analytics for Indian cities using verified transaction benchmarks.
            </p>
            <div>
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-navy-900 text-saffron border border-navy-800">
                {t('app.fictionalNotice')}
              </span>
            </div>
          </div>

          {/* Column 2: Public Services */}
          <div>
            <h4 className="font-extrabold text-white uppercase text-[11px] tracking-wider border-b border-navy-800 pb-1.5 mb-2.5">
              Citizen Services
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link to="/estimate" className="hover:text-saffron transition">
                  • {t('nav.estimate')}
                </Link>
              </li>
              <li>
                <Link to="/insights" className="hover:text-saffron transition">
                  • {t('nav.insights')}
                </Link>
              </li>
              <li>
                <Link to="/city-trends" className="hover:text-saffron transition">
                  • {t('nav.cityTrends')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-saffron transition">
                  • Frequently Asked Questions (FAQ)
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-saffron transition">
                  • Official Grievance & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Help & RERA Compliance */}
          <div>
            <h4 className="font-extrabold text-white uppercase text-[11px] tracking-wider border-b border-navy-800 pb-1.5 mb-2.5">
              Help & Compliance
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link to="/faq" className="hover:text-saffron transition">
                  • {t('nav.faq')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-saffron transition">
                  • {t('nav.contact')}
                </Link>
              </li>
              <li>
                <a href="#rera" className="hover:text-saffron transition">
                  • RERA Verification Guidelines
                </a>
              </li>
              <li>
                <a href="#accessibility" className="hover:text-saffron transition">
                  • Accessibility Statement (GIGW 3.0)
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Grievance Cell */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white uppercase text-[11px] tracking-wider border-b border-navy-800 pb-1.5">
              Grievance Cell
            </h4>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-saffron flex-shrink-0 mt-0.5" />
                <span className="text-slate-400">
                  Nirman Bhawan, Maulana Azad Road, New Delhi – 110011 (Demo)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-saffron flex-shrink-0" />
                <span className="text-slate-400">Toll Free: 1800-11-2024 (9 AM - 6 PM IST)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-saffron flex-shrink-0" />
                <span className="text-slate-400">support-housing@gov.in.demo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Compliance Strip */}
        <div className="mt-8 pt-6 border-t border-navy-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>© {currentYear} Directorate of Housing Analytics, Government of India (Demo).</span>
            <span>All Rights Reserved.</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <a href="#terms" className="hover:text-white transition">
              Terms of Use
            </a>
            <span>|</span>
            <a href="#privacy" className="hover:text-white transition">
              Privacy Policy
            </a>
            <span>|</span>
            <a href="#disclaimer" className="hover:text-white transition">
              Disclaimer
            </a>
            <span>|</span>
            <a href="#hyperlinking" className="hover:text-white transition">
              Hyperlinking Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
