$files = @(
  'assets/js/logo-data.js',
  'assets/js/svg-data.js',
  'assets/js/db-seed.js',
  'assets/js/storage.js',
  'assets/js/simulations.js',
  'assets/js/app.js'
)
$parts = @()
foreach ($f in $files) {
  $p = (Resolve-Path $f).Path
  $text = [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8)
  $parts += $text
}
$bundle = $parts -join "`n;`n"

$bundlePath1 = (Resolve-Path "bundle.js").Path
$bundlePath2 = (Resolve-Path "assets/js/bundle.js").Path

[System.IO.File]::WriteAllText($bundlePath1, $bundle, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText($bundlePath2, $bundle, [System.Text.Encoding]::UTF8)

Write-Host "Rebuild success. Length: $($bundle.Length)"
