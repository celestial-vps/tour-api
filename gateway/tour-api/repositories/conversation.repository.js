const Conversation = require('../models/conversation');

const create = async (payload, transaction = null) => {
    return await Conversation.create(payload, { transaction });
};

const update = async (oid, payload, transaction = null) => {
    const [updatedCount, [updatedConversation]] = await Conversation.update(payload, {
        where: { oid },
        returning: true,
        transaction,
    });

    return updatedCount ? updatedConversation : null;
};

const deleted = async (oid, transaction = null) => {
    const conversation = await Conversation.findByPk(oid);
    if (!conversation) return null;

    await Conversation.destroy({ where: { oid }, transaction });
    return conversation;
};
 


// Get all countries
const findAll = async (options = {}) => {
    try {
        const result = await Conversation.findAll(options);
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
        const result = await Conversation.findByPk(oid, options);
        return { result, err: null };
    } catch (err) {
        return { result: null, err };
    }
};
 
// Count countries by criteria
const findCountByCriteria = async (where = {}) => {
    try {
        const count = await Conversation.count({ where });
        return { count, err: null };
    } catch (err) {
        console.error('Repository findCountByCriteria Error:', err);
        return { count: 0, err };
    }
};


// Find countries by criteria with pagination
const findByCriteria = async (options = {}) => {
    try {
        const countries = await Conversation.findAll(options);
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
        const result = await Conversation.findAndCountAll(findOptions);

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
    create,
    update,
    deleted,
    findAll,
    findById,
    findCountByCriteria,
    findByCriteria,
    findAndCountAll
};
