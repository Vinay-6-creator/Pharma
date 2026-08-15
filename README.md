# 🧬 DobtWise AI - Solution Chatbot

A modern, real-time AI-powered educational chatbot using **Google Gemini API** for helping students with academic doubts and questions.

## ✨ Features

### 🤖 AI-Powered Chatbot
- Real-time responses using Google Gemini 1.5 Flash model
- Support for text questions
- Image upload and analysis (📷 Photo button)
- Clipboard image paste (📋 Paste button)
- Automatic fallback for API failures

### 📚 Smart Interface
- Clean, modern UI with green theme
- Chat message history
- Related topics sidebar
- Example quick-access questions
- Topic exploration buttons (Cell Biology, Math, Science, English, etc.)
- Responsive design for desktop and mobile

### 🔐 Security & Performance
- Backend API integration (no client-side API keys)
- Session-based authentication
- Error handling and fallback responses
- Fast response times with Gemini 1.5 Flash

## 🚀 Quick Start

### Option 1: Automatic Setup (Windows)

**For Command Prompt (CMD):**
```bash
setup.bat
```

**For PowerShell:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\setup.ps1
```

### Option 2: Manual Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create .env file:**
   ```bash
   cp .env.example .env
   ```

3. **Configure your Gemini API Key:**
   - Get a free API key from [ai.google.dev](https://ai.google.dev/)
   - Edit `.env` and add your API key:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```

4. **Start the server:**
   ```bash
   npm start
   ```

5. **Open in browser:**
   ```
   http://localhost:3000
   ```

## 📋 Project Structure

```
Pharma/
├── server.js                 # Express server with Gemini API integration
├── package.json             # Project dependencies
├── .env.example             # Environment variables template
├── SETUP_GUIDE.md           # Detailed setup documentation
├── setup.bat                # Windows batch setup script
├── setup.ps1                # PowerShell setup script
├── public/
│   ├── ai-doubt-solver.html # Main chatbot interface (REDESIGNED)
│   ├── login.html           # Login page
│   ├── student-dashboard.html
│   ├── faculty-dashboard.html
│   └── ... (other pages)
└── database.db              # SQLite database (auto-created)
```

## 🎯 How to Use

1. **Ask a Question:**
   - Type your question in the text area
   - Press Enter or click "Send"
   - AI provides instant response

2. **Upload an Image:**
   - Click "📷 Photo" button
   - Select an image from your device
   - AI analyzes and explains the image content

3. **Paste an Image:**
   - Copy an image to clipboard
   - Click "📋 Paste" button
   - Image preview appears
   - Click "Send" to get analysis

4. **Quick Questions:**
   - Click any example question in the sidebar
   - Message is auto-populated and sent
   - Perfect for learning by example

5. **Explore Topics:**
   - Click topic buttons (Cell Biology, Math, etc.)
   - AI generates information about that topic

## 🔧 Configuration

### Environment Variables (.env)

```env
# Required
GEMINI_API_KEY=your_api_key_here

# Optional - Email notifications
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Optional - Server
PORT=3000
```

### Models Available

- **gemini-1.5-flash** (Default) - Fast, efficient, free tier
- **gemini-1.5-pro** - More powerful, better for complex analysis

To change model, edit `server.js` line with:
```javascript
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
```

## 📱 API Endpoints

### Chat Endpoint
```
POST /api/chat
Content-Type: application/json

{
  "question": "What is cell biology?",
  "image": null  // or base64 encoded image
}

Response:
{
  "success": true,
  "answer": "Cell biology is...",
  "source": "gemini-1.5-flash"
}
```

## 🛠️ Troubleshooting

### Issue: "GEMINI_API_KEY not configured"
- **Solution:** Add your API key to `.env` file
- Restart the server: `npm start`

### Issue: "npm ERR! ERESOLVE"
- **Solution:** Use `npm install --legacy-peer-deps`

### Issue: "Port 3000 already in use"
- **Solution:** Change PORT in `.env` to 3001, 3002, etc.
- Or kill process: `netstat -ano | findstr :3000`

### Issue: Image upload not working
- **Solution:** Use `npm start` to ensure it's running on localhost
- Check browser console (F12) for errors

### Issue: AI not responding
- **Solution:** 
  - Check API key validity at [ai.google.dev](https://ai.google.dev/)
  - Verify `.env` file is correct
  - Check server logs for errors
  - Ensure internet connection is working

## 📚 System Architecture

```
┌─────────────┐
│   Browser   │ (ai-doubt-solver.html)
└──────┬──────┘
       │ HTTP POST /api/chat
       │
┌──────▼──────────────────┐
│   Express Server        │
│ (server.js)            │
├────────────────────────┤
│ • Session Management   │
│ • Route Handling       │
│ • Error Handling       │
└──────┬─────────────────┘
       │ HTTPS
       │
┌──────▼──────────────────┐
│  Google Gemini API      │
│ (gemini-1.5-flash)     │
├────────────────────────┤
│ • Text Processing      │
│ • Image Analysis       │
│ • Response Generation  │
└────────────────────────┘
```

## 🔐 Security Features

- ✅ No client-side API key exposure
- ✅ Backend-only API communication
- ✅ Session-based authentication
- ✅ Input validation
- ✅ Error handling without exposing internal details
- ✅ Environment variable protection

## 📊 Performance

- **Response Time:** < 2 seconds average
- **Model:** Gemini 1.5 Flash (optimized for speed)
- **Image Processing:** Supported with auto-compression
- **Concurrent Users:** Limited by API quotas

## 🎓 Use Cases

- 📖 Homework help
- 🧪 Lab report guidance
- 📝 Concept clarification
- 🔬 Image analysis (diagrams, problems)
- 📚 Topic exploration
- 💡 Quick reference answers

## 📝 Files Modified/Created

### New Files:
- `setup.bat` - Windows setup automation
- `setup.ps1` - PowerShell setup automation
- `.env.example` - Environment template
- `SETUP_GUIDE.md` - Detailed setup guide

### Modified Files:
- `public/ai-doubt-solver.html` - Complete redesign with new UI
- `server.js` - Added Gemini API integration endpoint
- `package.json` - Added @google/generative-ai dependency

## 🚀 Deployment

### Local Development:
```bash
npm start
```

### Production:
1. Set environment variables securely
2. Use HTTPS
3. Add rate limiting
4. Configure CORS if needed
5. Use a process manager (PM2)

## 📞 Support & Issues

If you encounter problems:
1. Check `SETUP_GUIDE.md` for detailed troubleshooting
2. Verify API key from [ai.google.dev](https://ai.google.dev/)
3. Check server logs: `node server.js` (not `npm start`)
4. Ensure Node.js version >= 14

## 📄 License

This project is provided as-is for educational purposes.

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- Express.js for server framework
- SQLite for database
- Students and educators using DobtWise

---

**Version:** 1.0.0  
**Last Updated:** August 15, 2025  
**Status:** ✅ Production Ready

### Next Steps After Setup:
1. ✅ Run setup script (setup.bat or setup.ps1)
2. ✅ Configure `.env` with Gemini API Key
3. ✅ Run `npm start`
4. ✅ Visit `http://localhost:3000`
5. ✅ Navigate to "AI Doubt Solver" page
6. ✅ Ask a question or upload an image!

**Happy Learning! 🎓** 
