import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, MapPin, User, Phone, Package, ChevronDown, ChevronUp, Check } from 'lucide-react';

type DeliveryOption = 'priority' | 'standard' | 'schedule';

const DELIVERY_OPTIONS: { id: DeliveryOption; label: string; time: string; price: string; fee: number }[] = [
  { id: 'priority', label: 'Priority', time: 'Today\nafternoon',  price: '+$3.99', fee: 3.99 },
  { id: 'standard', label: 'Standard', time: 'Tomorrow\n8–11 AM', price: 'Free',   fee: 0    },
  { id: 'schedule', label: 'Schedule', time: 'Pick\na window',    price: '',   fee: 0    },
];

function DeliveryWindowPicker({
  selected,
  onChange,
  compact = false,
}: {
  selected: DeliveryOption;
  onChange: (opt: DeliveryOption) => void;
  compact?: boolean;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {DELIVERY_OPTIONS.map(opt => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`relative rounded-xl p-3 text-center border-2 transition-all bg-white ${
            selected === opt.id ? 'border-black shadow-sm' : 'border-gray-200'
          }`}
        >
          {selected === opt.id && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-black rounded-full flex items-center justify-center">
              <Check size={9} className="text-white" strokeWidth={3} />
            </span>
          )}
          <div className={`font-bold mt-1 ${compact ? 'text-[12px]' : 'text-[14px]'}`}>{opt.label}</div>
          <div className="text-[11px] text-gray-500 mt-0.5 whitespace-pre-line">{opt.time}</div>
          <div className={`font-semibold mt-1 ${compact ? 'text-[11px]' : 'text-[13px]'} ${opt.price === 'Free' ? 'text-[#06C167]' : 'text-gray-700'}`}>
            {opt.price}
          </div>
        </button>
      ))}
    </div>
  );
}

