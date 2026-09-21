const GAS_API_URL = import.meta.env.VITE_GAS_API || '';

const MOCK_MENU = [
  { ID: 'M001', Nama: "Ome's Latte", Kategori: 'Coffee', Deskripsi: 'Espresso creamy dengan susu lembut dan gula aren.', price: 28000, Badge: 'Best Seller', options: [['Hot', 'Ice'], ['Normal', 'Less Sweet', 'No Sugar']], active: true },
  { ID: 'M002', Nama: 'Caramel Cloud', Kategori: 'Coffee', Deskripsi: 'Cold brew, caramel butter, dan foam lembut.', price: 32000, Badge: "Chef's Pick", options: [['Ice'], ['Normal', 'Less Sweet']], active: true },
  { ID: 'M003', Nama: 'Dirty Matcha', Kategori: 'Coffee', Deskripsi: 'Matcha earthy bertemu espresso bold.', price: 33000, Badge: 'New', options: [['Hot', 'Ice'], ['Normal', 'Less Sweet']], active: true },
  { ID: 'M004', Nama: 'Strawberry Milk', Kategori: 'Non Coffee', Deskripsi: 'Susu creamy dengan strawberry jam homemade.', price: 30000, Badge: 'Best Seller', options: [['Ice'], ['Normal', 'Less Sweet']], active: true },
  { ID: 'M005', Nama: 'Peach Tea Pop', Kategori: 'Non Coffee', Deskripsi: 'Teh peach segar dengan citrus sparkle.', price: 26000, Badge: 'New', options: [['Ice'], ['Normal', 'Less Sweet']], active: true },
  { ID: 'M006', Nama: "Ome's Chicken Sando", Kategori: 'Food', Deskripsi: 'Chicken crispy, coleslaw, cheese sauce, roti panggang.', price: 42000, Badge: "Chef's Pick", options: [['Regular', 'Large'], ['Original', 'Spicy']], active: true },
  { ID: 'M007', Nama: 'Smoky Beef Burger', Kategori: 'Food', Deskripsi: 'Patty beef juicy, smoked sauce, onion jam.', price: 48000, Badge: 'Best Seller', options: [['Regular', 'Double Patty'], ['Original', 'Spicy']], active: true },
  { ID: 'M008', Nama: 'Loaded Potato', Kategori: 'Snack', Deskripsi: 'Kentang crispy, cheese sauce, beef crumble.', price: 35000, Badge: 'Popular', options: [['Original', 'Spicy']], active: true },
  { ID: 'M009', Nama: 'Choco Chunk Cookie', Kategori: 'Snack', Deskripsi: 'Cookie hangat, gooey, chunky chocolate.', price: 18000, Badge: 'Sold Out', options: [['Warm']], active: false },
];

const MOCK_PROMOS = [
  { Kode: 'WELCOME10', Deskripsi: 'Diskon 10% untuk pembeli baru', Tipe: 'Percentage', Nilai: 10, 'Min Order': 50000, 'Max Diskon': 50000, Aktif: 'true' },
  { Kode: 'SEHAT5K', Deskripsi: 'Hemat 5 ribu min order 30k', Tipe: 'Fixed', Nilai: 5000, 'Min Order': 30000, Aktif: 'true' }
];

export async function fetchMenu() {
  if (!GAS_API_URL) return MOCK_MENU;
  try {
    const res = await fetch(`${GAS_API_URL}?action=getMenu`);
    const data = await res.json();
    return Array.isArray(data) ? data : MOCK_MENU;
  } catch (e) {
    console.warn('API error, using mock:', e);
    return MOCK_MENU;
  }
}

export async function fetchPromos() {
  if (!GAS_API_URL) return MOCK_PROMOS;
  try {
    const res = await fetch(`${GAS_API_URL}?action=getPromos`);
    const data = await res.json();
    return Array.isArray(data) ? data : MOCK_PROMOS;
  } catch (e) {
    return MOCK_PROMOS;
  }
}

export async function fetchShopInfo() {
  if (!GAS_API_URL) return { supportPhone: '6281234567890' };
  try {
    const res = await fetch(`${GAS_API_URL}?action=getShopInfo`);
    return await res.json();
  } catch (e) {
    return { supportPhone: '6281234567890' };
  }
}

export async function validatePromo(code, total) {
  if (!GAS_API_URL) {
    const safeCode = (code || '').toUpperCase();
    const found = MOCK_PROMOS.find(p => p.Kode === safeCode);
    if (!found) return { valid: false, message: 'Kode promo tidak valid' };
    const minOrder = Number(found['Min Order']) || 0;
    if (total < minOrder) return { valid: false, message: `Minimal order Rp${minOrder.toLocaleString('id-ID')}` };
    let discount = found.Tipe === 'Percentage' ? Math.floor(total * found.Nilai / 100) : found.Nilai;
    if (found['Max Diskon']) discount = Math.min(discount, found['Max Diskon']);
    return { valid: true, code: found.Kode, discount, description: found.Deskripsi, message: 'Promo berhasil diterapkan!' };
  }
  try {
    const res = await fetch(`${GAS_API_URL}?action=validatePromo&code=${encodeURIComponent(code)}&total=${total}`);
    return await res.json();
  } catch (e) {
    return { valid: false, message: 'Gagal validasi promo.' };
  }
}

export async function submitOrder(payload) {
  if (!GAS_API_URL) {
    const fakeId = 'OME-' + Math.floor(1000 + Math.random() * 9000);
    const subtotal = payload.items.reduce((s, i) => s + (i.price * i.quantity), 0);
    return {
      success: true,
      orderId: fakeId,
      status: 'Pesanan Masuk',
      total: subtotal,
      customerName: payload.customer.name,
      adminPhone: '6281234567890'
    };
  }
  try {
    const res = await fetch(`${GAS_API_URL}?action=submitOrder`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' }, // GAS CORS workaround
      body: JSON.stringify({ action: 'submitOrder', payload })
    });
    return await res.json();
  } catch (e) {
    throw new Error('Gagal terhubung ke server.');
  }
}

export async function trackOrder(orderId) {
  if (!GAS_API_URL) {
    return {
      orderId: orderId,
      customerName: 'Customer OME',
      orderType: 'Dine In',
      status: 'Sedang Dibuat',
      total: 60000,
      items: [{ name: "Ome's Latte", quantity: 2 }]
    };
  }
  try {
    const res = await fetch(`${GAS_API_URL}?action=trackOrder&orderId=${encodeURIComponent(orderId)}`);
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function fetchAdminOrders() {
  if (!GAS_API_URL) return [];
  try {
    const res = await fetch(`${GAS_API_URL}?action=getAdminOrders`);
    return await res.json();
  } catch (e) {
    return [];
  }
}

export async function updateOrderStatus(orderId, status) {
  if (!GAS_API_URL) return true;
  try {
    const res = await fetch(`${GAS_API_URL}?action=updateOrderStatus`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'updateOrderStatus', orderId, status })
    });
    const data = await res.json();
    return data.success;
  } catch (e) {
    return false;
  }
}
