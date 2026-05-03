import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Restaurant, Meal } from '../data/mockData';

export type Screen = 'home' | 'packaged-meals' | 'restaurant' | 'meal' | 'cart' | 'checkout';

export interface Preferences {
  overall: string[];
  dietary: string[];
  protein: string[];
}

interface AppContextType {
  screen: Screen;
  navigate: (s: Screen) => void;
  goBack: () => void;
  selectedRestaurant: Restaurant | null;
  setSelectedRestaurant: (r: Restaurant | null) => void;
  selectedMeal: Meal | null;
  setSelectedMeal: (m: Meal | null) => void;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'cartId'>) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, qty: number) => void;
  clearAICart: () => void;
  preferences: Preferences;
  setPreferences: (p: Preferences) => void;
  showPreferences: boolean;
  setShowPreferences: (v: boolean) => void;
  showAISearch: boolean;
  setShowAISearch: (v: boolean) => void;
  showSearch: boolean;
  setShowSearch: (v: boolean) => void;
  activeTab: string;
  setActiveTab: (t: string) => void;
  selectedFilter: string;
  setSelectedFilter: (f: string) => void;
  aiMessages: AIMessage[];
  addAIMessage: (msg: AIMessage) => void;
  hasAIItems: boolean;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [screenHistory, setScreenHistory] = useState<Screen[]>(['home']);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [preferences, setPreferences] = useState<Preferences>({ overall: [], dietary: [], protein: [] });
  const [showPreferences, setShowPreferences] = useState(false);
  const [showAISearch, setShowAISearch] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [aiMessages, setAIMessages] = useState<AIMessage[]>([]);

  const screen = screenHistory[screenHistory.length - 1];

  const navigate = (s: Screen) => {
    setScreenHistory(prev => [...prev, s]);
  };

  const goBack = () => {
    setScreenHistory(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
  };

  const addToCart = (item: Omit<CartItem, 'cartId'>) => {
    const cartId = `${item.restaurantId}-${item.meal.id}-${Date.now()}`;
    setCart(prev => {
      const existing = prev.find(c => c.restaurantId === item.restaurantId && c.meal.id === item.meal.id && c.selectedStyle === item.selectedStyle);
      if (existing) {
        return prev.map(c => c.cartId === existing.cartId ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { ...item, cartId }];
    });
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(c => c.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart(prev => prev.map(c => c.cartId === cartId ? { ...c, quantity: qty } : c));
  };

  const clearAICart = () => {
    setCart(prev => prev.filter(c => !c.addedByAI));
  };

  const addAIMessage = (msg: AIMessage) => {
    setAIMessages(prev => [...prev, msg]);
  };

  const hasAIItems = cart.some(c => c.addedByAI);

  return (
    <AppContext.Provider value={{
      screen, navigate, goBack,
      selectedRestaurant, setSelectedRestaurant,
      selectedMeal, setSelectedMeal,
      cart, addToCart, removeFromCart, updateQuantity, clearAICart,
      preferences, setPreferences,
      showPreferences, setShowPreferences,
      showAISearch, setShowAISearch,
      showSearch, setShowSearch,
      activeTab, setActiveTab,
      selectedFilter, setSelectedFilter,
      aiMessages, addAIMessage,
      hasAIItems,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}