const imageFileRepository = require('../repositories/image-file.repository');
const mappings = require('../mappings/image-file-vm');
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

    const { result, err } = await imageFileRepository.save(data);
    await session.commitTransaction();
    session.endSession();
    if (err) {
      return { imageFile: null, err };
    }
    if (result) {
      const msgData = {
        value: data._id,
        name: data.fileName
      }
      const imageFile = await messageMaps.toMessageResponse(msgData);
      return { imageFile, err: null };
    } else {
      return { imageFile: {}, err: {
        httpStatus: 500,
      } };
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return { imageFile: null, err: {
      httpStatus: 500,
    } };
  }
};

const update = async (oid, dto, userOid) => {  
  const session = await mongoose.startSession();
  session.startTransaction();

  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {

    const { result: resultFind, err: errImageFile } = await imageFileRepository.findById(oid);
    if (errImageFile != null) {
      return { imageFile: {}, err: errImageFile }
    }
    if (resultFind == null) {
      return {
        imageFile: {}, err: {
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

    const { result, err } = await imageFileRepository.update(oid, data);
    await session.commitTransaction();
    session.endSession();
    if (err) {
      return { imageFile: resultImageFile, err };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.email
      }
      const imageFile = await messageMaps.toMessageResponse(msgData);
      return { imageFile, err: null };
    } else {
      return { imageFile: {}, err: {
        httpStatus: 500,
      } };
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return { imageFile: null, err: {
      httpStatus: 500,
    } };
  }
};

const deleted = async (oid) => {  
  const session = await mongoose.startSession();
  session.startTransaction();

  now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  try {

    const { result: resultFind, err: errImageFile } = await imageFileRepository.findById(oid);
    if (errImageFile != null) {
      return { imageFile: {}, err: errImageFile }
    }
    if (resultFind == null) {
      return {
        imageFile: {}, err: {
          httpStatus: 404,
        }
      }
    }

    const { result, err } = await imageFileRepository.deleted(oid);
    await session.commitTransaction();
    session.endSession();

    if (err) {
      return { result: null, err };
    }
    if (result) {
      const msgData = {
        value: resultFind._id,
        name: resultFind.fileName
      }
      const imageFile = await messageMaps.toMessageResponse(msgData);
      return { imageFile, err: null };
    } else {
      return { imageFile: {}, err: {
        httpStatus: 500,
      } };
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return { imageFile: null, err: {
      httpStatus: 500,
    } };
  }
};

const findAll = async () => {  
  try {

    const { result, err } = await imageFileRepository.findAll();
    const imageFiles = await mappings.toImageFileResponses(result)
    return { imageFiles, err: null }
  } catch (err) {
    return { imageFiles: [], err: {
      httpStatus: 500,
    } }
  }
};

const findById = async (oid) => {  
  try {

    const { result, err } = await imageFileRepository.findById(oid);
    if (err != null) {
      return { imageFile: {}, err }
    }
    if (result == null) {
      return {
        imageFile: {}, err: {
          httpStatus: 404,
        }
      }
    }
    const imageFile = await mappings.toImageFileResponse(result)
    return { imageFile, err: null }
  } catch (err) {
    return { imageFile: [], err: {
      httpStatus: 500,
    } }
  }

};

const findPage = async (condition, page, pageSize) => {
  try {

    const { count, errCount } = await imageFileRepository.findCountByCriteria(condition);
    if (errCount) {
      return { imageFiles: [], count: 0, errCount }
    }
    const { imageFiles, err } = await imageFileRepository.findByCriteria(condition, page, pageSize);
    if (err) {
      return { imageFiles: [], count: 0, errCount }
    }
    const imageFileResponses = await mappings.toImageFileResponses(imageFiles)
    return { imageFiles: imageFileResponses, count, err: err };
  } catch (err) {
    return { imageFiles: [], count: 0, err: {
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