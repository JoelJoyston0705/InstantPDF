# 🚀 DEPLOY NOW - Vercel + Railway

## ✅ **Pre-Deployment Checklist** (5 min)

### **1. Push to GitHub**
```bash
cd /Users/joeljoyston/Multimodal\ Assistant/InstantPDF
git add .
git commit -m "Ready for deployment"
git push origin main
```

✅ **Code is on GitHub**

---

## 🚂 **STEP 1: Deploy Backend to Railway** (10 min)

### **A. Sign Up & Create Project**
1. Go to: **https://railway.app/**
2. Click **"Start a New Project"**
3. Sign in with **GitHub**
4. Click **"Deploy from GitHub repo"**
5. Select: **InstantPDF** repository
6. Railway detects Python automatically! ✅

### **B. Configure Environment Variables**
In Railway dashboard, go to **"Variables"** tab and add:

```env
PORT=8000
PYTHONUNBUFFERED=1
JWT_SECRET=GENERATE_THIS_BELOW
ALLOWED_ORIGINS=https://your-app.vercel.app
MAX_FILE_SIZE_MB=50
FILE_RETENTION_HOURS=24
```

**Generate JWT_SECRET:**
In your terminal:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```
Copy the output and paste as `JWT_SECRET`

### **C. Get Your Backend URL**
After deploy completes:
1. Go to **"Settings"** tab
2. Find **"Domains"**  
3. Copy URL (looks like: `https://instantpdf-production.up.railway.app`)

**✅ SAVE THIS URL - You need it for Vercel!**

---

## ⚡ **STEP 2: Deploy Frontend to Vercel** (10 min)

### **A. Sign Up & Create Project**
1. Go to: **https://vercel.com/**
2. Click **"Add New Project"**
3. Sign in with **GitHub**
4. Import: **InstantPDF** repository

### **B. Configure Project Settings**

**Framework Preset:** Vite  
**Root Directory:** `frontend` ⚠️ IMPORTANT!  
**Build Command:** `npm run build`  
**Output Directory:** `dist`  

### **C. Add Environment Variable**
Click **"Environment Variables"**

Add:
```
Name:  VITE_API_URL
Value: https://instantpdf-production.up.railway.app
       👆 (Your Railway URL from Step 1)
```

### **D. Deploy!**
Click **"Deploy"** button!

Vercel will build and deploy in ~2 minutes! ⏱️

**Your app will be live at:**  
`https://your-app.vercel.app`

**✅ SAVE THIS URL!**

---

## 🔄 **STEP 3: Update CORS** (2 min)

### **Back to Railway:**
1. Go to **"Variables"** tab
2. Update `ALLOWED_ORIGINS`:
```
ALLOWED_ORIGINS=https://your-app.vercel.app
                👆 (Your Vercel URL from Step 2)
```

Railway redeploys automatically! ✅

---

## ✅ **STEP 4: TEST YOUR LIVE APP!**

Visit: **`https://your-app.vercel.app`**

**Test:**
- [ ] Page loads
- [ ] Upload a file
- [ ] Convert it
- [ ] Download works
- [ ] Confetti appears! 🎉
- [ ] Dark mode works
- [ ] PWA install prompt

---

## 🎉 **SUCCESS!**

**Your app is LIVE on the internet!** 🌍

**Share it:**
- Send to friends
- Post on social media  
- Add to your portfolio

---

## 🔧 **Common Issues & Fixes**

### **Railway Build Fails:**
**Error:** "No module named 'xyz'"  
**Fix:** Add missing package to `backend/requirements.txt`

### **Vercel Build Fails:**
**Error:** "Root directory not found"  
**Fix:** Make sure Root Directory is set to `frontend`

### **API Calls Fail (CORS Error):**
**Error:** "Access-Control-Allow-Origin"  
**Fix:** Check `ALLOWED_ORIGINS` in Railway matches Vercel URL exactly

### **Conversions Fail:**
**Error:** 500 error on backend  
**Fix:** Check Railway logs (click "View Logs" in dashboard)

---

## 📊 **After Deployment**

### **Enable Analytics:**
**In Vercel:**
1. Go to your project
2. Click **"Analytics"** tab
3. Click **"Enable"**
4. See visitor stats! 📈

### **Custom Domain (Optional):**
**In Vercel:**
1. Go to **"Settings" → "Domains"**
2. Add your domain
3. Update DNS records
4. SSL auto-configured! 🔒

---

## 💰 **Costs**

### **Current Usage (FREE tier):**
- Vercel: FREE (100GB bandwidth)
- Railway: FREE ($5 credit/month)

**Total: $0/month** 🎉

### **When you outgrow FREE:**
- Railway Hobby: $5/month (good for 10K-50K users)
- Vercel stays FREE until 100GB exceeded

---

## 🚀 **Next Steps**

1. ✅ Share your app!
2. ✅ Enable Vercel Analytics
3. ✅ Monitor usage
4. ✅ Get feedback from users
5. ✅ Add more features!

---

## 🆘 **Need Help?**

**Railway Issues:**  
https://railway.app/help

**Vercel Issues:**  
https://vercel.com/docs

**Or check Railway/Vercel logs for error details!**

---

**Ready? Start with Step 1: Push to GitHub!** 🚂⚡
