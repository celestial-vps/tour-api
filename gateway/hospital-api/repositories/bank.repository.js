// const Bank = require('../models/bank'); // Import the default export

const save = async (data, options) => {
    const connection = options.transaction; 
    try {
        const query = `INSERT INTO banks (oid,bankCode, bankName, shortName,
                       description, createdBy, createdAt,lastModifiedBy, updatedAt) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await connection.execute(query, [data.oid,data.bankCode, data.bankName, data.shortName,
                        data.description,data.createdBy,data.createdAt,data.lastModifiedBy,data.updatedAt]);
        return { result, err: null };
    } catch (err) {
        return { result: null,err: {
            httpStatus:500,          
          }  };
    }
};

const update = async (oid, data,options) => {
    const connection = options.transaction; 
    try {
        const query = `UPDATE banks SET bankCode=?, bankName=?, shortName=?,
                        description=?,lastModifiedBy=?, updatedAt=?
                        WHERE oid=?;`;
        const [result] = await connection.execute(query, [data.bankCode, data.bankName, data.shortName,
                        data.description, data.lastModifiedBy, data.updatedAt, oid]);
        return { result, err: null };
    } catch (err) {
        return { result: null, err: {
            httpStatus:500,          
          }  };
    }
};

const deleted = async (oid,options) => {
    const connection = options.transaction; 
    try {
        const query = `DELETE from banks WHERE oid=?;`;
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
        const query = `SELECT oid, bankCode, bankName, shortName, description, 
                    createdBy, createdAt, lastModifiedBy, updatedAt, deletedBy, deletedAt FROM banks;`;
        const [result] = await connection.execute(query);
        return { result, err: null };
    } catch (err) {
        return { result: null, err: {
            httpStatus:500,          
          }  };
    }
};

const findById = async (oid,connection) => {    
    try {
        const query = `SELECT oid, bankCode, bankName, shortName, description, 
                    createdBy, createdAt, lastModifiedBy, updatedAt, deletedBy, deletedAt FROM banks 
                    where oid = ? `;
                    const [rows, fields]  = await connection.execute(query,[oid]);
                    return { result: rows[0] || null, err: null };
    } catch (err) {
        return { result: null, err: {
            httpStatus:500,          
          }  };
    }
};


const advanceFlter = async (filterCondition,connection) => {
    try {
        // Base query
        let query = `SELECT oid, bankCode, bankName, shortName, 
        description, createdBy, createdAt, lastModifiedBy, updatedAt, deletedBy, deletedAt FROM banks`;
        const queryParams = [];

        // Construct WHERE clause based on filter conditions
        const whereConditions = [];
        if (filterCondition.bankCode) {
            whereConditions.push('bankCode LIKE ?');
            queryParams.push(`%${filterCondition.bankCode}%`);
        }
        if (filterCondition.bankName) {
            whereConditions.push('bankName LIKE ?');
            queryParams.push(`%${filterCondition.bankName}%`);
        }

        // Add WHERE clause if there are conditions
        if (whereConditions.length > 0) {
            query += ' WHERE ' + whereConditions.join(' AND ');
        }                
        
        // Execute the query
        const [banks] = await connection.execute(query, queryParams);
        return { banks, err: null };
    } catch (error) {        
        return { banks: [], err: {
            httpStatus:500,          
          }  };
    }
};

const findCountByCriteria = async (filterCondition,connection) => {
    try {
         // Initialize the query and parameters
         let query = 'SELECT COUNT(oid) AS count FROM banks';
         const queryParams = [];
 
         // Construct WHERE clause based on filter conditions
         const whereConditions = [];
         if (filterCondition.bankCode) {
             whereConditions.push('bankCode LIKE ?');
             queryParams.push(`%${filterCondition.bankCode}%`);
         }
         if (filterCondition.bankName) {
             whereConditions.push('bankName LIKE ?');
             queryParams.push(`%${filterCondition.bankName}%`);
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
          }  };
    }
};

const findByCriteria = async (filterCondition, page = 1, pageSize = 10, connection) => {
    try {
        // Base query
        let query = `SELECT oid, bankCode, bankName, shortName, 
        description, createdBy, createdAt, lastModifiedBy, updatedAt, deletedBy, deletedAt FROM banks`;
        const queryParams = [];

        // Construct WHERE clause based on filter conditions
        const whereConditions = [];
        if (filterCondition.bankCode) {
            whereConditions.push('bankCode LIKE ?');
            queryParams.push(`%${filterCondition.bankCode}%`);
        }
        if (filterCondition.bankName) {
            whereConditions.push('bankName LIKE ?');
            queryParams.push(`%${filterCondition.bankName}%`);
        }

        // Add WHERE clause if there are conditions
        if (whereConditions.length > 0) {
            query += ' WHERE ' + whereConditions.join(' AND ');
        }

        // Add pagination
        const offset = (page - 1) * pageSize;
        query += ' LIMIT ' + offset + ', ' + pageSize;

        // Execute the query
        const [banks] = await connection.execute(query, queryParams);
        return { banks, err: null };
    } catch (error) {        
        return { banks: [],err: {
            httpStatus:500,          
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
    findCountByCriteria,    
    findByCriteria,
        
};



// // repository/bankRepository.js
// const pool = require('../databases/database');

// class BankRepository {
//   // Save a new bank record
//   async save(bank) {
//     const connection = await pool.getConnection();
//     try {
//       const [result] = await connection.query(
//         'INSERT INTO banks (bankCode, bankName, shortName, created_at, updated_at, deleted_at) VALUES (?, ?, ?, NOW(), NOW(), NULL)',
//         [bank.bankCode, bank.bankName, bank.shortName]
//       );
//       bank.id = result.insertId;
//       return bank;
//     } catch (error) {
//       throw new Error(`Error saving bank: ${error.message}`);
//     } finally {
//       connection.release();
//     }
//   }

//   // Update a bank record
//   async update(bank) {
//     const connection = await pool.getConnection();
//     try {
//       await connection.query(
//         'UPDATE banks SET bankCode = ?, bankName = ?, shortName = ?, updated_at = NOW() WHERE id = ?',
//         [bank.bankCode, bank.bankName, bank.shortName, bank.id]
//       );
//       return bank;
//     } catch (error) {
//       throw new Error(`Error updating bank: ${error.message}`);
//     } finally {
//       connection.release();
//     }
//   }

//   // Delete a bank record
//   async delete(id) {
//     const connection = await pool.getConnection();
//     try {
//       await connection.query('DELETE FROM banks WHERE id = ?', [id]);
//     } catch (error) {
//       throw new Error(`Error deleting bank: ${error.message}`);
//     } finally {
//       connection.release();
//     }
//   }

//   // Find all bank records
//   async findAll() {
//     const connection = await pool.getConnection();
//     try {
//       const [rows] = await connection.query('SELECT id, bankCode, bankName, shortName, created_at, updated_at, deleted_at FROM banks');
//       return rows;
//     } catch (error) {
//       throw new Error(`Error finding banks: ${error.message}`);
//     } finally {
//       connection.release();
//     }
//   }

//   // Find banks by criteria
//   async findByCriteria(criteria, page = 1, pageSize = 10) {
//     const connection = await pool.getConnection();
//     try {
//       const { bankCode, bankName } = criteria;
//       const offset = (page - 1) * pageSize;

//       const [rows] = await connection.query(
//         'SELECT SQL_CALC_FOUND_ROWS id, bankCode, bankName, shortName, created_at, updated_at, deleted_at FROM banks WHERE bankCode LIKE ? AND bankName LIKE ? LIMIT ? OFFSET ?',
//         [`%${bankCode}%`, `%${bankName}%`, pageSize, offset]
//       );
      
//       const [[{ 'FOUND_ROWS()': count }]] = await connection.query('SELECT FOUND_ROWS() as count');
      
//       return { banks: rows, count };
//     } catch (error) {
//       throw new Error(`Error finding banks by criteria: ${error.message}`);
//     } finally {
//       connection.release();
//     }
//   }

//   // Find a bank by ID
//   async findById(id) {
//     const connection = await pool.getConnection();
//     try {
//       const [rows] = await connection.query('SELECT id, bankCode, bankName, shortName, created_at, updated_at, deleted_at FROM banks WHERE id = ?', [id]);
//       if (rows.length === 0) {
//         throw new Error(`Bank with ID ${id} not found`);
//       }
//       return rows[0];
//     } catch (error) {
//       throw new Error(`Error finding bank by ID: ${error.message}`);
//     } finally {
//       connection.release();
//     }
//   }
// }

// module.exports = new BankRepository();
