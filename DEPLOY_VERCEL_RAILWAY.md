# 🚀 Deploy InstantPDF - Vercel + Railway (Easy Method)

## 📋 **Overview**

**Frontend (Vercel):** Host the React app  
**Backend (Railway):** Host the Python API

**Total Time:** ~30 minutes  
**Cost:** FREE tier available! 💰

---

## 🎯 **Step 1: Deploy Backend to Railway** (15 min)

### **A. Sign Up**
1. Go to: https://railway.app/
2. Click **"Start a New Project"**
3. Sign up with GitHub

### **B. Deploy Backend**
1. Click **"Deploy from GitHub repo"**
2. Select your **InstantPDF** repository
3. Railway will auto-detect it's a Python app!

### **C. Configure Environment**
1. Go to **"Variables"** tab
2. Add these:
```
JWT_SECRET=<generate with: python -c "import secrets; print(secrets.token_urlsafe(32))">
DATABASE_URL=postgresql://...  (Railway provides this automatically)
ALLOWED_ORIGINS=https://your-app.vercel.app
MAX_FILE_SIZE_MB=50
FILE_RETENTION_HOURS=24
```

3. Railway will deploy automatically! 🎉

### **D. Get Your Backend URL**
Railway gives you a URL like:  
`https://instantpdf-production.up.railway.app`

**Copy this URL!** You'll need it for frontend.

---

## 🎯 **Step 2: Deploy Frontend to Vercel** (10 min)

### **A. Sign Up**
1. Go to: https://vercel.com/
2. Click **"Sign Up"** with GitHub

### **B. Deploy Frontend**
1. Click **"Add New Project"**
2. Import your **InstantPDF** repository
3. Vercel auto-detects it's a Vite app!

### **C. Configure Build Settings**
**Root Directory:** `frontend`  
**Build Command:** `npm run build`  
**Output Directory:** `dist`

### **D. Set Environment Variables**
Click **"Environment Variables"** and add:
```
VITE_API_URL=https://instantpdf-production.up.railway.app
```
(Use your Railway URL from Step 1!)

### **E. Deploy!**
Click **"Deploy"** - Vercel builds and deploys! 🚀

Your app will be live at:  
`https://your-app.vercel.app`

---

## 🔄 **Step 3: Update CORS** (5 min)

### **Back to Railway:**
1. Update `ALLOWED_ORIGINS`:
```
ALLOWED_ORIGINS=https://your-app.vercel.app
```

2. Railway redeploys automatically!

---

## ✅ **Step 4: Test Your Live App!**

Visit: `https://your-app.vercel.app`

**Test:**
- Upload a file
- Convert it
- Download it
- Confetti! 🎉

---

## 💰 **Pricing**

### **Vercel (Frontend):**
- ✅ **FREE:** 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Custom domain support

### **Railway (Backend):**
- ✅ **FREE:** $5 credit/month (enough for small projects!)
- ✅ Automatic scaling
- ✅ Free PostgreSQL database
- ✅ Easy deployment

**Both FREE tiers are perfect for getting started!**

---

## 🎨 **Custom Domain (Optional)**

### **Vercel:**
1. Go to your project **Settings**
2. Click **"Domains"**
3. Add your domain (e.g., `instantpdf.com`)
4. Update DNS records (Vercel guides you!)

### **Railway:**
Uses automatically-generated URL (free)

---

## 🚨 **Important Files for Deployment**

### **Backend needs:**
- ✅ `requirements.txt` - Already have it!
- ✅ `Procfile` or Railway auto-detects

### **Frontend needs:**
- ✅ `package.json` - Already have it!
- ✅ `vite.config.js` - Already have it!

---

## 🔧 **If Deployment Fails:**

### **Railway Issues:**
**Error:** "Build failed"  
**Fix:** Check `requirements.txt` has all dependencies

**Error:** "Port binding"  
**Fix:** Use `PORT` env variable: `uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}`

### **Vercel Issues:**
**Error:** "Build command failed"  
**Fix:** Make sure you set Root Directory to `frontend`

**Error:** "API calls fail"  
**Fix:** Check `VITE_API_URL` is set correctly

---

## 📊 **Deployment Checklist**

### **Before Deploying:**
- [ ] Push latest code to GitHub
- [ ] Test locally (all tools work)
- [ ] Have GitHub repo ready

### **Railway (Backend):**
- [ ] Create Railway account
- [ ] Deploy from GitHub
- [ ] Set environment variables
- [ ] Copy backend URL

### **Vercel (Frontend):**
- [ ] Create Vercel account
- [ ] Deploy from GitHub
- [ ] Set `VITE_API_URL`
- [ ] Set Root Directory to `frontend`

### **After Deploying:**
- [ ] Update CORS with Vercel URL
- [ ] Test live site
- [ ] Check console for errors
- [ ] Test PWA install

---

## 🎉 **Success Indicators:**

✅ Frontend loads without errors  
✅ Backend API accessible  
✅ File upload works  
✅ Conversion works  
✅ Download works  
✅ Confetti appears! 🎊

---

## 🆘 **Need Help?**

### **Railway Docs:** https://docs.railway.app/  
### **Vercel Docs:** https://vercel.com/docs

---

## 🚀 **Alternative: All-in-One (Render.com)**

If you prefer ONE platform for both:
1. Use **Render.com**
2. Deploy both frontend & backend
3. FREE tier available
4. One dashboard for everything

---

**Ready to deploy? Start with Railway for backend! 🚂**
