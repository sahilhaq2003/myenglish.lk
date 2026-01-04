@echo off
echo ==========================================
echo      MyEnglish.lk Helper Script
echo ==========================================
echo.
echo This script will help you restart the server to apply changes.
echo.
echo 1. We will stop all running Node.js processes (Backend & Frontend).
echo 2. We will restart the Backend server (listening on port 3001).
echo 3. We will restart the Frontend server (listening on port 3000).
echo.
echo.
echo Starting auto-cleanup...

echo.
echo Stopping all node.exe processes...
taskkill /F /IM node.exe
echo stopped.

echo.
echo Starting Backend Server...
start "MyEnglish Backend" cmd /k "node server/index.js"

echo.
echo Waiting 5 seconds for backend to initialize...
timeout /t 5 /nobreak >nul

echo.
echo Starting Frontend...
start "MyEnglish Frontend" cmd /k "npm run dev"

echo.
echo ==========================================
echo DONE! You can now check the app in browser.
echo ==========================================
pause
