const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  mongodb: {
    url: process.env.MONGO_URI || "mongodb://localhost:27017",
    databaseName: process.env.MONGO_DB || "simakdb",
  },

  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  moduleSystem: "commonjs"
};
