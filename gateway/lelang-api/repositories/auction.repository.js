const Auction = require('../models/auction');

// ✅ Create
const save = async (auctionData) => {
    try {
        const result = new Auction(auctionData);
        await result.save();
        return { result, error: null };
    } catch (err) {
        console.error('Error saving auction:', err);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to save auction' },
        };
    }
};

// ✅ Update
const update = async (oid, updateData) => {
    try {
        const result = await Auction.findOneAndUpdate({ _id: oid }, updateData, {
            new: true,
            runValidators: true,
        });
        return { result, error: null };
    } catch (err) {
        console.error('Error updating auction:', err);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to update auction' },
        };
    }
};

// ✅ Delete
const deleted = async (oid) => {
    try {
        const result = await Auction.deleteOne({ _id: oid });
        return { result, error: null };
    } catch (err) {
        console.error('Error deleting auction:', err);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to delete auction' },
        };
    }
};

// ✅ Find all
const findAll = async () => {
    try {
        const result = await Auction.find().sort({ createdAt: -1 });
        return { result, error: null };
    } catch (err) {
        console.error('Error retrieving auctions:', err);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to retrieve auctions' },
        };
    }
};

// ✅ Find by ID
const findById = async (oid) => {
    try {
        const result = await Auction.findOne({ _id: oid }).populate('itemOid');
        return { result, error: null };
    } catch (err) {
        console.error('Error retrieving auction by ID:', err);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to retrieve auction' },
        };
    }
};

// ✅ Find by criteria
const findByCriteria = async (filterCondition = {}, page = 1, pageSize = 10) => {
    try {
        const whereConditions = {};

        const itemCategoryMatch = {};
        if (filterCondition.categoryName) {
            itemCategoryMatch.categoryName = {
                $regex: filterCondition.categoryName,
                $options: 'i',
            };
        }

        const result = await Auction.find(whereConditions)
            .populate({
                path: 'itemOid',
                populate: {
                    path: 'itemCategoryOid',
                    model: 'ItemCategory',
                    match: itemCategoryMatch,
                },
            })
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        return { result, error: null };
    } catch (err) {
        console.error('Error filtering auctions:', err);
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

        if (filterCondition.startTime) {
            whereConditions.startTime = {
                $eq: filterCondition.startTime,
            };
        }

        if (filterCondition.endTime) {
            whereConditions.endTime = {
                $eq: filterCondition.endTime,
            };
        }

        const count = await Auction.countDocuments(whereConditions);
        return { count, error: null };
    } catch (err) {
        console.error('Error counting auctions:', err);
        return {
            count: 0,
            error: { httpStatus: 500, message: 'Failed to count auctions' },
        };
    }
};

// ✅ Advance filter (fallback to all)
const advanceFilter = async () => {
    try {
        const result = await Auction.find();
        return { result, error: null };
    } catch (err) {
        console.error('Error retrieving auctions (advanceFilter):', err);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to retrieve auctions' },
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
