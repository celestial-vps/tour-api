#!/bin/bash

# Run migrations
echo "Running migrations..."
npx sequelize-cli db:migrate

if [ $? -eq 0 ]; then
  echo "Migrations applied successfully."
else
  echo "Migrations failed. Exiting script."
  exit 1
fi

# Run seeders
echo "Running seeders..."
npx sequelize-cli db:seed:all

if [ $? -eq 0 ]; then
  echo "Seeders executed successfully."
else
  echo "Seeders execution failed. Exiting script."
  exit 1
fi

# Sync Redis from DB
echo "Syncing Redis cache from database..."
npx sequelize-cli db:seed --seed 20230617-country-sync-redis.js

if [ $? -eq 0 ]; then
  echo "Redis sync completed successfully."
else
  echo "Redis sync failed. Exiting script."
  exit 1
fi

echo "✅ Database setup + Redis cache completed successfully."
