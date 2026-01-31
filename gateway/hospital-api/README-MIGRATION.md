# MIGRATION
npm install umzug mysql2
npm install fast-glob

# RUN MIGRATION
node runMigrations.js migrate up
node runMigrations.js migrate down


# CREATE FILE MIGRATION
POWERSHELL => New-Item -Path .\migrations\20250409-create-users-table.js -ItemType File
 