// Mapping functions
async function toAuctionResponse(auction) {
    const response = {
        oid: auction._id,
        itemOid: auction.itemOid,
        startTime: auction.startTime,
        endTime: auction.endTime,
        status: auction.status,
        createdBy: auction.createdBy,
        updatedAt: auction.updatedAt
    };
    if (auction.itemOid) {
        response.item = {
            itemName: auction.itemOid.itemName,
            description: auction.itemOid.description,
            startingPrice: auction.itemOid.startingPrice,
        };
        if (auction.itemOid.itemCategory) {
            response.item.itemCategory = {
                categoryName: auction.itemOid.itemCategory.categoryName
            };
        }
    }

    return response;
}

async function toAuctionResponses(auctions) {
    const auctionResponses = await Promise.all(auctions.map(toAuctionResponse));
    return auctionResponses;
}

// Export everything
module.exports = {
    toAuctionResponse,
    toAuctionResponses
};