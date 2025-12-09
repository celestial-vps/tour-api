const mongoose = require('mongoose');
const ItemCategory = require('../models/item-category');
const ObjectId = mongoose.Types.ObjectId;

// ✅ Create
const save = async (itemCategoryData) => {
    try {
        const result = new ItemCategory(itemCategoryData);
        await result.save();
        return { result, error: null };
    } catch (err) {
        console.error('Error saving item category:', err);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to save item category' },
        };
    }
};

// ✅ Update
const update = async (oid, updateData) => {
    try {
        const result = await ItemCategory.findByIdAndUpdate(oid, updateData, {
            new: true,
            runValidators: true,
        });
        return { result, error: null };
    } catch (err) {
        console.error('Error updating item category:', err);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to update item category' },
        };
    }
};

// ✅ Delete
const deleted = async (oid) => {
    try {
        const result = await ItemCategory.deleteOne({ _id: oid });
        return { result, error: null };
    } catch (err) {
        console.error('Error deleting item category:', err);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to delete item category' },
        };
    }
};

// ✅ Find all
const findAll = async () => {
    try {
        const result = await ItemCategory.find();
        return { result, error: null };
    } catch (err) {
        console.error('Error retrieving item categories:', err);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to retrieve categories' },
        };
    }
};

// ✅ Find by ID with lookup to items
const findById = async (oid) => {
    try {
        const result = await ItemCategory.aggregate([
            // { $match: { _id: new ObjectId(oid) } },
            { $match: { _id: oid } },
            {
                $lookup: {
                    from: 'items', // Collection name (bukan model)
                    localField: '_id',
                    foreignField: 'itemCategoryOid',
                    as: 'items',
                },
            },
        ]);
        return { result: result[0] || null, error: null };
    } catch (err) {
        console.error('Error retrieving item category by ID:', err);
        return {
            result: null,
            error: { httpStatus: 500, message: 'Failed to retrieve category' },
        };
    }
};

// ✅ Find by criteria (pagination + filter langsung di DB)
const findByCriteria = async (filterCondition = {}, page = 1, pageSize = 10) => {
    try {
        const whereConditions = {};

        if (filterCondition.categoryName) {
            whereConditions.categoryName = {
                $regex: filterCondition.categoryName,
                $options: 'i',
            };
        }

        const result = await ItemCategory.find(whereConditions)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        return { result, error: null };
    } catch (err) {
        console.error('Error filtering item categories:', err);
        return {
            result: [],
            error: { httpStatus: 500, message: 'Failed to retrieve filtered data' },
        };
    }
};

// ✅ Count by criteria (langsung ke DB)
const findCountByCriteria = async (filterCondition = {}) => {
    try {
        const whereConditions = {};

        if (filterCondition.categoryName) {
            whereConditions.categoryName = {
                $regex: filterCondition.categoryName,
                $options: 'i',
            };
        }

        const count = await ItemCategory.countDocuments(whereConditions);
        return { count, error: null };
    } catch (err) {
        console.error('Error counting item categories:', err);
        return {
            count: 0,
            error: { httpStatus: 500, message: 'Failed to count filtered data' },
        };
    }
};

module.exports = {
    save,
    update,
    deleted,
    findAll,
    findById,
    findByCriteria,
    findCountByCriteria,
};
