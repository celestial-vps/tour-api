npm install migrate-mongo --save-dev
npx migrate-mongo init

const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  mongodb: {
    url: process.env.MONGO_URI,
    databaseName: process.env.MONGO_DB,
  },
  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
};

npx migrate-mongo create add-users-collection
npx migrate-mongo up
npx migrate-mongo down

npm run seed
