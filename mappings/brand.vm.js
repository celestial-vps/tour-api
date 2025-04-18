async function toBrandResponse(brand) {  
    const response = {
        oid: brand.oid,        
        brandName: brand.brandName,        
        createdBy: brand.createdBy,
        updatedAt: brand.updatedAt
      };
    return response;
}

async function toBrandResponses(brands) {
    const brandResponses = await Promise.all(brands.map(toBrandResponse));
    return brandResponses;
}

// Export everything
module.exports = {
    toBrandResponse,
    toBrandResponses
};