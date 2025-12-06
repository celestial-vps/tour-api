const Bidder = require('../models/bidder');

// ✅ Create
const save = async (bidderData) => {
    try {
        const result = new Bidder(bidderData);
        await result.save();
        return { result, error: null };
    } catch (err) {
        console.error('Error saving bidder:', err);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to save bidder' },
        };
    }
};

// ✅ Update
const update = async (oid, updateData) => {
    try {
        const result = await Bidder.findOneAndUpdate({ _id: oid }, updateData, {
            new: true,
            runValidators: true,
        });
        return { result, error: null };
    } catch (err) {
        console.error('Error updating bidder:', err);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to update bidder' },
        };
    }
};

// ✅ Delete
const deleted = async (oid) => {
    try {
        const result = await Bidder.deleteOne({ _id: oid });
        return { result, error: null };
    } catch (err) {
        console.error('Error deleting bidder:', err);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to delete bidder' },
        };
    }
};

// ✅ Find all
const findAll = async () => {
    try {
        const result = await Bidder.find().sort({ createdAt: -1 });
        return { result, error: null };
    } catch (err) {
        console.error('Error retrieving bidders:', err);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to retrieve bidders' },
        };
    }
};

// ✅ Find by ID
const findById = async (oid) => {
    try {
        const result = await Bidder.findOne({ _id: oid });
        return { result, error: null };
    } catch (err) {
        console.error('Error retrieving bidder by ID:', err);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to retrieve bidder' },
        };
    }
};

// ✅ Find by criteria (pagination + filter)
const findByCriteria = async (filterCondition = {}, page = 1, pageSize = 10) => {
    try {
        const whereConditions = {};

        if (filterCondition.bidderCode) {
            whereConditions.bidderCode = {
                $regex: filterCondition.bidderCode,
                $options: 'i',
            };
        }

        if (filterCondition.bidderName) {
            whereConditions.bidderName = {
                $regex: filterCondition.bidderName,
                $options: 'i',
            };
        }

        const result = await Bidder.find(whereConditions)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        return { result, error: null };
    } catch (err) {
        console.error('Error filtering bidders:', err);
        return {
            result: [],
            error: { httpStatus: 500, message: 'Failed to retrieve filtered data' },
        };
    }
};

// ✅ Count by criteria
const findCountByCriteria = async (filterCondition = {}) => {
    try {
        const whereConditions = {};

        if (filterCondition.bidderCode) {
            whereConditions.bidderCode = {
                $regex: filterCondition.bidderCode,
                $options: 'i',
            };
        }

        if (filterCondition.bidderName) {
            whereConditions.bidderName = {
                $regex: filterCondition.bidderName,
                $options: 'i',
            };
        }

        const count = await Bidder.countDocuments(whereConditions);
        return { count, error: null };
    } catch (err) {
        console.error('Error counting bidders:', err);
        return {
            count: 0,
            error: { httpStatus: 500, message: 'Failed to count filtered data' },
        };
    }
};

// ✅ Advance filter (placeholder or general query)
const advanceFilter = async () => {
    try {
        const result = await Bidder.find();
        return { result, error: null };
    } catch (err) {
        console.error('Error retrieving bidders (advance filter):', err);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to retrieve bidders' },
        };
    }
};

module.exports = {
    save,
    update,
    deleted,
    findAll,
    findById,
    advanceFilter,
    findByCriteria,
    findCountByCriteria,
};
