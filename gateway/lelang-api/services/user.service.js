const userRepository = require('../repositories/user.repository');
const mappings = require('../mappings/user.vm');
const messageMaps = require('../mappings/message.vm');
const moment = require('moment');
require('dotenv').config();
const { hashPassword, checkPassword } = require('../misc/password');
const { JwtMaker } = require('../middleware/jwt'); // Adjust the path accordingly
const mongoose = require("mongoose");
const jwtMaker = new JwtMaker();
const { v4: uuidv4 } = require('uuid');

const registerAdmin = async (dto, userOid) => {
  // const roleId = process.env.RoleId;    
  const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const roleOidStr = process.env.RoleId || ""
  try {
    const hashedPassword = await hashPassword(dto.password);
    const data = {
      _id: uuidv4(),
      email: dto.email,
      password: hashedPassword,
      androidToken: dto.androidToken ?? null,
      iosToken: dto.iosToken ?? null,
      webToken: dto.webToken ?? null,
      desktopToken: dto.desktopToken ?? null,
      role: roleOidStr,
      createdBy: userOid ?? "",
      createdAt: now,
      lastModifiedBy: userOid ?? "",
      updatedAt: now,
    };

    const { result, error } = await userRepository.save(data);
    if (error) {
      return {
        user: {}, error: error
      };
    }

    const token = await jwtMaker.createToken(result.id, dto.email, 'Admin');


    if (error) {
      return { user: null, error };
    }
    if (result) {
      const msgData = {
        value: token,//result.id,
        name: data.email
      }
      const user = await messageMaps.toMessageResponse(msgData);
      return { user, error: null };
    } else {
      return {
        user: {}, error: { httpStatus: 500, message: 'Failed to delete Immage File' },
      };
    }

  } catch (error) {
    return {
      user: null,error: { httpStatus: 500, message: 'Failed to delete Immage File' },
    };
  }

}

const register = async (dto, userOid) => {  
  const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {
    const hashedPassword = await hashPassword(dto.password);
    const data = {
      _id: uuidv4(),
      email: dto.email,
      password: hashedPassword,
      androidToken: dto.androidToken ?? null,
      iosToken: dto.iosToken ?? null,
      webToken: dto.webToken ?? null,
      desktopToken: dto.desktopToken ?? null,
      role: dto.roleOid,
      createdBy: userOid ?? "",
      createdAt: now,
      lastModifiedBy: userOid ?? "",
      updatedAt: now,
    };

    const { result, error } = await userRepository.save(data);
    if (error) {
      return {
        user: {}, error: error
      };
    }

    const token = await jwtMaker.createToken(result.id, dto.email, 'Admin');


    if (error) {
      return { user: null, error };
    }
    if (result) {
      const msgData = {
        value: token,//result.id,
        name: data.email
      }
      const user = await messageMaps.toMessageResponse(msgData);
      return { user, error: null };
    } else {
      return {
        user: {},error: { httpStatus: 500, message: 'Failed to delete Immage File' },
      };
    }

  } catch (error) {
    return {
      user: null, error: { httpStatus: 500, message: 'Failed to delete Immage File' },
    };
  }

}

const login = async (condition, body) => {
  try {
    const { users, error } = await userRepository.advanceFilter(condition);
    if (error != null) {
      return { user: {}, error }
    }
    if (users == null || users.length == 0) {
      return {
        user: {}, error: {
          message: "Data Not Found"
        }
      }
    }
    const status = await checkPassword(condition.password, users[0].password);
    if (!status) {
      return { users: [], error }
    }
    const oid = users[0].id
    selectedUser = users[0];
    selectedUser.androidToken = body.androidToken
    selectedUser.iosToken = body.iosToken
    selectedUser.webToken = body.webToken
    selectedUser.desktopToken = body.desktopToken
    const token = await jwtMaker.createToken(oid, condition.email, selectedUser.role.roleName);


    const { users: userUpdate, error: errUpdate } = await userRepository.update(oid, selectedUser);
    if (errUpdate != null) {
      return { user: {}, error }
    }
    const user = await mappings.toUserTokenResponse(users[0], token, "")
    return { user, error: null }
  } catch (error) {
    return {
      user: [],error: { httpStatus: 500, message: 'Failed to delete Immage File' },
    }
  }
}

