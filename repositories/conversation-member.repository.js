
const ConversationMember = require('../models/conversation-member');
const { Op } = require('sequelize');
const { paginate } = require('../misc/pagination');


const save = async (data, options) => {
    try {
        const result = await ConversationMember.create(data, options);
        return { result, err: null };
    } catch (err) {
        console.error('Repository Save Error:', err); // Log for debugging
        return { result: null, err };
    }
};

// Update an existing country
const update = async (oid, data, options) => {
    try {
        const [affectedCount] = await ConversationMember.update(data, {
            where: { oid },
            ...options,
        });

        if (affectedCount === 0) {
            return { result: null, err: new Error("No rows updated") };
        }
        const findOptions = { ...options };
        delete findOptions.transaction; // hapus props yang tidak valid utk findByPk kalau ada
        const updated = await ConversationMember.findByPk(oid, findOptions);
        return { result: updated, err: null };
    } catch (err) {
        return { result: null, err };
    }
};

const deleted = async (id, options = {}) => {
    try {
        const result = await ConversationMember.destroy({
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
        const result = await ConversationMember.findAll(options);
        return { result, err: null };
    } catch (err) {
        console.error('Repository findAll Error:', err);
        return { result: null, err };
    }
};
const findById = async (oid, options = {}) => {
    try {
        // options bisa berisi { include, transaction, ... }
        const result = await ConversationMember.findByPk(oid, options);
        return { result, err: null };
    } catch (err) {
        return { result: null, err };
    }
};


const findCountByCriteria = async (where = {}) => {
    try {
        const count = await ConversationMember.count({ where });
        return { count, err: null };
    } catch (err) {
        console.error('Repository findCountByCriteria Error:', err);
        return { count: 0, err };
    }
};


// Find countries by criteria with pagination
const findByCriteria = async (options = {}) => {
    try {
        const countries = await ConversationMember.findAll(options);
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
        const result = await ConversationMember.findAndCountAll(findOptions);

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
