import React, { useState } from 'react';
import {
  MessageSquarePlus,
  Bot,
  Calendar as CalendarIcon,
  Share2,
  Palette,
  Check,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function FloatingIconDock({ onOpenChat }) {
  const { toggleHighContrast, highContrast } = useApp();
  const [activeModal, setActiveModal] = useState(null); // 'feedback' | 'calendar' | 'share' | null
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Bharat House Price Estimator',
          text: 'Official Indian Real Estate Valuation & Regional Market Intelligence Portal',
          url: window.location.href,
        });
        return;
      } catch (e) {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (feedbackText.trim()) {
      setFeedbackSent(true);
      setTimeout(() => {
        setFeedbackSent(false);
        setFeedbackText('');
        setActiveModal(null);
      }, 2000);
    }
  };

  const [loginPromptToast, setLoginPromptToast] = useState(false);

  const dockItems = [
    {
      id: 'feedback',
      label: 'Citizen Feedback',
      icon: MessageSquarePlus,
      onClick: () => setActiveModal(activeModal === 'feedback' ? null : 'feedback'),
    },
    {
      id: 'chat',
      label: 'Griha Mitra AI (Available After Login)',
      icon: Bot,
      highlight: true,
      onClick: () => {
        if (onOpenChat) {
          onOpenChat();
        } else {
          setLoginPromptToast(true);
          setTimeout(() => setLoginPromptToast(false), 3000);
        }
      },
    },
    {
      id: 'calendar',
      label: 'Official Calendar',
      icon: CalendarIcon,
      onClick: () => setActiveModal(activeModal === 'calendar' ? null : 'calendar'),
    },
    {
      id: 'share',
      label: 'Share Portal',
      icon: Share2,
      onClick: handleShare,
    },
    {
      id: 'theme',
      label: highContrast ? 'Standard Contrast' : 'High Contrast View',
      icon: Palette,
      onClick: toggleHighContrast,
    },
  ];

  return (
    <>
      {/* Floating Vertical Strip on Right Edge */}
      <aside
        aria-label="Quick Access Icon Dock"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-30 hidden sm:flex flex-col bg-navy-950/85 backdrop-blur-md border-l border-t border-b border-white/20 rounded-l-xl p-1.5 shadow-2xl space-y-2 text-white"
      >
        {dockItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              title={item.label}
              aria-label={item.label}
              className={`p-2 rounded-lg transition group relative flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-saffron ${
                item.highlight
                  ? 'bg-saffron text-navy-950 hover:bg-saffron-dark shadow-md font-bold'
                  : 'hover:bg-white/20 text-slate-200 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {/* Tooltip on hover */}
              <span className="absolute right-full mr-2.5 px-2 py-1 rounded bg-navy-900 text-white text-[11px] font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition shadow-lg border border-white/10">
                {item.label}
              </span>
            </button>
          );
        })}
      </aside>

      {/* Share Toast */}
      {copiedLink && (
        <div className="fixed bottom-14 right-6 z-50 bg-emerald-700 text-white px-3 py-2 rounded-md shadow-xl text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
          <Check className="w-4 h-4" />
          <span>Portal URL copied to clipboard!</span>
        </div>
      )}

      {/* Login Prompt Toast */}
      {loginPromptToast && (
        <div className="fixed bottom-14 right-6 z-50 bg-slate-900 border border-amber-400 text-amber-200 px-3.5 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn backdrop-blur-md">
          <Bot className="w-4 h-4 text-amber-300 animate-bounce" />
          <span>Please sign in first to chat with Griha Mitra AI assistant!</span>
        </div>
      )}

      {/* Citizen Feedback Modal */}
      {activeModal === 'feedback' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white text-slate-800 rounded-lg p-5 max-w-sm w-full shadow-2xl border-t-4 border-saffron space-y-3 relative animate-fadeIn">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-navy-900 font-bold text-sm">
              <MessageSquarePlus className="w-4 h-4 text-saffron" />
              <span>Submit Citizen Feedback</span>
            </div>
            {feedbackSent ? (
              <div className="py-6 text-center space-y-2">
                <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-emerald-800">
                  Thank you! Your feedback has been recorded.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                <textarea
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share your thoughts on the valuation portal or suggestions..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-navy-700 bg-slate-50"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-navy-800 hover:bg-navy-900 text-white rounded text-xs font-bold transition shadow-sm"
                >
                  Send Feedback
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Official Calendar Modal */}
      {activeModal === 'calendar' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white text-slate-800 rounded-lg p-5 max-w-xs w-full shadow-2xl border-t-4 border-navy-700 space-y-3 relative animate-fadeIn text-center">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
            <CalendarIcon className="w-8 h-8 text-navy-700 mx-auto" />
            <h4 className="font-bold text-navy-900 text-sm">Official Working Calendar</h4>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-800">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-[11px] text-slate-500">Working Hours: 09:00 AM – 06:00 PM IST</p>
            </div>
            <p className="text-[10px] text-slate-500">
              Department offices are open Monday to Saturday (closed on 2nd/4th Saturdays & Gazetted Holidays).
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default FloatingIconDock;
