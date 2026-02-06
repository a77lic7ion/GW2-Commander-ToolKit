@echo off
Setlocal EnableDelayedExpansion
for /f "tokens=1-4 delims=: " %%i in ('cmd /c C:\Windows\System32\wbem\wmic path Win32_UTCTime Get Hour^,DayOfWeek^|findstr [0-9]') do (
    set /a dw=%%i
    set /a pdw=%%i-1
    set /a h=%%j
)
set "psna[0]=[^&BIkHAAA=][^&BDoBAAA=][^&BO4CAAA=][^&BC0AAAA=][^&BIUCAAA=][^&BCECAAA=]"
set "psna[1]=[^&BIcHAAA=][^&BEwDAAA=][^&BNIEAAA=][^&BKYBAAA=][^&BIMCAAA=][^&BA8CAAA=]"
set "psna[2]=[^&BH8HAAA=][^&BEgAAAA=][^&BKgCAAA=][^&BBkAAAA=][^&BGQCAAA=][^&BIMBAAA=]"
set "psna[3]=[^&BH4HAAA=][^&BMIBAAA=][^&BP0CAAA=][^&BKYAAAA=][^&BDgDAAA=][^&BPEBAAA=]"
set "psna[4]=[^&BKsHAAA=][^&BE8AAAA=][^&BP0DAAA=][^&BIMAAAA=][^&BF0GAAA=][^&BOcBAAA=]"
set "psna[5]=[^&BJQHAAA=][^&BMMCAAA=][^&BJsCAAA=][^&BNUGAAA=][^&BHsBAAA=][^&BNMAAAA=]"
set "psna[6]=[^&BH8HAAA=][^&BLkCAAA=][^&BBEDAAA=][^&BJIBAAA=][^&BEICAAA=][^&BBABAAA=]"

if %h% geq 8 (
    echo !psna[%dw%]! | clip
)
if %h% lss 8 (
    if %dw% gtr 0 (
        echo !psna[%pdw%]! | clip
    )
    if %dw% equ 0 (
        echo !psna[6]! | clip
    )
)