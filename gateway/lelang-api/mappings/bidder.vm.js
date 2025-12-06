// Mapping functions
async function toBidderResponse(bidder) {
    const response = {
        oid: bidder._id,
        userId: bidder.userId,
        fullName: bidder.fullName,
        ktpNumber: bidder.ktpNumber,
        address: bidder.address,
        phone: bidder.phone,
        birthDate: bidder.birthDate,
        createdBy: bidder.createdBy,
        updatedAt: bidder.updatedAt
    };
    return response;
}

async function toBidderResponses(bidders) {
    const bidderResponses = await Promise.all(bidders.map(toBidderResponse));
    return bidderResponses;
}

// Export everything
module.exports = {
    toBidderResponse,
    toBidderResponses
};