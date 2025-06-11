const Bank = require('../models/bank');

// Save a new bank
const save = async (data, options) => {
    try {
        const result = await Bank.create(data, options);
        return { result, err: null };
    } catch (err) {
        console.error('Repository Save Error:', err); // Log for debugging
        return { result: null, err };
    }
};

// Update an existing bank
const update = async (oid, data, options) => {
    try {
        const [affectedCount] = await Bank.update(data, {
            where: { oid },
            ...options,
        });

        if (affectedCount === 0) {
            return { result: null, err: new Error("No rows updated") };
        }
        const findOptions = { ...options };
        delete findOptions.transaction; // hapus props yang tidak valid utk findByPk kalau ada
        const updated = await Bank.findByPk(oid, findOptions);
        return { result: updated, err: null };
    } catch (err) {
        return { result: null, err };
    }
};

// Delete a bank by ID
const remove = async (id, options = {}) => {
    try {
        const result = await Bank.destroy({
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

// Get all banks
const findAll = async (options = {}) => {
    try {
        const result = await Bank.findAll(options);
        return { result, err: null };
    } catch (err) {
        console.error('Repository findAll Error:', err);
        return { result: null, err };
    }
};

// Find bank by ID
const findById = async (oid, options = {}) => {
    try {
        // options bisa berisi { include, transaction, ... }
        const result = await Bank.findByPk(oid, options);
        return { result, err: null };
    } catch (err) {
        console.error('Error in findById:', err.message || err);
        return { result: null, err };
    }
};


// // Count banks by criteria
// const findCountByCriteria = async (where = {}) => {
//     try {
//         const count = await Bank.count({ where });
//         return { count, err: null };
//     } catch (err) {
//         console.error('Repository findCountByCriteria Error:', err);
//         return { count: 0, err };
//     }
// };


// Find banks by criteria with pagination
const findByCriteria = async (options = {}) => {
    try {
        const result = await Bank.findAll(options);
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
        const result = await Bank.findAndCountAll(findOptions);

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
