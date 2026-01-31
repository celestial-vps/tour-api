const save = async (data, options) => {
    const connection = options.transaction;
    try {
        const query = `
            INSERT INTO patients (
                oid, fullName, gender, birthDate, phone, address,
                createdAt, updatedAt, deletedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await connection.execute(query, [
            data.oid,
            data.fullName,
            data.gender || 'Other',
            data.birthDate,
            data.phone,
            data.address,
            data.createdAt,
            data.updatedAt,
            data.deletedAt || null
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
            UPDATE patients SET
                fullName = ?,
                gender = ?,
                birthDate = ?,
                phone = ?,
                address = ?,
                updatedAt = ?
            WHERE oid = ?;
        `;

        const [result] = await connection.execute(query, [
            data.fullName,
            data.gender || 'Other',
            data.birthDate,
            data.phone,
            data.address,
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
        const query = `DELETE FROM patients WHERE oid = ?`;
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
                oid, fullName, gender, birthDate, phone, address,
                createdAt, updatedAt, deletedAt
            FROM patients;
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
                oid, fullName, gender, birthDate, phone, address,
                createdAt, updatedAt, deletedAt
            FROM patients
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
                oid, fullName, gender, birthDate, phone, address,
                createdAt, updatedAt, deletedAt
            FROM patients
        `;

        const queryParams = [];
        const whereConditions = [];

        if (filterCondition.fullName) {
            whereConditions.push("fullName LIKE ?");
            queryParams.push(`%${filterCondition.fullName}%`);
        }

        if (filterCondition.gender) {
            whereConditions.push("gender = ?");
            queryParams.push(filterCondition.gender);
        }

        if (filterCondition.phone) {
            whereConditions.push("phone LIKE ?");
            queryParams.push(`%${filterCondition.phone}%`);
        }

        if (whereConditions.length > 0) {
            query += " WHERE " + whereConditions.join(" AND ");
        }

        const [rows] = await connection.execute(query, queryParams);
        return { patients: rows, err: null };
    } catch (error) {
        return { patients: [], err: { httpStatus: 500 } };
    }
};


const findCountByCriteria = async (filterCondition, connection) => {
    try {
        let query = `SELECT COUNT(oid) AS count FROM patients`;
        const queryParams = [];
        const whereConditions = [];

        if (filterCondition.fullName) {
            whereConditions.push("fullName LIKE ?");
            queryParams.push(`%${filterCondition.fullName}%`);
        }

        if (filterCondition.gender) {
            whereConditions.push("gender = ?");
            queryParams.push(filterCondition.gender);
        }

        if (filterCondition.phone) {
            whereConditions.push("phone LIKE ?");
            queryParams.push(`%${filterCondition.phone}%`);
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
                oid, fullName, gender, birthDate, phone, address,
                createdAt, updatedAt, deletedAt
            FROM patients
        `;

        const queryParams = [];
        const whereConditions = [];

        if (filterCondition.fullName) {
            whereConditions.push("fullName LIKE ?");
            queryParams.push(`%${filterCondition.fullName}%`);
        }

        if (filterCondition.gender) {
            whereConditions.push("gender = ?");
            queryParams.push(filterCondition.gender);
        }

        if (filterCondition.phone) {
            whereConditions.push("phone LIKE ?");
            queryParams.push(`%${filterCondition.phone}%`);
        }

        if (whereConditions.length > 0) {
            query += " WHERE " + whereConditions.join(" AND ");
        }

        const offset = (page - 1) * pageSize;
        query += " LIMIT " + offset + ", " + pageSize;

        const [rows] = await connection.execute(query, queryParams);
        return { patients: rows, err: null };
    } catch (error) {
        return { patients: [], err: { httpStatus: 500 } };
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
