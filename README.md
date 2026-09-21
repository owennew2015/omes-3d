# OME'S 3D Café - Full Stack Web App

🎉 **Interactive 3D menu ordering system** dengan React Three Fiber + Google Apps Script backend.

## 🚀 Quick Start

### 1️⃣ Frontend (Vercel)

**Development:**
```bash
cd ome-3d
npm install
npm run dev
```

Dev server: http://localhost:5173

**Production Build:**
```bash
npm run build
npm run preview
```

### 2️⃣ Backend (Google Apps Script)

1. Buka Google Sheets baru
2. **Extensions → Apps Script**
3. Copy-paste file berikut:
   - `code.gs` (dari `C:\Users\LENOVO\AppData\Local\Temp\opencode\code.gs`)
   - `setup.gs` (dari `C:\Users\LENOVO\AppData\Local\Temp\opencode\setup.gs`)
   - `admin.html` (dari `C:\Users\LENOVO\AppData\Local\Temp\opencode\admin.html`)
   - `index.html` (dari `C:\Users\LENOVO\AppData\Local\Temp\opencode\index.html`) - **optional legacy HTML**

4. Jalankan fungsi `setupCafeOmes()` dari Apps Script editor
5. **Deploy → New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Copy **Web App URL** (contoh: `https://script.google.com/macros/s/AKfy.../exec`)

### 3️⃣ Connect Frontend ↔ Backend

Di folder `ome-3d`, edit file `.env`:
```env
VITE_GAS_API=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Restart dev server (`npm run dev`).

---

## 📦 Features

### ✅ Frontend (React + Three.js)
- 🎨 **3D Interactive Hero Scene** dengan floating menu items
- 🍔 **3D Menu Cards** - setiap item punya model 3D yang bisa di-rotate
- 🛒 **Cart + Checkout** dengan promo code validation
- 📍 **Order Tracking** real-time
- 💬 **WhatsApp Integration** - floating button & konfirmasi order
- 📱 **Fully Responsive** - mobile & desktop

### ✅ Backend (Google Apps Script)
- 📊 **Google Sheets Database** (Menu, Orders, Promo, Config)
- 🔄 **JSON API Endpoints** untuk semua operasi
- 🎟️ **Promo Code System** (percentage & fixed discount)
- 📲 **WhatsApp Notifications** (optional, perlu API key)
- 🛡️ **Admin Dashboard** (`?page=admin` di GAS URL)

---

## 🎨 Tech Stack

**Frontend:**
- ⚛️ React 19 + Vite
- 🌐 Three.js + React Three Fiber + Drei
- 🎨 Tailwind CSS v4 (custom OME'S theme)
- 🎭 Lucide React Icons
- 📱 React Router DOM

**Backend:**
- 📊 Google Sheets (database)
- ⚡ Google Apps Script (API + HTML legacy support)
- 🔗 ContentService (JSON responses)

---

## 📂 Project Structure

```
ome-3d/
├── src/
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── CupModel.jsx         # 3D Coffee Cup
│   │   │   ├── BurgerModel.jsx      # 3D Burger
│   │   │   ├── DrinkModel.jsx       # 3D Cold Drink
│   │   │   ├── DonutModel.jsx       # 3D Cookie/Donut
│   │   │   ├── ItemCanvas.jsx       # 3D Item Wrapper
│   │   │   └── HeroScene.jsx        # Main 3D Hero
│   │   ├── Navbar.jsx
│   │   ├── MenuCard.jsx
│   │   ├── ItemModal.jsx
│   │   └── CartDrawer.jsx
│   ├── services/
│   │   └── api.js                   # API layer + mock data
│   ├── App.jsx                       # Main app
│   ├── main.jsx
│   └── index.css                     # Tailwind + OME'S tokens
├── .env                              # GAS API URL
├── vite.config.js
└── package.json
```

---

## 🔧 Configuration

### WhatsApp Notifications (Optional)

Di Google Sheets sheet **Config**, set:
- `wa_enabled` = `true`
- `wa_api_key` = your Twilio/WA Business API key
- `wa_api_url` = your WhatsApp API endpoint
- `support_phone` = `628123456789` (format: country code + number)

### Promo Codes

Edit sheet **Promo**:
- `Kode` = promo code (uppercase)
- `Tipe` = `Percentage` atau `Fixed`
- `Nilai` = discount value (10 for 10%, atau 5000 for Rp5k)
- `Min Order` = minimal subtotal
- `Aktif` = `true` untuk enable

---

## 🚀 Deploy to Vercel

1. Push `ome-3d` folder ke GitHub:
```bash
cd ome-3d
git init
git add .
git commit -m "Initial OME'S 3D Cafe"
git remote add origin https://github.com/YOUR_USERNAME/omes-3d-cafe.git
git push -u origin main
```

2. Import di Vercel:
   - Vercel dashboard → **New Project**
   - Import GitHub repo
   - Framework: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`

3. Add Environment Variable di Vercel:
   - Key: `VITE_GAS_API`
   - Value: `https://script.google.com/macros/s/YOUR_ID/exec`

4. Deploy! 🎉

---

## 🎯 Admin Access

**Admin Dashboard (GAS Legacy):**
- URL: `https://script.google.com/macros/s/YOUR_ID/exec?page=admin`
- Features: Order management, status update, WhatsApp send

**Frontend Admin Button:**
- Klik **Admin** di navbar → temporary placeholder
- Full admin dashboard ada di GAS URL di atas

---

## 📸 Screenshots & Demo

- **Hero 3D Scene**: Floating coffee, burger, drink dengan lighting sinematik
- **Menu Grid**: 3D preview untuk setiap item, hover untuk rotate
- **Cart**: Smooth drawer dengan promo code input
- **Order Tracking**: Visual stepper dengan status real-time

---

## 🤝 Support

Butuh bantuan? 
- **Frontend issues**: Check console browser (F12)
- **Backend issues**: Check Apps Script execution logs
- **CORS errors**: Pastikan GAS deployed sebagai "Anyone" access

---

## 📜 License

MIT License - Free to use untuk personal & commercial projects.

---

**Built with 💪 by OpenCode AI + UI/UX Pro Max Skill**
