import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, ChevronDown, Star } from 'lucide-react';
import { RESTAURANTS } from '../data/mockData';
import { BottomNavBar } from './BottomNavBar';

const CATEGORY_EMOJIS = [
  { label: 'Meal Prep', emoji: '🥗' },
  { label: 'Healthy', emoji: '🥦' },
  { label: 'Protein', emoji: '🍗' },
  { label: 'Bento', emoji: '🍱' },
  { label: 'Wraps', emoji: '🌯' },
];

export function HomeScreen() {
  const { navigate, setActiveTab, setSelectedRestaurant, cart, setShowAISearch } = useApp();
  const totalItems = cart.reduce((s, c) => s + c.quantity, 0);

  const featuredRestaurants = RESTAURANTS.slice(0, 2);
  const suggestedRestaurants = RESTAURANTS.slice(2, 4);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-2 pb-2">
        <button className="flex items-center gap-1">
          <span className="text-[15px] font-semibold">88 Arkansas St</span>
          <ChevronDown size={14} />
        </button>
        <div className="flex items-center gap-3">
          <button><Bell size={22} /></button>
        </div>
      </div>

      {/* Main tab nav */}
      <div className="flex overflow-x-auto px-4 gap-2 pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'All', emoji: '🏠' },
          { id: 'rides', label: 'Rides', emoji: '🚗' },
          { id: 'packaged-meals', label: 'Packaged meals', emoji: '📦' },
          { id: 'grocery', label: 'Grocery', emoji: '🛒' },
          { id: 'convenience', label: 'Convenience', emoji: '🏪' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === 'packaged-meals') {
                setActiveTab('packaged-meals');
                navigate('packaged-meals');
              }
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[13px] whitespace-nowrap border transition-all ${
              tab.id === 'all'
                ? 'bg-black text-white border-black'
                : 'border-gray-200 text-gray-700 bg-white'
            }`}
          >
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Food categories */}
        <div className="flex overflow-x-auto px-4 gap-4 pb-4 pt-2 scrollbar-none">
          {CATEGORY_EMOJIS.map(cat => (
            <button key={cat.label} className="flex flex-col items-center gap-1 min-w-[52px]">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                {cat.emoji}
              </div>
              <span className="text-[11px] text-gray-700 text-center leading-tight">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Filter pills */}
        <div className="flex overflow-x-auto px-4 gap-2 pb-4 scrollbar-none">
          {['🚶 Pickup', '❤️ Offers', 'Delivery fee ↓', 'Uber One'].map(f => (
            <button key={f} className="px-3 py-1.5 rounded-full border border-gray-300 text-[13px] whitespace-nowrap text-gray-700 bg-white">
              {f}
            </button>
          ))}
        </div>

        {/* Featured section */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-[17px]">Featured on Uber Eats</span>
            <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center">
              <span className="text-sm">→</span>
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-none">
            {featuredRestaurants.map(r => (
              <button
                key={r.id}
                className="min-w-[160px] text-left"
                onClick={() => { setSelectedRestaurant(r); navigate('restaurant'); }}
              >
                <div className="relative rounded-xl overflow-hidden h-[110px] bg-gray-100">
                  <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-[#EE2B37] text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <span>♥</span> $10 off $25+
                  </div>
                </div>
                <div className="mt-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold">{r.name}</span>
                    <span className="text-gray-400 text-[13px]">♡</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-gray-500">
                    <span>⭐</span>
                    <span>{r.rating} ({r.reviews}+)</span>
                    <span>·</span>
                    <span>{r.time}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Packaged meals promo banner */}
        <div className="mx-4 mb-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-4">
          <div className="flex items-start gap-3">
            <span className="text-3xl">📦</span>
            <div className="flex-1">
              <div className="text-[14px] font-semibold text-gray-900">New: Packaged Meals</div>
              <div className="text-[12px] text-gray-600 mt-0.5">Healthy, ready-to-eat meals delivered fresh. Three-day ready options available.</div>
              <button
                className="mt-2 bg-black text-white text-[12px] px-3 py-1.5 rounded-full"
                onClick={() => { setActiveTab('packaged-meals'); navigate('packaged-meals'); }}
              >
                Explore now →
              </button>
            </div>
          </div>
        </div>

        {/* Places you might like */}
        <div className="px-4 pb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-[17px]">Places you might like</span>
            <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center">
              <span className="text-sm">→</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {suggestedRestaurants.map(r => (
              <button
                key={r.id}
                className="text-left rounded-xl overflow-hidden"
                onClick={() => { setSelectedRestaurant(r); navigate('restaurant'); }}
              >
                <div className="relative h-[90px] bg-gray-100">
                  <img src={r.cardImage} alt={r.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-[#EE2B37] text-white text-[10px] px-1.5 py-0.5 rounded">
                    Buy 1, get 1
                  </div>
                </div>
                <div className="pt-1">
                  <div className="text-[12px] font-semibold truncate">{r.name}</div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500">
                    <span>⭐</span>
                    <span>{r.rating} ({r.reviews}+)</span>
                    <span>·</span>
                    <span>{r.time}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <BottomNavBar activeTab="home" />
    </div>
  );
}