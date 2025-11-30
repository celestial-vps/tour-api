module.exports = {
  up: async (pool) => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS patient_medical_records (
        oid CHAR(36) NOT NULL PRIMARY KEY,
        patientOid CHAR(36) NOT NULL,
        doctorOid CHAR(36) DEFAULT NULL,
        diseaseOid CHAR(36) DEFAULT NULL,
        treatmentOid CHAR(36) DEFAULT NULL,
        recordDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        notes TEXT DEFAULT NULL,
        createdBy CHAR(36) DEFAULT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        lastModifiedBy CHAR(36) DEFAULT NULL,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deletedBy CHAR(36) DEFAULT NULL,
        deletedAt DATETIME DEFAULT NULL,
        FOREIGN KEY (patientOid) REFERENCES patients(oid),
        FOREIGN KEY (doctorOid) REFERENCES doctors(oid),
        FOREIGN KEY (diseaseOid) REFERENCES diseases(oid),
        FOREIGN KEY (treatmentOid) REFERENCES treatments(oid)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
  },
  down: async (pool) => {
    await pool.query(`DROP TABLE IF EXISTS patient_medical_records;`);
  }
};
