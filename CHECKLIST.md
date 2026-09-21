# OME'S 3D CAFÉ - DEPLOYMENT CHECKLIST

## 🎯 BACKEND (Google Apps Script) - DO THIS FIRST

### ✅ Step 1: Create Google Sheets
- [ ] Go to https://sheets.google.com
- [ ] Login: owennew2015@gmail.com
- [ ] Create blank spreadsheet
- [ ] Rename to: "OME'S Cafe 3D Database"

### ✅ Step 2: Setup Apps Script
- [ ] Extensions → Apps Script
- [ ] Copy `code.gs` from: C:\Users\LENOVO\AppData\Local\Temp\opencode\code.gs
- [ ] Copy `setup.gs` from: C:\Users\LENOVO\AppData\Local\Temp\opencode\setup.gs
- [ ] (Optional) Copy `admin.html` from: C:\Users\LENOVO\AppData\Local\Temp\opencode\admin.html

### ✅ Step 3: Run Setup
- [ ] Apps Script editor → Select function: **setupCafeOmes**
- [ ] Click **Run** (▶️)
- [ ] Authorize when prompted
- [ ] Back to Google Sheets → Refresh
- [ ] Verify 4 sheets created: Menu, Pesanan_Customer, Promo, Config

### ✅ Step 4: Deploy Web App
- [ ] Apps Script → **Deploy** → **New deployment**
- [ ] Type: **Web app**
- [ ] Execute as: **Me (owennew2015@gmail.com)**
- [ ] Access: **Anyone**
- [ ] Click **Deploy**
- [ ] 🔑 **COPY WEB APP URL** → Save in notepad!

**Format:** `https://script.google.com/macros/s/AKfycby.../exec`

---

## 🎯 FRONTEND (Vercel) - DO THIS SECOND

### ✅ Step 5: Install GitHub Desktop
- [ ] Download: https://desktop.github.com/
- [ ] Install & sign in: owennew2015@gmail.com

### ✅ Step 6: Publish to GitHub
- [ ] GitHub Desktop → File → Add Local Repository
- [ ] Path: C:\Users\LENOVO\ome-3d
- [ ] Create Repository (name: omes-3d-cafe)
- [ ] Click **Publish repository** (make it PUBLIC)

### ✅ Step 7: Deploy to Vercel
- [ ] Go to: https://vercel.com/dashboard
- [ ] Add New → Project
- [ ] Import: omes-3d-cafe repository
- [ ] Framework: Vite (auto)
- [ ] Add Environment Variable:
  - Key: `VITE_GAS_API`
  - Value: [PASTE WEB APP URL from Step 4]
- [ ] Click **Deploy**
- [ ] 🎉 Wait ~2-3 minutes
- [ ] Get Vercel URL: `https://omes-3d-cafe.vercel.app`

---

## ✅ POST-DEPLOYMENT

### Step 8: Update Config
- [ ] Google Sheets → Config sheet
- [ ] Row: `frontend_url` → Value: `https://omes-3d-cafe.vercel.app`

### Step 9: TEST EVERYTHING
- [ ] [ ] Open Vercel URL
- [ ] [ ] 3D hero scene loads & drag works
- [ ] [ ] 9 menu items load from Sheets (NOT mock)
- [ ] [ ] Click item → 3D modal opens
- [ ] [ ] Add to cart works
- [ ] [ ] Checkout form works
- [ ] [ ] Submit order → get Order ID (OME-0001)
- [ ] [ ] Check Google Sheets "Pesanan_Customer" → order appears
- [ ] [ ] Track order feature works
- [ ] [ ] WhatsApp button works (floating circle bottom-right)

---

## 📞 SUPPORT LINKS

| Component | Link |
|-----------|------|
| Google Sheets | https://sheets.google.com |
| Apps Script | [Sheets] Extensions → Apps Script |
| Admin Dashboard | [GAS_URL]?page=admin |
| Vercel Project | https://vercel.com/owennew2015/omes-3d-cafe |
| GitHub Repo | https://github.com/owennew2015/omes-3d-cafe |
| Frontend Live | https://omes-3d-cafe.vercel.app |

---

## 🚨 IF SOMETHING BREAKS

**Menu items not loading?**
→ Check Vercel env variable `VITE_GAS_API` is correct
→ Redeploy Vercel (Settings → Deployments → Redeploy)

**CORS error?**
→ GAS must be deployed with "Anyone" access (not "Only me")
→ Redeploy GAS with correct permission

**Order not appearing?**
→ Apps Script → View → Executions (check for errors)

---

**Total Time: ~30 minutes**
**Status: Ready to deploy! Follow checklist above step-by-step.**
