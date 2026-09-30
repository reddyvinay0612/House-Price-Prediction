import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import chatApi from '../services/chatApi';

const STORAGE_KEY = 'griha_mitra_chat_v2';
const MAX_STORED_MESSAGES = 20;

const DEFAULT_SUGGESTIONS = [
  'Estimate my house price',
  'How does the estimate work?',
  'Compare Bengaluru & Mumbai',
  'What is RERA?',
];

export function useChat(initialLanguage = 'en') {
  const navigate = useNavigate();
  const [language, setLanguage] = useState(initialLanguage);
  const [isLoading, setIsLoading] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  // Initial welcome message
  const getWelcomeMessage = useCallback((lang) => ({
    id: 'welcome-0',
    sender: 'assistant',
    content:
      lang === 'hi'
        ? 'नमस्ते! मैं **गृह मित्र** (Griha Mitra) हूँ, आपका डिजिटल आवास सहायक। मैं संपत्ति का अनुमान लगाने, रियल एस्टेट नियमों को समझाने और शहरों की तुलना करने में आपकी सहायता कर सकता हूँ। बताएं, मैं आपकी क्या मदद करूँ?'
        : 'Namaste! I am **Griha Mitra** (गृह मित्र), your AI real estate assistant from the Directorate of Housing Analytics. I can help you estimate house prices, understand RERA & stamp duty, or compare cities & districts. How may I assist you today?',
    timestamp: new Date().toISOString(),
  }), []);

  // Initialize messages from sessionStorage
  const [messages, setMessages] = useState(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('SessionStorage read error for chat:', e);
    }
    return [getWelcomeMessage(initialLanguage)];
  });

  // Save to sessionStorage (capped to last 20 messages)
  useEffect(() => {
    try {
      const sliced = messages.slice(-MAX_STORED_MESSAGES);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sliced));
    } catch (e) {
      console.warn('SessionStorage write error for chat:', e);
    }
  }, [messages]);

  // Check health on mount
  useEffect(() => {
    chatApi.checkHealth().then((online) => {
      setIsOfflineMode(!online);
    });
  }, []);

  // Send message handler
  const sendMessage = useCallback(
    async (text) => {
      if (!text || !text.trim() || isLoading) return;

      const trimmedText = text.trim();
      setError(null);

      // Create User Message
      const userMsg = {
        id: `user-${Date.now()}`,
        sender: 'user',
        content: trimmedText,
        timestamp: new Date().toISOString(),
      };

      // Create Assistant Placeholder Message
      const botMsgId = `bot-${Date.now() + 1}`;
      const placeholderBotMsg = {
        id: botMsgId,
        sender: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...messages, userMsg];
      setMessages([...updatedMessages, placeholderBotMsg]);
      setIsLoading(true);

      // Abort previous stream if any
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        await chatApi.streamChat({
          messages: updatedMessages,
          language,
          signal: abortControllerRef.current.signal,
          onChunk: (chunkText) => {
            setMessages((prev) =>
              prev.map((msg) => (msg.id === botMsgId ? { ...msg, content: chunkText } : msg))
            );
          },
          onToolCall: (toolName, toolData) => {
            if (toolName === 'predict_price') {
              setMessages((prev) =>
                prev.map((msg) => (msg.id === botMsgId ? { ...msg, estimateData: toolData } : msg))
              );
            } else if (toolName === 'navigate' && toolData?.target) {
              setTimeout(() => {
                navigate(toolData.target);
              }, 1200);
            }
          },
          onComplete: ({ text, estimateData, suggestions: newSuggestions, navigation, isOffline }) => {
            setIsOfflineMode(Boolean(isOffline));
            if (newSuggestions && newSuggestions.length > 0) {
              setSuggestions(newSuggestions);
            }
            if (navigation) {
              setTimeout(() => navigate(navigation), 1200);
            }
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === botMsgId
                  ? {
                      ...msg,
                      content: text || msg.content,
                      estimateData: estimateData || msg.estimateData,
                    }
                  : msg
              )
            );
            setIsLoading(false);
          },
          onError: (err) => {
            console.error('Chat stream error', err);
            setError('Failed to reach assistant. Using basic knowledge base.');
            setIsLoading(false);
          },
        });
      } catch (err) {
        console.error('Error in sendMessage', err);
        setIsLoading(false);
      }
    },
    [messages, isLoading, language, navigate]
  );

  // Clear conversation
  const clearChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const resetMsg = [getWelcomeMessage(language)];
    setMessages(resetMsg);
    setSuggestions(DEFAULT_SUGGESTIONS);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(resetMsg));
    } catch (e) {
      console.warn('SessionStorage clear error', e);
    }
  }, [language, getWelcomeMessage]);

  // Record thumbs up/down feedback
  const handleFeedback = useCallback((messageId, type) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, feedback: type } : m))
    );
  }, []);

  return {
    messages,
    isLoading,
    isOfflineMode,
    suggestions,
    error,
    language,
    setLanguage,
    sendMessage,
    clearChat,
    handleFeedback,
  };
}

export default useChat;
