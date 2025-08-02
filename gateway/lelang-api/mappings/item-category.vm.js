// Mapping functions
async function toItemCategoryResponse(item) {
    const response = {
        oid: item._id,
        categoryName: item.categoryName,
        createdBy: item.createdBy,
        updatedAt: item.updatedAt,
    };
    if (Array.isArray(item.items) && item.items.length > 0) {
        response.items = await Promise.all(
            item.items.map(it => toItemResponse(it.toObject ? it.toObject() : it))
        );
    }
    return response;
}

async function toItemResponse(item) {
    return {
        oid: item._id,
        description: item.description,
        startingPrice: item.startingPrice
    };
}

async function toItemCategoryResponses(items) {
    const itemResponses = await Promise.all(items.map(toItemCategoryResponse));
    return itemResponses;
}

// Export everything
module.exports = {
    toItemCategoryResponse,
    toItemCategoryResponses
};