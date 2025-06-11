const Currency = require('../models/currency');

// Save a new currency
const save = async (data, options) => {
    try {
        const result = await Currency.create(data, options);
        return { result, err: null };
    } catch (err) {
        console.error('Repository Save Error:', err); // Log for debugging
        return { result: null, err };
    }
};

// Update an existing currency
const update = async (oid, data, options) => {
    try {
        const [affectedCount] = await Currency.update(data, {
            where: { oid },
            ...options,
        });

        if (affectedCount === 0) {
            return { result: null, err: new Error("No rows updated") };
        }
        const findOptions = { ...options };
        delete findOptions.transaction; // hapus props yang tidak valid utk findByPk kalau ada
        const updated = await Currency.findByPk(oid, findOptions);
        return { result: updated, err: null };
    } catch (err) {
        return { result: null, err };
    }
};

// Delete a currency by ID
const remove = async (id, options = {}) => {
    try {
        const result = await Currency.destroy({
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

// Get all currencys
const findAll = async (options = {}) => {
    try {
        const result = await Currency.findAll(options);
        return { result, err: null };
    } catch (err) {
        console.error('Repository findAll Error:', err);
        return { result: null, err };
    }
};

// Find currency by ID
const findById = async (oid, options = {}) => {
    try {
        // options bisa berisi { include, transaction, ... }
        const result = await Currency.findByPk(oid, options);
        return { result, err: null };
    } catch (err) {
        console.error('Error in findById:', err.message || err);
        return { result: null, err };
    }
}; 


// Find currencys by criteria with pagination
const findByCriteria = async (options = {}) => {
    try {
        const result = await Currency.findAll(options);
        return { result, err: null };
    } catch (err) {
        console.error('findByCriteria error:', err);
        return { result: [], err };
    }
};


// Find and count all with pagination 
const findAndCountByCriteria = async (findOptions) => {
    try {
        // @ts-ignore
        const result = await Currency.findAndCountAll(findOptions);

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
    remove,
    findAll,
    findById,
    findAndCountByCriteria,
    findByCriteria,
};
