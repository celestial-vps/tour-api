$base = "app"

mkdir $base
mkdir "$base/controllers"
mkdir "$base/services"
mkdir "$base/repositories"
mkdir "$base/dtos"
mkdir "$base/mappings"
mkdir "$base/models"
mkdir "$base/config"
mkdir "$base/exceptions"
mkdir "$base/utils"

# root files
ni "$base/__init__.py"
ni "$base/main.py"

Write-Host "Python Clean Architecture folder structure created successfully."
