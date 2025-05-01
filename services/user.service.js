require('dotenv').config();
const userRepository = require('../repositories/user.repository');
const mappings = require('../mappings/user.vm');
const messageMaps = require('../mappings/message.vm');
const { hashPassword, checkPassword } = require('../misc/password');
const { JwtMaker } = require('../middleware/jwt'); // Adjust the path accordingly
const jwtMaker = new JwtMaker();
const sequelize = require('../config/sequelize');
const moment = require('moment');

const create = async (dto, userOid) => {
    const transaction = await sequelize.transaction();
    now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    try {        
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

        const { result, err } = await userRepository.save(data,transaction);
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

        const { result, err } = await userRepository.save(data,transaction);
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
        // dto.createdBy = 'test'
        // const data = {
        //     userCode: dto.userCode,
        //     userName: dto.userName,
        //     shortName: dto.shortName,
        //     createdBy: dto.createdBy
        // };

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
            return { result: [], err:{message:"password not match"} }
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
    now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const transaction = await sequelize.transaction();
    try {
        const { result: fresult, err: ferr } = await userRepository.findById(oid);

        if (ferr !== null) {
            return { result: null, err }
        }
        if (fresult == null) {
            return {
                result: null, err: {
                    message: "Data Not Found"
                }
            }
        }
        const hashedPassword = await hashPassword(dto.password ?? resultFind.password);
        resultFind.name = dto.name ?? resultFind.name
        resultFind.email = dto.email ?? resultFind.email
        resultFind.password =   hashedPassword
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
    

        const { result: result, err: err } = await userRepository.update(id, resultFind,transaction);
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
        const { err } = await userRepository.deleted(oid,transaction,transaction);
        if (result) {
            const msgData = {
              value: resultFind.oid,
              name: resultFind.userName
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
        const users = await mappings.toUserResponses(result)
        return { users, err: null }
    } catch (err) {
        return { users: [], err }
    }
};


const findById = async (oid) => {
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


module.exports = {
    create,
    register,
    login,
    update,
    deleted,
    findAll,
    findById,
    findPage,
    findByEmail,
};

