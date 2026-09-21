/**
 * OME'S CAFE - GOOGLE APPS SCRIPT BACKEND API
 * Supports both JSON API endpoints for Vercel 3D Frontend & legacy HTML output
 */

function doGet(e) {
  e = e || { parameter: {} };
  var action = e.parameter.action;
  
  if (action) {
    return handleApiGet_(e);
  }
  
  var page = e.parameter.page || 'index';
  if (page === 'admin') {
    return HtmlService.createHtmlOutputFromFile('admin')
      .setTitle("OME'S ADMIN")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle("OME'S MENU")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  try {
    var contents = e && e.postData ? JSON.parse(e.postData.contents) : {};
    var action = (e && e.parameter && e.parameter.action) || contents.action;
    
    var result;
    if (action === 'submitOrder') {
      result = submitOrder(contents.payload || contents);
    } else if (action === 'validatePromo') {
      result = validatePromoCode(contents.code, contents.total);
    } else if (action === 'updateOrderStatus') {
      result = { success: updateOrderStatus(contents.orderId, contents.status) };
    } else if (action === 'trackOrder') {
      result = trackOrder(contents.orderId);
    } else {
      result = { error: 'Unknown POST action: ' + action };
    }
    
    return jsonResponse_(result);
  } catch (err) {
    return jsonResponse_({ error: err.message || String(err) });
  }
}

function handleApiGet_(e) {
  var action = e.parameter.action;
  var result;
  
  if (action === 'getMenu') {
    result = getMenu({ search: e.parameter.search, category: e.parameter.category });
  } else if (action === 'getPromos') {
    result = getActivePromos();
  } else if (action === 'getShopInfo') {
    result = getShopInfo();
  } else if (action === 'getAdminOrders') {
    result = getAdminOrders();
  } else if (action === 'trackOrder') {
    result = trackOrder(e.parameter.orderId);
  } else if (action === 'validatePromo') {
    result = validatePromoCode(e.parameter.code, Number(e.parameter.total) || 0);
  } else {
    result = { error: 'Unknown GET action: ' + action };
  }
  
  return jsonResponse_(result);
}

function jsonResponse_(data) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

function getMenu(filters) {
  filters = filters || {};
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(OME_SHEETS.MENU);
  if (!sheet || sheet.getLastRow() < 2) return [];

  var rows = sheet.getDataRange().getDisplayValues();
  var headers = rows.shift();

  var search = String(filters.search || '').toLowerCase().trim();
  var category = String(filters.category || 'All');

  return rows.map(function(row) {
    var item = rowToObject_(headers, row);
    item.price = Number(String(item.Harga).replace(/[^\d]/g, '')) || 0;
    item.active = String(item.Aktif).toLowerCase() === 'true';
    item.options = parseOptions_(item.Pilihan);
    return item;
  }).filter(function(item) {
    var haystack = (item.Nama + ' ' + item.Deskripsi + ' ' + item.Kategori).toLowerCase();
    var categoryMatch = category === 'All' || item.Kategori === category;
    return item.active && categoryMatch && (!search || haystack.indexOf(search) > -1);
  });
}

function getActivePromos() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(OME_SHEETS.PROMO);
  if (!sheet || sheet.getLastRow() < 2) return [];

  var rows = sheet.getDataRange().getDisplayValues();
  var headers = rows.shift();
  var today = new Date();

  return rows.map(function(row) {
    return rowToObject_(headers, row);
  }).filter(function(promo) {
    if (String(promo.Aktif).toLowerCase() !== 'true') return false;
    var start = new Date(promo.Mulai);
    var end = new Date(promo.Berakhir);
    if (today < start || today > end) return false;
    var quota = Number(promo.Kuota) || 0;
    var used = Number(promo.Terpakai) || 0;
    if (quota > 0 && used >= quota) return false;
    return true;
  });
}

function getShopInfo() {
  var config = getWhatsAppConfig_();
  return {
    supportPhone: config.supportPhone || '6281234567890'
  };
}

