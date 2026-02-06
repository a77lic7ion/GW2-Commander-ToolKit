@echo off
setlocal

:: Create/clear log file
set LOGFILE=%~dp0build.log
echo Build started at %date% %time% > "%LOGFILE%"
echo. >> "%LOGFILE%"

echo ====================================================
echo GW2 CommKit: Master Build Script
echo ====================================================
echo Logging to: %LOGFILE%
echo.

echo ==================================================== >> "%LOGFILE%"
echo GW2 CommKit: Master Build Script >> "%LOGFILE%"
echo ==================================================== >> "%LOGFILE%"
echo. >> "%LOGFILE%"

:: [1/3] Environment Prep
SET "NODE_PATH_DIR=C:\Program Files\nodejs"
SET "SystemRoot=C:\Windows"
SET "COMSPEC=C:\Windows\System32\cmd.exe"
:: Explicitly set PATH to include local .bin, node, and System32 (critical)
SET "PATH=%~dp0node_modules\.bin;%NODE_PATH_DIR%;C:\Windows\System32;C:\Windows;%PATH%"

echo:: [2/3] Installing Dependencies (NPM)...
echo [2/3] Installing Dependencies (NPM)... >> "%LOGFILE%"

:: Clean node_modules to ensure fresh state
echo Cleaning node_modules (this may take a moment)...
echo Cleaning node_modules... >> "%LOGFILE%"

if exist node_modules (
    rmdir /s /q node_modules >nul 2>&1
    if exist node_modules (
        echo [WARNING] Some files in node_modules could not be deleted.
        echo [WARNING] Some files in node_modules could not be deleted. >> "%LOGFILE%"
        echo Please close all VS Code instances, terminals, or run "taskkill /f /im node.exe" and try again.
        echo Please close all VS Code instances, terminals, or run "taskkill /f /im node.exe" and try again. >> "%LOGFILE%"
        pause
        exit /b 1
    )
)

:: Use npm install instead of yarn
echo Running npm install...
echo Running npm install... >> "%LOGFILE%"
call npm install >> "%LOGFILE%" 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] npm install failed. >> "%LOGFILE%"
    echo [ERROR] npm install failed. Check build.log for details.
    pause
    exit /b 1
)

:: [3/3] Build & Execution
echo Building UI (Vite)...
echo Building UI (Vite)... >> "%LOGFILE%"
call npm run build >> "%LOGFILE%" 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Vite build failed. >> "%LOGFILE%"
    echo [ERROR] Vite build failed. Check build.log for details.
    pause
    exit /b 1
)

echo Packaging Application (Electron Builder)...
echo Packaging Application (Electron Builder)... >> "%LOGFILE%"
:: Calling electron-builder. Since it is in PATH (from .bin), this works.
call electron-builder --win >> "%LOGFILE%" 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Packaging failed. >> "%LOGFILE%"
    echo [ERROR] Packaging failed. Check build.log for details.
    pause
    exit /b 1
)

echo. >> "%LOGFILE%"
echo Build completed successfully at %date% %time% >> "%LOGFILE%"
echo BOOM. Build verify.
echo.
echo Full build log saved to: %LOGFILE%
pause
