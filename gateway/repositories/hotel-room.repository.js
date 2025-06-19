const HotelRoom = require('../models/hotel-room');

// Save a new hotel-room
const save = async (data, options) => {
    try {
        const result = await HotelRoom.create(data, options);
        return { result, err: null };
    } catch (err) {
        console.error('Repository Save Error:', err);
        return { result: null, err };
    }
};

// Update an existing hotel-room
const update = async (oid, data, options) => {
    try {
        const [affectedCount] = await HotelRoom.update(data, {
            where: { oid },
            ...options,
        });

        if (affectedCount === 0) {
            return { result: null, err: new Error("No rows updated") };
        }

        const findOptions = { ...options };
        delete findOptions.transaction;

        const updated = await HotelRoom.findByPk(oid, findOptions);
        return { result: updated, err: null };
    } catch (err) {
        return { result: null, err };
    }
};

// Delete a hotel-room by ID
const remove = async (id, options = {}) => {
    try {
        const result = await HotelRoom.destroy({
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

// Get all hotel-rooms
const findAll = async (options = {}) => {
    try {
        const result = await HotelRoom.findAll(options);
        return { result, err: null };
    } catch (err) {
        console.error('Repository findAll Error:', err);
        return { result: null, err };
    }
};

// Find hotel-room by ID
const findById = async (oid, options = {}) => {
    try {
        const result = await HotelRoom.findByPk(oid, options);
        return { result, err: null };
    } catch (err) {
        console.error('Error in findById:', err.message || err);
        return { result: null, err };
    }
};

// Find hotel-rooms by criteria
const findByCriteria = async (options = {}) => {
    try {
        const result = await HotelRoom.findAll(options);
        return { result, err: null };
    } catch (err) {
        console.error('findByCriteria error:', err);
        return { result: [], err };
    }
};

// Find and count hotel-rooms
const findAndCountByCriteria = async (findOptions) => {
    try {
        const result = await HotelRoom.findAndCountAll(findOptions);
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
