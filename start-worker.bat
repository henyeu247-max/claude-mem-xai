@echo off
REM ============================================
REM Claude-Mem-xAI Worker Service Starter
REM ============================================

echo.
echo ========================================
echo  Starting claude-mem-xai Worker Service
echo ========================================
echo.

REM Change to script directory
cd /d "%~dp0"

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed!
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [INFO] node_modules not found. Running npm install...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] npm install failed!
        pause
        exit /b 1
    )
)

REM Check if plugin folder exists
if not exist "plugin\" (
    echo [INFO] plugin folder not found. Running build...
    call npm run build
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Build failed!
        pause
        exit /b 1
    )
)

REM Start worker service
echo [INFO] Starting worker service...
call npm run worker:start

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo  Worker Service Started Successfully!
    echo ========================================
    echo.
    echo  Port: 37777
    echo  UI: http://localhost:37777
    echo.
    echo  Check status: npm run worker:status
    echo  View logs: npm run worker:logs
    echo  Stop service: npm run worker:stop
    echo.
) else (
    echo.
    echo [ERROR] Failed to start worker service!
    echo.
    pause
    exit /b 1
)

exit /b 0
