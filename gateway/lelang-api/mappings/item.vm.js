// Mapping functions
async function toItemResponse(item, imageData) {
    const response = {
        oid: item._id,
        itemCategory: item.itemCategory,
        itemName: item.itemName,
        imageOid: item.imageOid,
        startingPrice: item.startingPrice,
        seller: item.seller,
        createdBy: item.createdBy,
        updatedAt: item.updatedAt
    };
    if (item.imageOid) {
        response.image = {
            oid: imageData._id,
            fileName: imageData.fileName,
            fileUrl: imageData.fileUrl,
            fileMime: imageData.fileMime,
            description: imageData.description,
        };
    }
    if (item.itemCategory) {
        response.itemCategory = {
            oid: item.itemCategory._id,
            categoryName: item.itemCategory.categoryName,
        };
    }
       if (item.seller) {
        response.seller = {
            oid: item.seller._id,
            storeName: item.seller.storeName,
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