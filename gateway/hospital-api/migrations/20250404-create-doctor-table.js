module.exports = {
    up: async (pool) => {
        await pool.query(`
      CREATE TABLE doctors (
        oid CHAR(36) NOT NULL PRIMARY KEY,
        userOid CHAR(36) NOT NULL,
        specializationOid CHAR(36) DEFAULT NULL,
        phone VARCHAR(20) DEFAULT NULL,
        createdBy CHAR(36) DEFAULT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        lastModifiedBy CHAR(36) DEFAULT NULL,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deletedBy CHAR(36) DEFAULT NULL,
        deletedAt DATETIME DEFAULT NULL, 
        FOREIGN KEY (userOid) REFERENCES users(oid) ON DELETE CASCADE,
        FOREIGN KEY (specializationOid) REFERENCES specializations(oid) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
    },
    down: async (pool) => {
        await pool.query(`DROP TABLE IF EXISTS doctors;`);
    }
};
