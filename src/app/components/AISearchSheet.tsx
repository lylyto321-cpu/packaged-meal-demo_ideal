import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Mic, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RESTAURANTS } from '../data/mockData';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  action?: 'filter' | 'cart';
}

const AI_RESPONSES: Array<{
  triggers: string[];
  response: string;
  action?: { type: 'filter'; filter: string } | { type: 'cart' };
}> = [
  {
    triggers: ['healthy', 'health', 'nutritious', 'clean'],
    response: "I've filtered the restaurant list to show you our healthiest options — low-calorie, nutrient-rich meals. You'll find fresh bowls, salads, and lean protein options! 🥗",
    action: { type: 'filter', filter: 'healthy' },
  },
  {
    triggers: ['protein', 'muscle', 'gains', 'high protein', 'workout'],
    response: "Switching to high-protein restaurants for you! These meals have 30g+ of protein per serving — perfect for fueling your workouts. 💪",
    action: { type: 'filter', filter: 'protein' },
  },
  {
    triggers: ['low carb', 'keto', 'no carb', 'carb free'],
    response: "Showing you our low-carb and keto-friendly meals. Great choices for keeping energy stable throughout the day! 🥑",
    action: { type: 'filter', filter: 'low-carb' },
  },
  {
    triggers: ['low calorie', 'calories', 'diet', 'light'],
    response: "Here are our lowest-calorie options — all under 400 cal per meal, so you can eat well without compromise. 🌿",
    action: { type: 'filter', filter: 'low-calories' },
  },
  {
    triggers: ['3 day', 'three day', 'three-day', 'prep', 'meal prep', 'ready'],
    response: "Showing you three-day ready meals — ordered fresh today, stays good for 3 days. Perfect for weekly meal planning! 📦",
    action: { type: 'filter', filter: 'three-day-ready' },
  },
  {
    triggers: ['mix', 'match', 'route', 'multiple'],
    response: "Switching to Mix & Match mode. Order from multiple restaurants on the same delivery route — no extra fee! 🔀",
    action: { type: 'filter', filter: 'mix-match' },
  },
  {
    triggers: ['pick', 'choose', 'select', 'add', 'meal', 'breakfast', 'lunch', 'dinner', 'week'],
    response: "On it! I'm picking meals for you based on your preferences. Added a balanced mix of protein bowls, healthy mains, and a couple of breakfasts to your cart. No fried food included! 🎯",
    action: { type: 'cart' },
  },
];

const QUICK_PROMPTS = [
  'Show me healthy options 🥗',
  'High protein meals 💪',
  'Pick 5 meals for this week 📦',
  'Low calorie options 🌿',
  'Three-day ready meals 📅',
];

