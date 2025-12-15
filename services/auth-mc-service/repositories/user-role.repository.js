const UserRole = require('../models/user-role'); // Adjust path as per your project structure

const save = async (userRoleData) => {
    try {
        const userRole = new UserRole(userRoleData);
        await userRole.save();
        return { result: userRole, err: null };
    } catch (err) {
        return {
            result: null,
            err: { httpStatus: 500 },
        };
    }
};

const update = async (oid, updateData) => {
    try {
        const userRole = await UserRole.findOneAndUpdate({ _id: oid }, updateData, {
            new: true,
            runValidators: true,
        });
        return { result: userRole, err: null };
    } catch (err) {
        return {
            result: null,
            err: { httpStatus: 500 },
        };
    }
};

const deleted = async (oid) => {
    try {
        const result = await UserRole.deleteOne({ _id: oid });
        return { result, err: null };
    } catch (err) {
        return {
            result: null,
            err: { httpStatus: 500 },
        };
    }
};

const findAll = async () => {
    try {
        const result = await UserRole.find();
        return { result, err: null };
    } catch (err) {
        return {
            result: null,
            err: { httpStatus: 500 },
        };
    }
};

const findById = async (oid) => {
    try {
        const userRole = await UserRole.findById(oid);
        if (!userRole) {
            return {
                result: null,
                err: { httpStatus: 404, message: 'UserRole not found' },
            };
        }
        return { result: userRole, err: null };
    } catch (err) {
        return {
            result: null,
            err: { httpStatus: 500 },
        };
    }
};

const findByCriteria = async (filterCondition, page = 1, pageSize = 10) => {
    try {
        const whereConditions = {}; // Add any specific filtering logic here
        if (filterCondition.roleName) {
            whereConditions.roleName = {
                [Op.like]: `%${filterCondition.roleName}%`
            };
        }
        const userRoles = await UserRole.find(whereConditions)
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        const count = await UserRole.countDocuments(whereConditions);

        return { userRoles, count, err: null };
    } catch (err) {
        return {
            userRoles: [],
            count: 0,
            err: { httpStatus: 500 },
        };
    }
};

const findCountByCriteria = async (filterCondition) => {
    try {
        // Initialize the query with conditions
        const whereConditions = {};

        if (filterCondition.roleName) {
            whereConditions.roleName = {
                [Op.like]: `%${filterCondition.roleName}%`
            };
        }        

        // Retrieve the paginated records
        const count = await UserRole.countDocuments(whereConditions);

        return { count, error: null };
    } catch (error) {
        console.error('Error retrieving userRoles:', error);
        return {
            count: 0, err: {
                httpStatus: 500,
            }
        };
    }
};

const advanceFlter = async () => {
    try {
        const result = await UserRole.findAll();
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

module.exports = {
    save,
    update,
    deleted,
    findAll,
    findById,
    findByCriteria,
    findByCriteria,
    findCountByCriteria,advanceFlter
};