
// const { result } = require('lodash');
const UserRole = require('../models/user-role'); // Import the default export
const { Op } = require('sequelize');
const models = require('../models'); // Ensure you're importing the models correctly

const save = async (data, options) => {
    try {
        const result = await models.UserRole.create(data, options);
        return { result, err: null }
    }
    catch (err) {
        return { result: null, err }
    }

};

const update = async (oid, data, options) => {
    try {
        const result = await models.UserRole.update(data, {
            where: { oid } // Assuming 'id' is the primary key or identifier
        }, options);

        return { result, err: null }
    } catch (err) {
        return { result: null, err }
    }
};

const deleted = async (oid, options) => {
    try {
        const deleteResult = await models.UserRole.destroy({
            where: {
                oid: oid // Replace 'id' with the actual primary key field if different
            }
        }, options);
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
    } catch (err) {
        return { result: null, err }
    }

};

const findAll = async () => {
    try {
        const result = await models.UserRole.findAll();
        return { result, err: null }
    } catch (err) {
        return { result: null, err }
    }

};

const findById = async (oid) => {
    try {
        const result = await models.UserRole.findByPk(oid);
        return { result, err: null }
    }
    catch (err) {
        return { result: null, err }
    }
};


const advanceFlter = async () => {
    try {
        const result = await models.UserRole.findAll();
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

        if (filterCondition.userRoleCode) {
            whereConditions.userRoleCode = {
                [Op.like]: `%${filterCondition.userRoleCode}%`
            };
        }
        if (filterCondition.userRoleName) {
            whereConditions.userRoleName = {
                [Op.like]: `%${filterCondition.userRoleName}%`
            };
        }

        // Retrieve the paginated records
        const count = await models.UserRole.count({
            where: whereConditions
        });

        return { count, error: null };
    } catch (error) {
        console.error('Error retrieving userRoles:', error);
        return { count: 0, error };
    }
};

const findByCriteria = async (filterCondition, page, pageSize) => {
    try {
        // Initialize the query with conditions
        const whereConditions = {};

        if (filterCondition.userRoleCode) {
            whereConditions.userRoleCode = {
                [Op.like]: `%${filterCondition.userRoleCode}%`
            };
        }
        if (filterCondition.userRoleName) {
            whereConditions.userRoleName = {
                [Op.like]: `%${filterCondition.userRoleName}%`
            };
        }

        // Retrieve the paginated records
        const userRoles = await models.UserRole.findAll({
            where: whereConditions,
            limit: pageSize,
            offset: (page - 1) * pageSize
        });

        return { userRoles, error: null };
    } catch (error) {
        console.error('Error retrieving userRoles:', error);
        return { userRoles: [], error };
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
