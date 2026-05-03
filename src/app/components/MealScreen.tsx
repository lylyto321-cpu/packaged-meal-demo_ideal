import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ChevronLeft, Flame, Zap, Leaf, Wheat } from 'lucide-react';

export function MealScreen() {
  const { selectedMeal, selectedRestaurant, goBack, navigate, addToCart } = useApp();
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedSpice, setSelectedSpice] = useState('');
  const [qty, setQty] = useState(1);

  const meal = selectedMeal;
  const restaurant = selectedRestaurant;
  if (!meal || !restaurant) return null;

  const handleAddToCart = () => {
    addToCart({
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      meal,
      quantity: qty,
      selectedStyle: selectedStyle || (meal.styles?.[0] ?? undefined),
      type: restaurant.isThreeDayReady ? 'three-day-ready' : 'packaged',
    });
    goBack();
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Hero image */}
      <div className="relative h-[240px] bg-gray-200 flex-shrink-0">
        <img src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
        <button
          onClick={goBack}
          className="absolute top-10 left-4 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow"
        >
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pt-4 pb-3">
          <h1 className="text-[22px] font-bold uppercase">{meal.name}</h1>
          <div className="text-[20px] font-bold text-[#06C167] mt-1">${meal.price.toFixed(2)}</div>
          <p className="text-[13px] text-gray-500 mt-2 leading-relaxed">{meal.description}</p>

          {/* Flavor tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {meal.flavors.map(f => (
              <span key={f} className="px-2.5 py-1 bg-gray-100 rounded-full text-[12px] text-gray-600">{f}</span>
            ))}
          </div>
        </div>

        {/* Nutrition */}
        <div className="mx-4 mb-4 bg-gray-50 rounded-2xl p-4">
          <div className="text-[14px] font-semibold mb-3">Nutrition per serving</div>
          <div className="grid grid-cols-4 gap-2">
            <div className="flex flex-col items-center bg-white rounded-xl p-2.5 shadow-sm">
              <Flame size={16} className="text-orange-500 mb-1" />
              <span className="text-[16px] font-bold">{meal.calories}</span>
              <span className="text-[10px] text-gray-500">cal</span>
            </div>
            <div className="flex flex-col items-center bg-white rounded-xl p-2.5 shadow-sm">
              <Zap size={16} className="text-blue-500 mb-1" />
              <span className="text-[16px] font-bold">{meal.protein}g</span>
              <span className="text-[10px] text-gray-500">protein</span>
            </div>
            <div className="flex flex-col items-center bg-white rounded-xl p-2.5 shadow-sm">
              <Leaf size={16} className="text-green-500 mb-1" />
              <span className="text-[16px] font-bold">{meal.fiber}g</span>
              <span className="text-[10px] text-gray-500">fiber</span>
            </div>
            <div className="flex flex-col items-center bg-white rounded-xl p-2.5 shadow-sm">
              <Wheat size={16} className="text-amber-500 mb-1" />
              <span className="text-[16px] font-bold">{meal.carbs}g</span>
              <span className="text-[10px] text-gray-500">carbs</span>
            </div>
          </div>
          <div className="mt-2 text-center text-[11px] text-gray-400">Fat: {meal.fat}g</div>
        </div>

        {/* Ingredients */}
        <div className="px-4 mb-4">
          <h3 className="text-[15px] font-bold mb-2">Ingredients</h3>
          <div className="flex flex-wrap gap-2">
            {meal.ingredients.map(ing => (
              <span key={ing} className="px-2.5 py-1 border border-gray-200 rounded-full text-[12px] text-gray-700">
                {ing}
              </span>
            ))}
          </div>
        </div>

        {/* Style selection */}
        {meal.styles && meal.styles.length > 0 && (
          <div className="mx-4 mb-4 border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-1">
              <div>
                <div className="text-[15px] font-bold">Choose your style</div>
                <div className="text-[12px] text-gray-500">Choose 1</div>
              </div>
              <span className="px-2 py-1 border border-gray-300 rounded-lg text-[12px] text-gray-600">Required</span>
            </div>
            {meal.styles.map(style => (
              <label key={style} className="flex items-center justify-between py-3 border-b border-gray-100 cursor-pointer">
                <span className="text-[14px]">{style}</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedStyle === style ? 'border-black' : 'border-gray-300'}`}>
                  {selectedStyle === style && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                </div>
                <input type="radio" className="hidden" checked={selectedStyle === style} onChange={() => setSelectedStyle(style)} />
              </label>
            ))}
          </div>
        )}

        {/* Spicy level */}
        {meal.spicyLevel && (
          <div className="mx-4 mb-4 border-t border-gray-100 pt-4">
            <div className="mb-2">
              <div className="text-[15px] font-bold">🌶️ Spicy Level</div>
              <div className="text-[12px] text-gray-500">Choose up to 1</div>
            </div>
            {['No spice', 'Mild', 'Medium', 'Hot'].map(s => (
              <label key={s} className="flex items-center justify-between py-2.5 border-b border-gray-100 cursor-pointer">
                <span className="text-[14px]">{s}</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedSpice === s ? 'border-black' : 'border-gray-300'}`}>
                  {selectedSpice === s && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                </div>
                <input type="radio" className="hidden" checked={selectedSpice === s} onChange={() => setSelectedSpice(s)} />
              </label>
            ))}
          </div>
        )}

        <div className="h-24" />
      </div>

      {/* Add to cart */}
      <div className="px-4 py-3 bg-white border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-xl font-semibold">−</button>
            <span className="text-[15px] font-semibold w-5 text-center">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="text-xl font-semibold">+</button>
          </div>
          <button
            className="flex-1 bg-black text-white rounded-full py-3.5 text-[15px] font-semibold text-center"
            onClick={handleAddToCart}
          >
            Add {qty} to cart · ${(meal.price * qty).toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}
