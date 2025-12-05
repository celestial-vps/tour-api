const { Op } = require('sequelize');
const User = require('../models/user');
const { UserRole } = require('../models');

// Save a new user
const save = async (data, options) => {
    try {
        const result = await User.create(data, options);
        return { result, err: null };
    } catch (err) {
        console.error('Repository Save Error:', err); // Log for debugging
        return { result: null, err };
    }
};

// Update an existing user
const update = async (oid, data, options) => {
    try {
        const [affectedCount] = await User.update(
            data,
            {
                where: { oid },
                logging: console.log,
                paranoid: false, // untuk berjaga-jaga
                individualHooks: true,
            }
        );

        if (affectedCount === 0) {
            return { result: null, err: new Error("No rows updated") };
        }

        const findOptions = { ...options };
        delete findOptions.transaction;

        const updated = await User.findByPk(oid, findOptions);
        return { result: updated, err: null };
    } catch (err) {
        return { result: null, err };
    }
};

// Delete a user by ID
const remove = async (oid, options = {}) => {
    try {
        const result = await User.destroy({
            where: { oid },
            transaction: options.transaction,
        });

        if (result <= 0) {
            return { result: null, err: new Error('Failed to delete record') };
        }

        return { result, err: null };
    } catch (err) {
        console.error('Repository Delete Error:', err);
        return { result: null, err };
    }
};

// Get all users
const findAll = async (options = {}) => {
    try {
        const result = await User.findAll(options);
        return { result, err: null };
    } catch (err) {
        console.error('Repository findAll Error:', err);
        return { result: null, err };
    }
};

// Find user by ID
const findById = async (oid, options = {}) => {
    try {
        // options bisa berisi { include, transaction, ... }
        const result = await User.findByPk(oid, options);
        return { result, err: null };
    } catch (err) {
        console.error('Error in findById:', err.message || err);
        return { result: null, err };
    }
};


// Find users by criteria with pagination
const findByCriteria = async (options = {}) => {
    try {
        const result = await User.findAll(options);
        return { result, err: null };
    } catch (err) {
        console.error('findByCriteria error:', err);
        return { result: [], err };
    }
};


// Find and count all with pagination 
const findAndCountByCriteria = async (findOptions) => {
    try {
        // @ts-ignore
        const result = await User.findAndCountAll(findOptions);

        return {
            data: result.rows,
            count: result.count,
            err: null,
        };
    } catch (err) {
        console.error('findAndCountWithOptions error:', err);
        return {
            data: [],
            count: 0,
            err,
        };
    }
};


const advanceFlter = async (filterCondition) => {
    try {
        const whereConditions = {};

        if (filterCondition.email) {
            whereConditions.email = {
                [Op.eq]: filterCondition.email
            };
        }
        const users = await User.findAll({
            include: [
                {
                    model: UserRole,
                    as: 'userRole', // This should match the alias in the User model's associate method
                    attributes: ['roleName', 'isAdministrative', 'readState', 'writeState', 'createState', 'deleteState', 'navigateState'],
                }
            ],
            // @ts-ignore
            where: whereConditions,
        });
        return { result: users, err: null }
    }
    catch (err) {
        return { result: null, err }
    }
};


module.exports = {
    save,
    update,
    remove,
    findAll,
    findById,
    findAndCountByCriteria,
    findByCriteria, advanceFlter
};
