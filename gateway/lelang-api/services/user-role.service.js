const userRoleRepository = require('../repositories/user-role.repository');
const mappings = require('../mappings/user-role.vm');
const messageMaps = require('../mappings/message.vm');
const mongoose = require('mongoose');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

const create = async (dto, userOid) => {  
  const session = await mongoose.startSession();
  session.startTransaction();

  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {

    const data = {
       _id: uuidv4(),
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


    const { result, error } = await userRoleRepository.save(data);
    await session.commitTransaction();
    session.endSession();
    if (error) {
      return { userRole: null, error };
    }
    if (result) {
      const msgData = {
        value: data._id,
        name: data.roleName
      }
      const userRole = await messageMaps.toMessageResponse(msgData);
      return { userRole, error: null };
    }
    return { userRole: {}, error: null };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return { userRole: null, error: { httpStatus: 500, message: 'Failed to delete Immage File' }, };
  }
};

const update = async (oid, dto,userOid) => {  
  const session = await mongoose.startSession();
  session.startTransaction();

  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {

    const { result: resultFind, error: errUserRole } = await userRoleRepository.findById({ _id: oid });
    if (errUserRole != null) {
      return { userRole: {}, error: errUserRole }
    }
    if (resultFind == null) {
      return {
        userRole: {}, error: {
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

    const { result, error } = await userRoleRepository.update(oid, resultFind);
    await session.commitTransaction();
    session.endSession();
    if (error) {
      return { userRole: result, error };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.roleName
      }
      const userRole = await messageMaps.toMessageResponse(msgData);
      return { userRole, error: null };
    } else {
      return { userRole: {}, error: { httpStatus: 500, message: 'Failed to delete Immage File' },};
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return { userRole: null, error: { httpStatus: 500, message: 'Failed to delete Immage File' }, };
  }
};

const deleted = async (oid) => {  
  const session = await mongoose.startSession();
  session.startTransaction();

  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {

    const { result: resultFind, error: errUserRole } = await userRoleRepository.findById(oid);
    if (errUserRole != null) {
      return { userRole: {}, error: errUserRole }
    }
    if (resultFind == null) {
      return {
        userRole: {}, error: {
          httpStatus: 404,
        }
      }
    }

    const { result, error } = await userRoleRepository.deleted(oid);
    await session.commitTransaction();
    session.endSession();
    if (error) {
      return { result: null, error };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.roleName
      }
      const userRole = await messageMaps.toMessageResponse(msgData);
      return { userRole, error: null };
    } else {
      return { userRole: {}, error: { httpStatus: 500, message: 'Failed to delete Immage File' }, };
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return { userRole: null,error: { httpStatus: 500, message: 'Failed to delete Immage File' },};
  }
};

const findAll = async () => {  
  try {

    const { result, error } = await userRoleRepository.findAll();
    const userRoles = await mappings.toUserRoleResponses(result)
    return { userRoles, error: error }
  } catch (error) {
    return { userRoles: [], error }
  }
};

const findById = async (oid) => {  
  try {

    const { result, error } = await userRoleRepository.findById(oid);
    if (error != null) {
      return { userRole: {}, error }
    }
    if (result == null) {
      return {
        userRole: null, error: {
          httpStatus: 404,
        }
      }
    }
    const userRole = await mappings.toUserRoleResponse(result)
    return { userRole, error: null }
  } catch (error) {
    return { userRole: [],error: { httpStatus: 500, message: 'Failed to delete Immage File' },}
  }

};

const findPage = async (condition, page, pageSize) => {
  try {

    const { count, errCount } = await userRoleRepository.findCountByCriteria(condition);
    if (errCount) {
      return { userRoles: [], count: 0, errCount }
    }
    const { userRoles, error } = await userRoleRepository.findByCriteria(condition, page, pageSize);
    if (error) {
      return { userRoles: [], count: 0, errCount }
    }
    const userRoleResponses = await mappings.toUserRoleResponses(userRoles)
    return { userRoles: userRoleResponses, count, error: error };
  } catch (error) {
    return { userRoles: [], count: 0, error: { httpStatus: 500, message: 'Failed to delete Immage File' },}
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