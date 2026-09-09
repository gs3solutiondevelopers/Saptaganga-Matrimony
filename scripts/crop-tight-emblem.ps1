Add-Type -AssemblyName System.Drawing

$srcPath = "E:\CODE PROJECT\Saptaganga\public\logo.png"
$img = [System.Drawing.Bitmap]::FromFile($srcPath)

$w = $img.Width
$h = $img.Height

# Scan only the top 55% of the image (above the text "SAPTAGANGA")
$scanHeight = [int]($h * 0.54)

$minX = $w
$maxX = 0
$minY = $scanHeight
$maxY = 0

for ($y = 0; $y -lt $scanHeight; $y += 4) {
    for ($x = 0; $x -lt $w; $x += 4) {
        $c = $img.GetPixel($x, $y)
        if ($c.A -gt 25) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Emblem Bounding Box: X=[$minX, $maxX], Y=[$minY, $maxY]"
$padding = 20
$cropX = [Math]::Max(0, $minX - $padding)
$cropY = [Math]::Max(0, $minY - $padding)
$cropW = [Math]::Min($w - $cropX, ($maxX - $minX) + ($padding * 2))
$cropH = [Math]::Min($scanHeight - $cropY, ($maxY - $minY) + ($padding * 2))

Write-Host "Crop Rect: $cropX, $cropY, $cropW, $cropH"

$cropped = New-Object System.Drawing.Bitmap($cropW, $cropH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$graphics = [System.Drawing.Graphics]::FromImage($cropped)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.Clear([System.Drawing.Color]::Transparent)

$destRect = New-Object System.Drawing.Rectangle(0, 0, $cropW, $cropH)
$graphics.DrawImage($img, $destRect, $cropX, $cropY, $cropW, $cropH, [System.Drawing.GraphicsUnit]::Pixel)

$destPath = "E:\CODE PROJECT\Saptaganga\public\logo-emblem.png"
$cropped.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

$graphics.Dispose()
$cropped.Dispose()
$img.Dispose()

Write-Host "Tight emblem saved successfully to $destPath"
