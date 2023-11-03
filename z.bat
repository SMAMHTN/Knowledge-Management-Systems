@echo off
set RETRY_COUNT=100

:build
docker build --no-cache -t ghcr.io/smam-tech/frontend:v2 .\frontend

if %errorlevel% neq 0 (
    set /a RETRY_COUNT-=1
    if %RETRY_COUNT% gtr 0 (
        echo Build failed. Retrying %RETRY_COUNT% more times...
        timeout /t 5 > nul
        goto build
    ) else (
        echo Maximum retry count reached. Exiting...
        exit /b 1
    )
)

echo Build completed successfully.
exit /b 0
