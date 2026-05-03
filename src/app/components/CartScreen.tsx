import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Plus, Minus, Sparkles, Trash2 } from 'lucide-react';
import { CartItem, MIX_MATCH_GROUPS } from '../data/mockData';

// Badge shown on packaged / three-day-ready items
function ItemTypeBadge({ type }: { type: CartItem['type'] }) {
  if (type === 'packaged') {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] bg-orange-50 text-orange-600 border border-orange-200 px-1.5 py-0.5 rounded-full font-medium">
        📦 Packaged Meals
      </span>
    );
  }
  if (type === 'three-day-ready') {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-full font-medium">
        🥗 Three-Day Ready
      </span>
    );
  }
  return null;
}

export function CartScreen() {
  const { cart, navigate, goBack, removeFromCart, updateQuantity, hasAIItems, setShowAISearch } = useApp();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(() => new Set(cart.map(c => c.cartId)));

  useEffect(() => {
    const currentIds = new Set(cart.map(c => c.cartId));
    setSelectedItems(prev => {
      const next = new Set<string>();
      currentIds.forEach(id => next.add(id));
      prev.forEach(id => { if (!currentIds.has(id)) next.delete(id); });
      return next;
    });
  }, [cart.length]);

  const subtotal = cart.reduce((s, c) => s + c.meal.price * c.quantity, 0);
  const allIds = cart.map(c => c.cartId);
  const allSelected = allIds.length > 0 && allIds.every(id => selectedItems.has(id));

  const toggleSelectAll = () => {
    if (allSelected) setSelectedItems(new Set());
    else setSelectedItems(new Set(allIds));
  };

  const toggleSelect = (cartId: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(cartId)) next.delete(cartId);
      else next.add(cartId);
      return next;
    });
  };

  const removeSelected = () => {
    selectedItems.forEach(id => removeFromCart(id));
    setSelectedItems(new Set());
  };

  // ── Grouping logic ──────────────────────────────────────────────────────────
  const cartRestaurantIds = [...new Set(cart.map(c => c.restaurantId))];

  const activeBundles = MIX_MATCH_GROUPS.map(group => ({
    ...group,
    matchedIds: group.restaurantIds.filter(id => cartRestaurantIds.includes(id)),
  })).filter(g => g.matchedIds.length >= 2);

  const claimedByBundle = new Set<string>();
  const dedupedBundles = activeBundles.reduce<typeof activeBundles>((acc, bundle) => {
    const unclaimed = bundle.matchedIds.filter(id => !claimedByBundle.has(id));
    if (unclaimed.length >= 2) {
      unclaimed.forEach(id => claimedByBundle.add(id));
      acc.push({ ...bundle, matchedIds: unclaimed });
    }
    return acc;
  }, []);

  const soloRestaurantIds = cartRestaurantIds.filter(id => !claimedByBundle.has(id));
  const itemsForRestaurant = (restaurantId: string) => cart.filter(c => c.restaurantId === restaurantId);

  // ── Item row ────────────────────────────────────────────────────────────────
  const renderItem = (item: CartItem, isLast: boolean) => (
    <div key={item.cartId} className={`flex items-start gap-3 px-3 py-3 ${!isLast ? 'border-b border-black/5' : ''}`}>
      {/* Checkbox */}
      <button
        className={`w-4.5 h-4.5 rounded border-2 flex-shrink-0 mt-1 flex items-center justify-center transition-all ${
          selectedItems.has(item.cartId) ? 'bg-black border-black' : 'border-gray-400'
        }`}
        style={{ width: 18, height: 18 }}
        onClick={() => toggleSelect(item.cartId)}
      >
        {selectedItems.has(item.cartId) && <span className="text-white text-[9px]">✓</span>}
      </button>

      {/* Image */}
      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
        <img src={item.meal.image} alt={item.meal.name} className="w-full h-full object-cover" />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold leading-snug truncate">{item.meal.name}</div>
            {item.selectedStyle && (
              <div className="text-[11px] text-gray-500 mt-0.5">{item.selectedStyle}</div>
            )}
            <div className="mt-1">
              <ItemTypeBadge type={item.type} />
            </div>
            <div className="text-[13px] font-medium mt-1">${(item.meal.price * item.quantity).toFixed(2)}</div>
            {item.addedByAI && (
              <div className="flex items-center gap-1 mt-0.5">
                <Sparkles size={10} className="text-[#06C167]" />
                <span className="text-[10px] text-[#06C167]">AI pick</span>
              </div>
            )}
          </div>

          {/* Qty stepper */}
          <div className="flex items-center gap-1 bg-white/70 rounded-full px-1.5 py-1 flex-shrink-0">
            <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)} className="w-5 h-5 flex items-center justify-center">
              <Minus size={11} />
            </button>
            <span className="text-[12px] font-semibold w-4 text-center">{item.quantity}</span>
            <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)} className="w-5 h-5 flex items-center justify-center">
              <Plus size={11} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Restaurant block inside a card ──────────────────────────────────────────
  const renderRestaurantBlock = (restaurantId: string, showDivider: boolean) => {
    const items = itemsForRestaurant(restaurantId);
    if (items.length === 0) return null;
    return (
      <div key={restaurantId}>
        {showDivider && <div className="mx-3 border-t border-black/8" />}
        {/* Restaurant name label */}
        <div className="px-3 pt-2.5 pb-0.5">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{items[0].restaurantName}</span>
        </div>
        {items.map((item, i) => renderItem(item, i === items.length - 1))}
      </div>
    );
  };

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="flex items-center justify-between px-4 pt-10 pb-4 border-b border-gray-100">
          <button onClick={goBack}><X size={22} /></button>
          <span className="text-[17px] font-bold">Your Cart</span>
          <div className="w-6" />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center pb-20 px-8 text-center">
          <span className="text-6xl mb-4">🛒</span>
          <div className="text-[17px] font-bold">Your cart is empty</div>
          <div className="text-[13px] text-gray-500 mt-2">Add items from restaurants to get started</div>
          <button className="mt-6 bg-black text-white px-6 py-3 rounded-full text-[14px] font-semibold" onClick={goBack}>
            Browse meals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-10 pb-4 border-b border-gray-100 flex-shrink-0">
        <button onClick={goBack}><X size={22} /></button>
        <span className="text-[17px] font-bold">Your Cart</span>
        <div className="w-8" />
      </div>

      {/* Scrollable area */}
      <div className="flex-1 overflow-y-auto bg-white">

        {/* Select-all row */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <button
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                allSelected ? 'bg-black border-black' : 'border-gray-300'
              }`}
              onClick={toggleSelectAll}
            >
              {allSelected && <span className="text-white text-[10px]">✓</span>}
            </button>
            <span className="text-[13px] text-gray-600">Select all items</span>
          </div>
          {selectedItems.size > 0 && selectedItems.size < allIds.length && (
            <span className="text-[12px] text-gray-400">{selectedItems.size} selected</span>
          )}
        </div>

        {/* Cards container — white gaps between cards via padding */}
        <div className="px-4 pt-3 pb-2 flex flex-col gap-3">

          {/* ── Mix & Match bundle cards ── */}
          {dedupedBundles.map(bundle => (
            <div key={bundle.title} className="rounded-2xl overflow-hidden bg-[#F2F2F2]">
              {bundle.matchedIds.map((restaurantId, i) =>
                renderRestaurantBlock(restaurantId, i > 0)
              )}
            </div>
          ))}

          {/* ── Solo restaurant cards ── */}
          {soloRestaurantIds.map(restaurantId => {
            const items = itemsForRestaurant(restaurantId);
            if (items.length === 0) return null;
            return (
              <div key={restaurantId} className="rounded-2xl overflow-hidden bg-[#F2F2F2]">
                <div className="px-3 pt-2.5 pb-0.5">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{items[0].restaurantName}</span>
                </div>
                {items.map((item, i) => renderItem(item, i === items.length - 1))}
              </div>
            );
          })}

        </div>

        {/* Subtotal */}
        <div className="px-4 py-4 border-t border-gray-100 mt-1">
          <div className="flex justify-between text-[13px] text-gray-600">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="h-4" />
      </div>

      {/* Bottom actions */}
      <div className="px-4 py-3 border-t border-gray-100 bg-white flex-shrink-0 flex items-center gap-2">
        {selectedItems.size > 0 && selectedItems.size < allIds.length && (
          <button className="flex items-center justify-center border border-gray-200 rounded-full w-12 h-12 text-red-500" onClick={removeSelected}>
            <Trash2 size={16} />
          </button>
        )}
        <button className="flex-1 bg-black text-white rounded-full py-3.5 text-[15px] font-semibold" onClick={() => navigate('checkout')}>
          Go to checkout
        </button>
      </div>

    </div>
  );
}