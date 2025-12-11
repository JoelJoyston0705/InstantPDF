# 🧪 InstantPDF - Complete Testing Guide

## ✅ **All 14 Tools Testing Checklist**

---

## 📋 **CONVERT TO PDF (5 Tools)**

### **1. Word to PDF** ✅
**Route:** `/word-to-pdf`  
**Test File:** `test_samples/sample.docx`  
**Expected:** PDF with formatted text, images, tables  
**Batch Route:** `/batch/word-to-pdf`

**Test Steps:**
1. Upload `sample.docx`
2. Click "Convert to PDF"
3. Check confetti animation 🎉
4. Download and verify PDF
5. Test batch with multiple files

---

### **2. Excel to PDF** ✅
**Route:** `/excel-to-pdf`  
**Test File:** `test_samples/sample.xlsx`  
**Expected:** PDF with spreadsheet data  
**Batch Route:** `/batch/excel-to-pdf`

**Test Steps:**
1. Upload `sample.xlsx`
2. Convert and download
3. Verify tables, formatting
4. Test batch conversion

---

### **3. PowerPoint to PDF** ✅
**Route:** `/ppt-to-pdf`  
**Test File:** `test_samples/sample.pptx`  
**Expected:** PDF with slides  
**Batch Route:** `/batch/ppt-to-pdf`

**Test Steps:**
1. Upload `sample.pptx`
2. Convert
3. Check all slides rendered
4. Batch test

---

### **4. Image to PDF** ✅
**Route:** `/image-to-pdf`  
**Test Files:** `test_samples/sample.jpg`, `sample.png`  
**Expected:** PDF with image  
**Batch Route:** `/batch/image-to-pdf`

**Test Steps:**
1. Upload image
2. Convert
3. Check quality
4. Test with multiple images (batch)

---

### **5. HTML to PDF** ✅
**Route:** `/html-to-pdf`  
**Test File:** `test_samples/sample.html`  
**Expected:** PDF with rendered HTML  
**Batch Route:** `/batch/html-to-pdf`

**Test Steps:**
1. Upload HTML file
2. Convert
3. Verify rendering
4. Batch test

---

## 📤 **CONVERT FROM PDF (4 Tools)**

### **6. PDF to Word** ✅
**Route:** `/pdf-to-word`  
**Test File:** `test_samples/sample.pdf`  
**Expected:** .docx with editable text  
**Batch Route:** `/batch/pdf-to-word`

**Test Steps:**
1. Upload PDF
2. Convert to Word
3. Open in Word, verify editability
4. Batch test

---

### **7. PDF to Excel** ✅
**Route:** `/pdf-to-excel`  
**Test File:** `test_samples/table.pdf`  
**Expected:** .xlsx with table data  
**Batch Route:** `/batch/pdf-to-excel`

**Test Steps:**
1. Upload PDF with tables
2. Convert
3. Open in Excel
4. Batch test

---

### **8. PDF to JPG** ✅
**Route:** `/pdf-to-jpg`  
**Test File:** `test_samples/sample.pdf`  
**Expected:** .jpg images of pages  
**Batch Route:** `/batch/pdf-to-jpg`

**Test Steps:**
1. Upload PDF
2. Convert
3. Download images
4. Batch test

---

### **9. PDF to PowerPoint** ✅
**Route:** `/pdf-to-ppt`  
**Test File:** `test_samples/sample.pdf`  
**Expected:** .pptx file  
**Batch Route:** `/batch/pdf-to-ppt`

**Test Steps:**
1. Upload PDF
2. Convert
3. Open in PowerPoint
4. Batch test

---

## ✏️ **EDIT PDF (5 Tools)**

### **10. Edit PDF (Add Text)** ✅
**Route:** `/edit-pdf`  
**Test File:** `test_samples/sample.pdf`  
**Expected:** PDF with added text  
**Batch Route:** `/batch/edit-pdf`

**Test Steps:**
1. Upload PDF
2. Add text parameter
3. Convert
4. Verify text added
5. Batch test

---

### **11. Watermark PDF** ✅
**Route:** `/watermark-pdf`  
**Test File:** `test_samples/sample.pdf`  
**Expected:** PDF with watermark  
**Batch Route:** `/batch/watermark-pdf`

**Test Steps:**
1. Upload PDF
2. Add watermark text
3. Convert
4. Verify watermark
5. Test batch

---

### **12. Rotate PDF** ✅
**Route:** `/rotate-pdf`  
**Test File:** `test_samples/sample.pdf`  
**Expected:** Rotated PDF  
**Batch Route:** `/batch/rotate-pdf`

**Test Steps:**
1. Upload PDF
2. Select rotation (90°, 180°, 270°)
3. Convert
4. Verify rotation
5. Batch test

