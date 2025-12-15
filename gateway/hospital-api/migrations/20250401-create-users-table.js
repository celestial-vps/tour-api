module.exports = {
  up: async (pool) => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        oid CHAR(36) NOT NULL,
        email VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        androidToken VARCHAR(255) DEFAULT NULL,
        expiredTime VARCHAR(50) DEFAULT NULL,
        isActive TINYINT(1) DEFAULT NULL,
        activatedAt DATETIME DEFAULT NULL,
        roleOid CHAR(36) DEFAULT NULL,
        description TEXT DEFAULT NULL,
        lastModifiedBy CHAR(36) DEFAULT NULL,
        deletedBy CHAR(36) DEFAULT NULL,
        deletedAt DATETIME DEFAULT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (oid),
        UNIQUE KEY email (email),
        CONSTRAINT fk_user_role FOREIGN KEY (roleOid) REFERENCES user_roles(oid) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
  },

  down: async (pool) => {
    await pool.query('DROP TABLE IF EXISTS users;');
  },
};
