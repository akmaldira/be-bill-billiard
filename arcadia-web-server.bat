@echo off
title Arcadia Web Server

:: Sets the ESC character  
for /F %%a in ('echo prompt $E ^| cmd') do set "ESC=%%a"

:TestNetworkConnection
PING -n 1 -l 1 google.co.id >NUL
IF %errorlevel% EQU 0 GOTO TestPostgresRunning
GOTO NetworkFailedConnect


:NetworkFailedConnect
cls
echo %ESC%[91m Tidak ada koneksi internet %ESC%[0m
echo %ESC%[91m Mencoba mengecek koneksi ulang... %ESC%[0m
TIMEOUT 5
GOTO TestNetworkConnection

:TestPostgresRunning
echo %ESC%[92m [1] Koneksi internet OK %ESC%[0m
sc query "postgresql-x64-15" | find "RUNNING">NUL
IF %errorlevel% EQU 0 GOTO TestMosquittoRunning
GOTO PostgresNotRunning

:PostgresNotRunning
cls
echo %ESC%[91m PostgresSQL tidak berjalan %ESC%[0m
echo %ESC%[91m Mencoba mengecek ulang... %ESC%[0m
TIMEOUT 5
GOTO TestPostgresRunning

:TestMosquittoRunning
echo %ESC%[92m [2] PostgresSQL OK %ESC%[0m
sc query "mosquitto" | find "RUNNING">NULL
IF %errorlevel% EQU 0 GOTO ExecTask
GOTO MosquittoNotRunning

:MosquittoNotRunning
cls
echo %ESC%[91m Mosquitto tidak berjalan %ESC%[0m
echo %ESC%[91m Mencoba mengecek ulang... %ESC%[0m
TIMEOUT 5
GOTO TestMosquittoRunning

:ExecTask
echo %ESC%[92m [3] Mosquitto OK %ESC%[0m
D:
cd Project/bill-billiard/be-bill-billiard

echo %ESC%[92m [4] Memperbarui Script %ESC%[0m
git pull origin master

echo:
echo %ESC%[92m [5] Build Project %ESC%[0m
cmd /c yarn build

echo:
echo %ESC%[92m [6] Menjalankan Project %ESC%[0m
cmd /c yarn deploy:prod

echo:
echo %ESC%[92m [7] Logs %ESC%[0m
cmd /c yarn watch:prod

@pause
