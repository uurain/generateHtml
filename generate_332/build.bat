


rd /s /q .\web-mobile
xcopy /y /e /k .\..\test3_3_2\build\*.* .\
node src/main 0 0
rem node src/main 0 ironSource