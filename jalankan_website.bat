@echo off
title Media Pembelajaran Interaktif Trigonometri - Aswan, M.Pd., Gr.
color 0B
echo =========================================================================
echo   MEDIA PEMBELAJARAN INTERAKTIF PERBANDINGAN TRIGONOMETRI SMA
echo   Pengembang: Aswan, M.Pd., Gr.
echo =========================================================================
echo.

:: 1. Periksa apakah MySQL berjalan
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] MySQL Daemon sedang berjalan di latar belakang.
) else (
    echo [INFO] Menyalakan MySQL MariaDB XAMPP...
    start /B "" "C:\xampp\mysql\bin\mysqld.exe" --defaults-file="C:\xampp\mysql\bin\my.ini" --standalone
    timeout /t 3 /nobreak >nul
)

:: 2. Buka Browser Otomatis
echo [INFO] Membuka peramban (browser) ke http://localhost:8080 ...
start http://localhost:8080

:: 3. Jalankan Web Server PHP
echo.
echo =========================================================================
echo   Server Web PHP aktif pada: http://localhost:8080
echo   Jangan tutup jendela command prompt ini selama aplikasi digunakan!
echo   Tekan Ctrl + C untuk menghentikan server.
echo =========================================================================
echo.
"C:\xampp\php\php.exe" -S localhost:8080 -t "%~dp0"
pause
