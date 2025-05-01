// utils/pagination.js
const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? (page - 1) * limit : 0;
  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: items } = data;
  const currentPage = page ? +page : 1;
  const totalPages = limit ? Math.ceil(totalItems / limit) : 1;
  
  return {
    items,
    pagination: {
      totalItems,
      itemsPerPage: limit,
      currentPage,
      totalPages,
    }
  };
};

const paginate = async (model, query = {}, page = 1, pageSize = 10, options = {}) => {
  const { limit, offset } = getPagination(page, pageSize);
  
  // Handle sorting
  let order = [['createdAt', 'DESC']];
  if (options.sortBy) {
    const [sortKey, sortDirection] = options.sortBy.split(':');
    order = [[sortKey, sortDirection || 'ASC']];
  }

  const findOptions = {
    where: query,
    ...options,
    limit,
    offset,
    order,
    distinct: true
  };

  // Remove pagination if limit is -1 (get all)
  if (options.limit === -1) {
    delete findOptions.pageIndex ;
    delete findOptions.pageSize ;
  }

  const data = await model.findAndCountAll({
    ...findOptions,
    logging: (sql) => console.log('🔍 SQL Executed:', sql)
  });
  
  return data;
};

module.exports = {
  paginate,
  getPagination,
  getPagingData
};