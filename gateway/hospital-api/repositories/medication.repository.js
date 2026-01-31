const save = async (data, options) => {
    const connection = options.transaction;
    try {
        const query = `
            INSERT INTO medications (
                oid, name, categoryOid,
                createdBy, createdAt, lastModifiedBy, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await connection.execute(query, [
            data.oid,
            data.name,
            data.categoryOid,
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
            UPDATE medications SET
                name = ?,
                categoryOid = ?, 
                lastModifiedBy = ?,
                updatedAt = ?
            WHERE oid = ?;
        `;

        const [result] = await connection.execute(query, [
            data.name,
            data.categoryOid, 
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
        const query = `DELETE FROM medications WHERE oid = ?`;
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
                oid, name, categoryOid, description,
                createdBy, createdAt, lastModifiedBy, updatedAt,
                deletedBy, deletedAt
            FROM medications;
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
                oid, name, categoryOid, description,
                createdBy, createdAt, lastModifiedBy, updatedAt,
                deletedBy, deletedAt
            FROM medications 
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
                oid, name, categoryOid, description,
                createdBy, createdAt, lastModifiedBy, updatedAt,
                deletedBy, deletedAt
            FROM medications
        `;

        const queryParams = [];
        const whereConditions = [];

        if (filterCondition.name) {
            whereConditions.push("name LIKE ?");
            queryParams.push(`%${filterCondition.name}%`);
        }

        // if (filterCondition.categoryOid) {
        //     whereConditions.push("categoryOid = ?");
        //     queryParams.push(filterCondition.categoryOid);
        // }

        if (whereConditions.length > 0) {
            query += " WHERE " + whereConditions.join(" AND ");
        }

        const [rows] = await connection.execute(query, queryParams);
        return { medications: rows, err: null };
    } catch (error) {
        return { medications: [], err: { httpStatus: 500 } };
    }
};


const findCountByCriteria = async (filterCondition, connection) => {
    try {
        let query = `SELECT COUNT(oid) AS count FROM medications`;
        const queryParams = [];
        const whereConditions = [];

        if (filterCondition.name) {
            whereConditions.push("name LIKE ?");
            queryParams.push(`%${filterCondition.name}%`);
        }

        // if (filterCondition.categoryOid) {
        //     whereConditions.push("categoryOid = ?");
        //     queryParams.push(filterCondition.categoryOid);
        // }

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
                m.oid, m.name, m.categoryOid,mc.name as categoryName, m.description,
                m.createdBy, m.createdAt, m.lastModifiedBy, m.updatedAt,
                m.deletedBy, m.deletedAt
            FROM medications m  left join medication_categories mc on m.categoryOid=mc.oid
        `;

        const queryParams = [];
        const whereConditions = [];

        if (filterCondition.name) {
            whereConditions.push("m.name LIKE ?");
            queryParams.push(`%${filterCondition.name}%`);
        }

        // if (filterCondition.categoryOid) {
        //     whereConditions.push("categoryOid = ?");
        //     queryParams.push(filterCondition.categoryOid);
        // }

        if (whereConditions.length > 0) {
            query += " WHERE " + whereConditions.join(" AND ");
        }

        const offset = (page - 1) * pageSize;
        query += " LIMIT " + offset + ", " + pageSize;

        const [rows] = await connection.execute(query, queryParams);
        return { medications: rows, err: null };
    } catch (error) {
        return { medications: [], err: { httpStatus: 500 } };
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
