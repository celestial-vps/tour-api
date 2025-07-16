const TravelSchedule = require('../models/travel-schedule');
 
const save = async (data, options) => {
    try {
        const result = await TravelSchedule.create(data, options);
        return { result, err: null };
    } catch (err) {
        console.error('Repository Save Error:', err);
        return { result: null, err };
    }
};
 
const update = async (oid, data, options) => {
    try {
        const [affectedCount] = await TravelSchedule.update(data, {
            where: { oid },
            ...options,
        });

        if (affectedCount === 0) {
            return { result: null, err: new Error("No rows updated") };
        }

        const findOptions = { ...options };
        delete findOptions.transaction;

        const updated = await TravelSchedule.findByPk(oid, findOptions);
        return { result: updated, err: null };
    } catch (err) {
        return { result: null, err };
    }
};
 
const remove = async (oid, options = {}) => {
    try {
        const result = await TravelSchedule.destroy({
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
 
const findAll = async (options = {}) => {
    try {
        const result = await TravelSchedule.findAll(options);
        return { result, err: null };
    } catch (err) {
        console.error('Repository findAll Error:', err);
        return { result: null, err };
    }
};
 
const findById = async (oid, options = {}) => {
    try {
        const result = await TravelSchedule.findByPk(oid, options);
        return { result, err: null };
    } catch (err) {
        console.error('Error in findById:', err.message || err);
        return { result: null, err };
    }
};
 
const findByCriteria = async (options = {}) => {
    try {
        const result = await TravelSchedule.findAll(options);
        return { result, err: null };
    } catch (err) {
        console.error('findByCriteria error:', err);
        return { result: [], err };
    }
};

const findAndCountByCriteria = async (findOptions) => {
    try {
        const result = await TravelSchedule.findAndCountAll(findOptions);
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
