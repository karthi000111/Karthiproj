@echo off
echo Stopping Android Emulator...
adb emu kill 2>nul
taskkill /F /IM qemu-system-x86_64.exe /T 2>nul
taskkill /F /IM emulator.exe /T 2>nul
echo Done! Emulator stopped.
pause
