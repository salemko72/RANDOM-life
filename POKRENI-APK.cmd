@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Potreban je Node.js 24 LTS: https://nodejs.org/
 echo Instaliraj ga, pa ponovo otvori ovu datoteku.
 pause
 exit /b 1
)
node pokreni-apk.mjs
set "RANDOM_BUILD_EXIT=%ERRORLEVEL%"
echo.
if not "%RANDOM_BUILD_EXIT%"=="0" echo Build nije pokrenut ili nije zavrsen. Posalji tekst greske, bez lozinke/tokena.
pause
exit /b %RANDOM_BUILD_EXIT%
