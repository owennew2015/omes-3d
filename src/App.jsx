import React, { useEffect, useMemo, useState } from 'react';
import { Search, MessageCircle, X, CheckCircle2, PackageSearch, TicketPercent, Sparkles } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroScene } from './components/3d/HeroScene';
import { MenuCard } from './components/MenuCard';
import { ItemModal } from './components/ItemModal';
import { CartDrawer } from './components/CartDrawer';
import { fetchMenu, fetchPromos, fetchShopInfo, trackOrder } from './services/api';
import './index.css';

const rupiah = value => 'Rp' + Number(value || 0).toLocaleString('id-ID');

function App() {
  const [menu, setMenu] = useState([]);
  const [promos, setPromos] = useState([]);
  const [shop, setShop] = useState({ supportPhone: '6281234567890' });
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [trackOpen, setTrackOpen] = useState(false);
  const [trackId, setTrackId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    Promise.all([fetchMenu(), fetchPromos(), fetchShopInfo()]).then(([items, activePromos, info]) => {
      setMenu(items);
      setPromos(activePromos);
      setShop(info);
    });
  }, []);

  const categories = useMemo(() => ['All', ...new Set(menu.map(item => item.Kategori))], [menu]);
  const visibleMenu = useMemo(() => menu.filter(item => {
    const text = `${item.Nama} ${item.Deskripsi} ${item.Kategori}`.toLowerCase();
    return (category === 'All' || item.Kategori === category) && (!search || text.includes(search.toLowerCase()));
  }), [menu, category, search]);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = item => {
    setCart(prev => [...prev, { ...item, key: Date.now() + Math.random() }]);
  };
  const updateQty = (index, delta) => setCart(prev => prev.flatMap((item, i) => i !== index ? [item] : item.quantity + delta <= 0 ? [] : [{ ...item, quantity: item.quantity + delta }]));
  const removeItem = index => setCart(prev => prev.filter((_, i) => i !== index));
  const handleOrderSuccess = result => { setCart([]); setCartOpen(false); setTicket(result); };
  const checkOrder = async () => setTrackedOrder(await trackOrder(trackId));
  const waLink = `https://wa.me/${shop.supportPhone}?text=${encodeURIComponent("Halo OME'S, saya mau tanya menu.")}`;

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar onOpenTrack={() => setTrackOpen(true)} onOpenAdmin={() => setAdmin(!admin)} cartCount={cartCount} onOpenCart={() => setCartOpen(true)} isAdmin={admin} />
      {admin ? <AdminPlaceholder onExit={() => setAdmin(false)} /> : <main className="max-w-6xl mx-auto px-4 md:px-8 pb-32">
        <section className="grid lg:grid-cols-[1fr_1.2fr] gap-8 items-center pt-8 md:pt-14">
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFF8E7] border border-[#ED7B35]/30 rounded-full text-[#651313] font-extrabold text-xs uppercase tracking-widest"><Sparkles className="w-4 h-4 text-[#ED7B35]" /> Good Mood Food Club</div>
            <h1 className="font-['Fredoka'] font-extrabold uppercase text-[clamp(4rem,10vw,7.5rem)] leading-[.75] tracking-[-.09em] mt-6 text-[#651313]">OME'S<br /><span className="text-[#C8523B]">MENU</span></h1>
            <p className="max-w-md mt-7 text-lg leading-relaxed text-[#756965]">Bold bites. Cozy drinks. Satu café 3D untuk mood terbaikmu.</p>
            <button onClick={() => document.getElementById('menus').scrollIntoView({ behavior: 'smooth' })} className="mt-7 px-6 py-4 rounded-2xl bg-[#2A1E1A] text-[#FFF8E7] font-extrabold shadow-lg hover:bg-[#C8523B] transition-colors">Explore 3D Menu</button>
          </div>
          <HeroScene />
        </section>

        {promos.length > 0 && <section className="mt-12"><div className="flex items-center gap-2 mb-4 font-['Fredoka'] font-extrabold text-2xl"><TicketPercent className="w-6 h-6 text-[#ED7B35]" /> Promo Hari Ini</div><div className="flex gap-3 overflow-x-auto pb-3">{promos.map(p => <div key={p.Kode} className="min-w-[270px] p-5 rounded-3xl bg-gradient-to-br from-[#FFF3D6] to-[#FFE2B8] border-2 border-dashed border-[#ED7B35] shadow-sm"><span className="text-xs font-extrabold bg-[#ED7B35] text-white px-2 py-1 rounded-lg">{p.Tipe === 'Percentage' ? `${p.Nilai}% OFF` : `HEMAT ${rupiah(p.Nilai)}`}</span><h3 className="font-['Fredoka'] font-extrabold text-xl text-[#651313] mt-3">{p.Kode}</h3><p className="text-sm text-[#756965] mt-1">{p.Deskripsi}</p></div>)}</div></section>}

        <section id="menus" className="mt-12"><div className="flex flex-col md:flex-row md:items-end justify-between gap-4"><div><p className="font-bold uppercase tracking-widest text-xs text-[#C8523B]">Interactive food universe</p><h2 className="font-['Fredoka'] font-extrabold text-4xl mt-2">Pick your mood</h2></div><div className="relative w-full md:w-80"><Search className="absolute left-4 top-3.5 text-[#C8523B] w-5 h-5" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari menu favoritmu..." className="w-full bg-white min-h-[50px] rounded-2xl border border-[#2A1E1A]/10 pl-12 pr-4 outline-none focus:ring-4 focus:ring-[#C8523B]/15" /></div></div><div className="flex gap-2 overflow-x-auto py-5">{categories.map(c => <button key={c} onClick={() => setCategory(c)} className={`flex-none px-5 py-2.5 rounded-full text-sm font-extrabold transition-all ${category === c ? 'bg-[#C8523B] text-white shadow-md -rotate-2' : 'bg-white border border-[#2A1E1A]/10 text-[#2A1E1A]'}`}>{c === 'All' ? 'Semua Menu' : c}</button>)}</div><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{visibleMenu.map((item, i) => <MenuCard key={item.ID} item={item} onSelect={setSelected} index={i} />)}</div></section>
      </main>}
      <a href={waLink} target="_blank" rel="noreferrer" className="fixed z-30 bottom-5 right-5 w-14 h-14 rounded-full bg-[#25D366] text-white grid place-items-center shadow-xl hover:scale-110 transition-transform"><MessageCircle className="w-7 h-7" /></a>
      {selected && <ItemModal item={selected} onClose={() => setSelected(null)} onAdd={addToCart} />}
      {cartOpen && <CartDrawer cart={cart} onClose={() => setCartOpen(false)} onUpdateQty={updateQty} onRemove={removeItem} onOrderSuccess={handleOrderSuccess} />}
      {trackOpen && <TrackModal id={trackId} setId={setTrackId} order={trackedOrder} onCheck={checkOrder} onClose={() => setTrackOpen(false)} />}
      {ticket && <TicketModal result={ticket} shop={shop} onClose={() => setTicket(null)} onTrack={() => { setTrackId(ticket.orderId); setTicket(null); setTrackOpen(true); }} />}
    </div>
  );
}

