module.exports = {
  up: async (pool) => {
    await pool.query(`
      CREATE TABLE patients (
        oid CHAR(36) NOT NULL PRIMARY KEY,
        fullName VARCHAR(100) NOT NULL,
        gender ENUM('Male','Female','Other') DEFAULT 'Other',
        birthDate DATE DEFAULT NULL,
        phone VARCHAR(20) DEFAULT NULL,
        address TEXT DEFAULT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deletedAt DATETIME DEFAULT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
  },
  down: async (pool) => {
    await pool.query(`DROP TABLE IF EXISTS patients;`);
  }
};
