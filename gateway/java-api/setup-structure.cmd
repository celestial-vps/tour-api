@echo off
echo Creating Java Clean Architecture Folder Structure...

REM Base application package
set BASE=src\main\java\com\example\app

REM Root src folders
mkdir src
mkdir src\main
mkdir src\main\java
mkdir src\main\resources
mkdir src\test
mkdir src\test\java

mkdir %BASE%
mkdir %BASE%\controllers
mkdir %BASE%\services
mkdir %BASE%\repositories
mkdir %BASE%\dtos
mkdir %BASE%\mappings
mkdir %BASE%\models
mkdir %BASE%\config
mkdir %BASE%\exceptions
mkdir %BASE%\utils

REM Resources folders
mkdir src\main\resources\static
mkdir src\main\resources\templates

echo DONE.
pause
