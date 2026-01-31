const userRepository = require('../repositories/user.repository');
const mappings = require('../mappings/user.vm');
const messageMaps = require('../mappings/message.vm');
const pool = require('../database/database');
const { uuidv7 } = require("uuidv7");
const { withTransaction } = require("../helper/transaction");
const moment = require('moment');
require('dotenv').config();
const { hashPassword, checkPassword } = require('../misc/password');
const { JwtMaker } = require('../middleware/jwt'); // Adjust the path accordingly

const jwtMaker = new JwtMaker();


const create = async (dto, userOid) => {
  let connection;
  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {
    connection = await pool.getConnection(); // Get a connection from the pool
    await connection.beginTransaction(); // Start transaction
    const hashedPassword = await hashPassword(dto.password);
    const data = {
      oid: uuidv7(),
      name: dto.name ?? null,
      email: dto.email,
      password: hashedPassword,
      birthday: dto.birthday ?? null,
      memberNumber: dto.memberNumber ?? null,
      androidToken: dto.androidToken ?? null,
      expiredTime: dto.expiredTime ?? null,
      isActive: dto.isActive,
      activatedAt: dto.activatedAt,
      roleOid: dto.roleOid,
      description: dto.description ?? null,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const saveFunction = async (connection, data) => {
      // This function is called within the transaction
      return userRepository.save(data, { transaction: connection });
    };
    const funcs = [
      async (conn) => saveFunction(conn, data) // Order insertion function
    ];
    const { result, err } = await withTransaction(funcs, connection, data);
    if (err) {
      return { user: null, err };
    }
    if (result) {
      const msgData = {
        value: data.oid,
        name: data.email
      }
      const user = await messageMaps.toMessageResponse(msgData);
      return { user, err: null };
    }
    return { user: {}, err: null };
  } catch (err) {
    return { user: null, err: {
      httpStatus: 500,
    } };
  }
};

const update = async (oid, dto, userOid) => {
  let connection;
  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {
    connection = await pool.getConnection(); // Get a connection from the pool
    await connection.beginTransaction(); // Start transaction

    const { result: resultFind, err: errUser } = await userRepository.findById(oid, connection);
    if (errUser != null) {
      return { user: {}, err: errUser }
    }
    if (resultFind == null) {
      return {
        user: {}, err: {
          httpStatus:404,          
        } 
      }
    }
    const hashedPassword = await hashPassword(dto.password ?? resultFind.password);
    resultFind.name = dto.name ?? resultFind.name
    resultFind.email = dto.email ?? resultFind.email
    resultFind.password = hashedPassword
    resultFind.birthday = dto.birthday ?? resultFind.birthday
    resultFind.memberNumber = dto.memberNumber ?? resultFind.memberNumber
    resultFind.androidToken = dto.androidToken ?? resultFind.androidToken
    resultFind.expiredTime = dto.expiredTime ?? resultFind.expiredTime
    resultFind.isActive = dto.isActive ?? resultFind.isActive
    resultFind.activatedAt = dto.activatedAt ?? resultFind.activatedAt
    resultFind.roleOid = dto.roleOid ?? resultFind.roleOid
    resultFind.description = dto.description ?? resultFind.description
    resultFind.lastModifiedBy = userOid ?? resultFind.lastModifiedBy
    resultFind.updatedAt = now ?? resultFind.updatedAt

    const updateFunction = async (connection, data) => {
      // This function is called within the transaction
      return userRepository.update(oid, data, { transaction: connection });
    };
    const funcs = [
      async (conn) => updateFunction(conn, resultFind) // Order insertion function
    ];
    const { result, err } = await withTransaction(funcs, connection, resultFind);

    if (err) {
      return { user: result, err };
    }
    if (result) {
      const msgData = {
        value: resultFind.oid,
        name: resultFind.email
      }
      const user = await messageMaps.toMessageResponse(msgData);
      return { user, err: null };
    } else {
      return { user: {},err: {
        httpStatus: 500,
      } };
    }
  } catch (err) {
    return { user: null, err: {
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
    const { result: resultFind, err: errUser } = await userRepository.findById(oid, connection);
    if (errUser != null) {
      return { user: {}, err: errUser }
    }
    if (resultFind == null) {
      return {
        user: {}, err: {
          httpStatus:404,          
        } 
      }
    }

    const deleteFunction = async (connection) => {
      // This function is called within the transaction
      return userRepository.deleted(oid, { transaction: connection });
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
        name: resultFind.email
      }
      const user = await messageMaps.toMessageResponse(msgData);
      return { user, err: null };
    } else {
      return { user: {},err: {
        httpStatus: 500,
      } };
    }
  } catch (err) {
    return { user: null, err: {
      httpStatus: 500,
    } };
  }
};

const findAll = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await userRepository.findAll(connection);
    const users = await mappings.toUserResponses(result)
    return { users, err: null }
  } catch (err) {
    return { users: [], err: {
      httpStatus: 500,
    } }
  }
};

