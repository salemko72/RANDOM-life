@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Potreban je Node.js 24 LTS: https://nodejs.org/
 pause
 exit /b 1
)
node prikupi-gresku.mjs
set "RANDOM_DIAGNOSTIC_EXIT=%ERRORLEVEL%"
echo.
pause
exit /b %RANDOM_DIAGNOSTIC_EXIT%
