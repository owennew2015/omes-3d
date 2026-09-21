import React from 'react';
import { ItemCanvas } from './3d/ItemCanvas';
import { Plus, Sparkles } from 'lucide-react';

export function MenuCard({ item, onSelect, index }) {
  return (
    <article
      onClick={() => onSelect(item)}
      className="group relative bg-white rounded-[28px] overflow-hidden shadow-[0_10px_35px_rgba(82,38,26,.10)] border border-[#2A1E1A]/5 hover:shadow-[0_18px_45px_rgba(82,38,26,.16)] transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative h-48 bg-gradient-to-br from-[#F4B27A] via-[#ED7B35] to-[#C8523B] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,248,231,.35),transparent_35%)]" />
        <ItemCanvas category={item.Kategori} className="h-full w-full" />
        {item.Badge && (
          <span className="absolute top-3 left-3 bg-[#FFF8E7] text-[#651313] text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md transform -rotate-3 border border-white/50 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> {item.Badge}
          </span>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-['Fredoka'] text-xl font-extrabold leading-none tracking-tight text-[#2A1E1A] mb-1">
              {item.Nama}
            </h3>
            <p className="text-[11px] uppercase tracking-widest font-bold text-[#C8523B]">
              {item.Kategori}
            </p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(item); }}
            className="flex-shrink-0 w-10 h-10 rounded-2xl bg-[#2A1E1A] text-[#FFF8E7] flex items-center justify-center group-hover:bg-[#C8523B] transition-transform active:scale-90 shadow-md"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-3 text-sm leading-snug text-[#756965] min-h-[38px] line-clamp-2">
          {item.Deskripsi}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-extrabold text-[#C8523B] text-lg">
            {rupiah(item.price)}
          </span>
          <span className="text-[10px] text-[#756965] font-bold bg-[#FFF8E7] px-2 py-1 rounded-full">
            360° Preview
          </span>
        </div>
      </div>
    </article>
  );
}

function rupiah(value) {
  return 'Rp' + Number(value || 0).toLocaleString('id-ID');
}
