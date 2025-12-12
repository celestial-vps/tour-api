const imageFileRepository = require('../repositories/image-file.repository');
const mappings = require('../mappings/image-file-vm');
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
      fileName: dto.fileName,
      filePath: dto.filePath,
      fileMime: dto.fileMime,
      fileUrl: dto.fileUrl,
      description: dto.description ?? null,
      createdBy: userOid,
      createdAt: now,
      lastModifiedBy: userOid,
      updatedAt: now,
    };

    const { result, error } = await imageFileRepository.save(data);
    await session.commitTransaction();
    session.endSession();
    if (error) {
      return { imageFile: null, error };
    }
    if (result) {
      const msgData = {
        value: data._id,
        name: data.fileName
      }
      const imageFile = await messageMaps.toMessageResponse(msgData);
      return { imageFile, error: null };
    } else {
      return { imageFile: {}, error: { httpStatus: 500, message: 'Failed to delete Immage File' }, };
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return { imageFile: null,error: { httpStatus: 500, message: 'Failed to delete Immage File' }, };
  }
};

const update = async (oid, dto, userOid) => {  
  const session = await mongoose.startSession();
  session.startTransaction();

  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {

    const { result: resultFind, error: errImageFile } = await imageFileRepository.findById(oid);
    if (errImageFile != null) {
      return { imageFile: {}, error: errImageFile }
    }
    if (resultFind == null) {
      return {
        imageFile: {}, error: {
          httpStatus: 404,
        }
      }
    }

    resultFind.fileName = dto.fileName ?? resultFind.fileName
    resultFind.filePath = dto.filePath ?? resultFind.filePath
    resultFind.fileMime = dto.fileMime ?? resultFind.fileMime
    resultFind.fileUrl = dto.fileUrl ?? resultFind.fileUrl
    resultFind.description = dto.description ?? resultFind.description
    resultFind.lastModifiedBy = userOid ?? resultFind.lastModifiedBy
    resultFind.updatedAt = now ?? resultFind.updatedAt

    const { result, error } = await imageFileRepository.update(oid, data);
    await session.commitTransaction();
    session.endSession();
    if (error) {
      return { imageFile: resultImageFile, error };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.email
      }
      const imageFile = await messageMaps.toMessageResponse(msgData);
      return { imageFile, error: null };
    } else {
      return { imageFile: {}, error: { httpStatus: 500, message: 'Failed to delete Immage File' }, };
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return { imageFile: null,error: { httpStatus: 500, message: 'Failed to delete Immage File' }, };
  }
};

const deleted = async (oid) => {  
  const session = await mongoose.startSession();
  session.startTransaction();

  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {

    const { result: resultFind, error: errImageFile } = await imageFileRepository.findById(oid);
    if (errImageFile != null) {
      return { imageFile: {}, error: errImageFile }
    }
    if (resultFind == null) {
      return {
        imageFile: {}, error: {
          httpStatus: 404,
        }
      }
    }

    const { result, error } = await imageFileRepository.deleted(oid);
    await session.commitTransaction();
    session.endSession();

    if (error) {
      return { result: null, error };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.fileName
      }
      const imageFile = await messageMaps.toMessageResponse(msgData);
      return { imageFile, error: null };
    } else {
      return { imageFile: {},error: { httpStatus: 500, message: 'Failed to delete Immage File' },};
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return { imageFile: null, error: { httpStatus: 500, message: 'Failed to delete Immage File' },}
  }
};

const findAll = async () => {  
  try {

    const { result, error } = await imageFileRepository.findAll();
    const imageFiles = await mappings.toImageFileResponses(result)
    return { imageFiles, error: null }
  } catch (error) {
    return { imageFiles: [], error: { httpStatus: 500, message: 'Failed to delete Immage File' },}
  }
};

const findById = async (oid) => {  
  try {

    const { result, error } = await imageFileRepository.findById(oid);
    if (error != null) {
      return { imageFile: {}, error }
    }
    if (result == null) {
      return {
        imageFile: {}, error: {
          httpStatus: 404,
        }
      }
    }
    const imageFile = await mappings.toImageFileResponse(result)
    return { imageFile, error: null }
  } catch (error) {
    return { imageFile: [], error: { httpStatus: 500, message: 'Failed to delete Immage File' }, }
  }

};

const findPage = async (condition, page, pageSize) => {
  try {

    const { count, errCount } = await imageFileRepository.findCountByCriteria(condition);
    if (errCount) {
      return { imageFiles: [], count: 0, errCount }
    }
    const { imageFiles, error } = await imageFileRepository.findByCriteria(condition, page, pageSize);
    if (error) {
      return { imageFiles: [], count: 0, errCount }
    }
    const imageFileResponses = await mappings.toImageFileResponses(imageFiles)
    return { imageFiles: imageFileResponses, count, error: error };
  } catch (error) {
    return { imageFiles: [], count: 0,error: { httpStatus: 500, message: 'Failed to delete Immage File' }, }
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