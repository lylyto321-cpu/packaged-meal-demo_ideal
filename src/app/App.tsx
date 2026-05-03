import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HomeScreen } from './components/HomeScreen';
import { PackagedMealsScreen } from './components/PackagedMealsScreen';
import { RestaurantScreen } from './components/RestaurantScreen';
import { MealScreen } from './components/MealScreen';
import { CartScreen } from './components/CartScreen';
import { CheckoutScreen } from './components/CheckoutScreen';
import { PreferencesPanel } from './components/PreferencesPanel';
import { AISearchSheet } from './components/AISearchSheet';
import { SearchSheet } from './components/SearchSheet';

function PhoneApp() {
  const { screen, showPreferences, showAISearch, showSearch } = useApp();

  return (
    <div className="relative w-full h-full overflow-hidden bg-white">
      {/* Screen content */}
      <div className="w-full h-full">
        {screen === 'home' && <HomeScreen />}
        {screen === 'packaged-meals' && <PackagedMealsScreen />}
        {screen === 'restaurant' && <RestaurantScreen />}
        {screen === 'meal' && <MealScreen />}
        {screen === 'cart' && <CartScreen />}
        {screen === 'checkout' && <CheckoutScreen />}
      </div>

      {/* Overlays */}
      {showPreferences && <PreferencesPanel />}
      {showAISearch && <AISearchSheet />}
      {showSearch && <SearchSheet />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      {/* Desktop wrapper */}
      <div
        className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center p-4"
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
      >
        {/* Phone frame */}
        <div
          className="relative bg-black rounded-[52px] shadow-2xl flex-shrink-0"
          style={{
            width: 390,
            height: 844,
            padding: '14px',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 30px 80px rgba(0,0,0,0.9), inset 0 0 0 2px #1a1a1a',
          }}
        >
          {/* Screen area */}
          <div
            className="w-full h-full rounded-[42px] overflow-hidden relative"
            style={{ background: '#fff' }}
          >
            {/* Notch / Dynamic Island */}
            <div
              className="absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-black rounded-full"
              style={{ width: 126, height: 34 }}
            />

            {/* Global status bar — sits alongside the notch */}
            <div className="absolute top-3 left-0 right-0 z-40 flex items-center justify-between px-5" style={{ height: 34 }}>
              <span className="text-[13px] font-semibold">2:15</span>
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-semibold">●●●</span>
                <span className="text-[11px]">📶</span>
                <span className="text-[11px] bg-black text-white rounded px-1 font-semibold">86</span>
              </div>
            </div>

            {/* App content */}
            <div className="w-full h-full pt-12">
              <PhoneApp />
            </div>
          </div>

          {/* Side buttons */}
          <div
            className="absolute left-[-3px] top-[120px] bg-gray-700 rounded-l-sm"
            style={{ width: 3, height: 32 }}
          />
          <div
            className="absolute left-[-3px] top-[168px] bg-gray-700 rounded-l-sm"
            style={{ width: 3, height: 60 }}
          />
          <div
            className="absolute left-[-3px] top-[240px] bg-gray-700 rounded-l-sm"
            style={{ width: 3, height: 60 }}
          />
          <div
            className="absolute right-[-3px] top-[168px] bg-gray-700 rounded-r-sm"
            style={{ width: 3, height: 80 }}
          />
        </div>

        {/* Label */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="text-white/30 text-[12px] tracking-widest uppercase">
            Uber Eats · Packaged Meals Prototype
          </div>
        </div>
      </div>
    </AppProvider>
  );
}