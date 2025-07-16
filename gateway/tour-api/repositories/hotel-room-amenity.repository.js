const { Op } = require('sequelize');
const HotelRoomAmenity = require('../models/hotel-room-amenity');

// Save a new hotel-room
const save = async (data, options) => {
    try {
        const result = await HotelRoomAmenity.create(data, options);
        return { result, err: null };
    } catch (err) {
        console.error('Repository Save Error:', err);
        return { result: null, err };
    }
};

const saveMany = async (data, options) => {
    try {
        const result = await HotelRoomAmenity.bulkCreate(data, options);
        return { result, err: null };
    } catch (err) {
        console.error('Repository Save Error:', err);
        return { result: null, err };
    }
};

// Update an existing hotel-room
const update = async (oid, data, options) => {
    try {
        const [affectedCount] = await HotelRoomAmenity.update(data, {
            where: { oid },
            ...options,
        });

        if (affectedCount === 0) {
            return { result: null, err: new Error("No rows updated") };
        }

        const findOptions = { ...options };
        delete findOptions.transaction;

        const updated = await HotelRoomAmenity.findByPk(oid, findOptions);
        return { result: updated, err: null };
    } catch (err) {
        return { result: null, err };
    }
};

// Delete a hotel-room by ID
const remove = async (oid, options = {}) => {
    try {
        const result = await HotelRoomAmenity.destroy({
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

// Delete a hotel-room by ID
const removeByRoomOids = async (oids, options = {}) => {
    try {
        const result = await HotelRoomAmenity.destroy({
            where: {
                hotelRoomOid: {
                    [Op.in]: oids,   // gunakan Op.in agar bisa hapus banyak berdasarkan array oids
                },
            },
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
        const result = await HotelRoomAmenity.findAll(options);
        return { result, err: null };
    } catch (err) {
        console.error('Repository findAll Error:', err);
        return { result: null, err };
    }
};

// Find hotel-room by ID
const findById = async (oid, options = {}) => {
    try {
        const result = await HotelRoomAmenity.findByPk(oid, options);
        return { result, err: null };
    } catch (err) {
        console.error('Error in findById:', err.message || err);
        return { result: null, err };
    }
};

// Find hotel-rooms by criteria
const findByCriteria = async (options = {}) => {
    try {
        const result = await HotelRoomAmenity.findAll(options);
        return { result, err: null };
    } catch (err) {
        console.error('findByCriteria error:', err);
        return { result: [], err };
    }
};

// Find and count hotel-rooms
const findAndCountByCriteria = async (findOptions) => {
    try {
        const result = await HotelRoomAmenity.findAndCountAll(findOptions);
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
    saveMany,
    update,
    remove, removeByRoomOids,
    findAll,
    findById,
    findAndCountByCriteria,
    findByCriteria,
};
