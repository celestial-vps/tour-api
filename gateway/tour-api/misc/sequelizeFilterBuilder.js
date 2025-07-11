const { Op } = require('sequelize');

const buildWhereConditions = (filterCondition = {}, options = {}) => {
  const {
    logic = 'XOR', // AND || OR || XOR
    caseSensitive = false,
    dialect = 'postgres',
    fieldOperators = {}
  } = options;

  // Handle empty filter case
  if (!Object.keys(filterCondition).length) {
    return {};
  }

  // Build individual conditions for each field
  const fieldConditions = Object.entries(filterCondition)
    .filter(([_, value]) => value !== undefined && value !== '')
    .map(([field, value]) => {
      // Use custom operator if specified for this field
      if (fieldOperators[field]) {
        return { [field]: { [fieldOperators[field]]: value } };
      }

      // Default field condition building
      if (caseSensitive) {
        return { [field]: value };
      }

      return {
        [field]: dialect === 'postgres'
          ? { [Op.iLike]: `%${value}%` }
          : { [Op.like]: `%${value.toLowerCase()}%` }
      };
    });

  // Handle XOR (exclusive OR) - only one condition must be true
  if (logic.toUpperCase() === 'XOR' && fieldConditions.length > 1) {
    return {
      [Op.or]: fieldConditions.map((condition, i) => ({
        [Op.and]: [
          condition,
          ...fieldConditions.filter((_, j) => i !== j)
            .map(c => ({ [Op.not]: c }))
        ]
      }))
    };
  }

  // Handle AND/OR
  const operator = logic.toUpperCase() === 'OR' ? Op.or : Op.and;
  return fieldConditions.length > 1
    ? { [operator]: fieldConditions }
    : fieldConditions[0] || {};
};

const buildFilterConditions = (sequelize, filterCondition = {}, caseSensitive = false) => {
  const dialect = sequelize.getDialect();

  return buildWhereConditions(filterCondition, {
    caseSensitive,
    dialect,
    likeOperator: dialect === 'postgres' ? Op.iLike : Op.like
  });
};

const buildFindOptions = (filters = {}, options = {}, attributes = {}) => {
  const pageIndex = parseInt(options.pageIndex, 10) || 1;
  const pageSize = parseInt(options.pageSize, 10) || 10;
  const limit = options.limit === -1 ? undefined : pageSize;
  const offset = options.limit === -1 ? undefined : (pageIndex - 1) * pageSize;
  const sortOrder = (options.sortOrder || 'ASC').toUpperCase();

  return {
    where: filters,
    limit,
    offset,
    order: options.sortBy ? [[options.sortBy, sortOrder]] : undefined,
    attributes,
    include: options.include || undefined, // tambahkan properti include
    distinct: true,
  };
};

module.exports = {
  buildWhereConditions,
  buildFilterConditions,
  buildFindOptions
};
