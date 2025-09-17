
const Item = require('../models/item');
const Image = require('../models/image-file');


const save = async (itemData) => {
    try {
        const result = new Item(itemData);
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
        const result = await Item.findOneAndUpdate({ _id: oid }, updateData, {
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
        const result = await Item.deleteOne({ _id: oid }); // Use deleteOne to remove the document        
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
        const result = await Item.find();
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
        if (filterCondition.itemName) {
            whereConditions.itemName = {
                $regex: filterCondition.itemName,
                $options: 'i' // 'i' untuk case-insensitive
            };
        }

        // Retrieve the paginated records
        const items = await Item.find(whereConditions).populate('imageOid').populate('itemCategoryOid')
            .limit(pageSize) // Limit the number of records returned
            .skip((page - 1) * pageSize); // Skip the records for pagination

        const count = await Item.countDocuments(whereConditions); // Count total documents


        return { items, error: null };
    } catch (err) {
        console.error('Error retrieving items:', err);
        return {
            items: [], err: {
                httpStatus: 500,
            }
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
            count: 0, err: {
                httpStatus: 500,
            }
        };
    }
};

const advanceFlter = async () => {
    try {
        const result = await Item.find(); // ✅ yang benar
        return { result, err: null };
    } catch (err) {
        return {
            result: null,
            err: { httpStatus: 500 }
        };
    }
};

const findById = async (oid) => {
    try {
        const result = await Item.findOne({ _id: oid }).populate('imageOid'); // Use findOne to find by the oid field
        return { result, err: null };
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