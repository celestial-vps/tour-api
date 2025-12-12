
const Item = require('../models/item');
const Image = require('../models/image-file');


const save = async (itemData) => {
    try {
        const result = new Item(itemData);
        await result.save();
        return { result, error: null }
    }
    catch (error) {
        return {
            result: null,
             error: { httpStatus: 500, message: 'Failed to save Item' },
        }
    }

};

const update = async (oid, updateData) => {
    try {
        const result = await Item.findOneAndUpdate({ _id: oid }, updateData, {
            new: true,
            runValidators: true,
        });
        return { result, error: null }
    } catch (error) {
        return {
            result: null, error: { httpStatus: 500, message: 'Failed to update item' },
        }
    }
};

const deleted = async (oid) => {
    try {
        const result = await Item.deleteOne({ _id: oid }); // Use deleteOne to remove the document        
        return { result, error: null };
    } catch (error) {
        return {
            result: null, error: {
                httpStatus: 500,
            }
        };
    }

};

const findAll = async () => {
    try {
        const result = await Item.find();
        return { result, error: null }
    } catch (error) {
        return {
            result: null,  error: { httpStatus: 500, message: 'Failed to delete item' },
        }
    }

};

const findByCriteria = async (filterCondition, page, pageSize) => {
    try {
        // Initialize the query with conditions
        const whereConditions = {};
        if (filterCondition.itemName) {
            whereConditions.itemName = {
                $regex: filterCondition.itemName,
                $options: 'i' // 'i' untuk case-insensitive
            };
        }

        // Retrieve the paginated records
        const items = await Item.find(whereConditions).populate('itemCategoryOid')
            .limit(pageSize) // Limit the number of records returned
            .skip((page - 1) * pageSize); // Skip the records for pagination

        const count = await Item.countDocuments(whereConditions); // Count total documents


        return { items, error: null };
    } catch (error) {
        console.error('Error retrieving items:', error);
        return {
            items: [],  error: { httpStatus: 500, message: 'Failed to delete item' },
        };
    }
};

const findCountByCriteria = async (filterCondition) => {
    try {
        // Initialize the query with conditions
        const whereConditions = {};
        if (filterCondition.itemName) {
            whereConditions.itemName = {
                $regex: filterCondition.itemName,
                $options: 'i' // 'i' untuk case-insensitive
            };
        }
        // Retrieve the paginated records
        const count = await Item.countDocuments(whereConditions);

        return { count, error: null };
    } catch (error) {
        console.error('Error retrieving items:', error);
        return {
            count: 0,  error: { httpStatus: 500, message: 'Failed to delete item' },
        };
    }
};

const advanceFlter = async () => {
    try {
        const result = await Item.find(); // ✅ yang benar
        return { result, error: null };
    } catch (error) {
        return {
            result: null,
            error: { httpStatus: 500 }
        };
    }
};

const findById = async (oid) => {
    try {
        const result = await Item.findOne({ _id: oid }).populate('imageOid'); // Use findOne to find by the oid field
        return { result, error: null };
    }
    catch (error) {
        return {
            result: null,  error: { httpStatus: 500, message: 'Failed to delete item' },
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