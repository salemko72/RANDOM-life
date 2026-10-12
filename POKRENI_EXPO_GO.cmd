@echo off
cd /d "%~dp0"
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\preview.ps1" -ExpoGo
if errorlevel 1 pause
