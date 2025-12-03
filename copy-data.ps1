# PowerShell script to copy Spotify data files to public/data folder
# Update the $sourcePath variable below to point to your Spotify Extended Streaming History folder

$sourcePath = "C:\Users\e0775081\Downloads\Spotify Extended Streaming History\Spotify Extended Streaming History"
$destPath = "public\data"

# If the default path doesn't work, uncomment and update the line below:
# $sourcePath = "YOUR_PATH_HERE\Spotify Extended Streaming History\Spotify Extended Streaming History"

# Create destination folder if it doesn't exist
if (-not (Test-Path $destPath)) {
    New-Item -ItemType Directory -Path $destPath -Force
    Write-Host "Created directory: $destPath" -ForegroundColor Green
}

# List of files to copy
$files = @(
    "Streaming_History_Audio_2016-2020_0.json",
    "Streaming_History_Audio_2020-2021_1.json",
    "Streaming_History_Audio_2021-2022_2.json",
    "Streaming_History_Audio_2022-2023_3.json",
    "Streaming_History_Audio_2023_4.json",
    "Streaming_History_Audio_2023-2024_5.json",
    "Streaming_History_Audio_2024-2025_6.json",
    "Streaming_History_Audio_2025_7.json"
)

$copied = 0
$failed = 0

foreach ($file in $files) {
    $sourceFile = Join-Path $sourcePath $file
    $destFile = Join-Path $destPath $file
    
    if (Test-Path $sourceFile) {
        Copy-Item -Path $sourceFile -Destination $destFile -Force
        Write-Host "Copied: $file" -ForegroundColor Green
        $copied++
    } else {
        Write-Host "Not found: $file" -ForegroundColor Yellow
        $failed++
    }
}

Write-Host "`nCopy complete! $copied files copied, $failed files not found." -ForegroundColor Cyan
Write-Host "Files are now in: $destPath" -ForegroundColor Cyan