---

### **13. Add Page Numbers** ✅
**Route:** `/page-numbers`  
**Test File:** `test_samples/sample.pdf`  
**Expected:** PDF with page numbers  
**Batch Route:** `/batch/page-numbers`

**Test Steps:**
1. Upload PDF
2. Convert
3. Verify page numbers
4. Batch test

---

### **14. Crop PDF** ✅
**Route:** `/crop-pdf`  
**Test File:** `test_samples/sample.pdf`  
**Expected:** Cropped PDF  
**Batch Route:** `/batch/crop-pdf`

**Test Steps:**
1. Upload PDF
2. Convert
3. Verify margins removed
4. Batch test

---

## 🎯 **TESTING CHECKLIST**

### **For Each Tool:**
- [ ] Single file upload works
- [ ] Drag & drop works
- [ ] Conversion succeeds
- [ ] **Confetti animation appears** 🎉
- [ ] Download button works
- [ ] Downloaded file is valid
- [ ] Batch processing works
- [ ] Error handling works (wrong file type)
- [ ] Dark mode displays correctly
- [ ] Mobile responsive

---

## 🚀 **Quick Test Script**

```bash
# Go to frontend
cd frontend

# Test all routes are accessible
curl http://localhost:5175/word-to-pdf
curl http://localhost:5175/excel-to-pdf
curl http://localhost:5175/ppt-to-pdf
curl http://localhost:5175/image-to-pdf
curl http://localhost:5175/html-to-pdf
curl http://localhost:5175/pdf-to-word
curl http://localhost:5175/pdf-to-excel
curl http://localhost:5175/pdf-to-jpg
curl http://localhost:5175/pdf-to-ppt
curl http://localhost:5175/edit-pdf
curl http://localhost:5175/watermark-pdf
curl http://localhost:5175/rotate-pdf
curl http://localhost:5175/page-numbers
curl http://localhost:5175/crop-pdf

# Test batch routes
curl http://localhost:5175/batch/word-to-pdf
# ... etc for all 14 batch routes
```

---

## 🎨 **UI Features to Test**

### **Dark Mode** 🌙
- [ ] Toggle works in navbar
- [ ] All text visible
- [ ] Smooth transition
- [ ] Preference saved

### **Confetti** 🎉
- [ ] Appears on successful conversion
- [ ] Google colors (blue, red, yellow, green)
- [ ] Auto-disappears after 3 seconds
- [ ] Doesn't block UI

### **Mobile (PWA)** 📱
- [ ] Install prompt appears
- [ ] Icon shows on home screen
- [ ] Standalone mode works
- [ ] Offline caching works

### **Batch Processing** 📦
- [ ] Multiple file upload
- [ ] Individual progress bars
- [ ] Download all button
- [ ] Error handling per file

---

## ⚠️ **Common Issues & Fixes**

### **Issue: Conversion fails**
**Fix:** Check backend is running on port 8000

### **Issue: No confetti**
**Fix:** Hard refresh browser (Ctrl+Shift+R)

### **Issue: Dark mode not working**
**Fix:** Clear localStorage and refresh

### **Issue: PWA not installing**
**Fix:** Use HTTPS or localhost only

---

## ✅ **Success Criteria**

### **All 14 tools should:**
1. ✅ Accept correct file types
2. ✅ Reject wrong file types
3. ✅ Show progress/loading state
4. ✅ Display confetti on success
5. ✅ Provide download button
6. ✅ Work in batch mode
7. ✅ Work in dark mode
8. ✅ Work on mobile

---

## 📊 **Testing Results Template**

| Tool | Single | Batch | Confetti | Dark Mode | Mobile | Status |
|------|--------|-------|----------|-----------|--------|--------|
| Word→PDF | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | Testing |
| Excel→PDF | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | Testing |
| PPT→PDF | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | Testing |
| Image→PDF | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | Testing |
| HTML→PDF | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | Testing |
| PDF→Word | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | Testing |
| PDF→Excel | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | Testing |
| PDF→JPG | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | Testing |
| PDF→PPT | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | Testing |
| Edit PDF | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | Testing |
| Watermark | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | Testing |
| Rotate | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | Testing |
| Page Numbers | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | Testing |
| Crop | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | Testing |

Replace ⏳ with ✅ when test passes or ❌ if fails.

---

## 🎯 **Ready to Deploy When:**
- ✅ All 14 tools tested
- ✅ Batch processing works
- ✅ Dark mode perfect
- ✅ Confetti delights
- ✅ PWA installable
- ✅ Mobile responsive
- ✅ No console errors

---

**Start testing and mark your progress!** 🚀
