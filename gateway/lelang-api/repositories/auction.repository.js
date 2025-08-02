
const Auction = require('../models/auction');


const save = async (auctionData) => {
    try {
        const result = new Auction(auctionData);
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
        const result = await Auction.findOneAndUpdate({ _id: oid }, updateData, {
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
        const result = await Auction.deleteOne({ _id: oid }); // Use deleteOne to remove the document        
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
        const result = await Auction.find();
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

        if (filterCondition.startTime) {
            whereConditions.startTime = {
                [Op.eq]: `${filterCondition.startTime}`
            };
        }
        if (filterCondition.endTime) {
            whereConditions.endTime = {
                [Op.eq]: `${filterCondition.endTime}`
            };
        }

        // Retrieve the paginated records
        const auctions = await Auction.find(whereConditions).populate({
            path: 'itemOid',
            populate: {
                path: 'itemCategoryOid',
                model: 'ItemCategory'
            }
        })
            .limit(pageSize) // Limit the number of records returned
            .skip((page - 1) * pageSize); // Skip the records for pagination

        const count = await Auction.countDocuments(whereConditions); // Count total documents


        return { auctions, error: null };
    } catch (err) {
        console.error('Error retrieving auctions:', err);
        return {
            auctions: [], err: {
                httpStatus: 500,
            }
        };
    }
};

const findCountByCriteria = async (filterCondition) => {
    try {
        // Initialize the query with conditions
        const whereConditions = {};

        if (filterCondition.startTime) {
            whereConditions.startTime = {
                [Op.eq]: `${filterCondition.startTime}`
            };
        }
        if (filterCondition.endTime) {
            whereConditions.endTime = {
                [Op.eq]: `${filterCondition.endTime}`
            };
        }

        // Retrieve the paginated records
        const count = await Auction.countDocuments(whereConditions);

        return { count, error: null };
    } catch (error) {
        console.error('Error retrieving auctions:', error);
        return {
            count: 0, err: {
                httpStatus: 500,
            }
        };
    }
};

const advanceFlter = async () => {
    try {
        const result = await Auction.findAll();
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
        const result = await Auction.findOne({ _id: oid }).populate('itemOid'); // Use findOne to find by the oid field
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