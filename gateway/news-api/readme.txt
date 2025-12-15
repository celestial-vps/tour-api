1 MIGRATION
 
    NODE_ENV=development npx typeorm-ts-node-commonjs migration:generate \
-d src/db/data-source.ts \
src/db/migrations/CreateBankTable

    NODE_ENV=development npx typeorm-ts-node-commonjs migration:run -d src/db/data-source.ts

    NODE_ENV=development npx typeorm-ts-node-commonjs migration:revert -d src/db/data-source.ts // UNDO MIGRATION

2. SEEDER
     npx ts-node src/db/seeds/index.ts

3. link swaggger 
    http://localhost:5010/api/v1/#/Bank/BankController_create


jalankan migration menggunakan git bash
NODE_ENV=development npx typeorm-ts-node-commonjs migration:generate \
-d src/db/data-source.ts \
src/db/migrations/create-new-table
