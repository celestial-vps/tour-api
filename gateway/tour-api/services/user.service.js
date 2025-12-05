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
const { buildFilterConditions, buildFindOptions } = require('../misc/sequelizeFilterBuilder');
const buildResponse = require('../common/build.response');
const { UserRole } = require('../models');
const { USER_ROLE_BASIC_FIELDS } = require('../constants/user-role.fields');

const create = async (dto, userOid) => {
    const transaction = await sequelize.transaction();
    const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    try {
        const hashedPassword = await hashPassword(dto.password);
        const data = {
            name: dto.name ?? null,
            email: dto.email,
            password: hashedPassword,
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
        const token = await jwtMaker.createToken(oid, condition.email, result[0].userRole.roleName);


        const user = await mappings.toUserTokenResponse(result[0], token, "")
        return { user, err: err }
    } catch (err) {
        return { result: null, err }
    }
};

const update = async (oid, dto, userOid, options = {}) => {
    const { transaction = null, useTransaction = false } = options;
    // @ts-ignore
    const now = new Date().formatUTC();
    let localTransaction = null;

    try {
        if (useTransaction && !transaction) {
            localTransaction = await sequelize.transaction();
        }

        const currentTransaction = transaction || localTransaction;

        const findOptions = {
            transaction: currentTransaction,
            include: [],
        };

        const { result: existing, err: findError } = await userRepository.findById(oid, findOptions);

        if (findError) {
            if (localTransaction) await localTransaction.rollback();
            return { userRole: null, err: findError };
        }

        if (!existing) {
            if (localTransaction) await localTransaction.rollback();
            return { userRole: null, err: { message: "UserRole not found", status: 404 } };
        }
        const hashedPassword = await hashPassword(dto.password ?? existing.password);
        const updateData = {
            email: dto.email ?? existing.email,
            password: hashedPassword,
            androidToken: dto.androidToken ?? existing.androidToken,
            expiredTime: dto.expiredTime ?? existing.expiredTime,
            isActive: dto.isActive ?? existing.isActive,
            activatedAt: dto.activatedAt ?? existing.activatedAt,
            roleOid: dto.roleOid ?? existing.roleOid,
            description: dto.description ?? existing.description,
            lastModifiedBy: userOid ?? existing.lastModifiedBy,
            updatedAt: now,
        };


        const { result: updateResult, err: updateError } = await userRepository.update(
            oid,
            updateData,
            currentTransaction ? { transaction: currentTransaction } : {}
        );

        if (updateError) {
            if (localTransaction) await localTransaction.rollback();
            return { userRole: null, err: updateError };
        }

        if (localTransaction) await localTransaction.commit();

        const msgData = { value: existing.oid, name: existing.roleName };
        const userRole = await messageMaps.toMessageResponse(msgData);

        return { userRole, err: null };

    } catch (err) {
        if (localTransaction) await localTransaction.rollback();
        console.error('Update failed:', err);
        return {
            userRole: null,
            err: buildResponse.responseInternalServerError(err).data.error,
        };
    }
};


const deleted = async (oid) => {
    let transaction;

    try {
        transaction = await sequelize.transaction();

        const { result: resultFind, err: errFind } = await userRepository.findById(oid, { transaction });
        if (errFind) {
            await transaction.rollback();
            return { userRole: null, err: errFind };
        }

        if (!resultFind) {
            await transaction.rollback();
            return {
                userRole: null,
                err: { message: 'Data Not Found', status: 404 }
            };
        }

        const { result, err } = await userRepository.remove(oid, { transaction });
        if (err) {
            await transaction.rollback();
            return { userRole: null, err };
        }

        await transaction.commit();

        const msgData = { value: resultFind.oid, name: resultFind.roleName };
        const userRole = await messageMaps.toMessageResponse(msgData);

        return { userRole, err: null };

    } catch (err) {
        if (transaction) await transaction.rollback();
        console.error('Delete failed:', err);
        return {
            userRole: null,
            err: buildResponse.responseInternalServerError(err).data.error,
        };
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

const findPage = async (filters, options) => {
    try {

        const { search, ...restFilters } = filters;
        const normalizedFilters = search ? { ...restFilters, email: search } : filters;

        const where = buildFilterConditions(sequelize, normalizedFilters, false); // case-insensitive
        options.include = [
            {
                model: UserRole,
                as: 'userRole',
                attributes: USER_ROLE_BASIC_FIELDS,
            }
        ];
        const findOptions = buildFindOptions(where, options);

        const result = await userRepository.findAndCountByCriteria(findOptions);

        if (result.err) throw result.err;
        const users = await mappings.toUserResponses(result.data);
        return {
            users,
            count: result.count,
            err: null,
        };
    } catch (error) {
        console.error('UserService findPage error:', error);
        return {
            users: [],
            count: 0,
            err: buildResponse.responseInternalServerError(error).data.error,
        };
    }
};

const findByEmail = async (filters, options) => {
    try {
        const { search, ...restFilters } = filters;
        const normalizedFilters = search ? { ...restFilters, email: search } : filters;

        const where = buildFilterConditions(sequelize, normalizedFilters, false); // case-insensitive
        const findOptions = buildFindOptions(where, options);


        const { count, errCount } = await userRepository.findAndCountByCriteria(findOptions);
        if (errCount) {
            return { users: [], count: 0, errCount }
        }
        const { users, err } = await userRepository.findByCriteria(findOptions);
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

