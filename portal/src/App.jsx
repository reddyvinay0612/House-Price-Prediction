import React from "react";
import { useLocation } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import UtilityBar from "./components/layout/UtilityBar";
import Header from "./components/layout/Header";
import TricolourBar from "./components/layout/TricolourBar";
import NavBar from "./components/layout/NavBar";
import Ticker from "./components/layout/Ticker";
import Breadcrumb from "./components/layout/Breadcrumb";
import Footer from "./components/layout/Footer";
import InactivityModal from "./components/auth/InactivityModal";
import ChatWidget from "./components/chat/ChatWidget";
import DemoTour from "./components/common/DemoTour";
import AppRoutes from "./routes";

function PortalLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Fullscreen view for login page
  const isFullscreenLogin = !isAuthenticated && ['/login', '/signin'].includes(location.pathname);

  if (isFullscreenLogin) {
    return (
      <main id="main-content" className="w-full min-h-screen">
        <AppRoutes />
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-govgrey-100 text-slate-800 font-sans antialiased selection:bg-saffron selection:text-slate-950">
      {/* WCAG 2.1 AA Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-saffron focus:text-slate-950 focus:font-bold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-navy-700"
      >
        Skip to main content
      </a>

      {/* Level 1: Official Utility Bar */}
      <UtilityBar />

      {/* Level 2: Department Branding Header */}
      <Header />

      {/* Level 3: Tricolour Accent Stripe */}
      <TricolourBar height="h-1.5" />

      {/* Level 4: Navigation, Ticker & Breadcrumb (Only visible after Citizen Logs In) */}
      {isAuthenticated && (
        <>
          <NavBar />
          <Ticker />
          <Breadcrumb />
        </>
      )}

      {/* Level 5: Main Dynamic Content Area */}
      <main
        id="main-content"
        tabIndex={-1}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full focus:outline-none"
      >
        <AppRoutes />
      </main>

      {/* 15-Minute Inactivity Session Manager for Authenticated Citizens */}
      {isAuthenticated && <InactivityModal />}

      {/* Griha Mitra AI Real Estate Assistant Floating Widget (Only after login) */}
      {isAuthenticated && <ChatWidget />}

      {/* 6-Step Guided Judge Demo Tour (M12 - Only after login) */}
      {isAuthenticated && <DemoTour />}

      {/* Level 6: Official Government Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <PortalLayout />
      </AuthProvider>
    </AppProvider>
  );
}
