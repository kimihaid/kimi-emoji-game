# Test script to verify Node.js and npm commands work properly
$env:PATH += ";C:\Program Files\nodejs"

Write-Host "=== Final Environment Test ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "Testing Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = & "C:\Program Files\nodejs\node.exe" -v
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js test failed" -ForegroundColor Red
}

Write-Host "Testing npm..." -ForegroundColor Yellow
try {
    $npmVersion = & "C:\Program Files\nodejs\npm.cmd" -v
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm test failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "Testing project commands..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    Write-Host "✅ package.json found" -ForegroundColor Green
    
    Write-Host "Available scripts:" -ForegroundColor Gray
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    $packageJson.scripts.PSObject.Properties | ForEach-Object {
        Write-Host "  npm run $($_.Name)" -ForegroundColor Gray
    }
} else {
    Write-Host "❌ package.json not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Instructions for VS Code ===" -ForegroundColor Cyan
Write-Host "1. Restart VS Code" -ForegroundColor Yellow
Write-Host "2. Open Terminal (Ctrl+`)" -ForegroundColor Yellow
Write-Host "3. Select 'PowerShell' profile" -ForegroundColor Yellow
Write-Host "4. Run: node -v" -ForegroundColor Yellow
Write-Host "5. Run: npm -v" -ForegroundColor Yellow
Write-Host "6. Run: npm run dev" -ForegroundColor Yellow