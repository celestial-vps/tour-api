const save = async (data, options) => {
    const connection = options.transaction;
    try {
        const query = `
            INSERT INTO medicines (
                oid, name, categoryOid,  stock, price,
                createdBy, createdAt, lastModifiedBy, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await connection.execute(query, [
            data.oid,
            data.name,
            data.categoryOid,
            data.stock,
            data.price,
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
            UPDATE medicines SET
                name = ?,
                categoryOid = ?, 
                stock = ?,
                price = ?,
                lastModifiedBy = ?,
                updatedAt = ?
            WHERE oid = ?;
        `;

        const [result] = await connection.execute(query, [
            data.name,
            data.categoryOid, 
            data.stock,
            data.price,
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
        const query = `DELETE FROM medicines WHERE oid = ?`;
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
                oid, name, categoryOid, description, stock, price,
                createdBy, createdAt, lastModifiedBy, updatedAt,
                deletedBy, deletedAt
            FROM medicines;
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
                oid, name, categoryOid, description, stock, price,
                createdBy, createdAt, lastModifiedBy, updatedAt,
                deletedBy, deletedAt
            FROM medicines
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
                oid, name, categoryOid, description, stock, price,
                createdBy, createdAt, lastModifiedBy, updatedAt,
                deletedBy, deletedAt
            FROM medicines
        `;

        const queryParams = [];
        const whereConditions = [];

        if (filterCondition.name) {
            whereConditions.push("name LIKE ?");
            queryParams.push(`%${filterCondition.name}%`);
        }

        if (filterCondition.categoryOid) {
            whereConditions.push("categoryOid LIKE ?");
            queryParams.push(`%${filterCondition.categoryOid}%`);
        }

        if (whereConditions.length > 0) {
            query += " WHERE " + whereConditions.join(" AND ");
        }

        const [rows] = await connection.execute(query, queryParams);
        return { medicines: rows, err: null };
    } catch (error) {
        return { medicines: [], err: { httpStatus: 500 } };
    }
};


const findCountByCriteria = async (filterCondition, connection) => {
    try {
        let query = `SELECT COUNT(oid) AS count FROM medicines`;
        const queryParams = [];
        const whereConditions = [];

        if (filterCondition.name) {
            whereConditions.push("name LIKE ?");
            queryParams.push(`%${filterCondition.name}%`);
        }

        if (filterCondition.categoryOid) {
            whereConditions.push("categoryOid LIKE ?");
            queryParams.push(`%${filterCondition.categoryOid}%`);
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
                m.oid, m.name, m.categoryOid,mc.name as categoryName, m.description, m.stock, m.price,
                m.createdBy, m.createdAt, m.lastModifiedBy, m.updatedAt,
                m.deletedBy, m.deletedAt
            FROM medicines m left join medication_categories mc on m.categoryOid=mc.oid
        `;

        const queryParams = [];
        const whereConditions = [];

        if (filterCondition.name) {
            whereConditions.push("m.name LIKE ?");
            queryParams.push(`%${filterCondition.name}%`);
        }

        // if (filterCondition.categoryOid) {
        //     whereConditions.push("categoryOid LIKE ?");
        //     queryParams.push(`%${filterCondition.categoryOid}%`);
        // }

        if (whereConditions.length > 0) {
            query += " WHERE " + whereConditions.join(" AND ");
        }

        const offset = (page - 1) * pageSize;
        query += " LIMIT " + offset + ", " + pageSize;

        const [rows] = await connection.execute(query, queryParams);
        return { medicines: rows, err: null };
    } catch (error) {
        return { medicines: [], err: { httpStatus: 500 } };
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
