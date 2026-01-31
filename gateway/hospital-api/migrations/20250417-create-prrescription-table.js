module.exports = {
  up: async (pool) => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS prescriptions (
        oid CHAR(36) NOT NULL PRIMARY KEY,
        medicalRecordOid CHAR(36) NOT NULL,
        medicineOid CHAR(36) DEFAULT NULL,
        dosage VARCHAR(50) DEFAULT NULL,
        frequency VARCHAR(50) DEFAULT NULL,
        duration VARCHAR(50) DEFAULT NULL,
        notes TEXT DEFAULT NULL,
        createdBy CHAR(36) DEFAULT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        lastModifiedBy CHAR(36) DEFAULT NULL,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deletedBy CHAR(36) DEFAULT NULL,
        deletedAt DATETIME DEFAULT NULL,
        FOREIGN KEY (medicalRecordOid) REFERENCES patient_medical_records(oid) ON DELETE CASCADE,
        FOREIGN KEY (medicineOid) REFERENCES medicines(oid) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
  },
  down: async (pool) => {
    await pool.query(`DROP TABLE IF EXISTS prescriptions;`);
  }
};
