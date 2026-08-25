# JanSamvad AI - Unified Local Development Launcher
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  JanSamvad AI - Local Development" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Start ASP.NET Core API
Write-Host "[1/3] Launching ASP.NET Core Backend (Port 5000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Starting JanSamvad AI Backend...' -ForegroundColor Cyan; cd '$PSScriptRoot/src/JanSamvadAI.Api'; dotnet run --urls 'http://localhost:5000;https://localhost:5001'"

# 2. Start React Frontend
Write-Host "[2/3] Launching React Client (Port 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Starting JanSamvad AI Frontend...' -ForegroundColor Cyan; cd '$PSScriptRoot/src/JanSamvadAI.Client'; npm run dev"

# 3. Start Python AI NLP service
Write-Host "[3/3] Launching AI NLP Service (Port 8001)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Starting JanSamvad AI NLP Service...' -ForegroundColor Cyan; cd '$PSScriptRoot/src/JanSamvadAI.AI'; if (Test-Path .\venv\Scripts\Activate.ps1) { .\venv\Scripts\Activate.ps1 }; uvicorn main:app --reload --port 8001"

Write-Host "`nAll services launched in separate windows!" -ForegroundColor Yellow
Write-Host "👉 Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "👉 Backend API / Swagger: http://localhost:5000/swagger" -ForegroundColor White
Write-Host "👉 AI NLP Service: http://localhost:8001/ai/health" -ForegroundColor White
