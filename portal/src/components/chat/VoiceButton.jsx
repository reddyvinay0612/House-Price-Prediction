import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';

export function VoiceButton({ onTranscript, language = 'en', disabled = false }) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        if (text && onTranscript) {
          onTranscript(text);
        }
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Speech recognition initialization error', err);
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language, onTranscript]);

  const toggleListening = () => {
    if (!isSupported) {
      alert('Voice recognition is not supported on this browser. Please use keyboard text input.');
      return;
    }
    if (disabled) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
          recognitionRef.current.start();
        }
      } catch (e) {
        console.warn('Failed to start speech recognition', e);
        setIsListening(false);
      }
    }
  };

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={toggleListening}
      disabled={disabled}
      title={isListening ? 'Stop voice recording' : 'Speak message (Voice Input)'}
      aria-label={isListening ? 'Stop voice recording' : 'Speak message (Voice Input)'}
      className={`p-2 rounded-md transition flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-navy-600 ${
        isListening
          ? 'bg-red-500 text-white animate-pulse shadow-md'
          : 'text-slate-500 hover:text-navy-900 hover:bg-slate-200/70'
      }`}
    >
      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
    </button>
  );
}

export default VoiceButton;
