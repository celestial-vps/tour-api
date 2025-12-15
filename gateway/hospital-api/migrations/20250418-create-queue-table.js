module.exports = {
  up: async (pool) => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS queues (
        oid CHAR(36) NOT NULL PRIMARY KEY,
        patientOid CHAR(36) NOT NULL,
        doctorOid CHAR(36) DEFAULT NULL,
        departmentOid CHAR(36) DEFAULT NULL,
        queueNumber INT NOT NULL,
        status ENUM('Waiting','InProgress','Done') DEFAULT 'Waiting',
        scheduledAt DATETIME DEFAULT NULL,
        createdBy CHAR(36) DEFAULT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        lastModifiedBy CHAR(36) DEFAULT NULL,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deletedBy CHAR(36) DEFAULT NULL,
        deletedAt DATETIME DEFAULT NULL,
        FOREIGN KEY (patientOid) REFERENCES patients(oid) ON DELETE CASCADE,
        FOREIGN KEY (doctorOid) REFERENCES users(oid) ON DELETE SET NULL,
        FOREIGN KEY (departmentOid) REFERENCES departments(oid) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
  },
  down: async (pool) => {
    await pool.query(`DROP TABLE IF EXISTS queues;`);
  }
};