function TrackModal({ id, setId, order, onCheck, onClose }) { const steps = ['Pesanan Masuk','Sedang Dibuat','Siap Diambil','Selesai']; const current = order ? Math.max(0, steps.indexOf(order.status)) : 0; return <div className="fixed inset-0 z-50 bg-[#2A1E1A]/60 backdrop-blur-sm flex items-end md:items-center justify-center"><div className="bg-[#FDFBF7] w-full max-w-md rounded-t-[32px] md:rounded-[32px] p-6"><div className="flex justify-between mb-5"><h2 className="font-['Fredoka'] text-3xl font-extrabold">Lacak pesanan</h2><button onClick={onClose}><X /></button></div><div className="flex gap-2"><input value={id} onChange={e => setId(e.target.value.toUpperCase())} placeholder="OME-0001" className="flex-1 min-h-[50px] rounded-2xl border border-[#2A1E1A]/10 px-4 font-bold" /><button onClick={onCheck} className="px-5 rounded-2xl bg-[#2A1E1A] text-white font-bold">Lacak</button></div>{order && <div className="mt-6 bg-[#FFF8E7] p-4 rounded-3xl"><h3 className="font-['Fredoka'] font-extrabold text-xl">{order.orderId}</h3><p className="text-sm text-[#756965]">{order.orderType} · {rupiah(order.total)}</p><div className="mt-5 space-y-4">{steps.map((step,i) => <div key={step} className="flex gap-3 items-center"><span className={`w-7 h-7 rounded-full grid place-items-center ${i <= current ? 'bg-[#C8523B] text-white' : 'bg-[#DECFC3]'}`}>{i <= current ? '✓' : ''}</span><b className={i === current ? 'text-[#C8523B]' : ''}>{step}</b></div>)}</div></div>}</div></div> }
function TicketModal({ result, shop, onClose, onTrack }) { const link = `https://wa.me/${result.adminPhone || shop.supportPhone}?text=${encodeURIComponent(`Halo OME'S, order saya ${result.orderId}.`)}`; return <div className="fixed inset-0 z-50 bg-[#2A1E1A]/60 backdrop-blur-sm grid place-items-center p-5"><div className="bg-[#FDFBF7] max-w-md w-full rounded-[32px] p-7 text-center"><div className="w-24 h-24 mx-auto rounded-full border-4 border-dashed border-[#C8523B] grid place-items-center text-[#C8523B] font-['Fredoka'] font-extrabold text-xl rotate-[-8deg]">ORDER<br/>IN!</div><h2 className="font-['Fredoka'] text-3xl font-extrabold mt-6">Pesanan masuk!</h2><p className="text-[#756965] mt-2">Terima kasih, {result.customerName}.</p><div className="my-5 py-4 bg-[#FFF8E7] rounded-2xl font-['Fredoka'] text-3xl font-extrabold text-[#C8523B]">{result.orderId}</div><p className="font-bold">Total bayar {rupiah(result.total)}</p><a href={link} target="_blank" rel="noreferrer" className="block mt-5 py-4 rounded-2xl bg-[#25D366] text-white font-extrabold">Konfirmasi WhatsApp</a><button onClick={onTrack} className="w-full mt-3 py-4 rounded-2xl bg-[#C8523B] text-white font-extrabold">Lacak pesanan</button><button onClick={onClose} className="mt-4 text-sm font-bold text-[#756965]">Kembali ke menu</button></div></div> }
function AdminPlaceholder({ onExit }) { return <main className="max-w-4xl mx-auto p-6 md:p-12"><button onClick={onExit} className="text-[#C8523B] font-bold">← Kembali ke menu</button><div className="mt-6 p-8 rounded-[32px] bg-[#651313] text-[#FFF8E7]"><PackageSearch className="w-12 h-12 text-[#ED7B35]"/><h1 className="font-['Fredoka'] text-5xl font-extrabold mt-5">OME'S ADMIN</h1><p className="mt-3 opacity-80">Dashboard admin ada di Apps Script: tambahkan <b>?page=admin</b> pada URL GAS. Frontend Vercel fokus customer 3D experience.</p></div></main> }
export default App;
