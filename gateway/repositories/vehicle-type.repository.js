const VehicleType = require('../models/vehicle-type');

// Save a new vehicle-type
const save = async (data, options) => {
    try {
        const result = await VehicleType.create(data, options);
        return { result, err: null };
    } catch (err) {
        console.error('Repository Save Error:', err);
        return { result: null, err };
    }
};

// Update an existing vehicle-type
const update = async (oid, data, options) => {
    try {
        const [affectedCount] = await VehicleType.update(data, {
            where: { oid },
            ...options,
        });

        if (affectedCount === 0) {
            return { result: null, err: new Error("No rows updated") };
        }

        const findOptions = { ...options };
        delete findOptions.transaction;

        const updated = await VehicleType.findByPk(oid, findOptions);
        return { result: updated, err: null };
    } catch (err) {
        return { result: null, err };
    }
};

// Delete a vehicle-type by ID
const remove = async (oid, options = {}) => {
    try {
        const result = await VehicleType.destroy({
            where: { oid },
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

// Get all vehicle-types
const findAll = async (options = {}) => {
    try {
        const result = await VehicleType.findAll(options);
        return { result, err: null };
    } catch (err) {
        console.error('Repository findAll Error:', err);
        return { result: null, err };
    }
};

// Find vehicle-type by ID
const findById = async (oid, options = {}) => {
    try {
        const result = await VehicleType.findByPk(oid, options);
        return { result, err: null };
    } catch (err) {
        console.error('Error in findById:', err.message || err);
        return { result: null, err };
    }
};

// Find vehicle-types by criteria
const findByCriteria = async (options = {}) => {
    try {
        const result = await VehicleType.findAll(options);
        return { result, err: null };
    } catch (err) {
        console.error('findByCriteria error:', err);
        return { result: [], err };
    }
};

// Find and count vehicle-types
const findAndCountByCriteria = async (findOptions) => {
    try {
        const result = await VehicleType.findAndCountAll(findOptions);
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
