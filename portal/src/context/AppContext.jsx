import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Accessibility Font Size ('small', 'normal', 'large')
  const [fontSize, setFontSize] = useLocalStorage('gov_portal_font_size', 'normal');

  // Accessibility High Contrast Mode
  const [highContrast, setHighContrast] = useLocalStorage('gov_portal_high_contrast', false);

  // Portal Language ('en', 'es', 'fr')
  const [language, setLanguage] = useLocalStorage('gov_portal_language', 'en');

  // Recent Property Estimates History
  const [recentEstimates, setRecentEstimates] = useLocalStorage('gov_portal_recent_estimates', []);

  // Ticker Pause state
  const [isTickerPaused, setIsTickerPaused] = useState(false);

  // Apply font size attribute to html root
  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize);
  }, [fontSize]);

  // Apply high-contrast class to html root
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  const toggleHighContrast = () => setHighContrast((prev) => !prev);

  // Active property estimate result
  const [currentEstimate, setCurrentEstimate] = useState(null);

  const addEstimate = (estimateResult) => {
    const newEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...estimateResult,
    };
    setRecentEstimates((prev) => [newEntry, ...prev.slice(0, 9)]);
    setCurrentEstimate(newEntry);
  };

  const restoreEstimate = (item) => {
    setCurrentEstimate(item);
  };

  const clearEstimates = () => {
    setRecentEstimates([]);
    setCurrentEstimate(null);
  };

  return (
    <AppContext.Provider
      value={{
        fontSize,
        setFontSize,
        highContrast,
        toggleHighContrast,
        language,
        setLanguage,
        recentEstimates,
        setRecentEstimates,
        currentEstimate,
        setCurrentEstimate,
        addEstimate,
        restoreEstimate,
        clearEstimates,
        isTickerPaused,
        setIsTickerPaused,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export const useAppContext = useApp;
export default AppProvider;
