module.exports = {
  up: async (pool) => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS patient_lab_tests (
        oid CHAR(36) NOT NULL PRIMARY KEY,
        patientOid CHAR(36) NOT NULL,
        labTestOid CHAR(36) NOT NULL,
        doctorOid CHAR(36) DEFAULT NULL,
        result TEXT DEFAULT NULL,
        testDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        createdBy CHAR(36) DEFAULT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        lastModifiedBy CHAR(36) DEFAULT NULL,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deletedBy CHAR(36) DEFAULT NULL,
        deletedAt DATETIME DEFAULT NULL,
        FOREIGN KEY (patientOid) REFERENCES patients(oid),
        FOREIGN KEY (labTestOid) REFERENCES lab_tests(oid),
        FOREIGN KEY (doctorOid) REFERENCES doctors(oid)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
  },
  down: async (pool) => {
    await pool.query(`DROP TABLE IF EXISTS patient_lab_tests;`);
  }
};
