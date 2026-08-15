# 🚀 DobtWise AI - Quick Start Card

## ⚡ 5-Minute Setup

### Step 1: Run Installer (Choose One)
```bash
# Windows CMD
setup.bat

# Windows PowerShell
.\setup.ps1

# Or Manual
npm install
```

### Step 2: Get API Key
1. Visit: https://ai.google.dev/
2. Click "Get API Key"
3. Copy your API key

### Step 3: Configure
1. Open `.env` file in your project folder
2. Replace `your_gemini_api_key_here` with your actual key
3. Save file

### Step 4: Run Server
```bash
npm start
```

### Step 5: Open Browser
```
http://localhost:3000
```

---

## 💡 Using the Chatbot

| Feature | How to Use |
|---------|-----------|
| **Ask Question** | Type in message box → Press Enter or click Send |
| **Upload Image** | Click 📷 Photo → Select image from device |
| **Paste Image** | Click 📋 Paste → Image from clipboard appears |
| **Quick Questions** | Click example in sidebar → Auto-populated & sent |
| **Explore Topics** | Click topic button (Math, Science, etc.) |

---

## ❌ Troubleshooting

### Error: "GEMINI_API_KEY not configured"
```
Fix: Add API key to .env file and restart npm start
```

### Error: "npm ERR! ERESOLVE"
```
Fix: npm install --legacy-peer-deps
```

### Error: "Port 3000 already in use"
```
Fix: Change PORT in .env or use port 3001, 3002, etc.
```

### Error: "Image upload not working"
```
Fix: Ensure running on localhost:3000
     Check browser console (F12) for errors
```

---

## 📂 Important Files

| File | Purpose |
|------|---------|
| `.env` | Store your Gemini API Key (MUST configure) |
| `setup.bat` | Windows installer |
| `setup.ps1` | PowerShell installer |
| `README.md` | Full documentation |
| `SETUP_GUIDE.md` | Detailed setup guide |

---

## 🎓 Features

✅ Real-time AI responses  
✅ Image upload & analysis  
✅ Chat history  
✅ Quick example questions  
✅ Topic exploration  
✅ Responsive design  
✅ Fallback if API fails  

---

## 📞 Need Help?

1. Check `README.md` for full documentation
2. See `SETUP_GUIDE.md` for detailed troubleshooting
3. Verify API key at https://ai.google.dev/
4. Check server logs: `node server.js` (not npm start)

---

## 🔒 Security Notes

- ✅ API key stored only in `.env` (not in code)
- ✅ Never commit `.env` to version control
- ✅ No client-side API key exposure
- ✅ Secure backend API calls

---

**Version:** 1.0.0  
**Status:** Ready to Use ✅  
**Last Updated:** August 15, 2025

Happy Learning! 🧬📚
