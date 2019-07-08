:: Init. Echo off to suppress detailed info

@echo off
setlocal enabledelayedexpansion
set WB5="bin/WB5.js"
set dd = "bin/dd.map"
set source_dir="src/js"
set dest_dir="bin/src/js"

:: add debuging comment line //# sourceMappingURL=dd.map
:: rmdir %dest_dir% /S /Q
echo //# sourceMappingURL=final.map>>%WB5%
robocopy %source_dir% %dest_dir% /s /e /IS

:: replace full path  in map under sources C:/TFS/kROUGE_ODES/OI5/WB5/ to ""

powershell -Command "(gc bin/dd.map) -replace 'C:/TFS/kROUGE_ODES/OI5/WB5/', '' | Out-File bin/final.map ASCII"
