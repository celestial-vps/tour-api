// repositories/countryRepository.js
// const { result } = require('lodash');
const Country = require('../models/country'); // Import the default export
const { Op } = require('sequelize');
const models = require('../models'); // Ensure you're importing the models correctly
const { paginate } = require('../misc/paggination')


const save = async (data, options) => {
    try {
        const result = await models.Country.create(data, options);
        return { result, err: null }
    }
    catch (err) {
        return { result: null, err }
    }

};

const update = async (oid, data, options) => {
    try {
        const result = await models.Country.update(data, {
            where: { oid } // Assuming 'id' is the primary key or identifier
        }, options);

        return { result, err: null }
    } catch (err) {
        return { result: null, err }
    }
};

const deleted = async (oid, options) => {
    try {
        const deleteResult = await models.Country.destroy({
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
        // const result = await Country.findByPk(oid);
        // if (result) {
        //     await result.destroy();
        //     return { result, err: null }
        // } else {
        //     return {
        //         err: {
        //             message: "Data Not Found"
        //         }
        //     }
        // }

    } catch (err) {
        return { result: null, err }
    }

};

const findAll = async () => {
    try {
        const result = await models.Country.findAll();
        return { result, err: null }
    } catch (err) {
        return { result: null, err }
    }

};

const findById = async (oid) => {
    try {
        const result = await models.Country.findByPk(oid);
        return { result, err: null }
    }
    catch (err) {
        return { result: null, err }
    }
};

const advanceFlter = async () => {
    try {
        const result = await models.Country.findAll();
        return { result, err: null }
    }
    catch (err) {
        return { result: null, err }
    }
};

const findCountByCriteria = async (where = {}) => {
    try {
        const count = await Country.count({ where });
        return { count, error: null };

    } catch (error) {
        console.error('Error counting countries:', error);
        return { count: 0, error: error.message };
    }
};

const findByCriteria = async (where = {}, page, pageSize) => {
    try {
        const whereConditions = Object.entries(filterCondition).reduce((acc, [key, value]) => {
            if (value) acc[key] = { [Op.like]: `%${value}%` };
            return acc;
        }, {});

        const countries = await Country.findAll({
            where,
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: [['countryName', 'ASC']],
        });

        return { countries, error: null };
    } catch (error) {
        console.error('Error retrieving countries:', error);
        return { countries: [], error };
    }
};

const findAndCountAll = async (filter, options, attribut = {}) => {
    try {
        const countries = await paginate(Country, filter, options.pageIndex, options.pageSize, {
            ...options,
            limit: -1,
            sortBy: 'countryName:asc',
            attributes: attribut,
        });

        return { countries: countries.rows, count: countries.count, err: null };
    } catch (err) {
        console.error('Error retrieving countries:', err);
        return { countries: [], count: 0, err };
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
