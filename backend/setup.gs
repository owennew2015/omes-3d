const OME_SHEETS = {
  MENU: 'Menu',
  ORDERS: 'Pesanan_Customer',
  PROMO: 'Promo',
  CONFIG: 'Config'
};

function setupCafeOmes() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  createMenuSheet_(ss);
  createOrdersSheet_(ss);
  createPromoSheet_(ss);
  createConfigSheet_(ss);
  SpreadsheetApp.flush();
  return 'Setup OME\'S selesai. Deploy GAS sebagai Web App, copy URL-nya, dan paste ke .env file frontend (VITE_GAS_API=your_url_here).';
}

function createMenuSheet_(ss) {
  var sheet = ss.getSheetByName(OME_SHEETS.MENU);
  if (!sheet) sheet = ss.insertSheet(OME_SHEETS.MENU);

  var headers = [
    'ID', 'Nama', 'Kategori', 'Deskripsi', 'Harga',
    'Badge', 'ImageUrl', 'Pilihan', 'Aktif'
  ];

  ensureHeaders_(sheet, headers);

  if (sheet.getLastRow() > 1) return;

  var menu = [
    ['M001', 'Ome\'s Latte', 'Coffee', 'Espresso creamy dengan susu lembut dan gula aren.', 28000, 'Best Seller', '', 'Hot|Ice;Normal|Less Sweet|No Sugar', true],
    ['M002', 'Caramel Cloud', 'Coffee', 'Cold brew, caramel butter, dan foam lembut.', 32000, 'Chef\'s Pick', '', 'Ice;Normal|Less Sweet', true],
    ['M003', 'Dirty Matcha', 'Coffee', 'Matcha earthy bertemu espresso bold.', 33000, 'New', '', 'Hot|Ice;Normal|Less Sweet', true],
    ['M004', 'Strawberry Milk', 'Non Coffee', 'Susu creamy dengan strawberry jam homemade.', 30000, 'Best Seller', '', 'Ice;Normal|Less Sweet', true],
    ['M005', 'Peach Tea Pop', 'Non Coffee', 'Teh peach segar dengan citrus sparkle.', 26000, 'New', '', 'Ice;Normal|Less Sweet', true],
    ['M006', 'Ome\'s Chicken Sando', 'Food', 'Chicken crispy, coleslaw, cheese sauce, roti panggang.', 42000, 'Chef\'s Pick', '', 'Regular|Large;Original|Spicy', true],
    ['M007', 'Smoky Beef Burger', 'Food', 'Patty beef juicy, smoked sauce, onion jam.', 48000, 'Best Seller', '', 'Regular|Double Patty;Original|Spicy', true],
    ['M008', 'Loaded Potato', 'Snack', 'Kentang crispy, cheese sauce, beef crumble.', 35000, 'Popular', '', 'Original|Spicy', true],
    ['M009', 'Choco Chunk Cookie', 'Snack', 'Cookie hangat, gooey, chunky chocolate.', 18000, 'Sold Out', '', 'Warm', false]
  ];

  sheet.getRange(2, 1, menu.length, headers.length).setValues(menu);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, headers.length)
    .setBackground('#C8523B')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold');
  sheet.autoResizeColumns(1, headers.length);
}

function createOrdersSheet_(ss) {
  var sheet = ss.getSheetByName(OME_SHEETS.ORDERS);
  if (!sheet) sheet = ss.insertSheet(OME_SHEETS.ORDERS);

  var headers = [
    'Timestamp', 'OrderID', 'Nama Customer', 'Nomor WhatsApp',
    'Tipe Pesanan', 'Catatan', 'Items JSON', 'Total',
    'Status', 'Tanggal Order', 'Kode Promo', 'Diskon', 'Subtotal'
  ];

  ensureHeaders_(sheet, headers);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, headers.length)
    .setBackground('#2A1E1A')
    .setFontColor('#FFF8E7')
    .setFontWeight('bold');
  sheet.autoResizeColumns(1, headers.length);
}

function createPromoSheet_(ss) {
  var sheet = ss.getSheetByName(OME_SHEETS.PROMO);
  if (!sheet) sheet = ss.insertSheet(OME_SHEETS.PROMO);

  var headers = [
    'Kode', 'Deskripsi', 'Tipe', 'Nilai', 'Max Diskon', 'Min Order',
    'Mulai', 'Berakhir', 'Kuota', 'Terpakai', 'Aktif'
  ];

  ensureHeaders_(sheet, headers);

  if (sheet.getLastRow() > 1) return;

  var promo = [
    ['WELCOME10', 'Diskon 10% untuk pembeli baru', 'Percentage', 10, 50000, 50000, '2026-01-01', '2026-12-31', 100, 0, true],
    ['SEHAT5K', 'Hemat 5 ribu untuk pembelian minimal 30 ribu', 'Fixed', 5000, 5000, 30000, '2026-01-01', '2026-12-31', 999, 0, true],
    ['PAYDAY20', 'Spesial gajian: diskon 20% max 100k', 'Percentage', 20, 100000, 100000, '2026-01-01', '2026-12-31', 50, 0, false]
  ];

  sheet.getRange(2, 1, promo.length, headers.length).setValues(promo);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, headers.length)
    .setBackground('#ED7B35')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold');
  sheet.autoResizeColumns(1, headers.length);
}

function createConfigSheet_(ss) {
  var sheet = ss.getSheetByName(OME_SHEETS.CONFIG);
  if (!sheet) sheet = ss.insertSheet(OME_SHEETS.CONFIG);

  var headers = ['Key', 'Value', 'Keterangan'];

  ensureHeaders_(sheet, headers);

  if (sheet.getLastRow() > 1) return;

  var config = [
    ['wa_enabled', 'false', 'Aktifkan WhatsApp notification (true/false)'],
    ['wa_api_key', '', 'API Key dari WhatsApp service (contoh: Twilio, WhatsApp Business API)'],
    ['wa_api_url', '', 'Endpoint URL WhatsApp API'],
    ['frontend_url', '', 'URL Frontend Vercel (untuk link di notif WA)'],
    ['support_phone', '6281234567890', 'Nomor WhatsApp support untuk tombol floating']
  ];

  sheet.getRange(2, 1, config.length, headers.length).setValues(config);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, headers.length)
    .setBackground('#4B805A')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold');
  sheet.autoResizeColumns(1, headers.length);
}

function ensureHeaders_(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    return;
  }

  var current = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), headers.length))
    .getDisplayValues()[0];

  headers.forEach(function(header, index) {
    if (current[index] !== header) {
      sheet.getRange(1, index + 1).setValue(header);
    }
  });
}
