const save = async (data, options) => {
    const connection = options.transaction;
    try {
        const query = `
            INSERT INTO lab_tests (
                oid, name, description, cost,
                createdBy, createdAt, lastModifiedBy, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await connection.execute(query, [
            data.oid,
            data.name,
            data.description,
            data.cost,
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
            UPDATE lab_tests SET
                name = ?,
                description = ?,
                cost = ?,
                lastModifiedBy = ?,
                updatedAt = ?
            WHERE oid = ?;
        `;

        const [result] = await connection.execute(query, [
            data.name,
            data.description,
            data.cost,
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
        const query = `DELETE FROM lab_tests WHERE oid = ?`;
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
                oid, name, description, cost,
                createdBy, createdAt, lastModifiedBy, updatedAt,
                deletedBy, deletedAt
            FROM lab_tests;
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
                oid, name, description, cost,
                createdBy, createdAt, lastModifiedBy, updatedAt,
                deletedBy, deletedAt
            FROM lab_tests
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
                oid, name, description, cost,
                createdBy, createdAt, lastModifiedBy, updatedAt,
                deletedBy, deletedAt
            FROM lab_tests
        `;

        const queryParams = [];
        const whereConditions = [];

        if (filterCondition.name) {
            whereConditions.push("name LIKE ?");
            queryParams.push(`%${filterCondition.name}%`);
        }

        if (filterCondition.description) {
            whereConditions.push("description LIKE ?");
            queryParams.push(`%${filterCondition.description}%`);
        }

        if (whereConditions.length > 0) {
            query += " WHERE " + whereConditions.join(" AND ");
        }

        const [rows] = await connection.execute(query, queryParams);
        return { labTests: rows, err: null };
    } catch (error) {
        return { labTests: [], err: { httpStatus: 500 } };
    }
};


const findCountByCriteria = async (filterCondition, connection) => {
    try {
        let query = `SELECT COUNT(oid) AS count FROM lab_tests`;
        const queryParams = [];
        const whereConditions = [];

        if (filterCondition.name) {
            whereConditions.push("name LIKE ?");
            queryParams.push(`%${filterCondition.name}%`);
        }

        if (filterCondition.description) {
            whereConditions.push("description LIKE ?");
            queryParams.push(`%${filterCondition.description}%`);
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
                oid, name, description, cost,
                createdBy, createdAt, lastModifiedBy, updatedAt,
                deletedBy, deletedAt
            FROM lab_tests
        `;

        const queryParams = [];
        const whereConditions = [];

        if (filterCondition.name) {
            whereConditions.push("name LIKE ?");
            queryParams.push(`%${filterCondition.name}%`);
        }

        if (filterCondition.description) {
            whereConditions.push("description LIKE ?");
            queryParams.push(`%${filterCondition.description}%`);
        }

        if (whereConditions.length > 0) {
            query += " WHERE " + whereConditions.join(" AND ");
        }

        const offset = (page - 1) * pageSize;
        query += " LIMIT " + offset + ", " + pageSize;

        const [rows] = await connection.execute(query, queryParams);
        return { labTests: rows, err: null };
    } catch (error) {
        return { labTests: [], err: { httpStatus: 500 } };
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
