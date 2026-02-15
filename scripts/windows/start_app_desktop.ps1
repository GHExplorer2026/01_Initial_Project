param(
  [ValidateSet("live", "fixtures")]
  [string]$SourceMode = "live",
  [string]$Host = "127.0.0.1",
  [int]$Port = 3000,
  [int]$StartupTimeoutSec = 90
)

$ErrorActionPreference = "Stop"

function Test-AppReady {
  param(
    [string]$Url
  )

  try {
    $response = Invoke-WebRequest -Uri $Url -Method Get -TimeoutSec 2 -UseBasicParsing
    return ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500)
  } catch {
    return $false
  }
}

function Open-DefaultBrowser {
  param(
    [string]$Url
  )

  try {
    Start-Process -FilePath $Url -ErrorAction Stop | Out-Null
    return $true
  } catch {
  }

  try {
    Start-Process -FilePath "cmd.exe" -ArgumentList @("/c", "start", "", $Url) -WindowStyle Hidden -ErrorAction Stop | Out-Null
    return $true
  } catch {
  }

  try {
    Start-Process -FilePath "explorer.exe" -ArgumentList @($Url) -ErrorAction Stop | Out-Null
    return $true
  } catch {
  }

  return $false
}

if (-not (Get-Command wsl.exe -ErrorAction SilentlyContinue)) {
  throw "WSL is required. Install WSL first, then rerun this launcher."
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoWinPath = (Resolve-Path (Join-Path $scriptDir "..\..")).Path
$repoWslPath = (wsl.exe wslpath -a "$repoWinPath").Trim()

if ([string]::IsNullOrWhiteSpace($repoWslPath)) {
  throw "Could not resolve repository path for WSL."
}

$appUrl = "http://$Host`:$Port/"
if (Test-AppReady -Url $appUrl) {
  if (Open-DefaultBrowser -Url $appUrl) {
    Write-Host "App already running. Opened in default browser: $appUrl"
  } else {
    Write-Warning "App is running, but browser launch failed. Open manually: $appUrl"
  }
  exit 0
}

$npmScript = if ($SourceMode -eq "live") { "dev:live" } else { "dev:fixtures" }
$wslCmd = "cd '$repoWslPath' && PATH=`"`$HOME/.nvm/versions/node/v20.20.0/bin:`$PATH`" npm run $npmScript"

Start-Process -FilePath "wsl.exe" -ArgumentList @("bash", "-lc", $wslCmd) -WindowStyle Normal | Out-Null

$ready = $false
for ($i = 0; $i -lt $StartupTimeoutSec; $i++) {
  if (Test-AppReady -Url $appUrl) {
    $ready = $true
    break
  }

  Start-Sleep -Seconds 1
}

if (-not $ready) {
  throw "App did not become ready within $StartupTimeoutSec seconds. Check the opened WSL terminal for errors."
}

if (Open-DefaultBrowser -Url $appUrl) {
  Write-Host "App started in '$SourceMode' mode and opened in default browser: $appUrl"
} else {
  Write-Warning "App started in '$SourceMode' mode, but browser launch failed. Open manually: $appUrl"
}
