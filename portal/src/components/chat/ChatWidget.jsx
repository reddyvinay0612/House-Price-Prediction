import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Bot, Sparkles, X } from 'lucide-react';
import { ChatPanel } from './ChatPanel';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../context/AuthContext';

export function ChatWidget() {
  const { isAuthenticated } = useAuth();
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const triggerButtonRef = useRef(null);

  const {
    messages,
    isLoading,
    isOfflineMode,
    suggestions,
    language,
    setLanguage,
    sendMessage,
    clearChat,
    handleFeedback,
  } = useChat(i18n.language || 'en');

  // Do not render floating chatbot before login
  if (!isAuthenticated) {
    return null;
  }

  // Keep chat language in sync with app i18n if user changes portal language
  useEffect(() => {
    if (i18n.language) {
      setLanguage(i18n.language);
    }
  }, [i18n.language, setLanguage]);

  // Handle open
  const handleOpen = () => {
    setIsOpen(true);
  };

  // Handle close with focus restoration
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      triggerButtonRef.current?.focus();
    }, 100);
  };

  return (
    <>
      {/* Floating Chat Launcher Button (WCAG 2.1 AA Keyboard Accessible) */}
      {!isOpen && (
        <aside
          aria-label="AI Assistant Floating Widget"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 print:hidden"
        >
          <button
            ref={triggerButtonRef}
            type="button"
            onClick={handleOpen}
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            aria-label="Ask Griha Mitra AI Real Estate Assistant"
            title="Ask Griha Mitra AI Real Estate Assistant"
            className="group flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-navy-800 hover:bg-navy-900 text-white rounded-full shadow-xl border-2 border-saffron hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-3 focus:ring-saffron focus:ring-offset-2"
          >
            {/* Animated Chat / Bot Icon */}
            <div className="relative flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-saffron text-slate-950 flex items-center justify-center font-bold text-xs shadow-xs">
                <MessageSquare className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indiagreen rounded-full ring-2 ring-white animate-pulse" />
            </div>

            {/* Button Label */}
            <div className="flex flex-col text-left">
              <span className="text-xs font-black tracking-wide leading-tight">
                {t('chat.launcherLabel', 'Ask Griha Mitra')}
              </span>
              <span className="text-[10px] text-saffron font-medium hidden sm:inline leading-none">
                गृह मित्र (AI Assistant)
              </span>
            </div>
          </button>
        </aside>
      )}

      {/* Floating Chat Panel */}
      <ChatPanel
        isOpen={isOpen}
        onClose={handleClose}
        onMinimize={() => setIsOpen(false)}
        messages={messages}
        isLoading={isLoading}
        isOfflineMode={isOfflineMode}
        suggestions={suggestions}
        language={language}
        onLanguageChange={setLanguage}
        onSendMessage={sendMessage}
        onClearChat={clearChat}
        onFeedback={handleFeedback}
      />
    </>
  );
}

export default ChatWidget;
