$root = $PSScriptRoot
if (-not $root) { $root = "C:\Users\ThinkPad\.gemini\antigravity\scratch\trigonometri-interaktif" }

$files = @(
  'assets/js/logo-data.js',
  'assets/js/svg-data.js',
  'assets/js/firebase-config.js',
  'assets/js/firebase-service.js',
  'assets/js/db-seed.js',
  'assets/js/storage.js',
  'assets/js/simulations.js',
  'assets/js/app.js'
)
$parts = @()
foreach ($f in $files) {
  $p = Join-Path $root $f
  if (Test-Path $p) {
    $text = [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8)
    $parts += $text
  } else {
    Write-Error "File not found: $p"
  }
}
$bundle = $parts -join "`n;`n"

$bundlePath1 = Join-Path $root "bundle.js"
$bundlePath2 = Join-Path $root "assets/js/bundle.js"

[System.IO.File]::WriteAllText($bundlePath1, $bundle, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText($bundlePath2, $bundle, [System.Text.Encoding]::UTF8)

Write-Host "Rebuild success. Length: $($bundle.Length)"
