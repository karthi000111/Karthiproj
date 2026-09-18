@echo off
adb shell screencap -p /sdcard/snap.png
adb pull /sdcard/snap.png screenshot_current.png
