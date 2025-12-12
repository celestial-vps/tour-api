const Bid = require('../models/bid');

// ✅ Create
const save = async (bidData) => {
    try {
        const result = new Bid(bidData);
        await result.save();
        return { result, error: null };
    } catch (error) {
        console.error('Error saving bid:', error);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to save bid' },
        };
    }
};

// ✅ Update
const update = async (oid, updateData) => {
    try {
        const result = await Bid.findOneAndUpdate({ _id: oid }, updateData, {
            new: true,
            runValidators: true,
        });
        return { result, error: null };
    } catch (error) {
        console.error('Error updating bid:', error);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to update bid' },
        };
    }
};

// ✅ Delete
const deleted = async (oid) => {
    try {
        const result = await Bid.deleteOne({ _id: oid });
        return { result, error: null };
    } catch (error) {
        console.error('Error deleting bid:', error);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to delete bid' },
        };
    }
};

// ✅ Find all
const findAll = async () => {
    try {
        const result = await Bid.find().sort({ createdAt: -1 });
        return { result, error: null };
    } catch (error) {
        console.error('Error retrieving bids:', error);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to retrieve bids' },
        };
    }
};

// ✅ Find by ID
const findById = async (oid) => {
    try {
        const result = await Bid.findOne({ _id: oid });
        return { result, error: null };
    } catch (error) {
        console.error('Error retrieving bid by ID:', error);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to retrieve bid' },
        };
    }
};

// ✅ Find by criteria (pagination + filter)
const findByCriteria = async (filterCondition = {}, page = 1, pageSize = 10) => {
    try {
        const whereConditions = {};

        if (filterCondition.auctionId) {
            whereConditions.auctionId = {
                $regex: filterCondition.auctionId,
                $options: 'i',
            };
        }

        if (filterCondition.userId) {
            whereConditions.userId = {
                $regex: filterCondition.userId,
                $options: 'i',
            };
        }

        const result = await Bid.find(whereConditions)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        return { result, error: null };
    } catch (error) {
        console.error('Error filtering bids:', error);
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

        if (filterCondition.auctionId) {
            whereConditions.auctionId = {
                $regex: filterCondition.auctionId,
                $options: 'i',
            };
        }

        if (filterCondition.userId) {
            whereConditions.userId = {
                $regex: filterCondition.userId,
                $options: 'i',
            };
        }

        const count = await Bid.countDocuments(whereConditions);
        return { count, error: null };
    } catch (error) {
        console.error('Error counting bids:', error);
        return {
            count: 0,
            error: { httpStatus: 500, message: 'Failed to count filtered data' },
        };
    }
};

// ✅ Advance filter (placeholder or general query)
const advanceFilter = async () => {
    try {
        const result = await Bid.find();
        return { result, error: null };
    } catch (error) {
        console.error('Error retrieving bids (advance filter):', error);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to retrieve bids' },
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
