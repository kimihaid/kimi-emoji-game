# PowerShell profile for Node.js development
# Ensure Node.js is in PATH
$env:PATH += ";C:\Program Files\nodejs"

# Verify Node.js and npm are available
try {
    $nodeVersion = node -v 2>$null
    Write-Host "Node.js $nodeVersion is available" -ForegroundColor Green
} catch {
    Write-Host "Warning: Node.js not found in PATH" -ForegroundColor Yellow
}

try {
    $npmVersion = npm -v 2>$null
    Write-Host "npm $npmVersion is available" -ForegroundColor Green
} catch {
    Write-Host "Warning: npm not found in PATH" -ForegroundColor Yellow
}

# Project-specific functions
function dev { npm run dev }
function build { npm run build }
function start { npm run start }
function lint { npm run lint }

# Set location to project directory
Set-Location $PSScriptRoot\..