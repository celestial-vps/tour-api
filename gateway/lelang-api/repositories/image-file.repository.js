const ImageFile = require('../models/image-file'); // Adjust path as per your project structure

const save = async (imageFileData) => {
    try {
        const imageFile = new ImageFile(imageFileData);
        const result = await imageFile.save();
        return { result, err: null };
    } catch (err) {
        return { result: null, err };
    }
};

const update = async (imageFileData) => {
    try {
        const updatedImageFile = await ImageFile.findByIdAndUpdate(imageFileData._id, imageFileData, { new: true, runValidators: true });
        return { result: updatedImageFile, err: null };
    } catch (err) {
        return { result: null, err };
    }
};

const deleteImageFile = async (id) => {
    try {
        const result = await ImageFile.findByIdAndDelete(id);
        return { result, err: null };
    } catch (err) {
        return { result: null, err };
    }
};

const findById = async (id) => {
    try {
        const imageFile = await ImageFile.findById(id);
        if (!imageFile) {
            return { result: null, err: { httpStatus: 404, message: 'ImageFile not found' } };
        }
        return { result: imageFile, err: null };
    } catch (err) {
        return { result: null, err };
    }
};

const find = async (condition, page = 1, pageSize = 10) => {
    try {
        const count = await ImageFile.countDocuments(condition);
        const imageFiles = await ImageFile.find(condition)
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        return { imageFiles, count, err: null };
    } catch (err) {
        return { imageFiles: [], count: 0, err };
    }
};

module.exports = {
    save,
    update,
    delete: deleteImageFile, // Rename to avoid confusion with the reserved keyword
    findById,
    find,
};