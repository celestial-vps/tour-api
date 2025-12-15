const save = async (data, options) => {
    const connection = options.transaction;
    try {
        const query = `INSERT INTO user_roles
                        (oid, roleName, targetType, isAdministrative, readState, writeState, createState, deleteState, navigateState, 
                        description, createdBy, createdAt, lastModifiedBy, updatedAt)
                        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )`;
        const [result] = await connection.execute(query, [data.oid, data.roleName, data.targetType,
        data.isAdministrative, data.readState, data.writeState, data.createState, data.deleteState, data.navigateState,
        data.description, data.createdBy,data.createdAt,data.lastModifiedBy, data.updatedAt]);
        return { result, err: null };
    } catch (err) {
        return { result: null, err: {
            httpStatus:500,          
          }  };
    }
};

const update = async (oid, data, options) => {
    const connection = options.transaction;
    try {
        const query = `UPDATE user_roles
                    SET roleName=?, targetType=?, isAdministrative=?, readState=?, writeState=?, createState=?, deleteState=?, navigateState=?, 
                    description=?, lastModifiedBy=?, updatedAt=?
                    WHERE oid=?`;
        const [result] = await connection.execute(query, [data.roleName, data.targetType, 
        data.isAdministrative, data.readState, data.writeState, data.createState, data.deleteState, data.navigateState,
        data.description, data.lastModifiedBy, data.updatedAt, oid]);
        return { result, err: null };
    } catch (err) {
        return { result: null, err: {
            httpStatus:500,          
          }  };
    }
};

const deleted = async (oid, options) => {
    const connection = options.transaction;
    try {
        const query = `DELETE from user_roles WHERE oid=?;`;
        const [result] = await connection.execute(query, [oid]);
        return { result, err: null };
    } catch (err) {
        return { result: null, err: {
            httpStatus:500,          
          }  };
    }
};

const findAll = async (connection) => {
    try {
        const query = `SELECT oid, roleName, targetType, isAdministrative, readState, writeState, createState, deleteState, navigateState, 
                        description, createdBy, createdAt, lastModifiedBy, updatedAt, deletedBy, deletedAt
                        FROM user_roles`;
        const [result] = await connection.execute(query);
        return { result, err: null };
    } catch (err) {
        return { result: null, err: {
            httpStatus:500,          
          }  };
    }
};


const advanceFlter = async (filterCondition, connection) => {
    try {
        // Base query
        let query = `SELECT oid, roleName, targetType, isAdministrative, readState, writeState, createState, deleteState, navigateState, 
                    description, createdBy, createdAt, lastModifiedBy, updatedAt, deletedBy, deletedAt
                    FROM user_roles`;
        const queryParams = [];

        // Construct WHERE clause based on filter conditions
        const whereConditions = [];
        if (filterCondition.roleName) {
            whereConditions.push('roleName LIKE ?');
            queryParams.push(`%${filterCondition.roleName}%`);
        }
        // if (filterCondition.targetType) {
        //     whereConditions.push('targetType LIKE ?');
        //     queryParams.push(`%${filterCondition.targetType}%`);
        // }

        // Add WHERE clause if there are conditions
        if (whereConditions.length > 0) {
            query += ' WHERE ' + whereConditions.join(' AND ');
        }

        // Execute the query
        const [userRoles] = await connection.execute(query, queryParams);
        return { userRoles, err: null };
    } catch (error) {
        return { userRoles: [], err: {
            httpStatus:500,          
          }  };
    }
};

const findById = async (oid, connection) => {
    try {
        const query = `SELECT oid, roleName, targetType, isAdministrative, readState, writeState, createState, deleteState, navigateState, 
                    description, createdBy, createdAt, lastModifiedBy, updatedAt, deletedBy, deletedAt FROM user_roles 
                    where oid = ? `;
        const [rows, fields] = await connection.execute(query, [oid]);
        return { result: rows[0] || null, err: null };
    } catch (err) {
        return { result: null, err: {
            httpStatus:500,          
          }  };
    }
};

const findCountByCriteria = async (filterCondition, connection) => {
    try {
        // Initialize the query and parameters
        let query = 'SELECT COUNT(oid) AS count FROM user_roles';
        const queryParams = [];

        // Construct WHERE clause based on filter conditions
        const whereConditions = [];
        if (filterCondition.roleName) {
            whereConditions.push('roleName LIKE ?');
            queryParams.push(`%${filterCondition.roleName}%`);
        }
        // if (filterCondition.targetType) {
        //     whereConditions.push('targetType LIKE ?');
        //     queryParams.push(`%${filterCondition.targetType}%`);
        // }

        // Add WHERE clause if there are conditions
        if (whereConditions.length > 0) {
            query += ' WHERE ' + whereConditions.join(' AND ');
        }

        // Execute the query
        const [rows] = await connection.execute(query, queryParams);
        const count = rows[0].count;

        return { count, err: null };

    } catch (error) {
        return { count: 0, err: {
            httpStatus:500,          
          }  };
    }
};
const findByCriteria = async (filterCondition, page = 1, pageSize = 10, connection) => {
    try {
        // Base query
        let query = `SELECT oid, roleName, targetType, isAdministrative, readState, writeState, createState, deleteState, navigateState, 
                    description, createdBy, createdAt, lastModifiedBy, updatedAt, deletedBy, deletedAt
                    FROM user_roles`;
        const queryParams = [];

        // Construct WHERE clause based on filter conditions
        const whereConditions = [];
        if (filterCondition.roleName) {
            whereConditions.push('roleName LIKE ?');
            queryParams.push(`%${filterCondition.roleName}%`);
        }
        // if (filterCondition.targetType) {
        //     whereConditions.push('targetType LIKE ?');
        //     queryParams.push(`%${filterCondition.targetType}%`);
        // }

        // Add WHERE clause if there are conditions
        if (whereConditions.length > 0) {
            query += ' WHERE ' + whereConditions.join(' AND ');
        }

        // Add pagination
        const offset = (page - 1) * pageSize;
        query += ' LIMIT ' + offset + ', ' + pageSize;

        // Execute the query
        const [userRoles] = await connection.execute(query, queryParams);
        return { userRoles, err: null };
    } catch (error) {
        return { userRoles: [], err: {
            httpStatus:500,          
          } };
    }
};


module.exports = {
    save,
    update,
    deleted,
    findAll,
    findById,
    advanceFlter,
    findByCriteria,
    findCountByCriteria,
};
