param([switch]$ExpoGo)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

try {
    Write-Host ''
    if ($ExpoGo) { Write-Host 'RANDOM - Expo Go na telefonu' -ForegroundColor Magenta }
    else { Write-Host 'RANDOM - brza proba u pregledniku' -ForegroundColor Magenta }
    Write-Host 'Demo: 5 recepata + 5 knjiga + 5 filmova/serija. Bez baze, kljuceva ili placenih servisa.'
    Write-Host ''

    if (-not (Get-Command node.exe -ErrorAction SilentlyContinue) -or -not (Get-Command npm.cmd -ErrorAction SilentlyContinue)) {
        throw 'Nedostaje Node.js. Instaliraj besplatni Node.js 24 LTS sa nodejs.org, pa ponovo pokreni ovaj fajl.'
    }
    & node.exe -e "const [a,b,c]=process.versions.node.split('.').map(Number);process.exit((a===20&&(b>19||(b===19&&c>=4)))||(a===22&&b>=13)||(a===24&&(b>3||(b===3&&c>=0)))||a>=25?0:1)"
    if ($LASTEXITCODE -ne 0) { throw 'Ova Node.js verzija nije podrzana. Instaliraj Node.js 24 LTS.' }

    $lockHash = (Get-FileHash -Algorithm SHA256 'package-lock.json').Hash
    $stamp = Join-Path $projectRoot 'node_modules\.random-preview-lock'
    $installed = Test-Path 'node_modules\expo\package.json'
    $sameLock = (Test-Path $stamp) -and ((Get-Content -Raw $stamp).Trim() -eq $lockHash)
    if (-not $installed -or -not $sameLock) {
        Write-Host 'Prvo pripremam pakete. Prvi put ovo moze trajati nekoliko minuta...'
        & npm.cmd ci --no-audit --no-fund
        if ($LASTEXITCODE -ne 0) { throw 'Instalacija paketa nije zavrsena. Posalji gresku iz ovog prozora.' }
        Set-Content -Path $stamp -Value $lockHash
    }

    & npm.cmd run build:preview
    if ($LASTEXITCODE -ne 0) { throw 'Priprema previewa nije zavrsena.' }

    if ($ExpoGo) {
        $env:EXPO_OFFLINE = '0'
        Write-Host 'Provjeravam Expo prijavu (potrebna za razvojni certifikat).'
        & node.exe node_modules/expo/bin/cli whoami
        if ($LASTEXITCODE -ne 0) {
            & node.exe node_modules/expo/bin/cli login
            if ($LASTEXITCODE -ne 0) { throw 'Expo prijava nije zavrsena. Koristi isti Expo racun kao na telefonu.' }
        }
        Write-Host 'Pokrecem Expo Go. U pregledniku ce se pojaviti QR kod.'
        Write-Host 'Telefon i racunar trebaju biti na istoj Wi-Fi mrezi.'
    } else { Write-Host 'Pokrecem aplikaciju. Preglednik ce se otvoriti automatski.' }
    Write-Host 'Ostavi ovaj prozor otvoren. Za zaustavljanje pritisni Ctrl+C.'
    if ($ExpoGo) { & node.exe scripts/preview.mjs --go }
    else { & node.exe scripts/preview.mjs }
    if ($LASTEXITCODE -ne 0) { throw 'Preview nije zavrsio uredno. Posalji gresku iz ovog prozora.' }
} catch {
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
