import React, { useState } from 'react';
import { X, Minus, Plus, Trash2, ArrowRight, Tag, LoaderCircle } from 'lucide-react';
import { validatePromo, submitOrder } from '../services/api';

export function CartDrawer({ cart, onClose, onUpdateQty, onRemove, onOrderSuccess }) {
  const [step, setStep] = useState('cart');
  const [promoCode, setPromoCode] = useState('');
  const [promo, setPromo] = useState(null);
  const [promoMessage, setPromoMessage] = useState('');
  const [customer, setCustomer] = useState({ name: '', phone: '', orderType: 'Dine In', note: '' });
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = promo?.discount || 0;
  const total = Math.max(0, subtotal - discount);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  const applyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoMessage('Memeriksa kode...');
    const result = await validatePromo(promoCode.trim(), subtotal);
    if (result?.valid) {
      setPromo(result);
      setPromoMessage(`✓ ${result.message} Hemat ${rupiah(result.discount)}`);
    } else {
      setPromo(null);
      setPromoMessage(result?.message || 'Kode promo tidak valid');
    }
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!customer.name || !customer.phone) return;
    setLoading(true);
    try {
      const result = await submitOrder({
        customer,
        promoCode: promo?.code || '',
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          options: item.options,
          note: item.note
        }))
      });
      onOrderSuccess({ ...result, total, discount });
    } catch (error) {
      setPromoMessage(error.message || 'Order gagal dikirim.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2A1E1A]/60 backdrop-blur-sm flex items-end justify-center">
      <div className="bg-[#FDFBF7] w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-[32px] shadow-2xl p-5 md:p-7">
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C8523B]">{step === 'cart' ? `${count} item` : 'Checkout'}</span>
            <h2 className="font-['Fredoka'] text-3xl font-extrabold leading-none mt-1">{step === 'cart' ? 'Keranjang kamu' : 'Almost there!'}</h2>
          </div>
          <button onClick={onClose} className="w-11 h-11 rounded-2xl bg-[#F0E9E0] flex items-center justify-center"><X /></button>
        </div>

        {step === 'cart' ? (
          <>
            <div className="space-y-3">
              {cart.map((item, index) => (
                <div key={item.key} className="flex gap-3 p-3 bg-white border border-[#2A1E1A]/10 rounded-2xl">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F4B27A] to-[#C8523B] flex items-center justify-center text-white font-['Fredoka'] text-2xl font-bold">{item.name.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2"><strong className="font-['Fredoka'] text-lg truncate">{item.name}</strong><button onClick={() => onRemove(index)} className="text-[#C8523B]"><Trash2 className="w-4 h-4" /></button></div>
                    <small className="block text-xs text-[#756965] truncate">{[...(item.options || []), item.note].filter(Boolean).join(' · ') || 'Pesanan original'}</small>
                    <div className="flex items-center justify-between mt-2"><div className="flex items-center gap-2"><button onClick={() => onUpdateQty(index, -1)} className="w-7 h-7 rounded-lg bg-[#FFF8E7] flex items-center justify-center"><Minus className="w-3 h-3" /></button><b>{item.quantity}</b><button onClick={() => onUpdateQty(index, 1)} className="w-7 h-7 rounded-lg bg-[#FFF8E7] flex items-center justify-center"><Plus className="w-3 h-3" /></button></div><strong className="text-[#C8523B]">{rupiah(item.price * item.quantity)}</strong></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between py-5 border-b border-[#2A1E1A]/10 font-['Fredoka'] text-xl font-bold"><span>Total</span><span>{rupiah(subtotal)}</span></div>
            <button onClick={() => setStep('checkout')} className="w-full mt-5 min-h-[58px] rounded-3xl bg-[#C8523B] text-white font-extrabold shadow-[0_8px_0_#9B3525] flex items-center justify-center gap-2">Lanjut Checkout <ArrowRight className="w-5 h-5" /></button>
          </>
        ) : (
          <form onSubmit={placeOrder} className="space-y-4">
            {['name', 'phone'].map(field => <input key={field} required value={customer[field]} onChange={e => setCustomer({ ...customer, [field]: e.target.value })} placeholder={field === 'name' ? 'Nama kamu' : 'Nomor WhatsApp'} className="w-full min-h-[50px] rounded-2xl bg-white border border-[#2A1E1A]/10 px-4 outline-none focus:ring-4 focus:ring-[#C8523B]/15" />)}
            <select value={customer.orderType} onChange={e => setCustomer({ ...customer, orderType: e.target.value })} className="w-full min-h-[50px] rounded-2xl bg-white border border-[#2A1E1A]/10 px-4"><option>Dine In</option><option>Take Away</option></select>
            <textarea value={customer.note} onChange={e => setCustomer({ ...customer, note: e.target.value })} placeholder="Catatan pesanan (opsional)" className="w-full min-h-[80px] rounded-2xl bg-white border border-[#2A1E1A]/10 p-4 resize-none" />
            <div className="p-3 bg-white rounded-2xl border border-[#2A1E1A]/10"><label className="flex items-center gap-2 text-sm font-extrabold mb-2"><Tag className="w-4 h-4 text-[#ED7B35]" /> Kode Promo</label><div className="flex gap-2"><input value={promoCode} onChange={e => setPromoCode(e.target.value.toUpperCase())} placeholder="WELCOME10" className="flex-1 min-h-[44px] rounded-xl bg-[#FFF8E7] px-3 font-bold outline-none" /><button type="button" onClick={applyPromo} className="px-4 rounded-xl bg-[#2A1E1A] text-white font-bold">Pakai</button></div>{promoMessage && <p className={`text-xs font-bold mt-2 ${promo ? 'text-[#4B805A]' : 'text-[#C8523B]'}`}>{promoMessage}</p>}</div>
            <div className="bg-[#FFF8E7] rounded-2xl p-4 space-y-2 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>{rupiah(subtotal)}</span></div>{discount > 0 && <div className="flex justify-between text-[#4B805A] font-bold"><span>Diskon</span><span>-{rupiah(discount)}</span></div>}<div className="flex justify-between border-t border-[#2A1E1A]/10 pt-2 font-['Fredoka'] text-xl font-bold"><span>Total</span><span>{rupiah(total)}</span></div></div>
            <button disabled={loading} className="w-full min-h-[58px] rounded-3xl bg-[#C8523B] text-white font-extrabold shadow-[0_8px_0_#9B3525] flex items-center justify-center gap-2 disabled:opacity-60">{loading ? <LoaderCircle className="animate-spin" /> : 'Buat Pesanan · ' + rupiah(total)}</button>
          </form>
        )}
      </div>
    </div>
  );
}

function rupiah(value) { return 'Rp' + Number(value || 0).toLocaleString('id-ID'); }