function submitOrder(payload) {
  if (!payload || !payload.customer || !payload.items || !payload.items.length) {
    throw new Error('Data pesanan belum lengkap.');
  }

  var customer = payload.customer;
  var name = sanitizeText_(customer.name, 80);
  var phone = sanitizeText_(customer.phone, 30);
  var orderType = sanitizeText_(customer.orderType, 30);
  var note = sanitizeText_(customer.note, 300);

  if (!name || !phone || !orderType) {
    throw new Error('Nama, WhatsApp, dan tipe pesanan wajib diisi.');
  }

  var items = payload.items.map(function(item) {
    return {
      id: sanitizeText_(item.id, 40),
      name: sanitizeText_(item.name, 100),
      quantity: Math.max(1, Number(item.quantity) || 1),
      price: Math.max(0, Number(item.price) || 0),
      options: Array.isArray(item.options) ? item.options.map(function(option) {
        return sanitizeText_(option, 80);
      }) : [],
      note: sanitizeText_(item.note, 160)
    };
  });

  var subtotal = items.reduce(function(sum, item) {
    return sum + (item.price * item.quantity);
  }, 0);

  var discount = 0;
  var promoCode = '';
  
  if (payload.promoCode) {
    var promoResult = validatePromoCode(payload.promoCode, subtotal);
    if (promoResult && promoResult.valid) {
      discount = promoResult.discount;
      promoCode = promoResult.code;
    }
  }

  var total = Math.max(0, subtotal - discount);

  var lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(OME_SHEETS.ORDERS);
    if (!sheet) throw new Error('Sheet Pesanan_Customer belum ada. Jalankan setupCafeOmes.');

    var orderId = createDailyOrderId_(sheet);
    var now = new Date();
    var dateKey = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd');

    sheet.appendRow([
      now,
      orderId,
      name,
      phone,
      orderType,
      note,
      JSON.stringify(items),
      total,
      'Pesanan Masuk',
      dateKey,
      promoCode,
      discount,
      subtotal
    ]);

    SpreadsheetApp.flush();

    if (promoCode) {
      applyPromoCode(orderId, promoCode);
    }

    sendWhatsAppNotification_(phone, {
      type: 'new_order',
      orderId: orderId,
      customerName: name,
      status: 'Pesanan Masuk',
      total: total,
      orderType: orderType
    });

    var config = getWhatsAppConfig_();

    return {
      success: true,
      orderId: orderId,
      status: 'Pesanan Masuk',
      total: total,
      discount: discount,
      subtotal: subtotal,
      customerName: name,
      adminPhone: config.supportPhone
    };
  } finally {
    lock.releaseLock();
  }
}

function trackOrder(orderId) {
  var safeOrderId = sanitizeText_(orderId, 30).toUpperCase();
  if (!safeOrderId) return null;

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(OME_SHEETS.ORDERS);
  if (!sheet || sheet.getLastRow() < 2) return null;

  var values = sheet.getDataRange().getDisplayValues();
  var headers = values.shift();

  for (var i = values.length - 1; i >= 0; i--) {
    var item = rowToObject_(headers, values[i]);
    if (String(item.OrderID).toUpperCase() === safeOrderId) {
      var items = [];
      try {
        items = JSON.parse(item['Items JSON'] || '[]');
      } catch (error) {}

      return {
        orderId: item.OrderID,
        customerName: item['Nama Customer'],
        orderType: item['Tipe Pesanan'],
        status: item.Status || 'Pesanan Masuk',
        total: Number(String(item.Total).replace(/[^\d]/g, '')) || 0,
        items: items
      };
    }
  }

  return null;
}

function createDailyOrderId_(sheet) {
  var today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  var values = sheet.getDataRange().getDisplayValues();
  var highest = 0;

  for (var i = 1; i < values.length; i++) {
    if (values[i][9] === today) {
      var match = String(values[i][1]).match(/OME-(\d+)/);
      if (match) highest = Math.max(highest, Number(match[1]));
    }
  }

  return 'OME-' + ('0000' + (highest + 1)).slice(-4);
}

