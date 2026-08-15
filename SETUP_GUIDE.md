# DobtWise AI Chatbot - Setup Guide

## 🎯 Features
- Real-time AI-powered chatbot using Google Gemini API
- Support for text questions
- Support for image uploads and analysis (📷 Photo & 📋 Paste buttons)
- Related topics sidebar
- Example questions for quick access
- Beautiful, modern UI matching the design specification

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API Key

## 🚀 Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install:
- express (web framework)
- better-sqlite3 (database)
- bcryptjs (password hashing)
- express-session (session management)
- nodemailer (email notifications)
- @google/generative-ai (Google Gemini API client)

### 2. Get Google Gemini API Key

1. Visit [https://ai.google.dev/](https://ai.google.dev/)
2. Click on "Get API Key" button
3. Create a new API key in Google Cloud Console
4. Copy your API key

### 3. Configure Environment Variables

1. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. (Optional) Configure email settings if needed:
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

### 4. Start the Server

```bash
npm start
```

The server will run on `http://localhost:3000`

## 📱 Using the Chatbot

1. **Text Questions**: Type your question in the message input area and click "Send"
2. **Upload Photo**: Click the 📷 Photo button to upload an image from your device
3. **Paste Image**: Click the 📋 Paste button to paste an image from clipboard
4. **Example Questions**: Click any example question in the sidebar to ask it quickly
5. **Related Topics**: Click topics to explore more on those subjects

## 🔍 API Endpoints

### Chat Endpoint
- **URL**: `/api/chat`
- **Method**: `POST`
- **Body**: 
  ```json
  {
    "question": "Your question here",
    "image": "base64_encoded_image_or_null"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "answer": "AI response here",
    "source": "gemini-1.5-flash"
  }
  ```

## 🛠️ Troubleshooting

### API Key Issues
- **Error**: `GEMINI_API_KEY not found`
  - Solution: Check that your `.env` file exists and has the correct API key
  - Ensure the environment variable is properly set

### Package Installation Failed
- **Error**: `npm ERR! code ERESOLVE`
  - Solution: Try `npm install --legacy-peer-deps`

### Port Already in Use
- **Error**: `EADDRINUSE: address already in use :::3000`
  - Solution: Change PORT in `.env` or kill the process using port 3000

### Image Upload Not Working
- **Note**: The clipboard paste feature works in modern browsers with HTTPS or localhost
- For image upload, use the 📷 Photo button instead

## 📚 Models Used

- **Primary**: `gemini-1.5-flash` - Fast, efficient responses
- **Alternative**: `gemini-1.5-pro` - For more detailed analysis (requires API key update in server.js)

To use gemini-1.5-pro, change line in `server.js`:
```javascript
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
```

## 🔐 Security Notes

- Never commit `.env` file to version control
- Keep your Gemini API key secret
- Use HTTPS in production
- Implement rate limiting for API calls
- Add authentication to `/api/chat` if deploying publicly

## 📝 Customization

### Change Sidebar Topics
Edit the topics in `ai-doubt-solver.html` line ~280:
```html
<div class="topic-item">Your Topic</div>
```

### Modify System Prompt
Edit the `systemInstruction` in `server.js` API endpoint to customize AI behavior

### Change Colors/Styling
Update CSS variables in `ai-doubt-solver.html` `<style>` section

## 🆘 Support

If you encounter any issues:
1. Check the browser console (F12) for errors
2. Check server logs in the terminal
3. Verify API key is correct and active
4. Ensure all dependencies are installed

## 📄 License

This project is provided as-is for educational purposes.

---

**Last Updated**: 2025-08-15
**Version**: 1.0.0
