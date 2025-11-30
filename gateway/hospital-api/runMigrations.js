const path = require('path');
const dotenv = require('dotenv');
const { Umzug } = require('umzug');
const fs = require('fs');
const mysql = require('mysql2/promise'); // gunakan versi promise

// Tentukan file env berdasarkan NODE_ENV, default ke development
const envFile = path.resolve(__dirname, `.env.${process.env.NODE_ENV || 'development'}`);
dotenv.config({ path: envFile });
console.log(`Environment loaded from ${envFile}`);

// Buat MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT || 3306,
});

// Custom MySQL Storage untuk Umzug
class MySQLStorage {
  constructor(options) {
    this.pool = options.pool;
    this.tableName = options.tableName || 'migrations';
  }

  async executed() {
    const [rows] = await this.pool.query(`SELECT name FROM ${this.tableName}`);
    return rows.map((row) => row.name);
  }

  async logMigration(name) {
    await this.pool.query(`INSERT INTO ${this.tableName} (name) VALUES (?)`, [name]);
  }

  async unlogMigration(name) {
    await this.pool.query(`DELETE FROM ${this.tableName} WHERE name = ?`, [name]);
  }

  async createTable() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        name VARCHAR(255) PRIMARY KEY
      )
    `);
  }
}

// Initialize storage
const storage = new MySQLStorage({ pool, tableName: 'migrations' });

// Load migration files
const migrationFiles = fs
  .readdirSync(path.resolve(__dirname, 'migrations'))
  .filter((file) => file.endsWith('.js'))
  .map((file) => {
    const migration = require(path.resolve(__dirname, 'migrations', file));
    return {
      name: file,
      up: migration.up,
      down: migration.down,
    };
  });

// Initialize Umzug
const umzug = new Umzug({
  migrations: migrationFiles,
  storage: storage,
  context: pool,
  logger: console,
});

// Migration runner
async function runMigration() {
  const migrationType = process.argv[3]; // 'up' atau 'down'

  if (!migrationType || !['up', 'down'].includes(migrationType)) {
    console.log('Invalid migration type. Use "up" or "down".');
    return;
  }

  try {
    await storage.createTable();

    if (migrationType === 'up') {
      const executedMigrations = await umzug.storage.executed();
      for (const migration of migrationFiles) {
        if (!executedMigrations.includes(migration.name)) {
          console.log(`Applying migration: ${migration.name}`);
          await migration.up(pool);
          await umzug.storage.logMigration(migration.name);
          console.log(`Migration applied: ${migration.name}`);
        }
      }
      console.log('All migrations applied successfully!');
    } else if (migrationType === 'down') {
      const executedMigrations = await umzug.storage.executed();
      if (executedMigrations.length > 0) {
        const lastMigration = executedMigrations.pop();
        const migration = migrationFiles.find((m) => m.name === lastMigration);
        console.log(`Rolling back migration: ${lastMigration}`);
        await migration.down(pool);
        await umzug.storage.unlogMigration(lastMigration);
        console.log('Last migration rolled back successfully!');
      } else {
        console.log('No migrations to rollback.');
      }
    }
  } catch (error) {
    console.error('Error applying/rolling back migrations:', error);
  }
}

// Seed runner
async function runSeed() {
  const seedType = process.argv[3]; // 'up' atau 'down'

  if (!seedType || !['up', 'down'].includes(seedType)) {
    console.log('Invalid seed type. Use "up" or "down".');
    return;
  }

  try {
    const seedFiles = fs
      .readdirSync(path.resolve(__dirname, 'seeders'))
      .filter((file) => file.endsWith('.js'))
      .map((file) => {
        const seed = require(path.resolve(__dirname, 'seeders', file));
        return {
          name: file,
          up: seed.up,
          down: seed.down,
        };
      });

    for (const seed of seedFiles) {
      if (seedType === 'up') {
        console.log(`Running seed: ${seed.name}`);
        await seed.up(pool);
        console.log(`Seed applied: ${seed.name}`);
      } else if (seedType === 'down') {
        console.log(`Rolling back seed: ${seed.name}`);
        await seed.down(pool);
        console.log(`Seed rolled back: ${seed.name}`);
      }
    }
    console.log('All seeds processed successfully!');
  } catch (error) {
    console.error('Error applying/rolling back seeds:', error);
  }
}

// IIFE untuk menjalankan async function
(async () => {
  const action = process.argv[2]; // 'migrate' atau 'seed'

  if (action === 'migrate') {
    await runMigration();
  } else if (action === 'seed') {
    await runSeed();
  } else {
    console.log('Please specify an action: "migrate" or "seed".');
  }

  // Tutup pool MySQL setelah selesai
  await pool.end();
})();
