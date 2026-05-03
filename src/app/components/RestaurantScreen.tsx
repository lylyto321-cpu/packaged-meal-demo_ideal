import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Search, Heart, MoreHorizontal, Star, MapPin, ShoppingCart, Clock, Package } from 'lucide-react';
import { RESTAURANTS } from '../data/mockData';

const MENU_FILTERS = ['Featured', 'Vegetarian', 'Pescatarian', 'Low Cal', 'High Protein'];

export function RestaurantScreen() {
  const { selectedRestaurant, navigate, goBack, cart, setSelectedMeal, addToCart } = useApp();
  const [menuFilter, setMenuFilter] = useState('Featured');
  const [liked, setLiked] = useState(false);

  const restaurant = selectedRestaurant;
  if (!restaurant) return null;

  const restaurantCartItems = cart.filter(c => c.restaurantId === restaurant.id);
  const totalItems = restaurantCartItems.reduce((s, c) => s + c.quantity, 0);
  const cartTotal = restaurantCartItems.reduce((s, c) => s + c.meal.price * c.quantity, 0);

  // Mix & match restaurants (other restaurants)
  const mixMatchRestaurants = RESTAURANTS.filter(r => r.id !== restaurant.id).slice(0, 4);

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Hero image */}
      <div className="relative h-[200px] bg-gray-200 flex-shrink-0">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Top controls */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-10 pb-2">
          <button onClick={goBack} className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow">
              <Search size={18} />
            </button>
            <button onClick={() => setLiked(!liked)} className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow">
              <Heart size={18} className={liked ? 'fill-red-500 text-red-500' : ''} />
            </button>
            <button className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Restaurant info */}
        <div className="px-4 pt-4 pb-3">
          <h1 className="text-[22px] font-bold">{restaurant.name}</h1>
          <div className="flex items-center gap-2 mt-1 text-[13px] text-gray-600">
            <Star size={13} className="fill-gray-600 text-gray-600" />
            <span className="font-medium">{restaurant.rating}</span>
            <span>({restaurant.reviews}+)</span>
            <span>·</span>
            <span className="text-[#06C167] font-medium">⊕ Uber One</span>
            <span>·</span>
            <span>{restaurant.distance}</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-[13px] text-gray-600">
            <MapPin size={12} />
            <span>{restaurant.address}</span>
          </div>
        </div>

        {/* Delivery / Pickup tabs */}
        <div className="px-4 flex gap-2 pb-3">
          <button className="px-4 py-1.5 rounded-full bg-black text-white text-[13px] font-medium">Delivery</button>
          <button className="px-4 py-1.5 rounded-full border border-gray-300 text-[13px] text-gray-600">Pickup</button>
        </div>

        {/* Order by 2pm banner */}
        <div className="mx-4 mb-3 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 flex items-center gap-2">
          <Clock size={16} className="text-amber-600 flex-shrink-0" />
          <span className="text-[13px] text-amber-800 font-medium">Order by 2pm, get delivery today</span>
        </div>

        {/* Promo banner */}
        <div className="mx-4 mb-4 flex gap-2 overflow-x-auto scrollbar-none">
          <div className="flex-shrink-0 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 flex items-center gap-2">
            <Package size={16} className="text-amber-600" />
            <span className="text-[13px] text-amber-800 font-medium">Order more than 5 meals, get 10% off</span>
          </div>
          <div className="flex-shrink-0 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 flex items-center gap-2">
            <span className="text-[13px] text-red-700">♥ $10 off $35+</span>
          </div>
        </div>

        {/* Explore Menu */}
        <div className="px-4 mb-3">
          <h2 className="text-[18px] font-bold mb-3">Explore Menu</h2>
          <div className="flex overflow-x-auto gap-2 scrollbar-none">
            {MENU_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setMenuFilter(f)}
                className={`px-4 py-1.5 rounded-full text-[13px] whitespace-nowrap transition-all ${
                  menuFilter === f
                    ? 'bg-black text-white'
                    : 'border border-gray-300 text-gray-700'
                }`}
              >
                {f === 'Featured' && '⭐ '}{f}
              </button>
            ))}
          </div>
        </div>

        {/* Menu items */}
        <div className="px-4 mb-6">
          <div className="flex overflow-x-auto gap-3 scrollbar-none pb-1">
            {restaurant.meals.map((meal, idx) => (
              <button
                key={meal.id}
                className="min-w-[150px] flex-shrink-0 text-left"
                onClick={() => { setSelectedMeal(meal); navigate('meal'); }}
              >
                <div className="relative rounded-xl overflow-hidden h-[110px] bg-gray-100">
                  <img src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
                  {meal.badge && (
                    <div className="absolute top-2 left-2 bg-[#06C167] text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                      {meal.badge}
                    </div>
                  )}
                  <button
                    className="absolute bottom-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow text-lg font-light"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart({
                        restaurantId: restaurant.id,
                        restaurantName: restaurant.name,
                        meal,
                        quantity: 1,
                        type: restaurant.isThreeDayReady ? 'three-day-ready' : 'packaged',
                      });
                    }}
                  >
                    +
                  </button>
                </div>
                <div className="mt-1.5">
                  <div className="text-[12px] font-semibold uppercase leading-tight">{meal.name}</div>
                  <div className="text-[12px] text-gray-600 mt-0.5">${meal.price.toFixed(2)}</div>
                  {meal.calories && (
                    <div className="text-[11px] text-gray-400">{meal.calories} cal</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mix and match section — only shown when cart has items from this restaurant */}
        {totalItems > 0 && (
        <div className="px-4 mb-6 border-t border-gray-100 pt-4">
          <div className="mb-1">
            <h3 className="text-[17px] font-bold">Mix and match</h3>
            <p className="text-[12px] text-gray-500 mt-0.5">These restaurants are on the way from {restaurant.name} to you. Order together to save delivery fee</p>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-none pt-3 pb-1">
            {mixMatchRestaurants.map(r => (
              <button
                key={r.id}
                className="min-w-[130px] flex-shrink-0 text-left"
                onClick={() => { navigate('restaurant'); }}
              >
                <div className="relative rounded-xl overflow-hidden h-[90px] bg-gray-100">
                  <img src={r.cardImage} alt={r.name} className="w-full h-full object-cover" />
                </div>
                <div className="mt-1">
                  <div className="text-[12px] font-semibold truncate">{r.name}</div>
                  <div className="text-[11px] text-gray-500">{r.distance} · Free delivery</div>
                </div>
              </button>
            ))}
          </div>
        </div>
        )}
      </div>

      {/* Cart button */}
      {totalItems > 0 && (
        <div className="px-4 py-3 border-t border-gray-100 bg-white">
          <button
            className="w-full bg-black text-white rounded-full py-3.5 flex items-center justify-between px-5"
            onClick={() => navigate('cart')}
          >
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-[12px] font-bold">{totalItems}</div>
            <span className="font-semibold text-[15px]">View cart</span>
            <span className="text-[15px] font-semibold">${cartTotal.toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  );
}