
const Bank = require('../models/bank');


const save = async (bankData) => {
    try {
        const result = new Bank(bankData);
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
        const result = await Bank.findOneAndUpdate({ _id: oid }, updateData, {
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
        const result = await Bank.deleteOne({ _id: oid }); // Use deleteOne to remove the document        
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
        const result = await Bank.find();
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

        if (filterCondition.bankCode) {
            whereConditions.bankCode = {
                [Op.like]: `%${filterCondition.bankCode}%`
            };
        }
        if (filterCondition.bankName) {
            whereConditions.bankName = {
                [Op.like]: `%${filterCondition.bankName}%`
            };
        }

        // Retrieve the paginated records
        const banks = await Bank.find(whereConditions)
            .limit(pageSize) // Limit the number of records returned
            .skip((page - 1) * pageSize); // Skip the records for pagination

        const count = await Bank.countDocuments(whereConditions); // Count total documents


        return { banks, error: null };
    } catch (err) {
        console.error('Error retrieving banks:', err);
        return {
            banks: [], err: {
                httpStatus: 500,
            }
        };
    }
};

const findCountByCriteria = async (filterCondition) => {
    try {
        // Initialize the query with conditions
        const whereConditions = {};

        if (filterCondition.bankCode) {
            whereConditions.bankCode = {
                [Op.like]: `%${filterCondition.bankCode}%`
            };
        }
        if (filterCondition.bankName) {
            whereConditions.bankName = {
                [Op.like]: `%${filterCondition.bankName}%`
            };
        }

        // Retrieve the paginated records
        const count = await Bank.countDocuments(whereConditions);

        return { count, error: null };
    } catch (error) {
        console.error('Error retrieving banks:', error);
        return {
            count: 0, err: {
                httpStatus: 500,
            }
        };
    }
};

const advanceFlter = async () => {
    try {
        const result = await Bank.findAll();
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
        const result = await Bank.findOne({ _id: oid }); // Use findOne to find by the oid field
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