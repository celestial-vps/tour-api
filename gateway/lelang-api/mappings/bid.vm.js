// Mapping functions
async function toBidResponse(bid) {  
  const response = {
      oid: bid._id,
      auctionOid: bid.auctionOid._id,
      itemName:bid.auctionOid.itemOid.itemName,
      userOid: bid.userOid,
      bidAmount: bid.bidAmount,
      bidTime: bid.bidTime,
      createdBy: bid.createdBy,
      updatedAt: bid.updatedAt
    };
  return response;
}

async function toBidResponses(bids) {
  const bidResponses = await Promise.all(bids.map(toBidResponse));
  return bidResponses;
}

// Export everything
module.exports = {
  toBidResponse,
  toBidResponses
};