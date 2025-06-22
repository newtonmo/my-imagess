Write-Host "Starting build process..." -ForegroundColor Cyan
npm run build

Write-Host "Copying index.html to 404.html..." -ForegroundColor Cyan
Copy-Item .\dist\index.html .\dist\404.html -Force

Write-Host "Deploying to GitHub Pages..." -ForegroundColor Cyan
npm run deploy

Write-Host ""
Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Visit your site at: https://newtonmo.github.io/vite_react_shadcn_ts/" -ForegroundColor Yellow
