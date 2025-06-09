const Country = require('../models/country');
const { Op } = require('sequelize');
const { paginate } = require('../misc/pagination');

// Save a new country
const save = async (data, options) => {
    try {
        const result = await Country.create(data, options);
        return { result, err: null };
    } catch (err) {
        return { result: null, err };
    }
};

// Update an existing country
const update = async (oid, data, options) => {
    try {
        const result = await Country.update(data, {
            where: { oid },
            ...options,
        });
        return { result, err: null };
    } catch (err) {
        return { result: null, err };
    }
};

// Delete a country by ID
const deleted = async (id) => {
    try {
        const result = await Country.destroy({ where: { oid: id } });
        if (result <= 0) {
            return { result: null, err: new Error('Failed to delete record') };
        }
        return { result, err: null };
    } catch (error) {
        return { result: null, err: error?.message ?? String(error) };
    }
};

// Get all countries
const findAll = async (include = []) => {
    try {
        const result = await Country.findAll({ include });
        return { result, err: null };
    } catch (err) {
        return { result: null, err };
    }
};

// Find country by ID
const findById = async (oid, include = []) => {
    try {
        const result = await Country.findByPk(oid, { include });
        return { result, err: null };
    } catch (err) {
        return { result: null, err };
    }
};

// Placeholder for advanced filtering (currently same as findAll)
const advanceFlter = async (include = []) => {
    try {
        const result = await Country.findAll({ include });
        return { result, err: null };
    } catch (err) {
        return { result: null, err };
    }
};

// Count countries by criteria
const findCountByCriteria = async (where = {}) => {
    try {
        const count = await Country.count({ where });
        return { count, error: null };
    } catch (error) {
        return { count: 0, error: error };
    }
};


// Find countries by criteria with pagination
const findByCriteria = async (where = {}, page = 1, pageSize = 10, include = []) => {
    try {
        const countries = await Country.findAll({
            where,
            include,
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: [['countryName', 'ASC']],
        });

        return { countries, error: null };
    } catch (error) {
        return { countries: [], error };
    }
};

// Find and count all with pagination
const findAndCountAll = async (filter, options, attribut = {}) => {
    try {
        const countries = await paginate(
            Country,
            filter,
            options.pageIndex,
            options.pageSize,
            {
                ...options,
                limit: -1,
                sortBy: 'countryName:asc',
                attributes: attribut,
            }
        );

        return { countries: countries.rows, count: countries.count, err: null };
    } catch (err) {
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
