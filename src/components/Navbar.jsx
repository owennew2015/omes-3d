import React from 'react';
import { Search, ShoppingBag, Truck, Shield } from 'lucide-react';

export function Navbar({ onOpenTrack, onOpenAdmin, cartCount, onOpenCart, isAdmin }) {
  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#2A1E1A]/10 px-4 md:px-8 py-3.5 flex items-center justify-between transition-all">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
        <span className="font-['Fredoka'] text-3xl font-extrabold tracking-tighter text-[#C8523B]">
          OME'S
        </span>
        <span className="hidden sm:inline-block bg-[#FFF8E7] text-[#651313] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#ED7B35]/30 uppercase tracking-widest">
          3D Café
        </span>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={onOpenTrack}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#FFF8E7] hover:bg-[#FFF3D6] text-[#2A1E1A] font-bold text-xs md:text-sm border border-[#2A1E1A]/10 transition-transform active:scale-95"
        >
          <Truck className="w-4 h-4 text-[#ED7B35]" />
          <span>Lacak Order</span>
        </button>

        <button
          onClick={onOpenAdmin}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-full font-bold text-xs md:text-sm border transition-transform active:scale-95 ${
            isAdmin ? 'bg-[#651313] text-[#FFF8E7] border-[#651313]' : 'bg-white hover:bg-neutral-50 text-[#796e68] border-[#2A1E1A]/10'
          }`}
        >
          <Shield className="w-4 h-4 text-[#C8523B]" />
          <span>{isAdmin ? 'Menu Utama' : 'Admin'}</span>
        </button>

        {!isAdmin && (
          <button
            onClick={onOpenCart}
            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#C8523B] text-white hover:bg-[#B3402F] transition-transform active:scale-95 shadow-md"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#ED7B35] text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FDFBF7]">
                {cartCount}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  );
}
