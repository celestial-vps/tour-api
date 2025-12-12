const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '.env.development')
});

const config = {
  mongodb: {
    url: process.env.MONGO_URL || "mongodb://localhost:27017",
    databaseName: process.env.DATABASE || "lelangdevdb",
    options: {}
  },

  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  lockCollectionName: "changelog_lock",
  lockTtl: 0,
  migrationFileExtension: ".js",
  useFileHash: false,
  moduleSystem: 'commonjs',
};

module.exports = config;
