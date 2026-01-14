#!/bin/bash

# echo "Installing dependencies..."
# npm install

# echo "Building project..."
# npm run build

echo "Running database migrations..."
npx sequelize-cli db:migrate

echo "Seeding database..."
npx sequelize-cli db:seed:all

# npx sequelize-cli db:seed:undo:all

# npx sequelize-cli db:seed --seed 20250420121520-seed-user-role.js
# npx sequelize-cli db:seed --seed 20250420121744-seed-country.js
# npx sequelize-cli db:seed --seed 20250501023758-bank.js
# npx sequelize-cli db:seed --seed 20250616173315-country-sync-redis.js
# npx sequelize-cli db:seed --seed 20250617160533-geo-seed.js
# npx sequelize-cli db:seed --seed 20250618062132-default-user.js
# npx sequelize-cli db:seed --seed 20250622044744-seed-hotels.js
# npx sequelize-cli db:seed --seed 20250624034148-seed-vehicle-types.js    
# npx sequelize-cli db:seed --seed 20250626095632-seed-subject-categories.js
# npx sequelize-cli db:seed --seed 20250626111109-seed-learning-level.js
# npx sequelize-cli db:seed --seed 20250717143456-alter-tour-schedule.js

# npx sequelize-cli db:seed --seed 20250717143456-alter-tour-schedule.js
# npx sequelize-cli db:seed --seed 20250717143456-alter-tour-schedule.js
# npx sequelize-cli db:seed --seed 20250717143456-alter-tour-schedule.js

# npx sequelize-cli db:seed --seed 20250618062132-default-user.js
# npx sequelize-cli db:seed --seed 20250626111109-seed-learning-level.js


echo "✅ First-time deployment complete!"
