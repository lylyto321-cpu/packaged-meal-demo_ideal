import React, { useState, useRef, useEffect } from 'react';
import { X, Search, Clock, TrendingUp, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RESTAURANTS } from '../data/mockData';

const TRENDING = [
  'Grilled Salmon & Quinoa',
  'Turkey Avocado Club',
  'Keto Egg & Veggie Scramble',
  'Ancient Grain Bowl',
  'Beef & Broccoli Bowl',
];

const CATEGORIES = [
  { label: 'Healthy', emoji: '🥗' },
  { label: 'High Protein', emoji: '💪' },
  { label: 'Low Carb', emoji: '🥑' },
  { label: 'Meal Prep', emoji: '📦' },
  { label: 'Sandwiches', emoji: '🥪' },
  { label: 'Bowls', emoji: '🍜' },
];

export function SearchSheet() {
  const { setShowSearch, setSelectedRestaurant, setSelectedMeal, navigate } = useApp();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 150);
  }, []);

  // Live search results
  const results = query.trim().length > 1
    ? RESTAURANTS.flatMap(r =>
        r.meals
          .filter(m => m.name.toLowerCase().includes(query.toLowerCase()) || r.name.toLowerCase().includes(query.toLowerCase()))
          .map(m => ({ restaurant: r, meal: m }))
      ).slice(0, 6)
    : [];

  const handleMealSelect = (restaurantId: string, mealId: string) => {
    const restaurant = RESTAURANTS.find(r => r.id === restaurantId)!;
    const meal = restaurant.meals.find(m => m.id === mealId)!;
    setSelectedRestaurant(restaurant);
    setSelectedMeal(meal);
    setShowSearch(false);
    navigate('meal');
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col">
      {/* Backdrop */}
      <div className="flex-1 bg-black/40" onClick={() => setShowSearch(false)} />

      {/* Sheet */}
      <div className="bg-white rounded-t-3xl flex flex-col overflow-hidden" style={{ maxHeight: '88%' }}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Search input */}
        <div className="px-4 pt-2 pb-3 flex-shrink-0">
          <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-4 py-3">
            <Search size={17} className="text-gray-400 flex-shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search meals, restaurants…"
              className="flex-1 bg-transparent text-[15px] outline-none text-gray-800 placeholder-gray-400"
            />
            {query ? (
              <button onClick={() => setQuery('')}>
                <X size={16} className="text-gray-400" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6">
          {/* Live results */}
          {results.length > 0 && (
            <div className="mb-5">
              <div className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide mb-3">Results</div>
              <div className="space-y-2">
                {results.map(({ restaurant, meal }) => (
                  <button
                    key={`${restaurant.id}-${meal.id}`}
                    className="w-full flex items-center gap-3 py-2 text-left"
                    onClick={() => handleMealSelect(restaurant.id, meal.id)}
                  >
                    <img src={meal.image} alt={meal.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-semibold truncate">{meal.name}</div>
                      <div className="text-[12px] text-gray-500">{restaurant.name} · ${meal.price.toFixed(2)}</div>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {query.trim().length > 1 && results.length === 0 && (
            <div className="py-8 text-center">
              <div className="text-4xl mb-2">🔍</div>
              <div className="text-[15px] font-semibold text-gray-700">No results for "{query}"</div>
              <div className="text-[13px] text-gray-400 mt-1">Try a different keyword</div>
            </div>
          )}

          {/* Default state */}
          {query.trim().length <= 1 && (
            <>
              {/* Categories */}
              <div className="mb-5">
                <div className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide mb-3">Browse</div>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.label}
                      className="flex flex-col items-center justify-center gap-1.5 bg-gray-50 rounded-2xl py-4 active:bg-gray-100"
                    >
                      <span className="text-2xl">{cat.emoji}</span>
                      <span className="text-[12px] font-medium text-gray-700">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending */}
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <TrendingUp size={14} className="text-gray-400" />
                  <span className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide">Trending</span>
                </div>
                <div className="space-y-0">
                  {TRENDING.map((item, i) => (
                    <button
                      key={item}
                      className="w-full flex items-center gap-3 py-3 border-b border-gray-50 last:border-0 text-left"
                    >
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Clock size={13} className="text-gray-400" />
                      </div>
                      <span className="flex-1 text-[14px] text-gray-800">{item}</span>
                      <ChevronRight size={15} className="text-gray-300 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
