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

# # Run seeders
# echo "Running seeders..."
# npx sequelize-cli db:seed:all



# if [ $? -eq 0 ]; then
#   echo "Seeders executed successfully."
# else
#   echo "Seeders execution failed. Exiting script."
#   exit 1
# fi


# Run specific seeders one by one
echo "Running specific seeders..."

SEEDERS=(
  "20250617160533-geo-seed.js"
  "20250420121520-seed-user-role.js"  
  "20250501023758-bank"
  "20250620074800-seed-countrys.js"
  "20250618062132-default-user.js"
)

for SEED in "${SEEDERS[@]}"; do
  echo "Running seeder: $SEED"
  npx sequelize-cli db:seed --seed "$SEED"

  if [ $? -eq 0 ]; then
    echo "Seeder $SEED executed successfully."
  else
    echo "Seeder $SEED failed. Exiting script."
    exit 1
  fi
done

# Sync Redis from DB
echo "Syncing Redis cache from database..."
npx sequelize-cli db:seed --seed 20250616173315-country-sync-redis.js

if [ $? -eq 0 ]; then
  echo "Redis sync completed successfully."
else
  echo "Redis sync failed. Exiting script."
  exit 1
fi

echo "✅ Database setup + Redis cache completed successfully."
