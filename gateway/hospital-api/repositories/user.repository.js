const save = async (data, options) => {
  const connection = options.transaction;
  try {
    const query = `INSERT INTO users
                  (oid, name, email, password, birthday, memberNumber, androidToken, expiredTime, isActive, activatedAt, roleOid, 
                  description, createdBy, createdAt, lastModifiedBy, updatedAt)
                  VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await connection.execute(query, [data.oid, data.name, data.email, data.password, data.birthday, data.memberNumber,
    data.androidToken, data.expiredTime, data.isActive, data.activatedAt, data.roleOid,
    data.description, data.createdBy, data.createdAt, data.lastModifiedBy, data.updatedAt]);
    return { result, err: null };
  } catch (err) {
    return { result: null, err: {
      httpStatus:500,       
      message:err.message  
    }  };
  }
};

const update = async (oid, data, options) => {
  const connection = options.transaction;
  try {
    const query = `UPDATE users
                  SET email=?, name=?, password=?, birthday=?, memberNumber=?, 
                  androidToken=?, expiredTime=?, isActive=?, activatedAt=?, roleOid=?, 
                  description=?, lastModifiedBy=?, updatedAt=? 
                  WHERE oid=?`;
    const [result] = await connection.execute(query, [data.email, data.name, data.password,
    data.birthday, data.memberNumber, data.androidToken, data.expiredTime, data.isActive, data.activatedAt, data.roleOid,
    data.description, data.lastModifiedBy, data.updatedAt, oid]);
    return { result, err: null };
  } catch (err) {
    return { result: null, err: {
      httpStatus:500,    
      message:err.message      
    }  };
  }
};

const deleted = async (oid, options) => {
  const connection = options.transaction;
  try {
    const query = `DELETE from users WHERE oid=?;`;
    const [result] = await connection.execute(query, [oid]);
    return { result, err: null };
  } catch (err) {
    return { result: null, err: {
      httpStatus:500,   
      message:err.message       
    }  };
  }
};

const findAll = async (connection) => {
  try {
    const query = `SELECT oid, name, email, password, birthday, memberNumber, androidToken, expiredTime, isActive, activatedAt, roleOid, 
                  description, createdBy, createdAt, lastModifiedBy, updatedAt, deletedBy, deletedAt
                  FROM users`;
    const [result] = await connection.execute(query);
    return { result, err: null };
  } catch (err) {
    return { result: null, err: {
      httpStatus:500, 
      message:err.message         
    }  };
  }
};


const findById = async (oid, connection) => {
  try {
    const query = `SELECT oid, name, email, password, birthday, memberNumber, androidToken, expiredTime, isActive, activatedAt, roleOid, 
                  description, createdBy, createdAt, lastModifiedBy, updatedAt, deletedBy, deletedAt FROM users 
                  where oid = ? `;
    const [rows, fields] = await connection.execute(query, [oid]);
    return { result: rows[0] || null, err: null };
  } catch (err) {
    return { result: null, err: {
      httpStatus:500,  
      message:err.message        
    }  };
  }
};

const advanceFlter = async (filterCondition, connection) => {
  try {
    // Base query
    let query = `SELECT oid, name, email, password, birthday, memberNumber, androidToken, expiredTime, isActive, activatedAt, roleOid, 
                description, createdBy, createdAt, lastModifiedBy, updatedAt, deletedBy, deletedAt
                FROM users`;
    const queryParams = [];

    // Construct WHERE clause based on filter conditions
    const whereConditions = [];
    if (filterCondition.name) {
      whereConditions.push('name = ?');
      queryParams.push(`%${filterCondition.name}%`);
    }
    if (filterCondition.email) {
      whereConditions.push('email = ?');
      queryParams.push(`${filterCondition.email}`);
    }

    // Add WHERE clause if there are conditions
    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }

    // Execute the query
    const [users] = await connection.execute(query, queryParams);
    return { users, err: null };
  } catch (error) {
    return { users: [], err: {
      httpStatus:500,  
      message:err.message        
    }  };
  }
};

const findCountByCriteria = async (filterCondition, connection) => {
  try {
    // Initialize the query and parameters
    let query = 'SELECT COUNT(oid) AS count FROM users';
    const queryParams = [];

    // Construct WHERE clause based on filter conditions
    const whereConditions = [];
    if (filterCondition.name) {
      whereConditions.push('name LIKE ?');
      queryParams.push(`%${filterCondition.name}%`);
    }
    if (filterCondition.email) {
      whereConditions.push('email LIKE ?');
      queryParams.push(`%${filterCondition.email}%`);
    }

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
      message:err.message     
    }  };
  }
};

const findByCriteria = async (filterCondition, page = 1, pageSize = 10, connection) => {
  try {
    // Base query
    let query = `SELECT oid, name, email, password, birthday, memberNumber, androidToken, expiredTime, isActive, activatedAt, roleOid, 
            description, createdBy, createdAt, lastModifiedBy, updatedAt, deletedBy, deletedAt
            FROM users`;
    const queryParams = [];

    // Construct WHERE clause based on filter conditions
    const whereConditions = [];
    if (filterCondition.name) {
      whereConditions.push('name LIKE ?');
      queryParams.push(`%${filterCondition.name}%`);
    }
    if (filterCondition.email) {
      whereConditions.push('email LIKE ?');
      queryParams.push(`%${filterCondition.email}%`);
    }

    // Add WHERE clause if there are conditions
    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }

    // Add pagination
    const offset = (page - 1) * pageSize;
    query += ' LIMIT ' + offset + ', ' + pageSize;

    // Execute the query
    const [users] = await connection.execute(query, queryParams);
    return { users, err: null };
  } catch (error) {
    return { users: [],err: {
      httpStatus:500,        
      message:err.message  
    }  };
  }
};



const findUserRole = async (email, connection) => {
  try {
    // Base query
    let query = `SELECT u.oid, u.name, u.email, u.password, u.birthday, u.memberNumber, u.androidToken, u.expiredTime, u.isActive, u.activatedAt, u.roleOid, 
            u.description, u.createdBy, u.createdAt, u.lastModifiedBy, u.updatedAt, u.deletedBy, u.deletedAt,ur.roleName 
            FROM users u LEFT JOIN user_roles ur on u.roleoId = ur.oid`;
    const queryParams = [];

    // Construct WHERE clause based on filter conditions
    const whereConditions = [];
    if (email) {
      whereConditions.push('u.email = ?');
      queryParams.push(`${email}`);
    }
    // if (filterCondition.email) {
    //   whereConditions.push('u.roleName LIKE ?');
    //   queryParams.push(`%${filterCondition.email}%`);
    // }

    // Add WHERE clause if there are conditions
    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }
 

    // Execute the query
    const [users] = await connection.execute(query, queryParams);
    return { users, err: null };
  } catch (error) {
    return { users: [], err: {
      httpStatus:500,  
      message:err.message        
    }  };
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
  findUserRole
};
