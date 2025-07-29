const userRoleRepository = require('../repositories/user-role.repository');
const mappings = require('../mappings/user-role.vm');
const messageMaps = require('../mappings/message.vm');
const mongoose = require('mongoose');
const moment = require('moment');

const create = async (dto, userOid) => {  
  const session = await mongoose.startSession();
  session.startTransaction();

  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {

    const data = {
      _id: new mongoose.Types.ObjectId(),
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


    const { result, err } = await userRoleRepository.save(data);
    await session.commitTransaction();
    session.endSession();
    if (err) {
      return { userRole: null, err };
    }
    if (result) {
      const msgData = {
        value: data._id,
        name: data.roleName
      }
      const userRole = await messageMaps.toMessageResponse(msgData);
      return { userRole, err: null };
    }
    return { userRole: {}, err: null };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return { userRole: null, err: {
      httpStatus: 500,
    } };
  }
};

const update = async (oid, dto,userOid) => {  
  const session = await mongoose.startSession();
  session.startTransaction();

  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {

    const { result: resultFind, err: errUserRole } = await userRoleRepository.findById({ _id: oid });
    if (errUserRole != null) {
      return { userRole: {}, err: errUserRole }
    }
    if (resultFind == null) {
      return {
        userRole: {}, err: {
          httpStatus: 404,
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

    const { result, err } = await userRoleRepository.update(oid, resultFind);
    await session.commitTransaction();
    session.endSession();
    if (err) {
      return { userRole: result, err };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.roleName
      }
      const userRole = await messageMaps.toMessageResponse(msgData);
      return { userRole, err: null };
    } else {
      return { userRole: {}, err: {
        httpStatus: 500,
      } };
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return { userRole: null, err: {
      httpStatus: 500,
    } };
  }
};

const deleted = async (oid) => {  
  const session = await mongoose.startSession();
  session.startTransaction();

  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {

    const { result: resultFind, err: errUserRole } = await userRoleRepository.findById(oid);
    if (errUserRole != null) {
      return { userRole: {}, err: errUserRole }
    }
    if (resultFind == null) {
      return {
        userRole: {}, err: {
          httpStatus: 404,
        }
      }
    }

    const { result, err } = await userRoleRepository.deleted(oid);
    await session.commitTransaction();
    session.endSession();
    if (err) {
      return { result: null, err };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.roleName
      }
      const userRole = await messageMaps.toMessageResponse(msgData);
      return { userRole, err: null };
    } else {
      return { userRole: {}, err: {
        httpStatus: 500,
      } };
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return { userRole: null, err: {
      httpStatus: 500,
    } };
  }
};

const findAll = async () => {  
  try {

    const { result, err } = await userRoleRepository.findAll();
    const userRoles = await mappings.toUserRoleResponses(result)
    return { userRoles, err: err }
  } catch (err) {
    return { userRoles: [], err }
  }
};

const findById = async (oid) => {  
  try {

    const { result, err } = await userRoleRepository.findById(oid);
    if (err != null) {
      return { userRole: {}, err }
    }
    if (result == null) {
      return {
        userRole: null, err: {
          httpStatus: 404,
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

const findPage = async (condition, page, pageSize) => {
  try {

    const { count, errCount } = await userRoleRepository.findCountByCriteria(condition);
    if (errCount) {
      return { userRoles: [], count: 0, errCount }
    }
    const { userRoles, err } = await userRoleRepository.findByCriteria(condition, page, pageSize);
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