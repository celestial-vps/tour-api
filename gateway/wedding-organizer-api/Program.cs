using WeddingOrganizerAPI.Data;
using WeddingOrganizerAPI.Services;
using WeddingOrganizerAPI.Services.Interfaces;
using WeddingOrganizerAPI.Repositories;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using WeddingOrganizerAPI.Services.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using WeddingOrganizerAPI.Extensions;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    // options.AddPolicy("AllowAll", policy =>
    // {
    //     policy.AllowAnyOrigin()
    //           .AllowAnyMethod()
    //           .AllowAnyHeader();
    // });
    options.AddPolicy("AllowAngular", policy =>
{
    policy.WithOrigins("http://192.168.1.6:4200", "http://localhost:4200","http://192.168.1.6:4300", "http://localhost:4300") // harus cocok protokol dan port
          .AllowAnyHeader()
          .AllowAnyMethod();
    //    .AllowCredentials();
});
});
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Wedding Organizer API", Version = "v1" });

    // Konfigurasi JWT auth
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Masukkan token JWT dengan format: Bearer {your token}"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IVenueRepository, VenueRepository>();
builder.Services.AddScoped<IVenueService, VenueService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<IJwtService, JwtService>();


builder.Services.AddAutoMapper(typeof(Program)); // <-- register AutoMapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]);

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            RoleClaimType = ClaimTypes.Role // ⬅️ agar klaim "role" dikenali
        };
    });
// builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//     .AddJwtBearer(options =>
//     {
//         options.TokenValidationParameters = new TokenValidationParameters
//         {
//             RoleClaimType = ClaimTypes.Role // 👈 agar klaim role dikenali
//         };
//     });


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAngular");
Console.WriteLine("LOGIN endpoint hit!");
app.UseAuthentication();
app.UseAuthorization();
// app.UseRoleAuthorization(); // role jika mau query ulang ke db

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<AppDbContext>();

    await UserRoleSeeder.SeedAsync(context); // atau panggil seeder spesifik, misal UserRoleSeeder.SeedAsync(context);
}


app.Run();
