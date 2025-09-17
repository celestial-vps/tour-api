const Bank = require('../models/bank');

// ✅ Create
const save = async (bankData) => {
    try {
        const result = new Bank(bankData);
        await result.save();
        return { result, error: null };
    } catch (err) {
        console.error('Error saving bank:', err);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to save bank' },
        };
    }
};

// ✅ Update
const update = async (oid, updateData) => {
    try {
        const result = await Bank.findOneAndUpdate({ _id: oid }, updateData, {
            new: true,
            runValidators: true,
        });
        return { result, error: null };
    } catch (err) {
        console.error('Error updating bank:', err);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to update bank' },
        };
    }
};

// ✅ Delete
const deleted = async (oid) => {
    try {
        const result = await Bank.deleteOne({ _id: oid });
        return { result, error: null };
    } catch (err) {
        console.error('Error deleting bank:', err);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to delete bank' },
        };
    }
};

// ✅ Find all
const findAll = async () => {
    try {
        const result = await Bank.find().sort({ createdAt: -1 });
        return { result, error: null };
    } catch (err) {
        console.error('Error retrieving banks:', err);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to retrieve banks' },
        };
    }
};

// ✅ Find by ID
const findById = async (oid) => {
    try {
        const result = await Bank.findOne({ _id: oid });
        return { result, error: null };
    } catch (err) {
        console.error('Error retrieving bank by ID:', err);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to retrieve bank' },
        };
    }
};

// ✅ Find by criteria (pagination + filter)
const findByCriteria = async (filterCondition = {}, page = 1, pageSize = 10) => {
    try {
        const whereConditions = {};

        if (filterCondition.bankCode) {
            whereConditions.bankCode = {
                $regex: filterCondition.bankCode,
                $options: 'i',
            };
        }

        if (filterCondition.bankName) {
            whereConditions.bankName = {
                $regex: filterCondition.bankName,
                $options: 'i',
            };
        }

        const result = await Bank.find(whereConditions)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        return { result, error: null };
    } catch (err) {
        console.error('Error filtering banks:', err);
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

        if (filterCondition.bankCode) {
            whereConditions.bankCode = {
                $regex: filterCondition.bankCode,
                $options: 'i',
            };
        }

        if (filterCondition.bankName) {
            whereConditions.bankName = {
                $regex: filterCondition.bankName,
                $options: 'i',
            };
        }

        const count = await Bank.countDocuments(whereConditions);
        return { count, error: null };
    } catch (err) {
        console.error('Error counting banks:', err);
        return {
            count: 0,
            error: { httpStatus: 500, message: 'Failed to count filtered data' },
        };
    }
};

// ✅ Advance filter (placeholder or general query)
const advanceFilter = async () => {
    try {
        const result = await Bank.find();
        return { result, error: null };
    } catch (err) {
        console.error('Error retrieving banks (advance filter):', err);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to retrieve banks' },
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
