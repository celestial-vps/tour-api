module.exports = {
  up: async (pool) => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        oid CHAR(36) NOT NULL,
        patientOid CHAR(36) NOT NULL,
        doctorOid CHAR(36) NOT NULL,
        departmentOid CHAR(36) DEFAULT NULL,
        appointmentDate DATETIME NOT NULL,
        status ENUM('Scheduled','Completed','Cancelled') DEFAULT 'Scheduled',
        createdBy CHAR(36) DEFAULT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        lastModifiedBy CHAR(36) DEFAULT NULL,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deletedBy CHAR(36) DEFAULT NULL,
        deletedAt DATETIME DEFAULT NULL,
        PRIMARY KEY (oid),
        CONSTRAINT fk_patient FOREIGN KEY (patientOid) REFERENCES patients(oid) ON DELETE CASCADE,
        CONSTRAINT fk_doctor FOREIGN KEY (doctorOid) REFERENCES users(oid) ON DELETE CASCADE,
        CONSTRAINT fk_department FOREIGN KEY (departmentOid) REFERENCES departments(oid) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);
  },
  down: async (pool) => {
    await pool.query('DROP TABLE IF EXISTS appointments;');
  }
};
