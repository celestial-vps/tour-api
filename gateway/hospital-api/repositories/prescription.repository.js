const save = async (data, options) => {
    const connection = options.transaction;
    try {
        const query = `
            INSERT INTO prescriptions (
                oid, medicalRecordOid, medicineOid,
                dosage, frequency, duration, notes,
                createdBy, createdAt, lastModifiedBy, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await connection.execute(query, [
            data.oid,
            data.medicalRecordOid,
            data.medicineOid,
            data.dosage,
            data.frequency,
            data.duration,
            data.notes,
            data.createdBy,
            data.createdAt,
            data.lastModifiedBy,
            data.updatedAt
        ]);

        return { result, err: null };
    } catch (err) {
        return { result: null, err: { httpStatus: 500 } };
    }
};


const update = async (oid, data, options) => {
    const connection = options.transaction;
    try {
        const query = `
            UPDATE prescriptions SET
                medicalRecordOid = ?,
                medicineOid = ?,
                dosage = ?,
                frequency = ?,
                duration = ?,
                notes = ?,
                lastModifiedBy = ?,
                updatedAt = ?
            WHERE oid = ?;
        `;

        const [result] = await connection.execute(query, [
            data.medicalRecordOid,
            data.medicineOid,
            data.dosage,
            data.frequency,
            data.duration,
            data.notes,
            data.lastModifiedBy,
            data.updatedAt,
            oid
        ]);

        return { result, err: null };
    } catch (err) {
        return { result: null, err: { httpStatus: 500 } };
    }
};


const deleted = async (oid, options) => {
    const connection = options.transaction;
    try {
        const query = `DELETE FROM prescriptions WHERE oid = ?`;
        const [result] = await connection.execute(query, [oid]);
        return { result, err: null };
    } catch (err) {
        return { result: null, err: { httpStatus: 500 } };
    }
};


const findAll = async (connection) => {
    try {
        const query = `
            SELECT 
                oid, medicalRecordOid, medicineOid,
                dosage, frequency, duration, notes,
                createdBy, createdAt, lastModifiedBy, updatedAt,
                deletedBy, deletedAt
            FROM prescriptions;
        `;

        const [result] = await connection.execute(query);
        return { result, err: null };
    } catch (err) {
        return { result: null, err: { httpStatus: 500 } };
    }
};


const findById = async (oid, connection) => {
    try {
        const query = `
            SELECT 
                oid, medicalRecordOid, medicineOid,
                dosage, frequency, duration, notes,
                createdBy, createdAt, lastModifiedBy, updatedAt,
                deletedBy, deletedAt
            FROM prescriptions
            WHERE oid = ?;
        `;

        const [rows] = await connection.execute(query, [oid]);
        return { result: rows[0] || null, err: null };
    } catch (err) {
        return { result: null, err: { httpStatus: 500 } };
    }
};


const advanceFilter = async (filterCondition, connection) => {
    try {
        let query = `
            SELECT 
                oid, medicalRecordOid, medicineOid,
                dosage, frequency, duration, notes,
                createdBy, createdAt, lastModifiedBy, updatedAt,
                deletedBy, deletedAt
            FROM prescriptions
        `;

        const queryParams = [];
        const whereConditions = [];

        if (filterCondition.medicalRecordOid) {
            whereConditions.push("medicalRecordOid = ?");
            queryParams.push(filterCondition.medicalRecordOid);
        }

        if (filterCondition.medicineOid) {
            whereConditions.push("medicineOid = ?");
            queryParams.push(filterCondition.medicineOid);
        }

        if (filterCondition.dosage) {
            whereConditions.push("dosage LIKE ?");
            queryParams.push(`%${filterCondition.dosage}%`);
        }

        if (filterCondition.frequency) {
            whereConditions.push("frequency LIKE ?");
            queryParams.push(`%${filterCondition.frequency}%`);
        }

        if (whereConditions.length > 0) {
            query += " WHERE " + whereConditions.join(" AND ");
        }

        const [rows] = await connection.execute(query, queryParams);
        return { prescriptions: rows, err: null };
    } catch (error) {
        return { prescriptions: [], err: { httpStatus: 500 } };
    }
};


const findCountByCriteria = async (filterCondition, connection) => {
    try {
        let query = `SELECT COUNT(oid) AS count FROM prescriptions`;
        const queryParams = [];
        const whereConditions = [];

        if (filterCondition.medicalRecordOid) {
            whereConditions.push("medicalRecordOid = ?");
            queryParams.push(filterCondition.medicalRecordOid);
        }

        if (filterCondition.medicineOid) {
            whereConditions.push("medicineOid = ?");
            queryParams.push(filterCondition.medicineOid);
        }

        if (whereConditions.length > 0) {
            query += " WHERE " + whereConditions.join(" AND ");
        }

        const [rows] = await connection.execute(query, queryParams);
        const count = rows[0].count;

        return { count, err: null };
    } catch (error) {
        return { count: 0, err: { httpStatus: 500 } };
    }
};


const findByCriteria = async (filterCondition, page = 1, pageSize = 10, connection) => {
    try {
        let query = `
            SELECT 
                oid, medicalRecordOid, medicineOid,
                dosage, frequency, duration, notes,
                createdBy, createdAt, lastModifiedBy, updatedAt,
                deletedBy, deletedAt
            FROM prescriptions
        `;

        const queryParams = [];
        const whereConditions = [];

        if (filterCondition.medicalRecordOid) {
            whereConditions.push("medicalRecordOid = ?");
            queryParams.push(filterCondition.medicalRecordOid);
        }

        if (filterCondition.medicineOid) {
            whereConditions.push("medicineOid = ?");
            queryParams.push(filterCondition.medicineOid);
        }

        if (whereConditions.length > 0) {
            query += " WHERE " + whereConditions.join(" AND ");
        }

        const offset = (page - 1) * pageSize;
        query += " LIMIT " + offset + ", " + pageSize;

        const [rows] = await connection.execute(query, queryParams);
        return { prescriptions: rows, err: null };
    } catch (error) {
        return { prescriptions: [], err: { httpStatus: 500 } };
    }
};


module.exports = {
    save,
    update,
    deleted,
    findAll,
    findById,
    advanceFilter,
    findCountByCriteria,
    findByCriteria
};
