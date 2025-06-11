const Country = require('../models/country');

// Save a new country
const save = async (data, options) => {
    try {
        const result = await Country.create(data, options);
        return { result, err: null };
    } catch (err) {
        console.error('Repository Save Error:', err); // Log for debugging
        return { result: null, err };
    }
};

// Update an existing country
const update = async (oid, data, options) => {
    try {
        const [affectedCount] = await Country.update(data, {
            where: { oid },
            ...options,
        });

        if (affectedCount === 0) {
            return { result: null, err: new Error("No rows updated") };
        }
        const findOptions = { ...options };
        delete findOptions.transaction; // hapus props yang tidak valid utk findByPk kalau ada
        const updated = await Country.findByPk(oid, findOptions);
        return { result: updated, err: null };
    } catch (err) {
        return { result: null, err };
    }
};

// Delete a country by ID
const deleted = async (id, options = {}) => {
    try {
        const result = await Country.destroy({
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

// Get all countries
const findAll = async (options = {}) => {
    try {
        const result = await Country.findAll(options);
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
        const result = await Country.findByPk(oid, options);
        return { result, err: null };
    } catch (err) {
        return { result: null, err };
    }
};


// // Placeholder for advanced filtering (currently same as findAll)
// const advanceFilter = async (include = []) => {
//     try {
//         const result = await Country.findAll({ include });
//         return { result, err: null };
//     } catch (err) {
//         console.error('Repository advancedFilter Error:', err);
//         return { result: null, err };
//     }
// };

// Count countries by criteria
const findCountByCriteria = async (where = {}) => {
    try {
        const count = await Country.count({ where });
        return { count, err: null };
    } catch (err) {
        console.error('Repository findCountByCriteria Error:', err);
        return { count: 0, err };
    }
};


// Find countries by criteria with pagination
const findByCriteria = async (options = {}) => {
    try {
        const countries = await Country.findAll(options);
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
        const result = await Country.findAndCountAll(findOptions);

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
    // advanceFilter,
    findCountByCriteria,
    findByCriteria,
    findAndCountAll
};
