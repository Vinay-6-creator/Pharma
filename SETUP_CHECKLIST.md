# ✅ DobtWise AI Setup Checklist

Complete this checklist to get your chatbot running!

---

## 🔧 Pre-Installation (5 minutes)

- [ ] Download and install Node.js from https://nodejs.org/ (if not already installed)
- [ ] Verify installation by opening Terminal/CMD and running:
  ```bash
  node --version
  npm --version
  ```
- [ ] Navigate to project folder: `e:\PROGRAM\Pharma`
- [ ] Get a free Google Gemini API key from https://ai.google.dev/

---

## 📦 Installation (2-3 minutes)

### Option A: Automatic Setup (RECOMMENDED)

- [ ] Double-click `setup.bat` (for Command Prompt)
   **OR**
- [ ] Right-click `setup.ps1` and select "Run with PowerShell" 
   **OR**
- [ ] Open PowerShell in project folder and run:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   .\setup.ps1
   ```

### Option B: Manual Setup

- [ ] Open Terminal/CMD in project folder
- [ ] Run: `npm install`
- [ ] Wait for completion (should show "added XX packages")

---

## 🔑 Configuration (2 minutes)

- [ ] Copy `.env.example` to `.env`:
  - Right-click `.env.example` → Copy
  - Paste in same folder
  - Rename copy to `.env`
  OR
  ```bash
  cp .env.example .env
  ```

- [ ] Open `.env` file with text editor (Notepad, VS Code, etc.)

- [ ] Find this line:
  ```
  GEMINI_API_KEY=your_gemini_api_key_here
  ```

- [ ] Replace `your_gemini_api_key_here` with your actual API key from Google

- [ ] Save the `.env` file (Ctrl+S)

- [ ] **VERIFY:** Make sure:
  - [ ] API key is correct
  - [ ] File is named `.env` (not `.env.txt`)
  - [ ] No quotes around API key
  - [ ] No extra spaces

---

## 🚀 Running the Server (1 minute)

- [ ] Open Terminal/CMD in project folder

- [ ] Run:
  ```bash
  npm start
  ```

- [ ] **Wait for message:** You should see:
  ```
  Server running on http://localhost:3000
  ```

- [ ] **Keep terminal open** - server must keep running

---

## 🌐 Testing the Chatbot (2-3 minutes)

- [ ] Open web browser (Chrome, Firefox, Edge, Safari)

- [ ] Go to: `http://localhost:3000`

- [ ] You should see the login page
  - [ ] Email: Use test email (e.g., `student@gmail.com`)
  - [ ] Password: Any password
  - [ ] Role: Select "Student"
  - [ ] Click "Register" first if new user

- [ ] After login, click on "AI Doubt Solver" in dashboard

- [ ] Test the chatbot:
  - [ ] **Test 1 - Text:** Type "What is cell biology?" → Click Send
  - [ ] Wait for AI response (should see reply below)
  - [ ] **Test 2 - Quick Question:** Click example question in sidebar
  - [ ] **Test 3 - Image:** Click 📷 Photo → Select an image → Click Send
  - [ ] **Test 4 - Paste:** Copy image → Click 📋 Paste → Click Send

- [ ] All tests passed? ✅ **SETUP COMPLETE!**

---

## ⚠️ Troubleshooting Quick Fixes

### npm install failed
```
□ Run: npm install --legacy-peer-deps
```

### "Server running but can't connect"
```
□ Check terminal - is it still running?
□ Try different browser
□ Try: http://127.0.0.1:3000 instead of localhost
```

### "API Key not working"
```
□ Get new key from https://ai.google.dev/
□ Check .env file - paste key exactly (no quotes)
□ Restart: Stop server (Ctrl+C) and run npm start again
```

### "Port 3000 already in use"
```
□ Edit .env file
□ Change: PORT=3000 to PORT=3001
□ Restart server
```

### "Chatbot not responding"
```
□ Check API key in .env is correct
□ Check internet connection
□ Look at browser console (Press F12)
□ Check terminal for error messages
```

### "Image upload not working"
```
□ Ensure running on http://localhost:3000 (not IP address)
□ Try different image format (JPG, PNG)
□ Check browser console for errors
```

---

## 📁 Important Files Reference

| File | What It Is | Edit? |
|------|-----------|-------|
| `.env` | ⭐ **YOUR SETTINGS** | YES - Add API key here! |
| `server.js` | Server code | NO - Don't edit |
| `public/ai-doubt-solver.html` | Chatbot UI | NO - Don't edit |
| `README.md` | Full documentation | NO |
| `QUICK_START.md` | Quick reference | NO |

---

## 🎓 Next Steps (After Setup Works)

1. **Customize Sidebar Topics**
   - Edit: `public/ai-doubt-solver.html`
   - Find: "Related Topics" section (~line 280)
   - Change: Cell Biology, Meiosis Stages, DNA Replication

2. **Change Colors**
   - Edit: `public/ai-doubt-solver.html`
   - Find: CSS section with color values
   - Change: Green colors to your preference

3. **Switch to Gemini Pro** (more powerful but slower)
   - Edit: `server.js`
   - Find: `'gemini-1.5-flash'`
   - Change to: `'gemini-1.5-pro'`

4. **Add Email Notifications**
   - Edit: `.env`
   - Add Gmail SMTP settings
   - Uncomment email lines in `server.js`

---

## 🎯 Success Criteria

Your setup is complete when:

- [x] `npm install` completed without errors
- [x] `.env` file has your Gemini API key
- [x] `npm start` shows "Server running on http://localhost:3000"
- [x] Browser can access http://localhost:3000
- [x] Can register and login
- [x] AI Doubt Solver page loads
- [x] Typing a question and clicking Send shows an AI response
- [x] Image upload works (optional but nice to have)

---

## 📞 Need More Help?

1. **Quick Help:** Read `QUICK_START.md`
2. **Detailed Guide:** Read `SETUP_GUIDE.md`
3. **Full Docs:** Read `README.md`
4. **Check Logs:** Look at terminal output when server runs
5. **Browser Console:** Press F12 in browser to see errors

---

## 🎉 Congratulations!

Once you see the AI responding to your questions, you're all set! 

**Share with students:**
- Bookmark: http://localhost:3000
- Click: "AI Doubt Solver" on dashboard
- Ask questions or upload images!

---

**Version:** 1.0.0  
**Last Updated:** August 15, 2025  
**Estimated Setup Time:** 10-15 minutes total

**Happy Learning! 🧬📚**
