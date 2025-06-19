// Mapping functions
async function toBrandResponse(Brand) {  
    const response = {
        oid: Brand.oid,
        brandName: Brand.brandName,
        createdBy: Brand.createdBy,
        updatedAt: Brand.updatedAt
    };
    return response;
}

async function toBrandResponses(Brands) {
    const BrandResponses = await Promise.all(Brands.map(toBrandResponse));
    return BrandResponses;
}

// Export everything
module.exports = {
    toBrandResponse,
    toBrandResponses
};
