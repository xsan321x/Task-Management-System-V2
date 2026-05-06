# Frontend Build Verification Script for Windows

Write-Host "🔍 Verifying Frontend Build..." -ForegroundColor Cyan
Write-Host ""

# Check if we're in the Frontend directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Make sure you're in the Frontend directory." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found package.json" -ForegroundColor Green
Write-Host ""

# Check Node version
Write-Host "📦 Node version:" -ForegroundColor Yellow
node --version
Write-Host ""

# Check npm version
Write-Host "📦 npm version:" -ForegroundColor Yellow
npm --version
Write-Host ""

# Install dependencies
Write-Host "📥 Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Run build
Write-Host "🔨 Building Next.js app..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Check the errors above." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful!" -ForegroundColor Green
Write-Host ""

# Check if .next directory was created
if (Test-Path ".next") {
    Write-Host "✅ .next directory created" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Build output:" -ForegroundColor Yellow
    Get-ChildItem .next -Recurse | Measure-Object -Property Length -Sum | Select-Object @{Name="Size(MB)";Expression={[math]::Round($_.Sum / 1MB, 2)}}
} else {
    Write-Host "❌ .next directory not found" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Frontend build verification complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To test locally, run:" -ForegroundColor Cyan
Write-Host "  npm start" -ForegroundColor White
Write-Host ""
Write-Host "The app should be available at http://localhost:3000" -ForegroundColor Cyan
