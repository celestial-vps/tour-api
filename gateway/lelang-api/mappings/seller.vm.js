// Mapping functions
async function toSellerResponse(seller) {
    const response = {
        oid: seller._id,
        storeName: seller.storeName,
        storeDescription: seller.storeDescription,
        phone: seller.phone,
        nationalId: seller.nationalId,
        bankAccountNumber: seller.bankAccountNumber,
        bankAccountName: seller.bankAccountName,
        sellerStatus: seller.sellerStatus,
        createdBy: seller.createdBy,
        updatedAt: seller.updatedAt
    };
    return response;
}

async function toSellerResponses(sellers) {
    const sellerResponses = await Promise.all(sellers.map(toSellerResponse));
    return sellerResponses;
}

// Export everything
module.exports = {
    toSellerResponse,
    toSellerResponses
};