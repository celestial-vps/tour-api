module.exports = {
  up: async (pool) => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_roles (
        oid CHAR(36) NOT NULL,
        roleName VARCHAR(50) NOT NULL,
        targetType VARCHAR(50) DEFAULT NULL,
        isAdministrative TINYINT(1) NOT NULL,
        readState TINYINT(1) DEFAULT 0,
        writeState TINYINT(1) DEFAULT 0,
        createState TINYINT(1) DEFAULT 0,
        deleteState TINYINT(1) DEFAULT 0,
        navigateState TINYINT(1) DEFAULT 0,
        description TEXT DEFAULT NULL,
        lastModifiedBy CHAR(36) DEFAULT NULL,
        deletedBy CHAR(36) DEFAULT NULL,
        deletedAt DATETIME DEFAULT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (oid),
        UNIQUE KEY roleName (roleName)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
  },

  down: async (pool) => {
    await pool.query('DROP TABLE IF EXISTS user_roles;');
  },
};
