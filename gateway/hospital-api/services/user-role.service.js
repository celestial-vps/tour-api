const userRoleRepository = require('../repositories/user-role.repository');
const mappings = require('../mappings/user-role.vm');
const messageMaps = require('../mappings/message.vm');
const pool = require('../database/database');
const { uuidv7 } = require("uuidv7");
const { withTransaction } = require("../helper/transaction");
const moment = require('moment');

const create = async (dto,userOid) => {
  let connection;
  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {
    connection = await pool.getConnection(); // Get a connection from the pool
    await connection.beginTransaction(); // Start transaction
    
    const data = {
      oid: uuidv7(),
      roleName: dto.roleName,
      targetType: dto.targetType,
      isAdministrative: dto.isAdministrative,
      readState: dto.readState,
      writeState: dto.writeState,
      createState: dto.createState,
      deleteState: dto.deleteState,
      navigateState: dto.navigateState,
      description: dto.description ?? null,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const saveFunction = async (connection, data) => {
      // This function is called within the transaction
      return userRoleRepository.save(data, { transaction: connection });
    };
    const funcs = [
      async (conn) => saveFunction(conn, data) // Order insertion function
    ];
    const { result, err } = await withTransaction(funcs, connection, data);
    if (err) {
      return { userRole: null, err };
    }
    if (result) {
      const msgData = {
        value: data.oid,
        name: data.roleName
      }
      const userRole = await messageMaps.toMessageResponse(msgData);
      return { userRole, err: null };
    }
    return { userRole:{}, err: null };
  } catch (err) {
    return { userRole: null, err: {
      httpStatus: 500,
    } };
  }
};

const update = async (oid, dto,userOid) => {
  let connection;
  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {
    connection = await pool.getConnection(); // Get a connection from the pool
    await connection.beginTransaction(); // Start transaction
    

    const { result: resultFind, err:errUserRole } = await userRoleRepository.findById(oid, connection);
    if (errUserRole != null) {
      return { userRole: {}, err: errUserRole }
    }
    if (resultFind == null) {
      return {
        userRole: {}, err: {
          httpStatus:404,          
        } 
      }
    }

    resultFind.roleName = dto.roleName ?? resultFind.roleName
    resultFind.targetType = dto.targetType ?? resultFind.targetType
    resultFind.isAdministrative = dto.isAdministrative ?? resultFind.isAdministrative
    resultFind.readState = dto.readState ?? resultFind.readState
    resultFind.writeState = dto.writeState ?? resultFind.writeState
    resultFind.createState = dto.createState ?? resultFind.createState
    resultFind.deleteState = dto.deleteState ?? resultFind.deleteState
    resultFind.navigateState = dto.navigateState ?? resultFind.navigateState
    resultFind.description = dto.description ?? resultFind.description
    resultFind.lastModifiedBy = userOid ?? resultFind.lastModifiedBy
    resultFind.updatedAt = now ?? resultFind.updatedAt


    const updateFunction = async (connection, data) => {
      // This function is called within the transaction
      return userRoleRepository.update(oid, data, { transaction: connection });
    };
    const funcs = [
      async (conn) => updateFunction(conn, resultFind) // Order insertion function
    ];
    const { result, err } = await withTransaction(funcs, connection, resultFind);

    if (err) {
      return { userRole: result, err };
    }
    if (result) {
      const msgData = {
        value: resultFind.oid,
        name: resultFind.roleName
      }
      const userRole = await messageMaps.toMessageResponse(msgData);
      return { userRole, err: null };
    } else {
      return { userRole: {},err: {
        httpStatus: 500,
      } };
    }
  } catch (err) {    
    return { userRole: null, err: {
      httpStatus: 500,
    } };
  } 
};

const deleted = async (oid) => {
  let connection;
  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {
    connection = await pool.getConnection(); // Get a connection from the pool
    await connection.beginTransaction(); // Start transaction
    const { result: resultFind, err:errUserRole } = await userRoleRepository.findById(oid, connection);
    if (errUserRole != null) {
      return { userRole: {}, err: errUserRole }
    }
    if (resultFind == null) {
      return {
        userRole: {}, err: {
          httpStatus:404,          
        } 
      }
    }

    const deleteFunction = async (connection) => {
      // This function is called within the transaction
      return userRoleRepository.deleted(oid, { transaction: connection });
    };
    const funcs = [
      async (conn) => deleteFunction(conn, resultFind) // Order insertion function
    ];
    const { result, err } = await withTransaction(funcs, connection, resultFind);

    if (err) {
      return { result: null, err };
    } 
    if (result) {
      const msgData = {
        value: resultFind.oid,
        name: resultFind.roleName
      }
      const userRole = await messageMaps.toMessageResponse(msgData);
      return { userRole, err: null };
    } else {
      return { userRole: {},err: {
        httpStatus: 500,
      } };
    }
  } catch (err) {    
    return { userRole: null, err: {
      httpStatus: 500,
    } };
  }
};

const findAll = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await userRoleRepository.findAll(connection);
    const userRoles = await mappings.toUserRoleResponses(result)
    return { userRoles, err: err }
  } catch (err) {
    return { userRoles: [], err: {
      httpStatus: 500,
    } }
  }
};

const findById = async (oid) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await userRoleRepository.findById(oid, connection);
    if (err != null) {
      return { userRole: {}, err }
    }
    if (result == null) {
      return {
        userRole: null, err: {
          httpStatus:404,          
        } 
      }
    }
    const userRole = await mappings.toUserRoleResponse(result)
    return { userRole, err: null }
  } catch (err) {
    return { userRole: [], err: {
      httpStatus: 500,
    } }
  }

};

const findPage = async (condition, options) => {
  try {
    connection = await pool.getConnection();
    const { count, errCount } = await userRoleRepository.findCountByCriteria(condition, connection);
    if (errCount) {
      return { userRoles: [], count: 0, errCount }
    }
    const { userRoles, err } = await userRoleRepository.findByCriteria(condition,options.pageIndex, options.pageSize, connection);
    if (err) {
      return { userRoles: [], count: 0, errCount }
    }
    const userRoleResponses = await mappings.toUserRoleResponses(userRoles)
    return { userRoles: userRoleResponses, count, err: err };
  } catch (err) {
    return { userRoles: [], count: 0, err: {
      httpStatus: 500,
    } }
  }
};

module.exports = {
  create,
  update,
  deleted,
  findAll,
  findById,
  findPage,
};

