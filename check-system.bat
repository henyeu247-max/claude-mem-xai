@echo off
REM ============================================
REM Claude-Mem-xAI System Check & Optimization
REM ============================================

echo.
echo ========================================
echo  Claude-Mem-xAI System Check
echo ========================================
echo.

cd /d "%~dp0"

REM Check 1: Node.js version
echo [1/8] Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [FAIL] Node.js is not installed!
    set CHECK_FAILED=1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [OK] Node.js %NODE_VERSION%
)
echo.

REM Check 2: Bun (optional)
echo [2/8] Checking Bun...
where bun >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] Bun not installed (will be auto-installed if needed)
) else (
    for /f "tokens=*" %%i in ('bun --version') do set BUN_VERSION=%%i
    echo [OK] Bun %BUN_VERSION%
)
echo.

REM Check 3: Worker service status
echo [3/8] Checking worker service...
call npm run worker:status >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Worker service is running
) else (
    echo [INFO] Worker service is not running
)
echo.

REM Check 4: Settings file
echo [4/8] Checking settings...
set SETTINGS_FILE=%USERPROFILE%\.claude-mem\settings.json
if exist "%SETTINGS_FILE%" (
    echo [OK] Settings file found

    REM Check Chroma status
    findstr /C:"CLAUDE_MEM_CHROMA_ENABLED" "%SETTINGS_FILE%" | findstr /C:"false" >nul
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Chroma is DISABLED (optimized)
    ) else (
        echo [WARNING] Chroma might be ENABLED (higher CPU usage)
    )

    REM Check provider
    findstr /C:"CLAUDE_MEM_PROVIDER" "%SETTINGS_FILE%" | findstr /C:"xai" >nul
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Provider is xAI
    ) else (
        echo [WARNING] Provider is not xAI
    )
) else (
    echo [INFO] Settings file not found (will be created on first run)
)
echo.

REM Check 5: Port availability
echo [5/8] Checking port 37777...
netstat -ano | findstr :37777 >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Port 37777 is in use (worker running)
) else (
    echo [INFO] Port 37777 is free
)
echo.

REM Check 6: Database
echo [6/8] Checking database...
set DB_FILE=%USERPROFILE%\.claude-mem\claude-mem.db
if exist "%DB_FILE%" (
    for %%A in ("%DB_FILE%") do set DB_SIZE=%%~zA
    echo [OK] Database found (%%DB_SIZE%% bytes)
) else (
    echo [INFO] Database not found (will be created on first run)
)
echo.

REM Check 7: Logs
echo [7/8] Checking logs...
set LOG_DIR=%USERPROFILE%\.claude-mem\logs
if exist "%LOG_DIR%" (
    for /f %%A in ('dir /b "%LOG_DIR%\*.log" 2^>nul ^| find /c /v ""') do set LOG_COUNT=%%A
    echo [OK] Found %LOG_COUNT% log files
) else (
    echo [INFO] Log directory not found
)
echo.

REM Check 8: CPU/Memory usage
echo [8/8] Checking resource usage...
for /f "tokens=*" %%i in ('wmic process where "name='bun.exe' or name='node.exe'" get WorkingSetSize 2^>nul ^| findstr /r "[0-9]"') do (
    set /a RAM_KB=%%i/1024
    echo [INFO] Process using !RAM_KB! KB RAM
)
echo.

echo ========================================
echo  System Check Complete
echo ========================================
echo.

if defined CHECK_FAILED (
    echo [WARNING] Some checks failed. Please review above.
) else (
    echo [OK] All checks passed!
)
echo.

REM Optimization suggestions
echo ========================================
echo  Optimization Suggestions
echo ========================================
echo.
echo  1. Ensure Chroma is DISABLED for lower CPU
echo  2. Use grok-4-1-fast-non-reasoning for speed
echo  3. Set LOG_LEVEL to WARN in production
echo  4. Limit CONTEXT_OBSERVATIONS to 30-50
echo  5. Set MAX_CONCURRENT_AGENTS to 1
echo.

pause
