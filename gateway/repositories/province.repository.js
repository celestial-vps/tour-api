const Province = require('../models/province');
const { Op } = require('sequelize');
const { paginate } = require('../misc/pagination');

// Save a new province
const save = async (data, options) => {
    try {
        const result = await Province.create(data, options);
        return { result, err: null };
    } catch (err) {
        console.error('Repository Save Error:', err); // Log for debugging
        return { result: null, err };
    }
};

// Update an existing province
const update = async (oid, data, options) => {
    try {
        const [affectedCount] = await Province.update(data, {
            where: { oid },
            ...options,
        });

        if (affectedCount === 0) {
            return { result: null, err: new Error("No rows updated") };
        }

        const findOptions = { ...options };
        delete findOptions.transaction; // hapus props yang tidak valid utk findByPk kalau ada

        const updated = await Province.findByPk(oid, findOptions);
        return { result: updated, err: null };
    } catch (err) {
        return { result: null, err };
    }
};

// Delete a province by ID
const deleted = async (id, options = {}) => {
    try {
        const result = await Province.destroy({
            where: { oid: id },
            transaction: options.transaction,
        });

        if (result <= 0) {
            return { result: null, err: new Error('Failed to delete record') };
        }

        return { result, err: null };
    } catch (err) {
        console.error('Repository Delete Error:', err);
        return { result: null, err };
    }
};

// Get all provinces
const findAll = async (options = {}) => {
    try {
        const result = await Province.findAll(options);
        return { result, err: null };
    } catch (err) {
        console.error('Repository findAll Error:', err);
        return { result: null, err };
    }
};

// Find province by ID
const findById = async (oid, options = {}) => {
    try {
        // options bisa berisi { include, transaction, ... }
        const result = await Province.findByPk(oid, options);
        return { result, err: null };
    } catch (err) {
        return { result: null, err };
    }
};

// Count provinces by criteria
const findCountByCriteria = async (where = {}) => {
    try {
        const count = await Province.count({ where });
        return { count, err: null };
    } catch (err) {
        console.error('Repository findCountByCriteria Error:', err);
        return { count: 0, err };
    }
};

// Find provinces by criteria
const findByCriteria = async (options = {}) => {
    try {
        const provinces = await Province.findAll(options);
        return { provinces, err: null };
    } catch (err) {
        console.error('findByCriteria error:', err);
        return { provinces: [], err };
    }
};

// Find and count all with pagination
const findAndCountAll = async (findOptions) => {
    try {
        const result = await Province.findAndCountAll(findOptions);

        return {
            data: result.rows,
            count: result.count,
            err: null,
        };
    } catch (err) {
        console.error('findAndCountWithOptions error:', err);
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
    findCountByCriteria,
    findByCriteria,
    findAndCountAll,
};
