const imageFileRepository = require('../repositories/image-file.repository');
const mappings = require('../mappings/image-file.vm');
const messageMaps = require('../mappings/message.vm');
const sequelize = require('../config/sequelize');
const moment = require('moment');
const { buildFilterConditions, buildFindOptions } = require('../misc/sequelizeFilterBuilder');
const buildResponse = require('../common/build.response');
const { IMAGE_FILE_BASIC_FIELDS } = require('../constants/image-file.fields');
const sizeOf = require('image-size').default;
const fs = require('fs');
const path = require('path');
// require('../misc/datetime'); // Import string extensions for toCapitalize


const create = async (dto) => {
  // @ts-ignore
  const now = new Date().formatUTC();

  let transaction;

  try {
    transaction = await sequelize.transaction();
    console.log(dto)
    // const dimensions = sizeOf(dto.path);
    // Baca file sebagai buffer
    const fullPath = path.resolve(dto.path); // Mengubah path relatif jadi absolut
    const buffer = fs.readFileSync(fullPath); // Baca file jadi buffer
    const dimensions = sizeOf(buffer); // Ambil dimensi gambar



    const data = {
      fileName: dto.originalname,
      filePath: dto.path,
      fileUrl: `/public/${dto.filename}`, // ✅ Gunakan dto
      fileMime: dto.mimetype,
      fileSize: dto.size,
      imageWidth: dimensions.width,
      imageHeight: dimensions.height,
      storageType: 'local',
      createdBy: '5ebdef4b-ede3-45a8-b597-f0f749521c52',
      createdAt: now,
      lastModifiedBy: '5ebdef4b-ede3-45a8-b597-f0f749521c52',
      updatedAt: now,
    };

    const { result, err } = await imageFileRepository.save(data, { transaction });

    if (err || !result) {
      await transaction.rollback();
      return {
        imageFile: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    await transaction.commit();

    const msgData = { value: result.oid, name: result.fileUrl  };
    const imageFile = await messageMaps.toMessageResponse(msgData);

    return { imageFile, err: null };

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Create failed:', error);

    return {
      imageFile: null,
      err: buildResponse.responseInternalServerError(error).data.error,
    };
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

    // Siapkan opsi untuk findById, termasuk transaksi dan include relasi jika diperlukan
    const findOptions = {
      transaction: currentTransaction,
      include: [],  // ubah sesuai kebutuhan, bisa [] atau diambil dari dto misal
    };

    // Panggil findById dengan options yang benar
    const { result: existingImageFile, err: findError } = await imageFileRepository.findById(oid, findOptions);

    if (findError) {
      if (localTransaction) await localTransaction.rollback();
      return { imageFile: null, err: findError };
    }

    if (!existingImageFile) {
      if (localTransaction) await localTransaction.rollback();
      return { imageFile: null, err: { message: "ImageFile not found", status: 404 } };
    }

    const updateData = {
      imageFileCode: dto.imageFileCode ?? existingImageFile.imageFileCode,
      imageFileName: dto.imageFileName ?? existingImageFile.imageFileName,
      imageFileCurrency: dto.imageFileCurrency ?? existingImageFile.imageFileCurrency,
      lastModifiedBy: userOid ?? existingImageFile.lastModifiedBy,
      updatedAt: now,
    };

    // Update data dengan transaksi yang sama
    const { result: updateResult, err: updateError } = await imageFileRepository.update(
      oid,
      updateData,
      currentTransaction ? { transaction: currentTransaction } : {}
    );

    if (updateError) {
      if (localTransaction) await localTransaction.rollback();
      return { imageFile: null, err: updateError };
    }

    if (localTransaction) {
      await localTransaction.commit();
    }

    // Buat response message dari data yang sudah diupdate
    const msgData = { value: existingImageFile.oid, name: existingImageFile.imageFileName };
    const imageFile = await messageMaps.toMessageResponse(msgData);

    return { imageFile, err: null };

  } catch (err) {
    if (localTransaction) await localTransaction.rollback();
    console.error('Update failed:', err);

    return {
      imageFile: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};


const deleted = async (oid) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const { result: resultFind, err: errFind } = await imageFileRepository.findById(oid, { transaction });
    if (errFind) {
      await transaction.rollback();
      return { imageFile: null, err: errFind };
    }

    if (!resultFind) {
      await transaction.rollback();
      return {
        imageFile: null,
        err: { message: 'Data Not Found', status: 404 }
      };
    }

    const { result, err } = await imageFileRepository.remove(oid, { transaction });
    if (err) {
      await transaction.rollback();
      return { imageFile: null, err };
    }

    await transaction.commit();

    const msgData = { value: resultFind.oid, name: resultFind.imageFileName };
    const imageFile = await messageMaps.toMessageResponse(msgData);

    return { imageFile, err: null };

  } catch (err) {
    if (transaction) await transaction.rollback();
    console.error('Delete failed:', err);

    return {
      imageFile: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findAll = async () => {
  try {
    const { result, err } = await imageFileRepository.findAll({
      include: [],
      order: [['createdAt', 'DESC']],
      attributes: IMAGE_FILE_BASIC_FIELDS
    });

    if (err) return { imageFiles: [], err };

    const imageFiles = await mappings.toImageFileResponses(result);
    return { imageFiles, err: null };
  } catch (err) {
    return {
      imageFiles: [],
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};

const findById = async (oid, options = {}) => {
  try {
    const { result, err } = await imageFileRepository.findById(oid, options);

    if (err) {
      return {
        imageFile: null,
        err: buildResponse.responseInternalServerError(err).data.error,
      };
    }

    if (!result) {
      // Data not found, no error, just empty result
      return { imageFile: null, err: null };
    }

    const imageFile = await mappings.toImageFileResponse(result);

    return { imageFile, err: null };
  } catch (err) {
    console.error('Error finding imageFile:', err);
    return {
      imageFile: null,
      err: buildResponse.responseInternalServerError(err).data.error,
    };
  }
};



const findPage = async (filters, options) => {
  try {

    const { search, ...restFilters } = filters;
    const normalizedFilters = search ? { ...restFilters, imageFileName: search } : filters;

    const where = buildFilterConditions(sequelize, normalizedFilters, false); // case-insensitive
    const findOptions = buildFindOptions(where, options);

    const result = await imageFileRepository.findAndCountByCriteria(findOptions);

    if (result.err) throw result.err;

    return {
      imageFiles: result.data,
      count: result.count,
      err: null,
    };
  } catch (error) {
    console.error('ImageFileService findPage error:', error);
    return {
      imageFiles: [],
      count: 0,
      err: buildResponse.responseInternalServerError(error).data.error,
    };
  }
};





module.exports = {
  create,
  update,
  deleted,
  findAll,
  findById,
  findPage
};

