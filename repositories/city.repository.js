const City = require('../models/city');
const { Op } = require('sequelize');

// Save a new city
const save = async (data, options = {}) => {
    try {
        const result = await City.create(data, options);
        return { result, err: null };
    } catch (err) {
        console.error('CityRepository Save Error:', err);
        return { result: null, err };
    }
};

// Update existing city
const update = async (oid, data, options) => {
    try {
        const [affected] = await City.update(data, {
            where: { oid },
            ...options,
        });

        if (affected === 0) {
            return { result: null, err: new Error('No rows updated') };
        }

        const findOptions = { ...options };
        delete findOptions.transaction;

        const updated = await City.findByPk(oid, findOptions);
        return { result: updated, err: null };
    } catch (err) {
        return { result: null, err };
    }
};

// Delete city (soft delete supported)
const deleted = async (oid, options = {}) => {
    try {
        const result = await City.destroy({
            where: { oid },
            transaction: options.transaction,
        });

        if (result <= 0) {
            return { result: null, err: new Error('Failed to delete record') };
        }

        return { result, err: null };
    } catch (err) {
        console.error('CityRepository Delete Error:', err);
        return { result: null, err };
    }
};

const findAll = async (options = {}) => {
    try {
        const result = await City.findAll(options);
        return { result, err: null };
    } catch (err) {
        return { result: null, err };
    }
};

const findById = async (oid, options = {}) => {
    try {
        const result = await City.findByPk(oid, options);
        return { result, err: null };
    } catch (err) {
        return { result: null, err };
    }
};

const findAndCountAll = async (findOptions) => {
    try {
        const result = await City.findAndCountAll(findOptions);
        return {
            data: result.rows,
            count: result.count,
            err: null,
        };
    } catch (err) {
        return {
            data: [],
            count: 0,
            err,
        };
    }
};

module.exports = {
    save,
    update,
    deleted,
    findAll,
    findById,
    findAndCountAll,
};
