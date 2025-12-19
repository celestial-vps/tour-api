npm init -y
npm install express mongoose dotenv
npm install --save-dev nodemon

# MIGRATION
npm install umzug mysql2
npm install fast-glob
node runMigrations.js migrate up
node runMigrations.js migrate down



POWERSHELL => New-Item -Path .\migrations\20250409-create-users-table.js -ItemType File

node --trace-warnings index.js
