const User = require('../models/user');
 
const save = async (data) => {
    try {
        const user = new User(data); // Create a new user instance
        const result = await user.save(); // Save the user to the database
        return { result, err: null };
    } catch (err) {
        return { result: null, err: {
            httpStatus: 500,
        } };F
    }
};

const update = async (oid, data) => {
    try {
        const result = await User.findOneAndUpdate({ _id: oid }, data, { new: true }); // Update the user
        return { result, err: null };
    } catch (err) {
        return { result: null, err: {
            httpStatus: 500,
        } };
    }
};

const deleted = async (oid) => {
    try {
        const result = await User.deleteOne({ oid }); // Delete the user
        return { result, err: null };
    } catch (err) {
        return { result: null, err: {
            httpStatus: 500,
        } };
    }
};

const findAll = async () => {
    try {
        const result = await User.find(); // Find all users
        return { result, err: null };
    } catch (err) {
        return { result: null, err: {
            httpStatus: 500,
        } };
    }
};

const findById = async (oid) => {
    try {
        const result = await User.findOne({ _id: oid }); // Find user by oid
        return { result, err: null };
    } catch (err) {
        return { result: null, err: {
            httpStatus: 500,
        } };
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
        return { users, err: null };
    } catch (err) {
        return { users: [], err: {
            httpStatus: 500,
        }};
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
        return { count, err: null };
    } catch (error) {
        return { count: 0,err: {
            httpStatus: 500,
        }};
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

        return { users, err: null };
    } catch (error) {
        return { users: [], err: error };
    }
};

const findUserRole = async (email) => {
    try {
        // const user = await User.findOne({ email })
        // .populate('roleOid');
        const user = await User.findOne({ email }).populate('roleOid');
        return { user, err: null };
    } catch (error) {
        return { user: null, err: {
            httpStatus: 500,
        } };
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