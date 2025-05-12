// repositories/ProvinceRepository.js
// const { result } = require('lodash');
const Province = require('../models/Province'); // Import the default export
const { Op } = require('sequelize');
const models = require('../models'); // Ensure you're importing the models correctly
const { paginate } = require('../misc/pagination')


const save = async (data, options) => {
    try {
        const result = await Province.create(data, options);
        return { result, err: null }
    }
    catch (err) {
        return { result: null, err }
    }

};

const update = async (oid, data, options) => {
    try {
        console.log("start", oid);
        const result = await Province.update(data, {
            where: { oid },
            ...options,            
        });

        return { result, err: null };
    } catch (err) {
        return { result: null, err };
    }
};

const deleted = async (oid, options) => {
    try {
        const deleteResult = await Province.destroy({
            where: {
                oid: oid // Replace 'id' with the actual primary key field if different
            }
        }, options);
        if (deleteResult !== 0) {
            return { result: deleteResult, err: null }; // Return the deleted product
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
        const result = await Province.findAll();
        return { result, err: null }
    } catch (err) {
        return { result: null, err }
    }

};

const findById = async (oid) => {
    try {
        const result = await Province.findByPk(oid);
        return { result, err: null }
    }
    catch (err) {
        return { result: null, err }
    }
};

const advanceFlter = async () => {
    try {
        const result = await Province.findAll();
        return { result, err: null }
    }
    catch (err) {
        return { result: null, err }
    }
};

const findCountByCriteria = async (where = {}) => {
    try {
        const count = await Province.count({ where });
        return { count, error: null };

    } catch (error) {
        console.error('Error counting provinces:', error);
        return { count: 0, error: error.message };
    }
};

const findByCriteria = async (where = {}, page, pageSize) => {
    try {
        const whereConditions = Object.entries(filterCondition).reduce((acc, [key, value]) => {
            if (value) acc[key] = { [Op.like]: `%${value}%` };
            return acc;
        }, {});

        const provinces = await Province.findAll({
            where,
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: [['ProvinceName', 'ASC']],
        });

        return { provinces, error: null };
    } catch (error) {
        console.error('Error retrieving provinces:', error);
        return { provinces: [], error };
    }
};

const findAndCountAll = async (filter, options, attribut = {}) => {
    try {
        const provinces = await paginate(Province, filter, options.pageIndex, options.pageSize, {
            ...options,
            limit: -1,
            sortBy: 'ProvinceName:asc',
            attributes: attribut,
        });

        return { provinces: provinces.rows, count: provinces.count, err: null };
    } catch (err) {
        console.error('Error retrieving provinces:', err);
        return { provinces: [], count: 0, err };
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
    findAndCountAll
};
