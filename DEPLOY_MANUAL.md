# 🚀 DEPLOY FRONTEND KE VERCEL - MANUAL STEPS (NO GIT CLI)

## Step 1: Install GitHub Desktop
1. Download: https://desktop.github.com/
2. Install & open
3. Sign in dengan: **owennew2015@gmail.com**

## Step 2: Publish Repository
1. Di GitHub Desktop:
   - File → Add Local Repository
   - Path: `C:\Users\LENOVO\ome-3d`
   - Klik **Create a Repository**
2. Di dialog Create:
   - Name: `omes-3d-cafe`
   - Description: `OME'S 3D Interactive Cafe Menu`
   - Local Path: `C:\Users\LENOVO\ome-3d`
   - Klik **Create Repository**
3. Klik tombol **Publish repository**
   - Pastikan "Keep this code private" TIDAK DICENTANG
   - Klik **Publish Repository**
4. GitHub Desktop akan create repository & push ke GitHub

## Step 3: Deploy ke Vercel
1. Buka https://vercel.com/dashboard
2. Login dengan: **owennew2015@gmail.com**
3. Klik **Add New...** → **Project**
4. Klik **Import Git Repository**
5. Cari & pilih: **omes-3d-cafe** (dari GitHub owennew2015)
6. Klik **Import**
7. Configure:
   - Framework: **Vite** (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
8. **Environment Variables** → klik **Add Another**:
   - Key: `VITE_GAS_API`
   - Value: [PASTE WEB APP URL dari GAS deployment]
     Format: `https://script.google.com/macros/s/AKfycby.../exec`
9. Klik **Deploy**
10. Wait 2-3 menit
11. Vercel akan kasih URL: `https://omes-3d-cafe.vercel.app`

## Step 4: Assign Custom Domain (Optional)
1. Di Vercel project dashboard
2. Tab **Settings** → **Domains**
3. Input: `omes.vercel.app`
4. Add domain
5. Update DNS di provider (kalau perlu)

## Step 5: Update .env & Test
1. Di `C:\Users\LENOVO\omes-3d\.env`, pastikan ada:
   ```
   VITE_GAS_API=https://script.google.com/macros/s/AKfycby.../exec
   ```
2. Buka Vercel URL di browser
3. Test: Menu load → Add to cart → Checkout → Order masuk ke Sheets

---

**Selesai! Frontend live di Vercel, Backend di Google Sheets.**
