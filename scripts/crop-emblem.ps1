Add-Type -AssemblyName System.Drawing

$srcPath = "E:\CODE PROJECT\Saptaganga\public\logo.png"
$img = [System.Drawing.Bitmap]::FromFile($srcPath)

$w = $img.Width
$h = $img.Height
Write-Host "Original Dimensions: $w x $h"

# Crop the upper emblem (top ~58% of the image where the arched lotus & couple illustration is)
$cropHeight = [int]($h * 0.58)
$cropRect = New-Object System.Drawing.Rectangle(0, 0, $w, $cropHeight)

$cropped = New-Object System.Drawing.Bitmap($w, $cropHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$graphics = [System.Drawing.Graphics]::FromImage($cropped)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.Clear([System.Drawing.Color]::Transparent)

$destRect = New-Object System.Drawing.Rectangle(0, 0, $w, $cropHeight)
$graphics.DrawImage($img, $destRect, 0, 0, $w, $cropHeight, [System.Drawing.GraphicsUnit]::Pixel)

$destPath = "E:\CODE PROJECT\Saptaganga\public\logo-emblem.png"
$cropped.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

$graphics.Dispose()
$cropped.Dispose()
$img.Dispose()

Write-Host "Saved emblem to $destPath"
