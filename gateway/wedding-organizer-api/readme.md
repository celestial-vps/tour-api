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


migration 
dotnet ef migrations add InitialCreate
dotnet ef migrations add InitialCreate --output-dir src/infrastructure/data/Migrations --verbose
dotnet ef database update

rolback migration

dotnet ef database update 0

dotnet ef migrations remove
