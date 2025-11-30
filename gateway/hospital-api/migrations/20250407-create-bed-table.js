module.exports = {
  up: async (pool) => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS beds (
        oid CHAR(36) NOT NULL PRIMARY KEY,
        roomOid CHAR(36) NOT NULL,
        bedNumber VARCHAR(20) NOT NULL,
        status ENUM('Available','Occupied','Maintenance') DEFAULT 'Available',
        createdBy CHAR(36) DEFAULT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        lastModifiedBy CHAR(36) DEFAULT NULL,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deletedBy CHAR(36) DEFAULT NULL,
        deletedAt DATETIME DEFAULT NULL,
        FOREIGN KEY (roomOid) REFERENCES rooms(oid)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
  },
  down: async (pool) => {
    await pool.query(`DROP TABLE IF EXISTS beds;`);
  }
};
