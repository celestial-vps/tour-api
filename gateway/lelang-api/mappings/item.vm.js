// Mapping functions
async function toItemResponse(item) {
    const response = {
        oid: item._id,
        itemName: item.itemName,
        imageOid: item.imageOid._id,
        description: item.description,
        startingPrice: item.startingPrice,
        owner: item.owner,
        createdBy: item.createdBy,
        updatedAt: item.updatedAt
    };
    if (item.imageOid) {
        response.image = {
            fileName: item.imageOid.fileName,
            fileUrl: item.imageOid.fileUrl,
            fileMime: item.imageOid.fileMime,
            description: item.imageOid.description,
        };
    }
     if (item.itemCategoryOid) {
        response.itemCategory = {
            categoryName: item.itemCategoryOid.categoryName,            
        };
    }
    return response;
}

async function toItemResponses(items) {
    const itemResponses = await Promise.all(items.map(toItemResponse));
    return itemResponses;
}

// Export everything
module.exports = {
    toItemResponse,
    toItemResponses
};