// repositories/imageFileRepository.js
// const { result } = require('lodash');
const ImageFile = require('../models/image-file'); // Import the default export
const { Op } = require('sequelize');
const models = require('../models'); // Ensure you're importing the models correctly

const save = async (data,options) => {
    try {
        const result = await models.ImageFile.create(data,options);
        return { result, err: null }
    }
    catch (err) {
        return { result: null, err }
    }

};

const update = async (oid, data, options) => {
    try {
        const result = await models.ImageFile.update(data, {
            where: { oid } // Assuming 'id' is the primary key or identifier
        }, options);

        return { result, err: null }
    } catch (err) {
        return { result: null, err }
    }
};

const deleted = async (oid, options) => {
    try {
        const result = await models.ImageFile.findByPk(oid);
        if (result) {
            await result.destroy();
            return { err: null }
        } else {
            return {
                err: {
                    message: "Data Not Found"
                }
            }
        }

    } catch (err) {
        return { result: null, err }
    }

};

const findAll = async () => {
    try {
        const result = await models.ImageFile.findAll();
        return { result, err: null }
    } catch (err) {
        return { result: null, err }
    }

};

const findById = async (oid) => {
    try {
        const result = await models.ImageFile.findByPk(oid);
        return { result, err: null }
    }
    catch (err) {
        return { result: null, err }
    }
};

const advanceFlter = async () => {
    try {
        const result = await models.ImageFile.findAll();
        return { result, err: null }
    }
    catch (err) {
        return { result: null, err }
    }
};

const findCountByCriteria = async (filterCondition) => {
    try {
        // Initialize the query with conditions
        const whereConditions = {};

        if (filterCondition.imageFileCode) {
            whereConditions.imageFileCode = {
                [Op.like]: `%${filterCondition.imageFileCode}%`
            };
        }
        if (filterCondition.imageFileName) {
            whereConditions.imageFileName = {
                [Op.like]: `%${filterCondition.imageFileName}%`
            };
        }

        // Retrieve the paginated records
        const count = await models.ImageFile.count({
            where: whereConditions
        });

        return { count, error: null };
    } catch (error) {
        console.error('Error retrieving imageFiles:', error);
        return { count: 0, error };
    }
};


const findByCriteria = async (filterCondition, page, pageSize) => {
    try {
        // Initialize the query with conditions
        const whereConditions = {};

        if (filterCondition.imageFileCode) {
            whereConditions.imageFileCode = {
                [Op.like]: `%${filterCondition.imageFileCode}%`
            };
        }
        if (filterCondition.imageFileName) {
            whereConditions.imageFileName = {
                [Op.like]: `%${filterCondition.imageFileName}%`
            };
        }

        // Retrieve the paginated records
        const imageFiles = await models.ImageFile.findAll({
            where: whereConditions,
            limit: pageSize,
            offset: (page - 1) * pageSize
        });

        return { imageFiles, error: null };
    } catch (error) {
        console.error('Error retrieving imageFiles:', error);
        return { imageFiles: [], error };
    }
};


module.exports = {
    save,
    update,
    deleted,
    findAll,
    findById,
    advanceFlter,
    findCountByCriteria,
    findByCriteria,   
};
