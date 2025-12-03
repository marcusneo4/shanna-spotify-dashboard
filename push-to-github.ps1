# Script to push to GitHub
# Replace YOUR_USERNAME and REPO_NAME with your actual GitHub username and repository name

$username = "YOUR_USERNAME"
$repoName = "REPO_NAME"  # e.g., "shanna-spotify-dashboard"

Write-Host "Adding remote origin..." -ForegroundColor Green
git remote add origin "https://github.com/$username/$repoName.git"

Write-Host "Pushing to GitHub..." -ForegroundColor Green
git push -u origin main

Write-Host "Done! Your repository is now on GitHub." -ForegroundColor Green
Write-Host "Visit: https://github.com/$username/$repoName" -ForegroundColor Cyan

