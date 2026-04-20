@echo off
echo ========================================================
echo MySQL Password Reset Tool
echo ========================================================
echo.
echo Stopping MySQL 9.4 service...
net stop MySQL94
echo Stopping MySQL 8.0 service (if running)...
net stop MySQL80
echo.

echo Creating initialization file...
echo ALTER USER 'root'@'localhost' IDENTIFIED BY '1234'; > C:\mysql-init.txt

echo Restarting MySQL with init file to reset password to '1234'...
start "MySQL Password Reset" "C:\Program Files\MySQL\MySQL Server 9.4\bin\mysqld.exe" --defaults-file="C:\ProgramData\MySQL\MySQL Server 9.4\my.ini" --init-file=C:\mysql-init.txt --console

echo Waiting 10 seconds for password reset to complete...
timeout /t 10 /nobreak >nul

echo Shutting down the temporary MySQL process...
taskkill /F /IM mysqld.exe

echo.
echo Starting MySQL 9.4 service normally...
net start MySQL94

echo Cleaning up...
del C:\mysql-init.txt

echo.
echo ========================================================
echo SUCCESS! Your MySQL root password has been reset to: 1234
echo ========================================================
pause
