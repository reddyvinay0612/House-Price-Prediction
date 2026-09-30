import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Home,
  Send,
  X,
  Minus,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  WifiOff,
  Bot,
  Globe,
} from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { QuickReplies } from './QuickReplies';
import { VoiceButton } from './VoiceButton';

export function ChatPanel({
  isOpen,
  onClose,
  onMinimize,
  messages,
  isLoading,
  isOfflineMode,
  suggestions,
  language,
  onLanguageChange,
  onSendMessage,
  onClearChat,
  onFeedback,
}) {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleVoiceTranscript = (transcript) => {
    if (transcript && !isLoading) {
      onSendMessage(transcript);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-labelledby="chat-panel-title"
      aria-modal="false"
      className="fixed z-50 bottom-0 right-0 sm:bottom-20 sm:right-6 w-full sm:w-[380px] h-full sm:h-[540px] bg-[#f8fafc] sm:rounded-lg shadow-2xl border border-slate-300 flex flex-col overflow-hidden font-sans antialiased animate-fadeIn transition-all"
    >
      {/* 1. Header (Government Navy with Placeholder Bot Emblem) */}
      <div className="bg-navy-900 text-white p-3 sm:px-4 flex items-center justify-between shadow-sm relative">
        <div className="flex items-center space-x-2.5">
          {/* Avatar Icon */}
          <div className="w-8 h-8 rounded-full bg-navy-800 border-2 border-saffron flex items-center justify-center text-saffron flex-shrink-0 shadow-xs">
            <Home className="w-4 h-4" />
          </div>
          <div>
            <h2 id="chat-panel-title" className="text-xs font-black tracking-tight flex items-center gap-1.5">
              <span>{t('chat.title', 'Griha Mitra (गृह मित्र)')}</span>
            </h2>
            <p className="text-[10px] text-slate-300">
              {t('chat.subtitle', 'Directorate AI Assistant (Demo)')}
            </p>
          </div>
        </div>

        {/* Header Controls */}
        <div className="flex items-center space-x-1 text-slate-300">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={() => onLanguageChange(language === 'hi' ? 'en' : 'hi')}
            className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-navy-950 hover:bg-navy-800 text-slate-200 border border-navy-700 transition"
            title="Toggle Language (EN / हिन्दी)"
            aria-label="Toggle Language"
          >
            {language === 'hi' ? 'EN' : 'हिन्दी'}
          </button>

          {/* Clear Chat Button */}
          <button
            type="button"
            onClick={onClearChat}
            className="p-1 rounded hover:bg-navy-800 text-slate-300 hover:text-white transition"
            title={t('chat.clearChat', 'Clear Conversation')}
            aria-label={t('chat.clearChat', 'Clear Conversation')}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Minimize Button */}
          <button
            type="button"
            onClick={onMinimize || onClose}
            className="p-1 rounded hover:bg-navy-800 text-slate-300 hover:text-white transition"
            title="Minimize"
            aria-label="Minimize Chat Panel"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-red-900/50 hover:text-red-300 text-slate-300 transition"
            title="Close"
            aria-label="Close Chat Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Tricolour Stripe */}
      <div className="h-1 bg-gradient-to-r from-saffron via-white to-indiagreen flex-shrink-0" />

      {/* 3. Offline Mode Warning Banner */}
      {isOfflineMode && (
        <div className="bg-amber-50 text-amber-900 px-3 py-1 text-[10px] font-semibold flex items-center gap-1.5 border-b border-amber-200">
          <WifiOff className="w-3 h-3 text-amber-700 flex-shrink-0" />
          <span>{t('chat.offlineBanner', 'Basic mode: AI assistant offline.')}</span>
        </div>
      )}

      {/* 4. Privacy Disclaimer Notice */}
      <div className="bg-slate-100 px-3 py-1 text-[9px] text-slate-500 flex items-center gap-1 border-b border-slate-200">
        <ShieldAlert className="w-3 h-3 text-slate-400 flex-shrink-0" />
        <span className="truncate">
          {t('chat.privacyNotice', 'Do not share personal info (Aadhaar, PAN, OTP, Bank details).')}
        </span>
      </div>

      {/* 5. Messages History Area */}
      <div
        aria-live="polite"
        className="flex-1 p-3 overflow-y-auto bg-slate-50 space-y-1 focus:outline-none"
      >
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            language={language}
            onFeedback={onFeedback}
          />
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex items-center space-x-1.5 p-2 bg-white border border-slate-200 rounded-[6px] w-16 mb-2">
            <span className="w-1.5 h-1.5 bg-navy-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 bg-navy-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 bg-navy-600 rounded-full animate-bounce" />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 6. Quick Replies Suggestions */}
      <QuickReplies
        suggestions={suggestions}
        disabled={isLoading}
        onSelect={(suggestion) => onSendMessage(suggestion)}
      />

      {/* 7. Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-1.5"
      >
        <VoiceButton
          onTranscript={handleVoiceTranscript}
          language={language}
          disabled={isLoading}
        />

        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t('chat.placeholder', 'Ask in English, हिन्दी, or Hinglish...')}
          disabled={isLoading}
          maxLength={400}
          className="flex-1 py-1.5 px-3 text-xs bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-700 focus:border-navy-700 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          title={t('chat.send', 'Send message')}
          aria-label={t('chat.send', 'Send message')}
          className="p-2 bg-navy-800 hover:bg-navy-900 disabled:bg-slate-300 text-white rounded-md transition shadow-xs flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-navy-600"
        >
          <Send className="w-3.5 h-3.5 text-saffron" />
        </button>
      </form>
    </div>
  );
}

export default ChatPanel;
