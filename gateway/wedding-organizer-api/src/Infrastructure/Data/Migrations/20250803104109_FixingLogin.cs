using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace wedding_organizer_api.src.infrastructure.data.Migrations
{
    /// <inheritdoc />
    public partial class FixingLogin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "desktopToken",
                table: "Users",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "tokenIos",
                table: "Users",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "tokenWeb",
                table: "Users",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "desktopToken",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "tokenIos",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "tokenWeb",
                table: "Users");
        }
    }
}