export function CheckoutScreen() {
  const { cart, goBack, navigate } = useApp();
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Global delivery option — unchanged default view
  const [globalOption, setGlobalOption] = useState<DeliveryOption>('standard');

  // Per-restaurant overrides (empty = inherit global)
  const [perRestaurantOptions, setPerRestaurantOptions] = useState<Record<string, DeliveryOption>>({});

  // Top-level toggle for the whole per-restaurant section
  const [showPerRestaurant, setShowPerRestaurant] = useState(false);

  // Which individual restaurant cards are expanded
  const [expandedSet, setExpandedSet] = useState<Set<string>>(new Set());

  // Unique packaged-meal restaurants in cart
  const packagedRestaurants = [...new Map(
    cart
      .filter(c => c.type === 'packaged' || c.type === 'three-day-ready')
      .map(c => [c.restaurantId, { id: c.restaurantId, name: c.restaurantName }])
  ).values()];

  const isMulti = packagedRestaurants.length > 1;

  const getRestaurantOpt = (id: string): DeliveryOption => perRestaurantOptions[id] ?? globalOption;

  const setRestaurantOpt = (id: string, opt: DeliveryOption) =>
    setPerRestaurantOptions(prev => ({ ...prev, [id]: opt }));

  // Detect when restaurants have different windows chosen
  const effectiveOpts = isMulti ? packagedRestaurants.map(r => getRestaurantOpt(r.id)) : [];
  const hasVariedWindows = isMulti && new Set(effectiveOpts).size > 1;

  // Auto-expand the details section when windows diverge
  useEffect(() => {
    if (hasVariedWindows) setShowPerRestaurant(true);
  }, [hasVariedWindows]);

  const toggleExpand = (id: string) =>
    setExpandedSet(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // ── Totals ────────────────────────────────────────────────────────────────
  const subtotal = cart.reduce((s, c) => s + c.meal.price * c.quantity, 0);

  const totalDeliveryFee = isMulti
    ? packagedRestaurants.reduce((sum, r) => sum + (getRestaurantOpt(r.id) === 'priority' ? 3.99 : 0), 0)
    : globalOption === 'priority' ? 3.99 : 0;

  const serviceFee = +(subtotal * 0.1).toFixed(2);
  const total = subtotal + totalDeliveryFee + serviceFee;

  // ── Order placed ──────────────────────────────────────────────────────────
  if (orderPlaced) {
    return (
      <div className="flex flex-col h-full bg-white items-center justify-center px-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <div className="text-[22px] font-bold mb-2">Order placed!</div>
        <div className="text-[14px] text-gray-500 mb-2">Your packaged meals are on their way.</div>
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6">
          <div className="text-[13px] text-green-800 font-medium">
            {globalOption === 'priority' ? '⚡ Delivers tomorrow 7–9 AM' :
             globalOption === 'standard'  ? '📦 Delivers tomorrow 8–11 AM' :
             '📅 Scheduled delivery window selected'}
          </div>
        </div>
        <button
          className="bg-black text-white px-8 py-3 rounded-full text-[14px] font-semibold"
          onClick={() => navigate('home')}
        >
          Back to home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center px-4 pt-2 pb-3 border-b border-gray-100">
        <button onClick={goBack} className="mr-3"><ChevronLeft size={22} /></button>
        <span className="text-[18px] font-bold">Checkout</span>
      </div>

      {/* Edit pin bar */}
      <div className="bg-[#e8f0e9] flex items-center justify-center py-2">
        <button className="bg-white rounded-full px-4 py-1 text-[13px] font-medium shadow-sm">Edit pin</button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">

        {/* Address rows */}
        <div className="divide-y divide-gray-100">
          <div className="flex items-center px-4 py-3.5 gap-3">
            <MapPin size={20} className="text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-[14px] font-semibold">88 Arkansas St</div>
              <div className="text-[12px] text-gray-500">San Francisco, CA</div>
            </div>
            <span className="text-gray-400 text-[16px]">›</span>
          </div>
          <div className="flex items-center px-4 py-3.5 gap-3">
            <User size={20} className="text-gray-500 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-[14px] font-semibold">Meet at my door</div>
              <div className="text-[12px] text-gray-500">do not leave at front desk</div>
            </div>
            <span className="text-gray-400 text-[16px]">›</span>
          </div>
          <div className="flex items-center px-4 py-3.5 gap-3">
            <Phone size={20} className="text-gray-500 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-[14px] font-semibold">+1 650-250-6942</div>
            </div>
            <span className="text-gray-400 text-[16px]">›</span>
          </div>
        </div>

        {/* ── Packaged Meal Delivery ────────────────────────────────────────── */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-2 mb-3">
            <Package size={16} className="text-amber-600" />
            <span className="text-[13px] font-bold text-gray-600 uppercase tracking-wider">
              Packaged Meal Delivery
            </span>
          </div>

          {/* Info banner */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 flex items-start gap-2">
            <span className="text-green-600 text-[18px]">🕐</span>
            <div className="text-[12px] text-green-800 leading-relaxed">
              Ordered after noon — delivers{' '}
              <span className="font-bold">tomorrow morning (8–11 AM)</span>.
              Order before noon for same-day delivery.
            </div>
          </div>

          {/* Global delivery window picker — hidden once restaurants have varied windows */}
          {!hasVariedWindows && (
            <DeliveryWindowPicker
              selected={globalOption}
              onChange={setGlobalOption}
            />
          )}

          {/* ── Per-restaurant section: hidden behind a single toggle ── */}
          {isMulti && (
            <div className="mt-3">

              {/* Toggle row */}
              <button
                className="w-full flex items-center justify-between py-2.5 border-t border-gray-100"
                onClick={() => setShowPerRestaurant(v => !v)}
              >
                <span className="text-[13px] text-gray-500">
                  See details
                </span>
                {showPerRestaurant
                  ? <ChevronUp size={15} className="text-gray-400" />
                  : <ChevronDown size={15} className="text-gray-400" />
                }
              </button>

              {/* Expandable restaurant cards */}
              {showPerRestaurant && (
                <div className="flex flex-col gap-2 mt-1">
                  {packagedRestaurants.map(r => {
                    const opt = getRestaurantOpt(r.id);
                    const isExpanded = expandedSet.has(r.id);
                    const isOverridden = !!perRestaurantOptions[r.id];
                    const rItems = cart.filter(c => c.restaurantId === r.id);
                    const rSubtotal = rItems.reduce((s, c) => s + c.meal.price * c.quantity, 0);
                    const rDeliveryFee = opt === 'priority' ? 3.99 : 0;
                    const rServiceFee = +(rSubtotal * 0.1).toFixed(2);
                    const rTotal = rSubtotal + rDeliveryFee + rServiceFee;
                    const optMeta = DELIVERY_OPTIONS.find(o => o.id === opt)!;

                    return (
                      <div key={r.id} className="border border-gray-200 rounded-2xl overflow-hidden">

                        {/* Collapsed row */}
                        <button
                          className="w-full flex items-center justify-between px-4 py-3 bg-white"
                          onClick={() => toggleExpand(r.id)}
                        >
                          <div className="text-left flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[13px] font-semibold truncate">{r.name}</span>
                              {isOverridden && (
                                <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full flex-shrink-0">
                                  Custom
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-gray-400 mt-0.5">
                              {optMeta.label} · {rDeliveryFee === 0 ? 'Free delivery' : `+$${rDeliveryFee.toFixed(2)} delivery`}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                            <span className="text-[13px] font-semibold">${rTotal.toFixed(2)}</span>
                            {isExpanded
                              ? <ChevronUp size={15} className="text-gray-400" />
                              : <ChevronDown size={15} className="text-gray-400" />
                            }
                          </div>
                        </button>

                        {/* Expanded: fee breakdown + individual delivery window */}
                        {isExpanded && (
                          <div className="border-t border-gray-100 bg-[#F8F8F8] px-4 py-3">
                            <div className="space-y-1.5 mb-4">
                              <div className="flex justify-between text-[12px] text-gray-500">
                                <span>Subtotal</span>
                                <span>${rSubtotal.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-[12px] text-gray-500">
                                <span>Delivery fee</span>
                                <span className={rDeliveryFee === 0 ? 'text-[#06C167] font-medium' : ''}>
                                  {rDeliveryFee === 0 ? 'Free' : `$${rDeliveryFee.toFixed(2)}`}
                                </span>
                              </div>
                              <div className="flex justify-between text-[12px] text-gray-500">
                                <span>Service fee</span>
                                <span>${rServiceFee.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-[13px] font-semibold pt-1.5 border-t border-gray-200">
                                <span>Restaurant total</span>
                                <span>${rTotal.toFixed(2)}</span>
                              </div>
                            </div>
                            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
                              Delivery window
                            </div>
                            <DeliveryWindowPicker
                              selected={opt}
                              onChange={newOpt => setRestaurantOpt(r.id, newOpt)}
                              compact
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Cost breakdown ─────────────────────────────────────────────────── */}
        <div className="px-4 pb-4 pt-3 border-t border-gray-100 space-y-2">
          <div className="flex justify-between text-[13px] text-gray-600">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[13px] text-gray-600">
            <span>Delivery fee</span>
            <span className={totalDeliveryFee === 0 ? 'text-[#06C167] font-medium' : ''}>
              {totalDeliveryFee === 0 ? 'Free' : `$${totalDeliveryFee.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-[13px] text-gray-600">
            <span>Service fee</span>
            <span>${serviceFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[15px] font-bold pt-2 border-t border-gray-100">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="h-8" />
      </div>

      {/* Place order */}
      <div className="px-4 py-3 border-t border-gray-100 bg-white">
        <button
          className="w-full bg-black text-white rounded-full py-4 text-[15px] font-bold"
          onClick={() => setOrderPlaced(true)}
        >
          Place order · ${total.toFixed(2)}
        </button>
      </div>
    </div>
  );
}