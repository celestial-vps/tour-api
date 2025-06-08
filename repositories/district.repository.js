const District = require('../models/district');
const { Op } = require('sequelize');
const { paginate } = require('../misc/pagination');

// Save a new district
const save = async (data, options) => {
  try {
    const result = await District.create(data, options);
    return { result, err: null };
  } catch (err) {
    console.error('Repository Save Error:', err);
    return { result: null, err };
  }
};

// Update an existing district
const update = async (oid, data, options) => {
  try {
    const [affectedCount] = await District.update(data, {
      where: { oid },
      ...options,
    });

    if (affectedCount === 0) {
      return { result: null, err: new Error('No rows updated') };
    }

    const findOptions = { ...options };
    delete findOptions.transaction; // hapus jika ada karena findByPk tidak butuh transaction

    const updated = await District.findByPk(oid, findOptions);
    return { result: updated, err: null };
  } catch (err) {
    console.error('Repository Update Error:', err);
    return { result: null, err };
  }
};

// Delete a district by ID
const deleted = async (id, options = {}) => {
  try {
    const result = await District.destroy({
      where: { oid: id },
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

// Get all districts
const findAll = async (options = {}) => {
  try {
    const result = await District.findAll(options);
    return { result, err: null };
  } catch (err) {
    console.error('Repository findAll Error:', err);
    return { result: null, err };
  }
};

// Find district by ID
const findById = async (oid, options = {}) => {
  try {
    const result = await District.findByPk(oid, options);
    return { result, err: null };
  } catch (err) {
    console.error('Repository findById Error:', err);
    return { result: null, err };
  }
};

// Count districts by criteria
const findCountByCriteria = async (where = {}) => {
  try {
    const count = await District.count({ where });
    return { count, err: null };
  } catch (err) {
    console.error('Repository findCountByCriteria Error:', err);
    return { count: 0, err };
  }
};

// Find districts by criteria with pagination
const findByCriteria = async (options = {}) => {
  try {
    const districts = await District.findAll(options);
    return { districts, err: null };
  } catch (err) {
    console.error('Repository findByCriteria Error:', err);
    return { districts: [], err };
  }
};

// Find and count all with pagination
const findAndCountAll = async (findOptions) => {
  try {
    const result = await District.findAndCountAll(findOptions);
    return {
      data: result.rows,
      count: result.count,
      err: null,
    };
  } catch (err) {
    console.error('Repository findAndCountAll Error:', err);
    return {
      data: [],
      count: 0,
      err,
    };
  }
};

module.exports = {
  save,
  update,
  deleted,
  findAll,
  findById,
  findCountByCriteria,
  findByCriteria,
  findAndCountAll,
};
