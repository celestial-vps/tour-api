const save = async (data, options) => {
    const connection = options.transaction;
    try {
        const query = `
            INSERT INTO queues (
                oid, patientOid, doctorOid, departmentOid,
                queueNumber, status, scheduledAt,
                createdBy, createdAt, lastModifiedBy, updatedAt
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await connection.execute(query, [
            data.oid,
            data.patientOid,
            data.doctorOid,
            data.departmentOid,
            data.queueNumber,
            data.status,
            data.scheduledAt,
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
            UPDATE queues SET 
                patientOid = ?, 
                doctorOid = ?, 
                departmentOid = ?, 
                queueNumber = ?, 
                status = ?, 
                scheduledAt = ?, 
                lastModifiedBy = ?, 
                updatedAt = ?
            WHERE oid = ?;
        `;

        const [result] = await connection.execute(query, [
            data.patientOid,
            data.doctorOid,
            data.departmentOid,
            data.queueNumber,
            data.status,
            data.scheduledAt,
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
        const query = `DELETE FROM queues WHERE oid = ?`;
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
                queueNumber, status, scheduledAt,
                createdBy, createdAt, lastModifiedBy, updatedAt,
                deletedBy, deletedAt
            FROM queues;
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
                queueNumber, status, scheduledAt,
                createdBy, createdAt, lastModifiedBy, updatedAt,
                deletedBy, deletedAt
            FROM queues
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
                queueNumber, status, scheduledAt,
                createdBy, createdAt, lastModifiedBy, updatedAt,
                deletedBy, deletedAt
            FROM queues
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

        if (filterCondition.status) {
            whereConditions.push("status = ?");
            queryParams.push(filterCondition.status);
        }

        if (filterCondition.queueNumber) {
            whereConditions.push("queueNumber = ?");
            queryParams.push(filterCondition.queueNumber);
        }

        if (whereConditions.length > 0) {
            query += " WHERE " + whereConditions.join(" AND ");
        }

        const [rows] = await connection.execute(query, queryParams);
        return { queues: rows, err: null };

    } catch (error) {
        return { queues: [], err: { httpStatus: 500 } };
    }
};


const findCountByCriteria = async (filterCondition, connection) => {
    try {
        let query = `SELECT COUNT(oid) AS count FROM queues`;
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
                queueNumber, status, scheduledAt,
                createdBy, createdAt, lastModifiedBy, updatedAt,
                deletedBy, deletedAt
            FROM queues
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
        return { queues: rows, err: null };

    } catch (error) {
        return { queues: [], err: { httpStatus: 500 } };
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
