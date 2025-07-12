@echo off
setlocal enabledelayedexpansion

REM Ambil timestamp sekarang format YYYYMMDDHHMMSS dengan WMIC
for /f "skip=1 tokens=1 delims=." %%x in ('wmic os get localdatetime') do if not defined mydate set mydate=%%x

set timestamp=%mydate:~0,14%

REM Minta nama migrasi dari user
set /p name=Enter migration name (use underscore for spaces): 

REM Buat file migrasi kosong
echo. > %timestamp%_%name%.up.sql
echo. > %timestamp%_%name%.down.sql

echo Created files:
echo %timestamp%_%name%.up.sql
echo %timestamp%_%name%.down.sql

pause
