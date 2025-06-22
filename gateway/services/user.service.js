require('dotenv').config();
const userRepository = require('../repositories/user.repository');
const mappings = require('../mappings/user.vm');
const messageMaps = require('../mappings/message.vm');
const { hashPassword, checkPassword } = require('../misc/password');
const { JwtMaker } = require('../middleware/jwt'); // Adjust the path accordingly
const jwtMaker = new JwtMaker();
const sequelize = require('../config/sequelize');
const moment = require('moment');
const redisClient = require('../lib/redis/redis');

const create = async (dto, userOid) => {
    const transaction = await sequelize.transaction();
    const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    try {
        const hashedPassword = await hashPassword(dto.password);
        const data = {
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

        const { result, err } = await userRepository.save(data, transaction);
        if (err !== null) {
            return { result: null, err }
        }
        if (result) {
            const msgData = {
                value: result.oid,
                name: result.email
            }
            const user = await messageMaps.toMessageResponse(msgData);
            return { user, err: null };
        } else {
            return { user: {}, err: { message: "Transaction Failed" } };
        }
        // const user = await mappings.toUserResponse(result)
        // return { user, err: err }
    } catch (err) {
        return { result: null, err }
    }
};

const register = async (dto) => {
    const transaction = await sequelize.transaction();
    const roleOidStr = process.env.RoleId || ""

    try {
        const hashedPassword = await hashPassword(dto.password);
        dto.createdBy = dto.email
        const data = {
            email: dto.email,
            name: dto.email,
            password: hashedPassword,
            roleOid: roleOidStr,
            createdBy: dto.createdBy
        };

        const { result, err } = await userRepository.save(data, transaction);
        if (err !== null) {
            return { result: null, err }
        }
        const user = await mappings.toUserResponse(result)
        return { user, err: err }
    } catch (err) {
        return { result: null, err }
    }
};

const login = async (condition) => {
    try {

        const { result, err } = await userRepository.advanceFlter(condition);
        if (err !== null) {
            return { result: null, err }
        }
        if (result.length == 0) {
            return {
                result: [], err: {
                    message: "Data Not Found"
                }
            }
        }
        const status = await checkPassword(condition.password, result[0].password);
        if (!status) {
            return { result: [], err: { message: "password not match" } }
        }
        const oid = result[0].oid
        const token = await jwtMaker.createToken(oid, condition.email);


        const user = await mappings.toUserTokenResponse(result[0], token, "")
        return { user, err: err }
    } catch (err) {
        return { result: null, err }
    }
};

const update = async (oid, dto, userOid) => {
    const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const transaction = await sequelize.transaction();
    try {
        const { result: fresult, err: ferr } = await userRepository.findById(oid);

        if (ferr !== null) {
            return { result: null, ferr }
        }
        if (fresult == null) {
            return {
                result: null, err: {
                    message: "Data Not Found"
                }
            }
        }
        const hashedPassword = await hashPassword(dto.password ?? fresult.password);
        fresult.name = dto.name ?? fresult.name
        fresult.email = dto.email ?? fresult.email
        fresult.password = hashedPassword
        fresult.birthday = dto.birthday ?? fresult.birthday
        fresult.memberNumber = dto.memberNumber ?? fresult.memberNumber
        fresult.androidToken = dto.androidToken ?? fresult.androidToken
        fresult.expiredTime = dto.expiredTime ?? fresult.expiredTime
        fresult.isActive = dto.isActive ?? fresult.isActive
        fresult.activatedAt = dto.activatedAt ?? fresult.activatedAt
        fresult.roleOid = dto.roleOid ?? fresult.roleOid
        fresult.description = dto.description ?? fresult.description
        fresult.lastModifiedBy = userOid ?? fresult.lastModifiedBy
        fresult.updatedAt = now ?? fresult.updatedAt


        const { result: result, err: err } = await userRepository.update(oid, fresult, transaction);
        const user = await mappings.toUserResponse(result)
        return { user, err: err }
    } catch (err) {
        return { result: null, err }
    }
};

const deleted = async (oid) => {
    const transaction = await sequelize.transaction();
    try {
        const { result: resultFind, err: errUser } = await userRepository.findById(oid);
        if (errUser != null) {
            return { user: {}, err: errUser }
        }
        if (resultFind == null) {
            return {
                user: {}, err: {
                    message: "Data Not Found"
                }
            }
        }
        const { result, err } = await userRepository.deleted(oid, transaction);
        if (err) {
            const msgData = {
                value: result.oid,
                name: result.userName
            }
            const user = await messageMaps.toMessageResponse(msgData);
            return { user, err: null };
        } else {
            return { user: {}, err: { message: "Transaction Failed" } };
        }
    } catch (err) {
        return { user: null, err }
    }
};

const findAll = async () => {
    try {
        const { result, err } = await userRepository.findAll();
        if (err) {
            return { users: [], err: null }
        }
        const users = await mappings.toUserResponses(result)
        return { users, err: null }
    } catch (err) {
        return { users: [], err }
    }
};


const findById = async (oid, options = {}) => {
    try {
        const { result, err } = await userRepository.findById(oid);
        if (result == null) {
            return {
                user: {}, err: {
                    message: "Data Not Found"
                }
            }
        }
        const user = await mappings.toUserResponse(result)
        return { user, err: err }
    } catch (err) {
        return { user: {}, err }
    }

};
const findPage = async (condition, page, pageSize) => {
    try {
        const { count, errCount } = await userRepository.findCountByCriteria(condition);
        if (errCount) {
            return { users: [], count: 0, errCount }
        }
        const { users, err } = await userRepository.findByCriteria(condition, page, pageSize);
        const userResponses = await mappings.toUserResponses(users)
        return { users: userResponses, count, err: err };
    } catch (err) {
        return { users: [], count: 0, err }
    }
};

const findByEmail = async (condition, page, pageSize) => {
    try {
        const { count, errCount } = await userRepository.findCountByCriteria(condition);
        if (errCount) {
            return { users: [], count: 0, errCount }
        }
        const { users, err } = await userRepository.findByCriteria(condition, page, pageSize);
        const userResponses = await mappings.toUserResponses(users)
        return { users: userResponses, count, err: err };
    } catch (err) {
        return { users: [], count: 0, err }
    }
};


const findByMe = async (oid, options = {}) => {
  try {
    let userData = await redisClient.get(`user:profile:${oid}`);
    let user;

    if (!userData) {
      const { result, err } = await userRepository.findById(oid);
      if (result == null) {
        return {
          user: {},
          err: { message: "Data Not Found" }
        };
      }

      await redisClient.set(`user:profile:${oid}`, JSON.stringify(result), { EX: 3600 });
      user = await mappings.toUserResponse(result);
    } else {
      const json = typeof userData === 'string' ? userData : userData.toString();
      user = await mappings.toUserResponse(JSON.parse(json));
    }

    return { user, err: null };
  } catch (err) {
    return { user: {}, err };
  }
};




module.exports = {
    create,
    register,
    login,
    update,
    deleted,
    findAll,
    findById,
    findPage,
    findByEmail, findByMe
};

