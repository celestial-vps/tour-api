const Message = require('../models/message');
const { Op } = require('sequelize');
const { paginate } = require('../misc/pagination');

const save = async (data, options) => {
    try {
        const result = await Message.create(data, options);
        return { result, err: null };
    } catch (err) {
        console.error('Repository Save Error:', err); // Log for debugging
        return { result: null, err };
    }
};


const update = async (oid, data, options) => {
    try {
        const [affectedCount] = await Message.update(data, {
            where: { oid },
            ...options,
        });

        if (affectedCount === 0) {
            return { result: null, err: new Error("No rows updated") };
        }
        const findOptions = { ...options };
        delete findOptions.transaction; // hapus props yang tidak valid utk findByPk kalau ada
        const updated = await Message.findByPk(oid, findOptions);
        return { result: updated, err: null };
    } catch (err) {
        return { result: null, err };
    }
};


const deleted = async (id, options = {}) => {
    try {
        const result = await Message.destroy({
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

const findAll = async (options = {}) => {
    try {
        const result = await Message.findAll(options);
        return { result, err: null };
    } catch (err) {
        console.error('Repository findAll Error:', err);
        return { result: null, err };
    }
};

// Find country by ID
const findById = async (oid, options = {}) => {
    try {
        // options bisa berisi { include, transaction, ... }
        const result = await Message.findByPk(oid, options);
        return { result, err: null };
    } catch (err) {
        return { result: null, err };
    }
};


const findCountByCriteria = async (where = {}) => {
    try {
        const count = await Message.count({ where });
        return { count, err: null };
    } catch (err) {
        console.error('Repository findCountByCriteria Error:', err);
        return { count: 0, err };
    }
};


// Find countries by criteria with pagination
const findByCriteria = async (options = {}) => {
    try {
        const countries = await Message.findAll(options);
        return { countries, err: null };
    } catch (err) {
        console.error('findByCriteria error:', err);
        return { countries: [], err };
    }
};


// Find and count all with pagination
const findAndCountAll = async (findOptions) => {
    try {
        // @ts-ignore
        const result = await Message.findAndCountAll(findOptions);

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
    findAndCountAll
};
