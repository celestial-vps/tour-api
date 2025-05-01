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

# npx sequelize-cli db:seed --seed 20250420121744-seed-country.js

echo "✅ First-time deployment complete!"