export function AISearchSheet() {
  const { setShowAISearch, setSelectedFilter, navigate, addToCart, aiMessages, addAIMessage } = useApp();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, isTyping]);

  const handleSend = (text?: string) => {
    const msg = text ?? input;
    if (!msg.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: msg };
    addAIMessage(userMsg);
    setInput('');
    setIsTyping(true);

    // Find matching response
    const lower = msg.toLowerCase();
    const match = AI_RESPONSES.find(r => r.triggers.some(t => lower.includes(t)));

    setTimeout(() => {
      setIsTyping(false);

      if (match) {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          text: match.response,
        };
        addAIMessage(aiMsg);

        if (match.action?.type === 'filter') {
          setSelectedFilter(match.action.filter);
          navigate('packaged-meals');
        } else if (match.action?.type === 'cart') {
          // Add AI-selected meals to cart
          const aiMeals = [
            { restaurant: RESTAURANTS[4], meal: RESTAURANTS[4].meals[0] }, // FitMeals SF - Salmon
            { restaurant: RESTAURANTS[4], meal: RESTAURANTS[4].meals[1] }, // FitMeals SF - Chicken
            { restaurant: RESTAURANTS[6], meal: RESTAURANTS[6].meals[0] }, // Meal Prep Co - Keto scramble
            { restaurant: RESTAURANTS[5], meal: RESTAURANTS[5].meals[0] }, // Macro Kitchen - Beef
            { restaurant: RESTAURANTS[6], meal: RESTAURANTS[6].meals[1] }, // Meal Prep Co - Med Chicken
            { restaurant: RESTAURANTS[7], meal: RESTAURANTS[7].meals[1] }, // Daily Kitchen - Acai
            { restaurant: RESTAURANTS[6], meal: RESTAURANTS[6].meals[0] }, // Meal Prep Co - Keto (breakfast)
          ];
          aiMeals.forEach(({ restaurant, meal }) => {
            addToCart({
              restaurantId: restaurant.id,
              restaurantName: restaurant.name,
              meal,
              quantity: 1,
              type: restaurant.isThreeDayReady ? 'three-day-ready' : 'packaged',
              addedByAI: true,
            });
          });
          navigate('cart');
        }
      } else {
        addAIMessage({
          id: (Date.now() + 1).toString(),
          role: 'ai',
          text: "I can help you find meals! Try asking me to show healthy options, pick meals for the week, or filter by protein, low-carb, or low-calorie. What sounds good? 😊",
        });
      }
    }, 1000 + Math.random() * 500);
  };

  const handleMic = () => {
    setMicActive(true);
    setTimeout(() => {
      setMicActive(false);
      // Simulate voice input
      const voiceTexts = [
        "Show me healthy food",
        "Pick 5 meals for the week",
        "High protein options",
      ];
      const picked = voiceTexts[Math.floor(Math.random() * voiceTexts.length)];
      setInput(picked);
    }, 2000);
  };

  const hasMessages = aiMessages.length > 0;

  return (
    <div className="absolute inset-0 z-50 flex flex-col">
      {/* Backdrop */}
      <div
        className="flex-1 bg-black/40"
        onClick={() => setShowAISearch(false)}
      />

      {/* Sheet */}
      <div className="bg-white rounded-t-3xl overflow-hidden flex flex-col"
        style={{ maxHeight: '85%' }}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 pt-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#06C167] to-teal-400 flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <div className="text-[15px] font-bold">AI Food Assistant</div>
              <div className="text-[11px] text-[#06C167] font-medium">● Online</div>
            </div>
          </div>
          <button
            onClick={() => setShowAISearch(false)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 min-h-[200px] max-h-[320px]">
          {/* Welcome */}
          {!hasMessages && (
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#06C167] to-teal-400 flex items-center justify-center flex-shrink-0">
                <Sparkles size={12} className="text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-3 py-2.5 max-w-[85%]">
                <div className="text-[13px] text-gray-800 leading-relaxed">
                  Hi! I can help you discover meals, build a weekly meal plan, or filter by your dietary needs. What are you looking for? 🍽️
                </div>
              </div>
            </div>
          )}

          {aiMessages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {msg.role === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#06C167] to-teal-400 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={12} className="text-white" />
                </div>
              )}
              <div
                className={`rounded-2xl px-3 py-2.5 max-w-[85%] ${
                  msg.role === 'user'
                    ? 'bg-black text-white rounded-tr-sm'
                    : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                }`}
              >
                <div className="text-[13px] leading-relaxed">{msg.text}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#06C167] to-teal-400 flex items-center justify-center flex-shrink-0">
                <Sparkles size={12} className="text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1 items-center">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompts */}
        {!hasMessages && (
          <div className="px-4 pb-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
              {QUICK_PROMPTS.map(p => (
                <button
                  key={p}
                  onClick={() => handleSend(p)}
                  className="flex-shrink-0 bg-gray-100 rounded-full px-3 py-1.5 text-[12px] text-gray-700 whitespace-nowrap"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-4 pb-5 pt-2 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-2.5">
            <button
              onClick={handleMic}
              className={`flex-shrink-0 transition-all ${micActive ? 'text-red-500 animate-pulse' : 'text-gray-500'}`}
            >
              <Mic size={18} />
            </button>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={micActive ? 'Listening...' : 'Ask me anything about food...'}
              className="flex-1 bg-transparent text-[14px] outline-none text-gray-800 placeholder-gray-400"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                input.trim() ? 'bg-black text-white' : 'bg-gray-300 text-gray-500'
              }`}
            >
              <Send size={13} />
            </button>
          </div>
          <div className="text-center text-[11px] text-gray-400 mt-2">
            Powered by AI · Results are demo only
          </div>
        </div>
      </div>
    </div>
  );
}