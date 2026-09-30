import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  X,
  Calculator,
  Home,
  LineChart,
  Building2,
  Phone,
  FileText,
  LayoutDashboard,
  Sliders,
  MapPin,
  Scale,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Official Indian Government Navigation Bar with active state and mobile menu
 */
export function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();

  const isOfficer = user?.role === 'OFFICER' || user?.email?.includes('officer');

  const navItems = [
    { to: '/', label: t('nav.home') || 'Home', icon: Home },
    { to: '/estimate', label: 'Estimate Price', icon: Calculator, badge: 'Core' },
    { to: '/whatif', label: 'What-If (M1)', icon: Sliders },
    { to: '/map', label: 'India Map (M3)', icon: MapPin },
    { to: '/finance', label: 'EMI & Rent (M4)', icon: Calculator },
    { to: '/compare', label: 'Compare (M5)', icon: Scale },
    { to: '/forecast', label: 'Forecast (M7)', icon: TrendingUp },
    { to: '/city-trends', label: 'Districts', icon: Building2 },
    ...(isOfficer
      ? [{ to: '/officer', label: 'Officer (M9)', icon: ShieldCheck, badge: 'Official' }]
      : []),
    ...(isAuthenticated
      ? [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }]
      : []),
    { to: '/faq', label: 'FAQs', icon: FileText },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="bg-navy-700 text-white shadow-md relative z-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-11 sm:h-12">
          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center space-x-0.5 h-full overflow-x-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `h-full flex items-center px-3 text-xs font-bold transition-colors border-b-3 whitespace-nowrap ${
                    isActive
                      ? 'bg-navy-800 text-white border-saffron shadow-xs'
                      : 'text-slate-100 hover:bg-navy-800/80 hover:text-white border-transparent'
                  }`
                }
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-1.5 text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase tracking-wider ${
                      item.badge === 'Official'
                        ? 'bg-red-500 text-white'
                        : 'bg-saffron text-slate-950'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center justify-between w-full lg:hidden">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200 truncate">
              Bharat Housing Portal • Demo
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-1.5 rounded hover:bg-navy-800 text-white focus:outline-none focus:ring-2 focus:ring-saffron"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-navy-900 border-t border-navy-800 px-4 pt-2 pb-4 space-y-1 shadow-xl max-h-[80vh] overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-navy-950 text-saffron border-l-4 border-saffron'
                      : 'text-slate-100 hover:bg-navy-800'
                  }`
                }
              >
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4 text-saffron" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-saffron text-slate-950">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      )}
    </nav>
  );
}

export default NavBar;
