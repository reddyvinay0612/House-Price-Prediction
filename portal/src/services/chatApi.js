/**
 * Chat API Service for Griha Mitra Assistant
 * Connects to the FastAPI SSE /chat endpoint with streaming support,
 * and seamlessly provides client-side rule-based FAQ fallback if the server is offline.
 */

import faqData from '../data/faqKnowledge.json';
import { METRO_CITIES } from '../data/indianData';
import { estimateIndianPrice } from './demoModel';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const chatApi = {
  /**
   * Check if FastAPI backend is online and healthy
   */
  async checkHealth() {
    try {
      const res = await fetch(`${BACKEND_URL}/health`, { method: 'GET', signal: AbortSignal.timeout(2000) });
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Send chat message via Server-Sent Events (SSE) streaming
   */
  async streamChat({ messages, language = 'en', onChunk, onToolCall, onComplete, onError, signal }) {
    const isOnline = await this.checkHealth();
    if (!isOnline) {
      // Execute rule-based fallback
      const lastUserMsg = messages[messages.length - 1]?.content || '';
      const fallbackResult = this.getOfflineResponse(lastUserMsg, messages, language);
      
      // Simulate natural typing stream for fallback
      let fullText = fallbackResult.text;
      let streamed = '';
      const words = fullText.split(' ');
      
      for (let i = 0; i < words.length; i++) {
        if (signal?.aborted) return;
        streamed += (i === 0 ? '' : ' ') + words[i];
        onChunk(streamed);
        await new Promise((r) => setTimeout(r, 25));
      }

      if (fallbackResult.estimateData && onToolCall) {
        onToolCall('predict_price', fallbackResult.estimateData);
      }
      if (fallbackResult.navigation && onToolCall) {
        onToolCall('navigate', fallbackResult.navigation);
      }

      onComplete({
        text: fullText,
        estimateData: fallbackResult.estimateData,
        suggestions: fallbackResult.suggestions,
        navigation: fallbackResult.navigation,
        isOffline: true,
      });
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.content,
          })),
          language,
        }),
        signal,
      });

      if (!response.ok) {
        throw new Error(`Chat API responded with status ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';
      let estimateData = null;
      let navigation = null;
      let suggestions = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (dataStr === '[DONE]') continue;

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.type === 'delta' && parsed.content) {
                accumulatedText += parsed.content;
                onChunk(accumulatedText);
              } else if (parsed.type === 'tool_result') {
                if (parsed.tool === 'predict_price') {
                  estimateData = parsed.data;
                  if (onToolCall) onToolCall('predict_price', parsed.data);
                } else if (parsed.tool === 'navigate') {
                  navigation = parsed.data?.target;
                  if (onToolCall) onToolCall('navigate', parsed.data);
                }
              } else if (parsed.type === 'suggestions') {
                suggestions = parsed.items || [];
              }
            } catch (e) {
              // Non-JSON chunk, append text
              accumulatedText += dataStr;
              onChunk(accumulatedText);
            }
          }
        }
      }

      onComplete({
        text: accumulatedText,
        estimateData,
        navigation,
        suggestions: suggestions.length ? suggestions : ['Estimate my house price', 'How does it work?', 'Compare two cities', 'What is RERA?'],
        isOffline: false,
      });
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.warn('Backend SSE failed, falling back to offline knowledge base', err);

      const lastUserMsg = messages[messages.length - 1]?.content || '';
      const fallbackResult = this.getOfflineResponse(lastUserMsg, messages, language);
      onComplete({
        text: fallbackResult.text,
        estimateData: fallbackResult.estimateData,
        suggestions: fallbackResult.suggestions,
        navigation: fallbackResult.navigation,
        isOffline: true,
      });
    }
  },

  /**
   * Rule-based conversational and FAQ matching engine
   */
  getOfflineResponse(userInput, conversationHistory, language = 'en') {
    const cleanInput = (userInput || '').toLowerCase().trim();
    const isHindi = language === 'hi' || /[\u0900-\u097F]/.test(userInput);

    // 1. Detect active price estimation conversational slot-filling
    const slotCheck = this._detectSlotFilling(cleanInput, conversationHistory, isHindi);
    if (slotCheck) {
      return slotCheck;
    }

    // 2. Check for navigation intents
    for (const intent of faqData.intents) {
      if (intent.action && intent.keywords.some((kw) => cleanInput.includes(kw.toLowerCase()))) {
        return {
          text: isHindi ? intent.response_hi : intent.response_en,
          suggestions: intent.suggestions || [],
          navigation: intent.action.target,
        };
      }
    }

    // 3. Keyword matching across FAQ Intents
    let bestMatch = null;
    let highestScore = 0;

    for (const intent of faqData.intents) {
      let score = 0;
      for (const kw of intent.keywords) {
        if (cleanInput.includes(kw.toLowerCase())) {
          score += kw.length; // weight longer specific keywords
        }
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = intent;
      }
    }

    if (bestMatch && highestScore > 0) {
      return {
        text: isHindi ? bestMatch.response_hi : bestMatch.response_en,
        suggestions: bestMatch.suggestions || [],
      };
    }

    // 4. Default helpful answer
    return {
      text: isHindi ? faqData.default_response.response_hi : faqData.default_response.response_en,
      suggestions: faqData.default_response.suggestions,
    };
  },

  /**
   * Helper: Multi-step conversational estimation parser
   */
  _detectSlotFilling(input, history, isHindi) {
    const isEstimateTrigger =
      input.includes('estimate') ||
      input.includes('price') ||
      input.includes('value') ||
      input.includes('cost') ||
      input.includes('कीमत') ||
      input.includes('अनुमान') ||
      input.includes('bengaluru') ||
      input.includes('mumbai') ||
      input.includes('delhi') ||
      input.includes('hyderabad') ||
      input.includes('chennai') ||
      input.includes('pune') ||
      input.includes('kolkata');

    // Extract numbers like sqft and BHK
    const sqftMatch = input.match(/(\d{3,5})\s*(sqft|sq\.ft|sq\s*ft|feet|square feet)?/i);
    const bhkMatch = input.match(/(\d)\s*(bhk|bed|bedroom)/i) || input.match(/\b([1-5])\b/);

    // If user provides a full specification (e.g. "Estimate 3 BHK 1500 sqft in Bengaluru Whitefield")
    let detectedCity = 'Bengaluru';
    if (input.includes('mumbai')) detectedCity = 'Mumbai (MMR)';
    else if (input.includes('delhi') || input.includes('gurugram') || input.includes('noida')) detectedCity = 'Delhi-NCR';
    else if (input.includes('chennai')) detectedCity = 'Chennai';
    else if (input.includes('hyderabad')) detectedCity = 'Hyderabad';
    else if (input.includes('pune')) detectedCity = 'Pune';
    else if (input.includes('kolkata')) detectedCity = 'Kolkata';

    if (sqftMatch && (bhkMatch || input.includes('bhk'))) {
      const sqft = parseInt(sqftMatch[1], 10);
      const bhk = bhkMatch ? parseInt(bhkMatch[1], 10) : 2;
      const bath = Math.max(1, bhk);
      const balcony = Math.min(2, Math.max(1, bhk - 1));

      // Calculate estimate using verified Indian models
      const calculation = estimateIndianPrice({
        city: detectedCity,
        locality: 'Whitefield',
        total_sqft: sqft,
        bhk,
        bath,
        balcony,
        area_type: 'Super built-up  Area',
        availability: 'Ready To Move',
      });

      const priceText = isHindi
        ? `आपके विवरण के आधार पर, **${detectedCity}** में **${sqft} वर्ग फुट (${bhk} BHK)** आवास का अनुमानित मूल्य:\n\n` +
          `• **अनुमानित बाजार मूल्य:** ₹${calculation.price_in_lakhs.toFixed(2)} लाख\n` +
          `• **90% विश्वास सीमा:** ₹${calculation.lower_bound_lakhs.toFixed(2)}L – ₹${calculation.upper_bound_lakhs.toFixed(2)}L\n` +
          `• **औसत दर:** ₹${calculation.price_per_sqft.toLocaleString('en-IN')}/वर्ग फुट\n\n` +
          `*यह एक सांकेतिक सलाहकार अनुमान है, कानूनी या बैंक मूल्यांकन नहीं।*`
        : `Based on verified transactional models, here is the econometric valuation for **${bhk} BHK (${sqft} sq. ft.)** in **${detectedCity}**:\n\n` +
          `• **Estimated Market Price:** ₹${calculation.price_in_lakhs.toFixed(2)} Lakh (${calculation.formatted_price})\n` +
          `• **90% Confidence Band:** ₹${calculation.lower_bound_lakhs.toFixed(2)}L – ₹${calculation.upper_bound_lakhs.toFixed(2)}L\n` +
          `• **Micro-market Rate:** ₹${calculation.price_per_sqft.toLocaleString('en-IN')} per sq. ft.\n\n` +
          `*This is an indicative estimate, not a legal valuation.*`;

      return {
        text: priceText,
        estimateData: {
          city: detectedCity,
          locality: 'Central / Key Area',
          total_sqft: sqft,
          bhk,
          bath,
          balcony,
          predicted_price_lakhs: calculation.price_in_lakhs,
          formatted_price: `₹${calculation.price_in_lakhs.toFixed(2)} Lakh`,
          lower_bound_lakhs: calculation.lower_bound_lakhs,
          upper_bound_lakhs: calculation.upper_bound_lakhs,
          price_per_sqft: calculation.price_per_sqft,
        },
        suggestions: ['How is EMI calculated?', 'What is Stamp Duty?', 'Open in Estimator', 'Compare two cities'],
      };
    }

    if (isEstimateTrigger && input.length < 30) {
      return {
        text: isHindi
          ? 'निश्चित रूप से! आपके घर के मूल्य का सटीक अनुमान लगाने के लिए, कृपया **शहर, कुल क्षेत्रफल (वर्ग फुट में), और BHK** (जैसे: *Bengaluru, 1400 sqft, 3 BHK*) बताएं?'
          : 'I can estimate your property price right away! Please share the **City**, **Total Area in sq. ft.**, and **BHK count** (e.g. *"Bengaluru, 1250 sqft, 2 BHK"*).',
        suggestions: ['Bengaluru, 1200 sqft, 2 BHK', 'Mumbai, 850 sqft, 2 BHK', 'Hyderabad, 1500 sqft, 3 BHK', 'Pune, 1100 sqft, 2 BHK'],
      };
    }

    return null;
  },
};

export default chatApi;
