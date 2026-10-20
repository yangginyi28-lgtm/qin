# Minimal static file server for previewing the portfolio locally.
# data.json is loaded with fetch(), which browsers block on file://, so the site needs a server.
# Usage: powershell -ExecutionPolicy Bypass -File .claude\serve.ps1 [-Port 8080]
param(
  [string]$Root = (Split-Path -Parent $PSScriptRoot),
  [int]$Port = 8080
)

$types = @{
  '.html' = 'text/html; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.js'   = 'application/javascript; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'
  '.jpg'  = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.png'  = 'image/png'
  '.webp' = 'image/webp'
  '.svg'  = 'image/svg+xml'
  '.ico'  = 'image/x-icon'
  '.pdf'  = 'application/pdf'
}

$rootFull = [IO.Path]::GetFullPath($Root)
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Output "Serving $rootFull on http://localhost:$Port/"

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $path = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart('/'))
  if ($path -eq '') { $path = 'index.html' }
  $file = [IO.Path]::GetFullPath((Join-Path $rootFull $path))

  # Only serve files inside the project folder, and never the .claude folder itself
  $inside = $file.StartsWith($rootFull, [StringComparison]::OrdinalIgnoreCase) -and
            -not $file.StartsWith((Join-Path $rootFull '.claude'), [StringComparison]::OrdinalIgnoreCase)

  if ($inside -and (Test-Path -LiteralPath $file -PathType Leaf)) {
    $bytes = [IO.File]::ReadAllBytes($file)
    $ext = [IO.Path]::GetExtension($file).ToLower()
    if ($types[$ext]) { $ctx.Response.ContentType = $types[$ext] }
    $ctx.Response.Headers.Add('Cache-Control', 'no-store')
    $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $ctx.Response.StatusCode = 404
  }
  $ctx.Response.Close()
}
