import { Home, MapPin, Search, ShoppingCart, Sparkles, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface BottomNavBarProps {
  activeTab?: 'home' | 'explore' | 'cart' | 'profile';
}

export function BottomNavBar({ activeTab }: BottomNavBarProps) {
  const { navigate, goBack, cart, setShowAISearch } = useApp();
  const totalItems = cart.reduce((s, c) => s + c.quantity, 0);

  return (
    <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white px-4 py-2 flex items-center gap-2">
      {/* Home */}
      <button
        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 flex-shrink-0"
        onClick={goBack}
      >
        <Home size={20} strokeWidth={activeTab === 'home' ? 2.5 : 1.8} className={activeTab === 'home' ? 'text-black' : 'text-gray-700'} />
      </button>

      {/* Explore */}
      <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 flex-shrink-0">
        <MapPin size={20} strokeWidth={1.8} className="text-gray-700" />
      </button>

      {/* Search pill */}
      <button
        className="flex-1 flex items-center gap-2 px-4 h-10 bg-gray-100 rounded-full"
        onClick={() => setShowAISearch(true)}
      >
        <Sparkles size={13} className="text-[#06C167] flex-shrink-0" />
        <Search size={15} className="text-gray-500 flex-shrink-0" />
        <span className="text-[14px] text-gray-500">Search</span>
      </button>

      {/* Cart */}
      <button
        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 flex-shrink-0 relative"
        onClick={() => navigate('cart')}
      >
        <ShoppingCart size={20} strokeWidth={1.8} className="text-gray-700" />
        {totalItems > 0 && (
          <span className="absolute top-1 right-1 bg-[#06C167] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
            {totalItems}
          </span>
        )}
      </button>

      {/* Profile */}
      <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 flex-shrink-0">
        <User size={20} strokeWidth={1.8} className="text-gray-700" />
      </button>
    </div>
  );
}