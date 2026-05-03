import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, SlidersHorizontal, Star } from 'lucide-react';
import { RESTAURANTS, SECTIONS, FilterTag, MIX_MATCH_GROUPS } from '../data/mockData';
import { BottomNavBar } from './BottomNavBar';

const FILTERS: { id: FilterTag | 'all'; label: string; color?: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'three-day-ready', label: 'Three-day ready', color: '#B8860B' },
  { id: 'mix-match', label: 'Mix and match' },
  { id: 'healthy', label: 'Healthy' },
  { id: 'protein', label: 'Protein' },
  { id: 'low-carb', label: 'Low carb' },
  { id: 'low-calories', label: 'Low calories' },
];

export function PackagedMealsScreen() {
  const { navigate, goBack, selectedFilter, setSelectedFilter, setSelectedRestaurant, cart, setShowPreferences, setShowAISearch } = useApp();
  const totalItems = cart.reduce((s, c) => s + c.quantity, 0);

  const filteredRestaurants = selectedFilter === 'all'
    ? RESTAURANTS
    : RESTAURANTS.filter(r => r.tags.includes(selectedFilter as FilterTag));

  const visibleSections = SECTIONS.filter(s =>
    filteredRestaurants.some(r => r.section === s.key)
  );

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-2 pb-2">
        <div className="flex items-center gap-2">
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[15px] font-semibold">88 Arkansas St</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowPreferences(true)} className="relative">
            <SlidersHorizontal size={22} />
          </button>
          <button><Bell size={22} /></button>
        </div>
      </div>

      {/* Tab nav — Packaged meals active */}
      <div className="flex overflow-x-auto px-4 gap-2 pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'All', emoji: '🏠' },
          { id: 'rides', label: 'Rides', emoji: '🚗' },
          { id: 'packaged-meals', label: 'Packaged meals', emoji: '📦', active: true },
          { id: 'grocery', label: 'Grocery', emoji: '🛒' },
          { id: 'convenience', label: 'Convenience', emoji: '🏪' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { if (tab.id === 'all') goBack(); }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[13px] whitespace-nowrap border transition-all ${
              tab.active
                ? 'bg-black text-white border-black'
                : 'border-gray-200 text-gray-700 bg-white'
            }`}
          >
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex overflow-x-auto px-4 gap-2 pb-3 scrollbar-none">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setSelectedFilter(f.id)}
            className={`px-3 py-1 rounded-lg text-[12px] whitespace-nowrap transition-all ${
              selectedFilter === f.id
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
            style={{
              color: selectedFilter === f.id ? 'white' : f.color || undefined,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Mix and match subtitle */}
      {selectedFilter === 'mix-match' && (
        <div className="mx-4 mb-2 px-1">
          <span className="text-gray-400 text-[13px]">Order from restaurants en route, save delivery fee</span>
        </div>
      )}

      {/* Three-day ready subtitle */}
      {selectedFilter === 'three-day-ready' && (
        <div className="mx-4 mb-2 px-1">
          <span className="text-gray-400 text-[13px]">Refrigerator safe for three days.</span>
        </div>
      )}

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {selectedFilter === 'mix-match' ? (
          MIX_MATCH_GROUPS.map(group => {
            const groupRestaurants = group.restaurantIds
              .map(id => RESTAURANTS.find(r => r.id === id))
              .filter(Boolean) as typeof RESTAURANTS;
            return (
              <div key={group.title} className="px-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-[15px] leading-tight pr-4">{group.title}</span>
                  <button className="w-7 h-7 flex-shrink-0 rounded-full border border-gray-200 flex items-center justify-center text-sm">→</button>
                </div>
                <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
                  {groupRestaurants.map(r => (
                    <button
                      key={r.id}
                      className="min-w-[165px] text-left flex-shrink-0"
                      onClick={() => { setSelectedRestaurant(r); navigate('restaurant'); }}
                    >
                      <div className="relative rounded-xl overflow-hidden h-[115px] bg-gray-100">
                        <img src={r.cardImage} alt={r.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="mt-2">
                        <div className="text-[13px] font-semibold truncate">{r.name}</div>
                        <div className="mt-0.5">
                          {r.tags.includes('three-day-ready') ? (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full">
                              🥗 Three-Day Ready
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                              📦 Packaged Meals
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                          <Star size={10} className="fill-gray-500 text-gray-500" />
                          <span>{r.rating}</span>
                          <span>({r.reviews}+)</span>
                          <span>·</span>
                          <span>{r.distance}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <>
            {visibleSections.map(section => {
              const sectionRestaurants = filteredRestaurants.filter(r => r.section === section.key);
              if (sectionRestaurants.length === 0) return null;
              return (
                <div key={section.key} className="px-4 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-[16px]">{section.label}</span>
                    <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-sm">→</button>
                  </div>
                  <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
                    {sectionRestaurants.map(r => (
                       <button
                         key={r.id}
                         className="min-w-[165px] text-left flex-shrink-0"
                         onClick={() => { setSelectedRestaurant(r); navigate('restaurant'); }}
                       >
                         <div className="relative rounded-xl overflow-hidden h-[115px] bg-gray-100">
                           <img src={r.cardImage} alt={r.name} className="w-full h-full object-cover" />
                         </div>
                         <div className="mt-2">
                           <div className="text-[13px] font-semibold truncate">{r.name}</div>
                           <div className="mt-0.5">
                             {r.tags.includes('three-day-ready') ? (
                               <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full">
                                 🥗 Three-Day Ready
                               </span>
                             ) : (
                               <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                                 📦 Packaged Meals
                               </span>
                             )}
                           </div>
                           <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                             <Star size={10} className="fill-gray-500 text-gray-500" />
                             <span>{r.rating}</span>
                             <span>({r.reviews}+)</span>
                           </div>
                         </div>
                       </button>
                     ))}
                  </div>
                </div>
              );
            })}

            {filteredRestaurants.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                <span className="text-5xl mb-4">🍽️</span>
                <div className="text-[15px] font-semibold text-gray-700">No restaurants found</div>
                <div className="text-[13px] text-gray-500 mt-1">Try a different filter</div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom nav */}
      <BottomNavBar />
    </div>
  );
}