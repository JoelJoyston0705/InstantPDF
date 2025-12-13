# 📸 Screenshots Guide for InstantPDF

This guide will help you capture and upload professional screenshots to showcase InstantPDF's features in the README.

---

## 🎯 Required Screenshots

### 1. **Homepage/Landing Page**
   - **What to capture**: Full homepage view showing the logo, tagline, and all 9 tool cards
   - **Filename**: `homepage.png`
   - **Important elements**:
     - InstantPDF logo and title
     - Tagline: "The All-in-One, Intelligent PDF Solution"
     - All 9 tool cards clearly visible
     - Dark/Light mode toggle
   - **Browser size**: Full desktop width (1920x1080 recommended)

### 2. **Tools Grid View**
   - **What to capture**: Close-up of the tools section showing all conversion options
   - **Filename**: `tools-grid.png`
   - **Important elements**:
     - Word to PDF
     - Excel to PDF
     - PPT to PDF
     - Image to PDF
     - HTML to PDF
     - PDF to Word
     - PDF to Excel
     - PDF to JPG
     - PDF to PPT

### 3. **Tool Interface Example (Word to PDF)**
   - **What to capture**: The conversion interface for one tool (preferably Word to PDF)
   - **Filename**: `word-to-pdf-interface.png`
   - **Important elements**:
     - File upload area with drag-and-drop zone
     - "Choose File" or upload button
     - Conversion settings (if visible)
     - Clean, modern UI design

### 4. **Dark Mode View**
   - **What to capture**: Homepage or tools page in dark mode
   - **Filename**: `dark-mode.png`
   - **Important elements**:
     - Toggle to dark mode first (moon/sun icon)
     - Same elements as homepage but in dark theme
     - Contrast and readability clearly visible

### 5. **Mobile Responsive View** (Optional but Recommended)
   - **What to capture**: Mobile view of the homepage
   - **Filename**: `mobile-view.png`
   - **How to capture**: 
     - Open Chrome DevTools (F12)
     - Click "Toggle device toolbar" or press Ctrl+Shift+M (Cmd+Shift+M on Mac)
     - Select iPhone or Android device
     - Take screenshot

### 6. **Conversion Process** (Optional)
   - **What to capture**: File being uploaded or conversion in progress
   - **Filename**: `conversion-process.png`
   - **Important elements**:
     - Progress indicator or loading state
     - File name and size
     - Cancel/Download buttons

---

## 📝 How to Take Screenshots

### **Option 1: Using Browser (Recommended)**
1. Open https://instant-pdf-neon.vercel.app/ in Chrome/Firefox
2. Press `F11` to go full-screen (optional, for cleaner screenshots)
3. **Windows**: Press `Windows + Shift + S` to open Snipping Tool
4. **Mac**: Press `Cmd + Shift + 4` to capture area
5. **Linux**: Press `PrtScn` or use Screenshot tool
6. Select the area you want to capture
7. Save with the recommended filename

### **Option 2: Using Browser Extensions**
- **Awesome Screenshot** (Chrome/Firefox)
- **Fireshot** (Chrome/Firefox)
- **Nimbus Screenshot** (Chrome)

These tools allow:
- Full-page screenshots
- Specific element capture
- Annotations and editing
- Direct saving to your computer

---

## 📂 How to Upload Screenshots to GitHub

### **Method 1: Create Images Folder (Recommended)**

1. In your GitHub repository, create a new folder:
   - Click "Add file" → "Create new file"
   - Type: `images/.gitkeep` (this creates an images folder)
   - Commit the file

2. Navigate to the `images/` folder

3. Click "Add file" → "Upload files"

4. Drag and drop all your screenshots OR click "choose your files"

5. Add commit message: `docs: Add project screenshots`

6. Click "Commit changes"

### **Method 2: Direct Upload to Root**

1. Go to your repository root: https://github.com/JoelJoyston0705/InstantPDF

2. Click "Add file" → "Upload files"

3. Upload all screenshots

4. Commit with message: `docs: Add screenshots`

---

## 🎨 Screenshot Best Practices

✅ **DO:**
- Use high resolution (1920x1080 or higher)
- Capture in PNG format for best quality
- Show the full interface without cropping important elements
- Use consistent browser width for all screenshots
- Clear browser history/bookmarks bar for clean look
- Capture with good lighting (if photographing screen)

❌ **DON'T:**
- Include personal information (emails, names in browser)
- Use low-resolution or blurry images
- Crop out important UI elements
- Mix different browser styles
- Include distracting browser extensions or notifications

---

## 🔗 Adding Screenshots to README

Once uploaded, add them to your README.md using:

### If stored in `images/` folder:
```markdown
![Homepage](images/homepage.png)
![Tools Grid](images/tools-grid.png)
![Word to PDF Interface](images/word-to-pdf-interface.png)
![Dark Mode](images/dark-mode.png)
```

### If stored in root:
```markdown
![Homepage](homepage.png)
![Tools Grid](tools-grid.png)
```

---

## 📋 Quick Checklist

- [ ] Homepage screenshot (light mode)
- [ ] Tools grid view
- [ ] Word to PDF interface
- [ ] Dark mode view
- [ ] Mobile responsive view (optional)
- [ ] Conversion process (optional)
- [ ] All screenshots in PNG format
- [ ] All screenshots uploaded to GitHub
- [ ] README.md updated with screenshot links
- [ ] Verified all images display correctly

---

## 🆘 Need Help?

If you encounter any issues:
1. Check file size limits (GitHub allows up to 25MB per file)
2. Ensure files are in PNG or JPG format
3. Verify image URLs in README.md match uploaded filenames
4. Clear browser cache and refresh if images don't appear

---

**Note**: Since browser automation tools cannot directly upload binary files (like images) through GitHub's web interface, this manual process ensures proper file handling and organization.

For questions or assistance, refer to [GitHub's documentation on uploading files](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository).
