#!/bin/bash

# Run migrations
echo "Running migrations..."
npx sequelize-cli db:migrate

# Check if migrations were successful
if [ $? -eq 0 ]; then
  echo "Migrations applied successfully."
else
  echo "Migrations failed. Exiting script."
  exit 1
fi

# Run seeders
echo "Running seeders..."
npx sequelize-cli db:seed:all

# Check if seeders were successful
if [ $? -eq 0 ]; then
  echo "Seeders executed successfully."
else
  echo "Seeders execution failed. Exiting script."
  exit 1
fi

echo "Database setup completed successfully."
