const UserRole = require('../models/user-role'); // Adjust path as per your project structure

const save = async (userRoleData) => {
    try {
        const userRole = new UserRole(userRoleData);
        await userRole.save();
        return { result: userRole, error: null };
    } catch (error) {
        return {
            result: null,
            error: { httpStatus: 500 },
        };
    }
};

const update = async (oid, updateData) => {
    try {
        const userRole = await UserRole.findOneAndUpdate({ _id: oid }, updateData, {
            new: true,
            runValidators: true,
        });
        return { result: userRole, error: null };
    } catch (error) {
        return {
            result: null,
            error: { httpStatus: 500 },
        };
    }
};

const deleted = async (oid) => {
    try {
        const result = await UserRole.deleteOne({ _id: oid });
        return { result, error: null };
    } catch (error) {
        return {
            result: null,
            error: { httpStatus: 500 },
        };
    }
};

const findAll = async () => {
    try {
        const result = await UserRole.find();
        return { result, error: null };
    } catch (error) {
        return {
            result: null,
            error: { httpStatus: 500 },
        };
    }
};

const findById = async (oid) => {
    try {
        const userRole = await UserRole.findById(oid);
        if (!userRole) {
            return {
                result: null,
                error: { httpStatus: 404, message: 'UserRole not found' },
            };
        }
        return { result: userRole, error: null };
    } catch (error) {
        return {
            result: null,
            error: { httpStatus: 500 },
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

        return { userRoles, count, error: null };
    } catch (error) {
        return {
            userRoles: [],
            count: 0,
            error: { httpStatus: 500 },
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
            count: 0,  error: { httpStatus: 500, message: 'Failed to delete User Role' },
        };
    }
};

const advanceFlter = async () => {
    try {
        const result = await UserRole.findAll();
        return { result, error: null }
    }
    catch (error) {
        return {
            result: null,  error: { httpStatus: 500, message: 'Failed to delete User Role' },
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