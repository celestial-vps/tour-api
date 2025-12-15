const User = require('../models/user');

const save = async (data) => {
    try {
        const user = new User(data); // Create a new user instance
        const result = await user.save(); // Save the user to the database
        return { result, error: null };
    } catch (error) {
        return { result: null, error };
    }
};

const update = async (oid, data) => {
    try {
        const result = await User.findOneAndUpdate({ _id: oid }, data, { new: true }); // Update the user
        return { result, error: null };
    } catch (error) {
        return { result: null, error };
    }
};

const deleted = async (oid) => {
    try {
        const result = await User.deleteOne({ oid }); // Delete the user
        return { result, error: null };
    } catch (error) {
        return {
            result: null, error
        };
    }
};

const findAll = async () => {
    try {
        const result = await User.find(); // Find all users
        return { result, error: null };
    } catch (error) {
        return {
            result: null,  error: { httpStatus: 500, message: 'Failed to delete User' },
        };
    }
};

const findById = async (oid) => {
    try {
        const result = await User.findOne({ _id: oid }); // Find user by oid
        return { result, error: null };
    } catch (error) {
        return {
            result: null, error
        };
    }
};

const advanceFilter = async (filterCondition) => {
    try {
        const query = {};
        if (filterCondition.name) {
            query.name = { $regex: filterCondition.name, $options: 'i' }; // Case-insensitive search
        }
        if (filterCondition.email) {
            query.email = filterCondition.email;
        }

        const users = await User.find(query).populate('role'); // Execute the query
        return { users, error: null };
    } catch (error) {
        return {
            users: [], error
        };
    }
};

const findCountByCriteria = async (filterCondition) => {
    try {
        const query = {};
        if (filterCondition.name) {
            query.name = { $regex: filterCondition.name, $options: 'i' };
        }
        if (filterCondition.email) {
            query.email = filterCondition.email;
        }

        const count = await User.countDocuments(query); // Count the documents
        return { count, error: null };
    } catch (error) {
        return {
            count: 0, error:error
        };
    }
};

const findByCriteria = async (filterCondition, page = 1, pageSize = 10) => {
    try {
        const query = {};
        if (filterCondition.name) {
            query.name = { $regex: filterCondition.name, $options: 'i' };
        }
        if (filterCondition.email) {
            query.email = filterCondition.email;
        }

        const users = await User.find(query)
            .skip((page - 1) * pageSize) // Pagination
            .limit(pageSize); // Limit results

        return { users, error: null };
    } catch (error) {
        return { users: [], error: error };
    }
};

const findUserRole = async (email) => {
    try {
        // const user = await User.findOne({ email })
        // .populate('roleOid');
        const user = await User.findOne({ email }).populate('roleOid');
        return { user, error: null };
    } catch (error) {
        return {
            user: null, error: error
        };
    }
};

module.exports = {
    save,
    update,
    deleted,
    findAll,
    findById,
    advanceFilter,
    findByCriteria,
    findCountByCriteria,
    findUserRole
};