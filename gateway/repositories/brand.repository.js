const Brand = require('../models/brand');
const { Op } = require('sequelize');
const models = require('../models');

const save = async (data, options) => {
    try {
        const result = await models.Brand.create(data, options);
        return { result, err: null }
    }
    catch (err) {
        return { result: null, err }
    }

};

const update = async (oid, data, options) => {
    try {
        const result = await models.Brand.update(data, {
            where: { oid }
        }, options);
        return { result, err: null }
    } catch (err) {
        return { result: null, err }
    }
};

const deleted = async (oid, options) => {
    try {
        const deleteResult = await models.Brand.destroy({
            where: {
                oid: oid
            }
        }, options);
        if (deleteResult !== 0) {
            return { result: deleteResult, err: null };
        } else {
            return {
                result: null,
                err: {
                    message: "Failed to delete record"
                }
            };
        }
    } catch (err) {
        return { result: null, err }
    }
};

const findAll = async () => {
    try {
        const result = await models.Brand.findAll();
        return { result, err: null }
    } catch (err) {
        return { result: null, err }
    }
};

const findById = async (oid) => {
    try {
        const result = await models.Brand.findByPk(oid);
        return { result, err: null }
    }
    catch (err) {
        return { result: null, err }
    }
};

const advanceFlter = async () => {
    try {
        const result = await models.Brand.findAll();
        return { result, err: null }
    }
    catch (err) {
        return { result: null, err }
    }
};

const findCountByCriteria = async (filterCondition) => {
    try {        
        const whereConditions = {};

        if (filterCondition.brandCode) {
            whereConditions.brandCode = {
                [Op.like]: `%${filterCondition.brandCode}%`
            };
        }
        if (filterCondition.brandName) {
            whereConditions.brandName = {
                [Op.like]: `%${filterCondition.brandName}%`
            };
        }

        const count = await models.Brand.count({
            where: whereConditions
        });

        return { count, error: null };
    } catch (error) {
        console.error('Error retrieving brands:', error);
        return { count: 0, error };
    }
};

const findByCriteria = async (filterCondition, page, pageSize) => {
    try {
        const whereConditions = {};

        if (filterCondition.brandCode) {
            whereConditions.brandCode = {
                [Op.like]: `%${filterCondition.brandCode}%`
            };
        }
        if (filterCondition.brandName) {
            whereConditions.brandName = {
                [Op.like]: `%${filterCondition.brandName}%`
            };
        }

        const brands = await models.Brand.findAll({
            where: whereConditions,
            limit: pageSize,
            offset: (page - 1) * pageSize
        });

        return { brands, error: null };
    } catch (error) {
        console.error('Error retrieving brands:', error);
        return { brands: [], error };
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
