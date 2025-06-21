// Mapping functions
async function toBrandResponse(brand) {
    const response = {
        oid: brand.oid,
        imageOid: brand.imageOid,
        brandName: brand.brandName,
        fileUrl: brand.fileUrl ?? '',
        createdBy: brand.createdBy,
        updatedAt: brand.updatedAt
    };
    return response;
}

async function toBrandResponses(brands) {
    const BrandResponses = await Promise.all(brands.map(toBrandResponse));
    return BrandResponses;
}

// Export everything
module.exports = {
    toBrandResponse,
    toBrandResponses
};
