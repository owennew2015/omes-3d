import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingCart } from 'lucide-react';
import { ItemCanvas } from './3d/ItemCanvas';

export function ItemModal({ item, onClose, onAdd }) {
  const [qty, setQty] = useState(1);
  const [choices, setChoices] = useState(() => (item?.options || []).map(group => group[0] || ''));
  const [note, setNote] = useState('');

  if (!item) return null;

  const handleChoice = (groupIndex, option) => {
    setChoices(prev => {
      const next = [...prev];
      next[groupIndex] = option;
      return next;
    });
  };

  const submit = () => {
    onAdd({
      id: item.ID,
      name: item.Nama,
      price: Number(item.price),
      quantity: qty,
      options: choices.filter(Boolean),
      note
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-[#2A1E1A]/60 backdrop-blur-sm p-0 md:p-6">
      <div className="bg-[#FDFBF7] w-full md:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-[32px] md:rounded-[32px] shadow-2xl border border-white/30">
        <div className="relative h-72 bg-gradient-to-br from-[#651313] via-[#C8523B] to-[#ED7B35] rounded-t-[32px] overflow-hidden">
          <ItemCanvas category={item.Kategori} className="h-full w-full" />
          <button onClick={onClose} className="absolute top-4 right-4 w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center border border-white/20 active:scale-95">
            <X className="w-6 h-6" />
          </button>
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between text-white">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#FFF8E7]/80">{item.Kategori}</p>
              <h2 className="font-['Fredoka'] text-4xl font-extrabold tracking-tight leading-none drop-shadow-lg">{item.Nama}</h2>
            </div>
            <div className="bg-[#FFF8E7] text-[#C8523B] px-4 py-2 rounded-2xl font-extrabold shadow-lg">
              {rupiah(item.price)}
            </div>
          </div>
        </div>

        <div className="p-5 md:p-7 space-y-6">
          <p className="text-[#756965] leading-relaxed">{item.Deskripsi}</p>

          {(item.options || []).map((group, groupIndex) => (
            <div key={groupIndex}>
              <h4 className="font-extrabold text-sm mb-3 text-[#2A1E1A] uppercase tracking-wide">
                Pilih {groupIndex === 0 ? 'opsi' : 'tambahan'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {group.map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleChoice(groupIndex, option)}
                    className={`px-4 py-2.5 rounded-2xl font-bold text-sm border transition-all active:scale-95 ${
                      choices[groupIndex] === option
                        ? 'bg-[#C8523B] text-white border-[#C8523B] shadow-md'
                        : 'bg-white text-[#2A1E1A] border-[#2A1E1A]/10 hover:border-[#C8523B]/50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div>
            <label className="font-extrabold text-sm mb-2 block text-[#2A1E1A] uppercase tracking-wide">Catatan</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Contoh: saus dipisah, tanpa es..."
              className="w-full min-h-[90px] rounded-2xl border border-[#2A1E1A]/10 bg-white p-4 outline-none focus:ring-4 focus:ring-[#C8523B]/15 focus:border-[#C8523B] resize-none"
            />
          </div>

          <div className="flex items-center justify-between bg-white rounded-3xl p-3 border border-[#2A1E1A]/10">
            <span className="font-extrabold text-[#2A1E1A]">Jumlah</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 rounded-2xl bg-[#FFF8E7] flex items-center justify-center active:scale-90">
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-extrabold text-xl min-w-[24px] text-center">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="w-10 h-10 rounded-2xl bg-[#FFF8E7] flex items-center justify-center active:scale-90">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            onClick={submit}
            className="w-full min-h-[58px] rounded-3xl bg-[#C8523B] text-white font-extrabold shadow-[0_8px_0_#9B3525] active:translate-y-1 active:shadow-[0_4px_0_#9B3525] transition-all flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" /> Tambah ke Keranjang · {rupiah(item.price * qty)}
          </button>
        </div>
      </div>
    </div>
  );
}

function rupiah(value) {
  return 'Rp' + Number(value || 0).toLocaleString('id-ID');
}
