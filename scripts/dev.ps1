Write-Host ""
Write-Host "========================================"
Write-Host "     EduQuest Development Environment"
Write-Host "========================================"
Write-Host ""

$root = Split-Path -Parent $PSScriptRoot

Write-Host "Starting backend..."

Start-Process powershell.exe -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$root\backend'; & '$root\.venv\Scripts\Activate.ps1'; uvicorn app.main:app --reload"
)

Start-Sleep -Seconds 2

Write-Host "Starting frontend..."

Start-Process powershell.exe -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$root\frontend'; npm run dev"
)

Start-Sleep -Seconds 5

Start-Process "http://localhost:5173"