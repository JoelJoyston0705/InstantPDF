# 🚀 PRE-DEPLOYMENT CHECKLIST - InstantPDF

## ✅ **ABSOLUTE MINIMUM TO DEPLOY** (30 minutes)

### **1. Environment Variables** 🚨 CRITICAL
**Backend `.env`:**
```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key_min_32_characters
ALLOWED_ORIGINS=https://yourdomain.com
```

**Frontend `.env.production`:**
```env
VITE_API_URL=https://api.yourdomain.com
```

### **2. Update Domain URLs** 🚨 CRITICAL
In `frontend/index.html`:
- Change `https://instantpdf.com/` to YOUR domain
- Update all meta tag URLs

### **3. Update CORS** 🚨 CRITICAL
In `backend/main.py`:
```python
origins = [
    "https://yourdomain.com",  # Your actual domain!
]
```

### **4. Update Contact Emails** 🚨 CRITICAL
- Privacy Policy: Change `privacy@instantpdf.com`
- Terms of Service: Change `legal@instantpdf.com`

### **5. Test Core Features** 🚨 CRITICAL
- [ ] Upload file works
- [ ] Convert works
- [ ] Download works
- [ ] No console errors

---

## ⚠️ **RECOMMENDED BEFORE DEPLOY**

### **6. Rate Limiting**
Prevent abuse - add in backend

### **7. File Size Limits**
Currently no limit - add 50MB max

### **8. Analytics**
Add Google Analytics (optional)

### **9. Error Pages**
Add 404 page (optional)

### **10. Security Headers**
Configure in nginx/deployment

---

## 🧪 **FINAL TEST**

- [ ] Test on mobile
- [ ] Test dark mode
- [ ] Test 3 different tools
- [ ] Check Privacy/Terms pages
- [ ] PWA installs

---

## 🎯 **YOU'RE 90% READY!**

**Just set up environment variables and update domains, then deploy!**

See `DEPLOYMENT.md` for deployment guide! 🚀
