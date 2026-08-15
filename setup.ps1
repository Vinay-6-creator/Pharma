# DobtWise AI Chatbot - Quick Setup Script for Windows PowerShell

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   DobtWise AI - Installation Setup" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js detected: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please download and install from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✓ npm detected: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ ERROR: npm is not installed!" -ForegroundColor Red
    Write-Host "Please reinstall Node.js" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "`nInstalling dependencies..." -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Yellow

# Install dependencies
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n✗ ERROR: Failed to install dependencies" -ForegroundColor Red
    Write-Host "Try running: npm install --legacy-peer-deps" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "`n✓ Dependencies installed successfully!" -ForegroundColor Green

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "`nCreating .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "`n⚠️  IMPORTANT: Edit the .env file and add your Gemini API Key!" -ForegroundColor Yellow
    Write-Host "`nSteps:" -ForegroundColor Cyan
    Write-Host "1. Get API Key from https://ai.google.dev/" -ForegroundColor White
    Write-Host "2. Open .env file in this folder" -ForegroundColor White
    Write-Host "3. Replace 'your_gemini_api_key_here' with your actual API key" -ForegroundColor White
    Write-Host "4. Save the file" -ForegroundColor White
} else {
    Write-Host "`n✓ .env file already exists" -ForegroundColor Green
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   ✓ Setup Complete!" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Open .env file and ensure Gemini API Key is configured" -ForegroundColor White
Write-Host "2. Run: npm start" -ForegroundColor White
Write-Host "`nThe server will start on http://localhost:3000" -ForegroundColor Green
Write-Host "`nPress Enter to exit" -ForegroundColor Cyan
Read-Host
