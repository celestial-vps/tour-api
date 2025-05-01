// repositories/bankRepository.js
// const { result } = require('lodash');
const Bank = require('../models/Bank'); // Import the default export
const { Op } = require('sequelize');
const models = require('../models'); // Ensure you're importing the models correctly

const save = async (data, options) => {
    try {
        const result = await models.Bank.create(data, options);
        return { result, err: null }
    }
    catch (err) {
        return { result: null, err }
    }

};

const update = async (oid, data,options) => {
    try {
        const result = await models.Bank.update(data, {
            where: { oid } // Assuming 'id' is the primary key or identifier
        },options);

        return { result, err: null }
    } catch (err) {
        return { result: null, err }
    }
};

const deleted = async ( oid,options) => {
    try {
        const deleteResult = await models.Bank.destroy({
            where: {
                oid: oid // Replace 'id' with the actual primary key field if different
            }
        },options);
        if (deleteResult !== 0) {
            return { result: deleteResult, err: null }; // Return the deleted product
        } else {
            return {
                result: null,
                err: {
                    message: "Failed to delete record"
                }
            };
        }
        // const result = await Bank.findByPk(oid);
        // if (result) {
        //     await result.destroy();
        //     return { result, err: null }
        // } else {
        //     return {
        //         err: {
        //             message: "Data Not Found"
        //         }
        //     }
        // }

    } catch (err) {
        return { result: null, err }
    }

};

const findAll = async () => {
    try {
        const result = await models.Bank.findAll();
        return { result, err: null }
    } catch (err) {
        return { result: null, err }
    }

};

const findById = async (oid) => {
    try {
        const result = await models.Bank.findByPk(oid);
        return { result, err: null }
    }
    catch (err) {
        return { result: null, err }
    }
};

const advanceFlter = async () => {
    try {
        const result = await models.Bank.findAll();
        return { result, err: null }
    }
    catch (err) {
        return { result: null, err }
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
        const count = await models.Bank.count({
            where: whereConditions
        });

        return { count, error: null };
    } catch (error) {
        console.error('Error retrieving banks:', error);
        return { count: 0, error };
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
        const banks = await models.Bank.findAll({
            where: whereConditions,
            limit: pageSize,
            offset: (page - 1) * pageSize
        });

        return { banks, error: null };
    } catch (error) {
        console.error('Error retrieving banks:', error);
        return { banks: [], error };
    }
};



module.exports = {
    save,
    update,
    deleted,
    findAll,
    findById,
    advanceFlter,
    findCountByCriteria,
    findByCriteria,    
};
