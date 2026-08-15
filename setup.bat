@echo off
REM DobtWise AI Chatbot - Quick Setup Script for Windows

echo.
echo ========================================
echo   DobtWise AI - Installation Setup
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js detected
node --version
echo.

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed!
    echo Please reinstall Node.js
    pause
    exit /b 1
)

echo ✓ npm detected
npm --version
echo.

REM Install dependencies
echo Installing dependencies...
echo.
npm install

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install dependencies
    echo Try running: npm install --legacy-peer-deps
    pause
    exit /b 1
)

echo.
echo ✓ Dependencies installed successfully!
echo.

REM Check if .env file exists
if not exist ".env" (
    echo Creating .env file from template...
    copy ".env.example" ".env"
    echo.
    echo ⚠️  IMPORTANT: Edit the .env file and add your Gemini API Key!
    echo.
    echo Steps:
    echo 1. Get API Key from https://ai.google.dev/
    echo 2. Open .env file in this folder
    echo 3. Replace 'your_gemini_api_key_here' with your actual API key
    echo 4. Save the file
    echo.
)

echo.
echo ========================================
echo   ✓ Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Open .env file and add your Gemini API Key
echo 2. Run: npm start
echo.
echo The server will start on http://localhost:3000
echo.
pause
