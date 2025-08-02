const mongoose = require('mongoose');
const ItemCategory = require('../models/item-category');
const Image = require('../models/image-file');
const ObjectId = mongoose.Types.ObjectId;

const save = async (itemCategoryData) => {
    try {
        const result = new ItemCategory(itemCategoryData);
        await result.save();
        return { result, err: null }
    }
    catch (err) {
        return {
            result: null, err: {
                httpStatus: 500,
            }
        }
    }

};

const update = async (oid, updateData) => {
    try {
        const result = await ItemCategory.findOneAndUpdate({ _id: oid }, updateData, {
            new: true,
            runValidators: true,
        });
        return { result, err: null }
    } catch (err) {
        return {
            result: null, err: {
                httpStatus: 500,
            }
        }
    }
};

const deleted = async (oid) => {
    try {
        const result = await ItemCategory.deleteOne({ _id: oid }); // Use deleteOne to remove the document        
        return { result, err: null };
    } catch (err) {
        return {
            result: null, err: {
                httpStatus: 500,
            }
        };
    }

};

const findAll = async () => {
    try {
        const result = await ItemCategory.find();
        return { result, err: null }
    } catch (err) {
        return {
            result: null, err: {
                httpStatus: 500,
            }
        }
    }

};

const findByCriteria = async (filterCondition, page, pageSize) => {
    try {
        // Initialize the query with conditions
        const whereConditions = {};

        if (filterCondition.title) {
            whereConditions.title = {
                [Op.like]: `%${filterCondition.title}%`
            };
        }
        if (filterCondition.description) {
            whereConditions.description = {
                [Op.like]: `%${filterCondition.description}%`
            };
        }

        // Retrieve the paginated records
        const itemCategorys = await ItemCategory.find(whereConditions)
            .limit(pageSize) // Limit the number of records returned
            .skip((page - 1) * pageSize); // Skip the records for pagination

        const count = await ItemCategory.countDocuments(whereConditions); // Count total documents


        return { itemCategorys, error: null };
    } catch (err) {
        console.error('Error retrieving itemCategorys:', err);
        return {
            itemCategorys: [], err: {
                httpStatus: 500,
            }
        };
    }
};

const findCountByCriteria = async (filterCondition) => {
    try {
        // Initialize the query with conditions
        const whereConditions = {};

        if (filterCondition.title) {
            whereConditions.title = {
                [Op.like]: `%${filterCondition.title}%`
            };
        }
        if (filterCondition.description) {
            whereConditions.description = {
                [Op.like]: `%${filterCondition.description}%`
            };
        }

        // Retrieve the paginated records
        const count = await ItemCategory.countDocuments(whereConditions);

        return { count, error: null };
    } catch (error) {
        console.error('Error retrieving itemCategorys:', error);
        return {
            count: 0, err: {
                httpStatus: 500,
            }
        };
    }
};

const advanceFlter = async () => {
    try {
        const result = await ItemCategory.findAll();
        return { result, err: null }
    }
    catch (err) {
        return {
            result: null, err: {
                httpStatus: 500,
            }
        }
    }
};

const findById = async (oid) => {
    try {
        // const result = await ItemCategory.findOne({ _id: oid }).populate('items'); // Use findOne to find by the oid field
        const result = await ItemCategory.aggregate([
            {
                $match: { _id: new ObjectId(oid) }
            },
            {
                $lookup: {
                    from: 'items', // nama collection (bukan nama model!)
                    localField: '_id',
                    foreignField: 'itemCategoryOid',
                    as: 'items'
                }
            }
        ]);
        return { result: result[0], err: null };
    }
    catch (err) {
        return {
            result: null, err: {
                httpStatus: 500,
            }
        }
    }
};

module.exports = {
    save,
    update,
    deleted,
    findAll,
    findById,
    advanceFlter,
    findByCriteria,
    findCountByCriteria,
};