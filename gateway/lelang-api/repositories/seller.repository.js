const Seller = require('../models/seller');

// ✅ Create
const save = async (sellerData) => {
    try {
        const result = new Seller(sellerData);
        await result.save();
        return { result, error: null };
    } catch (error) {
        console.error('Error saving seller:', error);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to save seller' },
        };
    }
};

// ✅ Update
const update = async (oid, updateData) => {
    try {
        const result = await Seller.findOneAndUpdate({ _id: oid }, updateData, {
            new: true,
            runValidators: true,
        });
        return { result, error: null };
    } catch (error) {
        console.error('Error updating seller:', error);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to update seller' },
        };
    }
};

// ✅ Delete
const deleted = async (oid) => {
    try {
        const result = await Seller.deleteOne({ _id: oid });
        return { result, error: null };
    } catch (error) {
        console.error('Error deleting seller:', error);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to delete seller' },
        };
    }
};

// ✅ Find all
const findAll = async () => {
    try {
        const result = await Seller.find().sort({ createdAt: -1 });
        return { result, error: null };
    } catch (error) {
        console.error('Error retrieving sellers:', error);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to retrieve sellers' },
        };
    }
};

// ✅ Find by ID
const findById = async (oid) => {
    try {
        const result = await Seller.findOne({ _id: oid });
        return { result, error: null };
    } catch (error) {
        console.error('Error retrieving seller by ID:', error);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to retrieve seller' },
        };
    }
};

// ✅ Find by criteria (pagination + filter)
const findByCriteria = async (filterCondition = {}, page = 1, pageSize = 10) => {
    try {
        const whereConditions = {};

        if (filterCondition.sellerCode) {
            whereConditions.sellerCode = {
                $regex: filterCondition.sellerCode,
                $options: 'i',
            };
        }

        if (filterCondition.sellerName) {
            whereConditions.sellerName = {
                $regex: filterCondition.sellerName,
                $options: 'i',
            };
        }

        const result = await Seller.find(whereConditions)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        return { result, error: null };
    } catch (error) {
        console.error('Error filtering sellers:', error);
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

        if (filterCondition.sellerCode) {
            whereConditions.sellerCode = {
                $regex: filterCondition.sellerCode,
                $options: 'i',
            };
        }

        if (filterCondition.sellerName) {
            whereConditions.sellerName = {
                $regex: filterCondition.sellerName,
                $options: 'i',
            };
        }

        const count = await Seller.countDocuments(whereConditions);
        return { count, error: null };
    } catch (error) {
        console.error('Error counting sellers:', error);
        return {
            count: 0,
            error: { httpStatus: 500, message: 'Failed to count filtered data' },
        };
    }
};

// ✅ Advance filter (placeholder or general query)
const advanceFilter = async () => {
    try {
        const result = await Seller.find();
        return { result, error: null };
    } catch (error) {
        console.error('Error retrieving sellers (advance filter):', error);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to retrieve sellers' },
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
