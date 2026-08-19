# JanSamvad AI - Unified Local Development Launcher
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  JanSamvad AI - Local Development" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Start ASP.NET Core API
Write-Host "[1/2] Launching ASP.NET Core Backend (Port 5000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Starting JanSamvad AI Backend...' -ForegroundColor Cyan; cd '$PSScriptRoot/src/JanSamvadAI.Api'; dotnet run --urls 'http://localhost:5000;https://localhost:5001'"

# 2. Start React Frontend
Write-Host "[2/2] Launching React Client (Port 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Starting JanSamvad AI Frontend...' -ForegroundColor Cyan; cd '$PSScriptRoot/src/JanSamvadAI.Client'; npm run dev"

Write-Host "`nAll services launched in separate windows!" -ForegroundColor Yellow
Write-Host "👉 Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "👉 Backend API / Swagger: http://localhost:5000/swagger" -ForegroundColor White