const findById = async (oid) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { result, err } = await userRepository.findById(oid, connection);
    if (err != null) {
      return { user: {}, err }
    }
    if (result == null) {
      return {
        user: null, err: {
          httpStatus:404,          
        } 
      }
    }
    const user = await mappings.toUserResponse(result)
    return { user, err: null }
  } catch (err) {
    return { user: [], err: {
      httpStatus: 500,
    } }
  }

};
const findPage = async (condition,options) => {
  try {
    connection = await pool.getConnection();
    const { count, errCount } = await userRepository.findCountByCriteria(condition, connection);
    if (errCount) {
      return { users: [], count: 0, errCount }
    }
    const { users, err } = await userRepository.findByCriteria(condition, options.pageIndex, options.pageSize, connection);
    if (err) {
      return { users: [], count: 0, errCount }
    }
    const userResponses = await mappings.toUserResponses(users)
    return { users: userResponses, count, err: err };
  } catch (err) {
    return { users: [], count: 0, err: {
      httpStatus: 500,
    } }
  }
};


const login = async (condition) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { users, err } = await userRepository.advanceFlter(condition, connection);
    if (err != null) {
      return { user: {}, err }
    }
    if (users == null || users.length == 0) {
      return {
        user: {}, err: {
          httpStatus:404,          
        } 
      }
    }
    const status = await checkPassword(condition.password, users[0].password);
    if (!status) {
      return {
        user: [], err: {
          message: "Password Invalid"
        }
      }
    }
    const oid = users[0].oid
    const token = await jwtMaker.createToken(oid, condition.email);
    const user = await mappings.toUserTokenResponse(users[0], token, "")
    return { user, err: null }
  } catch (err) {
    return { user: [], err: {
      httpStatus: 500,
    } }
  }

};

const register = async (dto, userOid) => {
  let connection;
  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const roleOidStr = process.env.RoleId || ""
  try {
    connection = await pool.getConnection(); // Get a connection from the pool
    await connection.beginTransaction(); // Start transaction
    const hashedPassword = await hashPassword(dto.password);
    const data = {
      oid: uuidv7(),
      name: dto.name ?? "",
      email: dto.email,
      password: hashedPassword,
      birthday: dto.birthday ?? null,
      memberNumber: dto.memberNumber ?? null,
      androidToken: dto.androidToken ?? null,
      expiredTime: dto.expiredTime ?? null,
      isActive: dto.isActive ?? false,
      activatedAt: dto.activatedAt ?? null,
      roleOid: roleOidStr,
      description: dto.description ?? "",
      createdBy: userOid ?? "",
      createdAt: now,
      lastModifiedBy: userOid ?? "",
      updatedAt: now,
    };

    const saveFunction = async (connection, data) => {
      // This function is called within the transaction
      return userRepository.save(data, { transaction: connection });
    };
    const funcs = [
      async (conn) => saveFunction(conn, data) // Order insertion function
    ];
    const { result, err } = await withTransaction(funcs, connection, data);
    if (err) {
      return { user: null, err };
    }
    if (result) {
      const msgData = {
        value: data.oid,
        name: data.email
      }
      const user = await messageMaps.toMessageResponse(msgData);
      return { user, err: null };
    } else {
      return { user: {},err: {
        httpStatus: 500,
      } };
    }

  } catch (err) {
    return { user: null, err: {
      httpStatus: 500,
    } };
  }

};

module.exports = {
  create,
  update,
  deleted,
  findAll,
  findById,
  findPage,
  register,
  login
};

