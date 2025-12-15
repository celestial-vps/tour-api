dotnet new webapi -n wedding-organizer-api
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package AutoMapper
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection
dotnet add package Swashbuckle.AspNetCore
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet tool install --global dotnet-ef
dotnet add package BCrypt.Net-Next
dotnet add package System.IdentityModel.Tokens.Jwt  
dotnet add package AutoMapper
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer


mkdir controllers dtos models mappings services repositories data
dotnet tool install --global dotnet-ef


migration 
dotnet ef migrations add FixingLogin
dotnet ef migrations add InitialCreate --output-dir src/infrastructure/data/Migrations --verbose
dotnet ef database update

rolback migration

dotnet ef database update 0

dotnet ef migrations remove

RUN
dotnet run
dotnet run --launch-profile "https"
dotnet run --launch-profile http

https://localhost:5401/swagger/index.html

DEBUG
dotnet build
dotnet watch run 
lalu tekang F5


# launchSettings.json https 
{
  "$schema": "http://json.schemastore.org/launchsettings.json",
  "iisSettings": {
    "windowsAuthentication": false,
    "anonymousAuthentication": true,
    "iisExpress": {
      "applicationUrl": "http://localhost:63179",
      "sslPort": 44341
    }
  },
  "profiles": {
    "http": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": true,
      "launchUrl": "swagger",
      "applicationUrl": "http://localhost:5401",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    },
    "https": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": true,
      "launchUrl": "swagger",
      "applicationUrl": "https://localhost:5401;http://localhost:5100",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    },
    "IIS Express": {
      "commandName": "IISExpress",
      "launchBrowser": true,
      "launchUrl": "swagger",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    }
  }
}



