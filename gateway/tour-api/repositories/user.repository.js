// repositories/userRepository.js
// const { result } = require('lodash');
const User = require('../models/user'); // Import the default export
const UserRole = require('../models/user-role'); // Import the default export
const { Op } = require('sequelize');
const models = require('../models'); // Ensure you're importing the models correctly


const save = async (data, options) => {
    try {
        const result = await models.User.create(data, options);
        return { result, err: null }
    }
    catch (err) {
        return { result: null, err }
    }

};

const update = async (oid, data, options) => {
    try {

        const [affectedCount] = await User.update(data, {
            where: { oid },
            ...options,
        });
        if (affectedCount === 0) {
            return { result: null, err: new Error("No rows updated") };
        }
        const findOptions = { ...options };
        delete findOptions.transaction; // hapus props yang tidak valid utk findByPk kalau ada
        const updated = await User.findByPk(oid, findOptions);
        return { result: updated, err: null };
    } catch (err) {
        return { result: null, err }
    }
};

// @ts-ignore
const deleted = async (oid, options) => {
    try {
        const deleteResult = await models.User.destroy({
            where: {
                oid: oid // Replace 'id' with the actual primary key field if different
            }
        });
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
        const result = await models.User.findAll();
        return { result, err: null }
    } catch (err) {
        return { result: null, err }
    }

};

const findById = async (oid) => {
    try {
        const result = await models.User.findByPk(oid);
        return { result, err: null }
    }
    catch (err) {
        return { result: null, err }
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
        const users = await models.User.findAll({
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

const findByCriteria = async (filterCondition = {}, page = 1, pageSize = 10) => {
    try {
        // Pastikan page dan pageSize valid
        // @ts-ignore
        page = parseInt(page, 10);
        // @ts-ignore
        pageSize = parseInt(pageSize, 10);

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(pageSize) || pageSize < 1) pageSize = 10;

        // Build dynamic filter conditions
        const whereConditions = {};

        if (filterCondition.email) {
            whereConditions.email = {
                [Op.eq]: filterCondition.email
            };
        }

        if (filterCondition.userName) {
            whereConditions.userName = {
                [Op.like]: `%${filterCondition.userName}%`
            };
        }

        const users = await models.User.findAll({
            // @ts-ignore
            where: whereConditions,
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: [['createdAt', 'DESC']] // Optional: sort by latest
        });

        return { users, error: null };
    } catch (error) {
        console.error('Error retrieving users:', error);
        return { users: [], error };
    }
};

const findCountByCriteria = async (filterCondition) => {
    try {
        // Initialize the query with conditions
        const whereConditions = {};

        if (filterCondition.userCode) {
            whereConditions.userCode = {
                [Op.like]: `%${filterCondition.userCode}%`
            };
        }
        if (filterCondition.userName) {
            whereConditions.userName = {
                [Op.like]: `%${filterCondition.userName}%`
            };
        }

        // Retrieve the paginated records
        const count = await models.User.count({
            // @ts-ignore
            where: whereConditions
        });

        return { count, error: null };
    } catch (error) {
        console.error('Error retrieving users:', error);
        return { count: 0, error };
    }
};


const findUserRole = async (email) => {
    try {
        const result = await models.User.findAll({
            attributes: ['oid', 'email'],
            include: [
                {
                    model: UserRole,
                    as: 'userRole',
                    attributes: ['roleName', 'isAdministrative'],
                }
            ],
            where: { email: email },
        });
        return { result, err: null };
    } catch (err) {
        console.error('Error in findUserRole:', err);
        return { result: null, err };
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
    findUserRole,
};