function parseOptions_(value) {
  if (!value) return [];
  return String(value).split(';').filter(Boolean).map(function(group) {
    return group.split('|').filter(Boolean);
  });
}

function rowToObject_(headers, row) {
  var output = {};
  headers.forEach(function(header, index) {
    output[header] = row[index] || '';
  });
  return output;
}

function sanitizeText_(value, maxLength) {
  return String(value || '')
    .replace(/[<>{}[\]\\]/g, '')
    .trim()
    .slice(0, maxLength);
}

function getAdminOrders() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(OME_SHEETS.ORDERS);
  if (!sheet || sheet.getLastRow() < 2) return [];

  var rows = sheet.getDataRange().getDisplayValues();
  var headers = rows.shift();

  return rows.map(function(row) {
    return rowToObject_(headers, row);
  }).reverse();
}

function updateOrderStatus(orderId, newStatus) {
  var safeOrderId = sanitizeText_(orderId, 30).toUpperCase();
  var safeStatus = sanitizeText_(newStatus, 50);
  
  if (!safeOrderId || !safeStatus) return false;

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(OME_SHEETS.ORDERS);
  if (!sheet || sheet.getLastRow() < 2) return false;

  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  var orderIdCol = headers.indexOf('OrderID');
  var statusCol = headers.indexOf('Status');

  if (orderIdCol < 0 || statusCol < 0) return false;

  for (var i = 1; i < values.length; i++) {
    if (String(values[i][orderIdCol]).toUpperCase() === safeOrderId) {
      sheet.getRange(i + 1, statusCol + 1).setValue(safeStatus);
      
      var phone = String(values[i][headers.indexOf('Nomor WhatsApp')]);
      var customerName = String(values[i][headers.indexOf('Nama Customer')]);
      
      sendWhatsAppNotification_(phone, {
        orderId: safeOrderId,
        customerName: customerName,
        status: safeStatus
      });
      
      SpreadsheetApp.flush();
      return true;
    }
  }

  return false;
}

