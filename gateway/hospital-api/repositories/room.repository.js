const save = async (data, options) => {
    const connection = options.transaction;
    try {
        const query = `
            INSERT INTO rooms (
                oid, name, departmentOid, type, description,
                createdBy, createdAt, lastModifiedBy, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await connection.execute(query, [
            data.oid,
            data.name,
            data.departmentOid,
            data.type,
            data.description,
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
            UPDATE rooms SET
                name = ?,
                departmentOid = ?,
                type = ?,
                description = ?,
                lastModifiedBy = ?,
                updatedAt = ?
            WHERE oid = ?;
        `;

        const [result] = await connection.execute(query, [
            data.name,
            data.departmentOid,
            data.type,
            data.description,
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
        const query = `DELETE FROM rooms WHERE oid = ?`;
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
                oid, name, departmentOid, type, description,
                createdBy, createdAt, lastModifiedBy, updatedAt,
                deletedBy, deletedAt
            FROM rooms;
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
                oid, name, departmentOid, type, description,
                createdBy, createdAt, lastModifiedBy, updatedAt,
                deletedBy, deletedAt
            FROM rooms
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
                oid, name, departmentOid, type, description,
                createdBy, createdAt, lastModifiedBy, updatedAt,
                deletedBy, deletedAt
            FROM rooms
        `;

        const queryParams = [];
        const whereConditions = [];

        if (filterCondition.name) {
            whereConditions.push("name LIKE ?");
            queryParams.push(`%${filterCondition.name}%`);
        }

        if (filterCondition.departmentOid) {
            whereConditions.push("departmentOid = ?");
            queryParams.push(filterCondition.departmentOid);
        }

        if (filterCondition.type) {
            whereConditions.push("type = ?");
            queryParams.push(filterCondition.type);
        }

        if (whereConditions.length > 0) {
            query += " WHERE " + whereConditions.join(" AND ");
        }

        const [rows] = await connection.execute(query, queryParams);
        return { rooms: rows, err: null };
    } catch (error) {
        return { rooms: [], err: { httpStatus: 500 } };
    }
};


const findCountByCriteria = async (filterCondition, connection) => {
    try {
        let query = `SELECT COUNT(oid) AS count FROM rooms`;
        const queryParams = [];
        const whereConditions = [];

        if (filterCondition.name) {
            whereConditions.push("name LIKE ?");
            queryParams.push(`%${filterCondition.name}%`);
        }

        if (filterCondition.departmentOid) {
            whereConditions.push("departmentOid = ?");
            queryParams.push(filterCondition.departmentOid);
        }

        if (filterCondition.type) {
            whereConditions.push("type = ?");
            queryParams.push(filterCondition.type);
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
                oid, name, departmentOid, type, description,
                createdBy, createdAt, lastModifiedBy, updatedAt,
                deletedBy, deletedAt
            FROM rooms
        `;

        const queryParams = [];
        const whereConditions = [];

        if (filterCondition.name) {
            whereConditions.push("name LIKE ?");
            queryParams.push(`%${filterCondition.name}%`);
        }

        if (filterCondition.departmentOid) {
            whereConditions.push("departmentOid = ?");
            queryParams.push(filterCondition.departmentOid);
        }

        if (filterCondition.type) {
            whereConditions.push("type = ?");
            queryParams.push(filterCondition.type);
        }

        if (whereConditions.length > 0) {
            query += " WHERE " + whereConditions.join(" AND ");
        }

        const offset = (page - 1) * pageSize;
        query += " LIMIT " + offset + ", " + pageSize;

        const [rows] = await connection.execute(query, queryParams);
        return { rooms: rows, err: null };
    } catch (error) {
        return { rooms: [], err: { httpStatus: 500 } };
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
