import React, { useState } from 'react';
import {
  Copy,
  Check,
  Volume2,
  VolumeX,
  ThumbsUp,
  ThumbsDown,
  Building,
  User,
} from 'lucide-react';
import PriceResultCard from './PriceResultCard';

/**
 * Safe markdown parser for bullet lists, bold text, italics, and lines
 */
function FormattedText({ text }) {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div className="space-y-1.5 leading-relaxed text-xs font-sans">
      {lines.map((line, idx) => {
        if (!line.trim()) {
          return <div key={idx} className="h-1" />;
        }

        // Check if list item
        const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('* ');
        const isNumbered = /^\d+\.\s/.test(line.trim());

        let cleanContent = line;
        if (isBullet) {
          cleanContent = line.replace(/^[\s•*-]+\s*/, '');
        } else if (isNumbered) {
          cleanContent = line.replace(/^\d+\.\s*/, '');
        }

        // Render inline bold formatting
        const parts = cleanContent.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

        const renderedLine = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className="font-bold text-slate-900">
                {part.slice(2, -2)}
              </strong>
            );
          }
          if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
            return (
              <em key={pIdx} className="italic text-slate-600">
                {part.slice(1, -1)}
              </em>
            );
          }
          if (part.startsWith('`') && part.endsWith('`')) {
            return (
              <code key={pIdx} className="px-1 py-0.5 rounded bg-slate-100 font-mono text-[11px] text-navy-800">
                {part.slice(1, -1)}
              </code>
            );
          }
          return part;
        });

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1">
              <span className="text-saffron font-bold">•</span>
              <div>{renderedLine}</div>
            </div>
          );
        }

        if (isNumbered) {
          const numMatch = line.match(/^(\d+)\./);
          const num = numMatch ? numMatch[1] : idx + 1;
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1">
              <span className="font-bold text-navy-800 font-mono text-[11px]">{num}.</span>
              <div>{renderedLine}</div>
            </div>
          );
        }

        return <p key={idx}>{renderedLine}</p>;
      })}
    </div>
  );
}

export function MessageBubble({ message, onFeedback, language = 'en' }) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [feedback, setFeedback] = useState(message.feedback || null);

  const isUser = message.sender === 'user';

  // Copy to clipboard
  const handleCopy = () => {
    if (message.content) {
      navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Text to Speech
  const handleSpeak = () => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const cleanText = message.content.replace(/[*#`•]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleFeedback = (type) => {
    setFeedback(type);
    if (onFeedback) onFeedback(message.id, type);
  };

  return (
    <div className={`flex w-full mb-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] sm:max-w-[80%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Message Bubble */}
        <div
          className={`p-3 text-xs shadow-2xs rounded-[6px] relative group ${
            isUser
              ? 'bg-navy-700 text-white font-medium border border-navy-800'
              : 'bg-white text-slate-800 border border-slate-300'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <>
              <FormattedText text={message.content} />
              {message.estimateData && <PriceResultCard data={message.estimateData} />}
            </>
          )}
        </div>

        {/* Action Controls for Bot Messages */}
        {!isUser && (
          <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
            {/* Timestamp */}
            <span>
              {message.timestamp
                ? new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : ''}
            </span>

            <span className="text-slate-300">•</span>

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              title={copied ? 'Copied to clipboard' : 'Copy message text'}
              aria-label="Copy message text"
              className="p-1 hover:text-navy-900 rounded transition"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            </button>

            {/* Read Aloud Button */}
            <button
              type="button"
              onClick={handleSpeak}
              title={isSpeaking ? 'Stop speech' : 'Read message aloud'}
              aria-label="Read message aloud"
              className={`p-1 rounded transition ${
                isSpeaking ? 'text-navy-900 font-bold' : 'hover:text-navy-900'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-3 h-3 text-red-500" /> : <Volume2 className="w-3 h-3" />}
            </button>

            <span className="text-slate-300">•</span>

            {/* Feedback Thumbs */}
            <button
              type="button"
              onClick={() => handleFeedback('up')}
              title="Helpful response"
              aria-label="Helpful response"
              className={`p-1 rounded transition ${
                feedback === 'up' ? 'text-emerald-700 font-bold' : 'hover:text-slate-700'
              }`}
            >
              <ThumbsUp className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => handleFeedback('down')}
              title="Not helpful"
              aria-label="Not helpful"
              className={`p-1 rounded transition ${
                feedback === 'down' ? 'text-red-600 font-bold' : 'hover:text-slate-700'
              }`}
            >
              <ThumbsDown className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
