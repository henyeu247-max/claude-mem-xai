@echo off
REM ============================================
REM Claude-Mem-xAI Quick Setup Script
REM ============================================

echo.
echo ========================================
echo  Claude-Mem-xAI Quick Setup
echo ========================================
echo.

REM Change to script directory
cd /d "%~dp0"

REM Step 1: Check Node.js
echo [1/6] Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION% found
echo.

REM Step 2: Check Git
echo [2/6] Checking Git...
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Git is not installed!
    echo You can still use the project, but updates will be manual.
) else (
    for /f "tokens=*" %%i in ('git --version') do set GIT_VERSION=%%i
    echo [OK] %GIT_VERSION% found
)
echo.

REM Step 3: Install dependencies
echo [3/6] Installing dependencies...
if exist "node_modules\" (
    echo [INFO] node_modules already exists, skipping...
) else (
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] npm install failed!
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed
)
echo.

REM Step 4: Build project
echo [4/6] Building project...
if exist "plugin\scripts\worker-service.cjs" (
    echo [INFO] Build files already exist, skipping...
) else (
    call npm run build
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Build failed!
        pause
        exit /b 1
    )
    echo [OK] Project built successfully
)
echo.

REM Step 5: Check settings
echo [5/6] Checking settings...
set SETTINGS_FILE=%USERPROFILE%\.claude-mem\settings.json
if exist "%SETTINGS_FILE%" (
    echo [OK] Settings file found: %SETTINGS_FILE%
) else (
    echo [INFO] Settings file not found. Will be created on first run.
)
echo.

REM Step 6: Start worker
echo [6/6] Starting worker service...
call npm run worker:start
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to start worker service!
    pause
    exit /b 1
)
echo.

echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo  Next steps:
echo  1. Configure xAI API key in settings
echo  2. Open UI: http://localhost:37777
echo  3. Test in Claude Code: /mem-search "test"
echo.
echo  Useful commands:
echo  - npm run worker:status  (check status)
echo  - npm run worker:logs    (view logs)
echo  - npm run worker:stop    (stop service)
echo  - npm run worker:restart (restart service)
echo.

pause