function sendWhatsAppNotification_(phone, data) {
  var cleanPhone = String(phone).replace(/\D/g, '');
  if (!cleanPhone || cleanPhone.length < 10) return;

  var config = getWhatsAppConfig_();
  if (!config.enabled || !config.apiKey) return;

  var message = '';
  var statusEmoji = {
    'Pesanan Masuk': '✅',
    'Sedang Dibuat': '👨‍🍳',
    'Siap Diambil': '🎉',
    'Selesai': '✨'
  };
  
  if (data.type === 'new_order') {
    message = 'Halo ' + data.customerName + '!\n\n' +
              'Pesanan OME\'S kamu sudah kami terima:\n' +
              'Order ID: ' + data.orderId + '\n' +
              'Total: ' + formatRupiah_(data.total) + '\n' +
              'Tipe: ' + data.orderType + '\n\n' +
              'Status: ' + data.status + '\n\n' +
              'Terima kasih!';
  } else {
    message = 'Update Pesanan ' + data.orderId + ' ' + (statusEmoji[data.status] || '') + ':\n\n' +
              'Status sekarang: ' + data.status + '\n\n';
    
    if (data.status === 'Siap Diambil') {
      message += 'Pesanan kamu sudah siap! Yuk ambil di counter.';
    } else if (data.status === 'Selesai') {
      message += 'Terima kasih sudah pesan di OME\'S! Sampai jumpa lagi!';
    } else {
      message += 'Kami sedang proses pesanan kamu dengan sepenuh hati!';
    }
  }

  try {
    var payload = {
      phone: cleanPhone,
      message: message
    };

    var options = {
      method: 'post',
      contentType: 'application/json',
      headers: {
        'Authorization': 'Bearer ' + config.apiKey
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    UrlFetchApp.fetch(config.apiUrl, options);
  } catch (error) {
    Logger.log('WhatsApp send failed: ' + error.message);
  }
}

function getWhatsAppConfig_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var configSheet = ss.getSheetByName(OME_SHEETS.CONFIG);
  
  if (!configSheet || configSheet.getLastRow() < 2) {
    return {
      enabled: false,
      apiKey: '',
      apiUrl: '',
      supportPhone: '6281234567890'
    };
  }

  var values = configSheet.getDataRange().getValues();
  var config = {};
  
  for (var i = 1; i < values.length; i++) {
    config[values[i][0]] = values[i][1];
  }

  return {
    enabled: config.wa_enabled === 'true' || config.wa_enabled === true,
    apiKey: config.wa_api_key || '',
    apiUrl: config.wa_api_url || '',
    supportPhone: String(config.support_phone || '6281234567890').replace(/\D/g, '')
  };
}

function validatePromoCode(code, orderTotal) {
  var safeCode = sanitizeText_(code, 30).toUpperCase();
  if (!safeCode) return null;

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(OME_SHEETS.PROMO);
  if (!sheet || sheet.getLastRow() < 2) return null;

  var rows = sheet.getDataRange().getDisplayValues();
  var headers = rows.shift();

  for (var i = 0; i < rows.length; i++) {
    var promo = rowToObject_(headers, rows[i]);
    
    if (String(promo.Kode).toUpperCase() !== safeCode) continue;
    if (String(promo.Aktif).toLowerCase() !== 'true') continue;

    var minOrder = Number(String(promo['Min Order']).replace(/[^\d]/g, '')) || 0;
    if (orderTotal < minOrder) {
      return {
        valid: false,
        message: 'Minimal order ' + formatRupiah_(minOrder)
      };
    }

    var today = new Date();
    var startDate = new Date(promo['Mulai']);
    var endDate = new Date(promo['Berakhir']);
    
    if (today < startDate || today > endDate) {
      return {
        valid: false,
        message: 'Promo sudah tidak berlaku'
      };
    }

    var quota = Number(promo.Kuota) || 0;
    var used = Number(promo.Terpakai) || 0;
    
    if (quota > 0 && used >= quota) {
      return {
        valid: false,
        message: 'Kuota promo sudah habis'
      };
    }

    var discount = 0;
    var type = String(promo.Tipe);
    var value = Number(String(promo.Nilai).replace(/[^\d]/g, '')) || 0;

    if (type === 'Percentage') {
      discount = Math.floor(orderTotal * value / 100);
      var maxDisc = Number(String(promo['Max Diskon']).replace(/[^\d]/g, '')) || 999999999;
      discount = Math.min(discount, maxDisc);
    } else if (type === 'Fixed') {
      discount = value;
    }

    return {
      valid: true,
      code: promo.Kode,
      discount: discount,
      description: promo.Deskripsi,
      message: 'Promo berhasil diterapkan!'
    };
  }

  return {
    valid: false,
    message: 'Kode promo tidak valid'
  };
}

function applyPromoCode(orderId, promoCode) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(OME_SHEETS.PROMO);
  if (!sheet || sheet.getLastRow() < 2) return false;

  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  var codeCol = headers.indexOf('Kode');
  var usedCol = headers.indexOf('Terpakai');

  if (codeCol < 0 || usedCol < 0) return false;

  for (var i = 1; i < values.length; i++) {
    if (String(values[i][codeCol]).toUpperCase() === String(promoCode).toUpperCase()) {
      var currentUsed = Number(values[i][usedCol]) || 0;
      sheet.getRange(i + 1, usedCol + 1).setValue(currentUsed + 1);
      SpreadsheetApp.flush();
      return true;
    }
  }

  return false;
}

function formatRupiah_(value) {
  return 'Rp' + Number(value || 0).toLocaleString('id-ID');
}