const create = async (dto, userOid) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const hashedPassword = await hashPassword(dto.password);

  try {

    const data = {
      _id: new mongoose.Types.ObjectId(),
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

    const { result, error } = await userRepository.save(data);
    await session.commitTransaction();
    session.endSession();

    if (error) {
      return { user: null, error };
    }
    if (result) {
      const msgData = {
        value: data._id,
        name: data.email
      }
      const user = await messageMaps.toMessageResponse(msgData);
      return { user, error: null };
    } else {
      return {
        user: {},error: { httpStatus: 500, message: 'Failed to delete Immage File' },
      };
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return {
      user: null, error: { httpStatus: 500, message: 'Failed to delete Immage File' },
    };
  }
};

const update = async (oid, dto, userOid) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {

    const { result: resultFind, error: errUser } = await userRepository.findById(oid);
    if (errUser != null) {
      return { user: {}, error: errUser }
    }
    if (resultFind == null) {
      return {
        user: {}, error: {
          httpStatus: 404,
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

    const { result, error } = await userRepository.update(oid, resultFind);
    await session.commitTransaction();
    session.endSession();
    if (error) {
      return { user: result, error };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.email
      }
      const user = await messageMaps.toMessageResponse(msgData);
      return { user, error: null };
    } else {
      return {
        user: {}, error: { httpStatus: 500, message: 'Failed to delete Immage File' },
      };
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return {
      user: null, error: { httpStatus: 500, message: 'Failed to delete Immage File' },
    };
  }
};

const deleted = async (oid) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {
    const { result: resultFind, error: errUser } = await userRepository.findById(oid);
    if (errUser != null) {
      return { user: {}, error: errUser }
    }
    if (resultFind == null) {
      return {
        user: {}, error: {
          httpStatus: 404,
        }
      }
    }

    const { result, error } = await userRepository.deleted(oid);
    await session.commitTransaction();
    session.endSession();
    if (error) {
      return { result: null, error };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.email
      }
      const user = await messageMaps.toMessageResponse(msgData);
      return { user, error: null };
    } else {
      return {
        user: {},error: { httpStatus: 500, message: 'Failed to delete Immage File' },
      };
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return {
      user: null, error: { httpStatus: 500, message: 'Failed to delete Immage File' },
    };
  }
};

const findAll = async () => {
  try {
    const { result, error } = await userRepository.findAll();
    const users = await mappings.toUserResponses(result)
    return { users, error: null }
  } catch (error) {
    return { users: [], error }
  }
};

const findById = async (oid) => {
  try {
    const { result, error } = await userRepository.findById(oid);
    if (error != null) {
      return { user: {}, error }
    }
    if (result == null) {
      return {
        user: null, error: {
          httpStatus: 404,
        }
      }
    }
    const user = await mappings.toUserResponse(result)
    return { user, error: null }
  } catch (error) {
    return {
      user: [], error: { httpStatus: 500, message: 'Failed to delete Immage File' },
    }
  }

};

const findPage = async (condition, options) => {
  try {
    const { count, errCount } = await userRepository.findCountByCriteria(condition);
    if (errCount) {
      return { users: [], count: 0, errCount }
    }
    const { users, error } = await userRepository.findByCriteria(condition, options.pageIndex, options.pageSize);
    if (error) {
      return { users: [], count: 0, errCount }
    }
    const userResponses = await mappings.toUserResponses(users)
    return { users: userResponses, count, error: error };
  } catch (error) {
    return {
      users: [], count: 0,error: { httpStatus: 500, message: 'Failed to delete Immage File' },
    }
  }
};


 

module.exports = {
  register,
  registerAdmin,
  login,
  create,
  update,
  deleted,
  findAll,
  findById,
  findPage,
};