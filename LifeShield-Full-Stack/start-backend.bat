@echo off
cd /d "%~dp0backend"
if "%DB_PASSWORD%"=="" (
  echo ERROR: Set DB_PASSWORD in this terminal before starting the backend.
  echo Example: set DB_PASSWORD=your_postgres_password
  pause
  exit /b 1
)
mvn spring-boot:run
pause
