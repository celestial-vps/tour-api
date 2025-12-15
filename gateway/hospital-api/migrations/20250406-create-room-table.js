module.exports = {
  up: async (pool) => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        oid CHAR(36) NOT NULL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        departmentOid CHAR(36) DEFAULT NULL,
        type ENUM('General','ICU','Surgery','Maternity','Other') DEFAULT 'General',
        description TEXT DEFAULT NULL,
        createdBy CHAR(36) DEFAULT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        lastModifiedBy CHAR(36) DEFAULT NULL,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deletedBy CHAR(36) DEFAULT NULL,
        deletedAt DATETIME DEFAULT NULL,
        FOREIGN KEY (departmentOid) REFERENCES departments(oid)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
  },
  down: async (pool) => {
    await pool.query(`DROP TABLE IF EXISTS rooms;`);
  }
};
