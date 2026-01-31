const save = async (data, options) => {
    const connection = options.transaction;
    try {
        const query = `
            INSERT INTO appointments (
                oid, patientOid, doctorOid, departmentOid,
                appointmentDate, status,
                createdBy, createdAt, lastModifiedBy, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await connection.execute(query, [
            data.oid,
            data.patientOid,
            data.doctorOid,
            data.departmentOid,
            data.appointmentDate,
            data.status,
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
            UPDATE appointments SET
                patientOid = ?,
                doctorOid = ?,
                departmentOid = ?,
                appointmentDate = ?,
                status = ?,
                lastModifiedBy = ?,
                updatedAt = ?
            WHERE oid = ?;
        `;

        const [result] = await connection.execute(query, [
            data.patientOid,
            data.doctorOid,
            data.departmentOid,
            data.appointmentDate,
            data.status,
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
        const query = `DELETE FROM appointments WHERE oid = ?`;
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
                oid, patientOid, doctorOid, departmentOid,
                appointmentDate, status,
                createdBy, createdAt, lastModifiedBy, updatedAt,
                deletedBy, deletedAt
            FROM appointments;
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
                oid, patientOid, doctorOid, departmentOid,
                appointmentDate, status,
                createdBy, createdAt, lastModifiedBy, updatedAt,
                deletedBy, deletedAt
            FROM appointments
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
                oid, patientOid, doctorOid, departmentOid,
                appointmentDate, status,
                createdBy, createdAt, lastModifiedBy, updatedAt,
                deletedBy, deletedAt
            FROM appointments
        `;

        const queryParams = [];
        const whereConditions = [];

        if (filterCondition.patientOid) {
            whereConditions.push("patientOid = ?");
            queryParams.push(filterCondition.patientOid);
        }

        if (filterCondition.doctorOid) {
            whereConditions.push("doctorOid = ?");
            queryParams.push(filterCondition.doctorOid);
        }

        if (filterCondition.departmentOid) {
            whereConditions.push("departmentOid = ?");
            queryParams.push(filterCondition.departmentOid);
        }

        if (filterCondition.status) {
            whereConditions.push("status = ?");
            queryParams.push(filterCondition.status);
        }

        if (filterCondition.appointmentDate) {
            whereConditions.push("DATE(appointmentDate) = DATE(?)");
            queryParams.push(filterCondition.appointmentDate);
        }

        if (whereConditions.length > 0) {
            query += " WHERE " + whereConditions.join(" AND ");
        }

        const [rows] = await connection.execute(query, queryParams);
        return { appointments: rows, err: null };
    } catch (error) {
        return { appointments: [], err: { httpStatus: 500 } };
    }
};


const findCountByCriteria = async (filterCondition, connection) => {
    try {
        let query = `SELECT COUNT(oid) AS count FROM appointments`;
        const queryParams = [];
        const whereConditions = [];

        if (filterCondition.patientOid) {
            whereConditions.push("patientOid = ?");
            queryParams.push(filterCondition.patientOid);
        }

        if (filterCondition.doctorOid) {
            whereConditions.push("doctorOid = ?");
            queryParams.push(filterCondition.doctorOid);
        }

        if (filterCondition.departmentOid) {
            whereConditions.push("departmentOid = ?");
            queryParams.push(filterCondition.departmentOid);
        }

        if (filterCondition.status) {
            whereConditions.push("status = ?");
            queryParams.push(filterCondition.status);
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
                oid, patientOid, doctorOid, departmentOid,
                appointmentDate, status,
                createdBy, createdAt, lastModifiedBy, updatedAt,
                deletedBy, deletedAt
            FROM appointments
        `;

        const queryParams = [];
        const whereConditions = [];

        if (filterCondition.patientOid) {
            whereConditions.push("patientOid = ?");
            queryParams.push(filterCondition.patientOid);
        }

        if (filterCondition.doctorOid) {
            whereConditions.push("doctorOid = ?");
            queryParams.push(filterCondition.doctorOid);
        }

        if (filterCondition.departmentOid) {
            whereConditions.push("departmentOid = ?");
            queryParams.push(filterCondition.departmentOid);
        }

        if (filterCondition.status) {
            whereConditions.push("status = ?");
            queryParams.push(filterCondition.status);
        }

        if (whereConditions.length > 0) {
            query += " WHERE " + whereConditions.join(" AND ");
        }

        const offset = (page - 1) * pageSize;
        query += " LIMIT " + offset + ", " + pageSize;

        const [rows] = await connection.execute(query, queryParams);
        return { appointments: rows, err: null };
    } catch (error) {
        return { appointments: [], err: { httpStatus: 500 } };
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
