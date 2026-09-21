# 🚀 DEPLOYMENT GUIDE - OME'S 3D CAFÉ

## ✅ PHASE 1: Deploy Backend (Google Apps Script)

### Step 1: Buat Google Sheets Baru
1. Buka https://sheets.google.com (login sebagai owennew2015@gmail.com)
2. Klik **Blank spreadsheet**
3. Rename jadi **"OME'S Cafe 3D Database"**

### Step 2: Buka Apps Script Editor
1. Di Google Sheets, klik menu **Extensions** → **Apps Script**
2. Browser akan buka Apps Script editor

### Step 3: Copy Backend Files

**File 1: code.gs**
1. Di Apps Script editor, hapus semua kode default
2. Copy SEMUA isi dari file: `C:\Users\LENOVO\AppData\Local\Temp\opencode\code.gs`
3. Paste ke editor
4. Save (Ctrl+S)

**File 2: setup.gs**
1. Klik **+** di samping Files → **Script**
2. Nama: `setup`
3. Copy SEMUA isi dari: `C:\Users\LENOVO\AppData\Local\Temp\opencode\setup.gs`
4. Paste & Save

**File 3: admin.html (optional)**
1. Klik **+** → **HTML**
2. Nama: `admin`
3. Copy dari: `C:\Users\LENOVO\AppData\Local\Temp\opencode\admin.html`
4. Paste & Save

### Step 4: Run Setup Function
1. Di Apps Script editor, pilih dropdown function → pilih **setupCafeOmes**
2. Klik tombol **Run** (▶️)
3. Popup "Authorization required" → klik **Review permissions**
4. Pilih account owennew2015@gmail.com
5. Klik **Advanced** → **Go to Untitled project (unsafe)** → **Allow**
6. Wait ~5 detik
7. Kembali ke Google Sheets → refresh → akan ada 4 sheets baru:
   - Menu (dengan 9 sample items)
   - Pesanan_Customer (kosong)
   - Promo (3 promo codes)
   - Config (WhatsApp settings)

### Step 5: Deploy as Web App
1. Di Apps Script editor, klik **Deploy** → **New deployment**
2. Klik icon **⚙️ (gear)** di samping "Select type"
3. Pilih **Web app**
4. Settings:
   - Description: `OME'S 3D Cafe API v1`
   - Execute as: **Me (owennew2015@gmail.com)**
   - Who has access: **Anyone**
5. Klik **Deploy**
6. **COPY WEB APP URL** (format: `https://script.google.com/macros/s/AKfycby...../exec`)
7. Paste URL ini di notepad temporary

---

## ✅ PHASE 2: Deploy Frontend (Vercel via GitHub)

### Step 1: Push to GitHub
```bash
cd C:\Users\LENOVO\ome-3d

# Initialize git (kalau belum)
git init
git add .
git commit -m "OME'S 3D Cafe - Full 3D Interactive Menu"

# Create remote repository
# Buka https://github.com/new
# - Repository name: omes-3d-cafe
# - Public
# - Jangan centang "Initialize with README"
# - Click Create

# Link & push
git remote add origin https://github.com/owennew2015/omes-3d-cafe.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy ke Vercel
1. Buka https://vercel.com/dashboard (login dengan owennew2015@gmail.com)
2. Klik **Add New...** → **Project**
3. Cari & pilih repository **omes-3d-cafe**
4. Klik **Import**
5. Configure Project:
   - **Framework Preset**: Vite (auto-detect)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `dist` (default)
6. **Environment Variables** → klik **Add**:
   - Key: `VITE_GAS_API`
   - Value: [PASTE WEB APP URL dari Phase 1 Step 5]
7. Klik **Deploy**
8. Wait ~2 menit
9. Vercel akan kasih URL: `https://omes-3d-cafe.vercel.app` (atau bisa custom jadi `https://omes.vercel.app`)

### Step 3: Custom Domain (Optional)
1. Di Vercel project settings → **Domains**
2. Add domain: `omes.vercel.app` (atau tetap pakai yang auto-generated)
3. Save

---

## ✅ PHASE 3: Update Config & Test

### Step 1: Update Google Sheets Config
1. Buka Google Sheets "OME'S Cafe 3D Database"
2. Sheet **Config** → row `frontend_url`
3. Value column → paste Vercel URL: `https://omes-3d-cafe.vercel.app`
4. Save

### Step 2: Test End-to-End
1. Buka Vercel URL di browser
2. Test checklist:
   - [ ] 3D Hero scene muncul & bisa di-drag
   - [ ] Menu items load (9 items dari Google Sheets)
   - [ ] Klik item → 3D modal muncul
   - [ ] Add to cart → keranjang update
   - [ ] Checkout → isi form → submit
   - [ ] Dapat order ID (contoh: OME-0001)
   - [ ] Cek Google Sheets "Pesanan_Customer" → order masuk!
   - [ ] Track order → status muncul
   - [ ] Floating WhatsApp button berfungsi

---

## 📋 Quick Reference

**Backend (GAS):**
- Sheets: https://sheets.google.com
- Apps Script: Extensions → Apps Script
- Admin Dashboard: `[GAS_WEB_APP_URL]?page=admin`

**Frontend (Vercel):**
- Project: https://vercel.com/owennew2015/omes-3d-cafe
- Live URL: https://omes-3d-cafe.vercel.app
- Settings: Project Settings → Environment Variables

**Files Location:**
- Backend: `C:\Users\LENOVO\AppData\Local\Temp\opencode\`
- Frontend: `C:\Users\LENOVO\ome-3d\`

---

## 🚨 Troubleshooting

**"Menu items not loading" (masih pakai mock data):**
→ Check `.env` file → VITE_GAS_API benar?
→ Redeploy Vercel dengan env variable yang benar

**"CORS error" di browser console:**
→ GAS deployed dengan "Anyone" access? (bukan "Only me")
→ Redeploy GAS dengan setting yang benar

**"Order tidak masuk ke Sheets":**
→ Check Apps Script → View → Executions
→ Lihat error logs

---

**Start dengan PHASE 1, lalu lanjut PHASE 2. Total waktu: ~20 menit.**
