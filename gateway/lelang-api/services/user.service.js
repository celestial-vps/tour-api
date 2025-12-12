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

const register = async (dto, userOid) => {
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

    const { result, err } = await userRepository.save(data);
    if (err) {
      return {
        user: {}, err: err
      };
    }

    const token = await jwtMaker.createToken(result.id, dto.email, 'Admin');


    if (err) {
      return { user: null, err };
    }
    if (result) {
      const msgData = {
        value: token,//result.id,
        name: data.email
      }
      const user = await messageMaps.toMessageResponse(msgData);
      return { user, err: null };
    } else {
      return {
        user: {}, err: {
          httpStatus: 500,
        }
      };
    }

  } catch (err) {
    return {
      user: null, err: {
        httpStatus: 500,
      }
    };
  }

}

const login = async (condition, body) => {
  try {
    const { users, err } = await userRepository.advanceFilter(condition);
    if (err != null) {
      return { user: {}, err }
    }
    if (users == null || users.length == 0) {
      return {
        user: {}, err: {
          message: "Data Not Found"
        }
      }
    }
    const status = await checkPassword(condition.password, users[0].password);
    if (!status) {
      return { users: [], err }
    }
    const oid = users[0].id
    selectedUser = users[0];
    selectedUser.androidToken = body.androidToken
    selectedUser.iosToken = body.iosToken
    selectedUser.webToken = body.webToken
    selectedUser.desktopToken = body.desktopToken
    const token = await jwtMaker.createToken(oid, condition.email, selectedUser.userRole.roleName);


    const { users: userUpdate, err: errUpdate } = await userRepository.update(oid, selectedUser);
    if (errUpdate != null) {
      return { user: {}, err }
    }
    const user = await mappings.toUserTokenResponse(users[0], token, "")
    return { user, err: null }
  } catch (err) {
    return {
      user: [], err: {
        httpStatus: 500,
      }
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

    const { result, err } = await userRepository.save(data);
    await session.commitTransaction();
    session.endSession();

    if (err) {
      return { user: null, err };
    }
    if (result) {
      const msgData = {
        value: data._id,
        name: data.email
      }
      const user = await messageMaps.toMessageResponse(msgData);
      return { user, err: null };
    } else {
      return {
        user: {}, err: {
          httpStatus: 500,
        }
      };
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return {
      user: null, err: {
        httpStatus: 500,
      }
    };
  }
};

const update = async (oid, dto, userOid) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {

    const { result: resultFind, err: errUser } = await userRepository.findById(oid);
    if (errUser != null) {
      return { user: {}, err: errUser }
    }
    if (resultFind == null) {
      return {
        user: {}, err: {
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

    const { result, err } = await userRepository.update(oid, resultFind);
    await session.commitTransaction();
    session.endSession();
    if (err) {
      return { user: result, err };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.email
      }
      const user = await messageMaps.toMessageResponse(msgData);
      return { user, err: null };
    } else {
      return {
        user: {}, err: {
          httpStatus: 500,
        }
      };
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return {
      user: null, err: {
        httpStatus: 500,
      }
    };
  }
};

const deleted = async (oid) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {
    const { result: resultFind, err: errUser } = await userRepository.findById(oid);
    if (errUser != null) {
      return { user: {}, err: errUser }
    }
    if (resultFind == null) {
      return {
        user: {}, err: {
          httpStatus: 404,
        }
      }
    }

    const { result, err } = await userRepository.deleted(oid);
    await session.commitTransaction();
    session.endSession();
    if (err) {
      return { result: null, err };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.email
      }
      const user = await messageMaps.toMessageResponse(msgData);
      return { user, err: null };
    } else {
      return {
        user: {}, err: {
          httpStatus: 500,
        }
      };
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return {
      user: null, err: {
        httpStatus: 500,
      }
    };
  }
};

const findAll = async () => {
  try {
    const { result, err } = await userRepository.findAll();
    const users = await mappings.toUserResponses(result)
    return { users, err: null }
  } catch (err) {
    return { users: [], err }
  }
};

const findById = async (oid) => {
  try {
    const { result, err } = await userRepository.findById(oid);
    if (err != null) {
      return { user: {}, err }
    }
    if (result == null) {
      return {
        user: null, err: {
          httpStatus: 404,
        }
      }
    }
    const user = await mappings.toUserResponse(result)
    return { user, err: null }
  } catch (err) {
    return {
      user: [], err: {
        httpStatus: 500,
      }
    }
  }

};

const findPage = async (condition, page, pageSize) => {
  try {
    const { count, errCount } = await userRepository.findCountByCriteria(condition);
    if (errCount) {
      return { users: [], count: 0, errCount }
    }
    const { users, err } = await userRepository.findByCriteria(condition, page, pageSize);
    if (err) {
      return { users: [], count: 0, errCount }
    }
    const userResponses = await mappings.toUserResponses(users)
    return { users: userResponses, count, err: err };
  } catch (err) {
    return {
      users: [], count: 0, err: {
        httpStatus: 500,
      }
    }
  }
};

module.exports = {
  register,
  login,
  create,
  update,
  deleted,
  findAll,
  findById,
  findPage,
};