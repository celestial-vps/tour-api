// Mapping functions
async function toCityResponse(city) {  
    const response = {
        oid: city.oid,
        provinceOid: city.provinceOid,
        cityName: city.cityName,
        createdBy: city.createdBy,
        updatedAt: city.updatedAt
    };
    return response;
}

async function toCityResponses(citys) {
    const cityResponses = await Promise.all(citys.map(toCityResponse));
    return cityResponses;
}

// Export everything
module.exports = {
    toCityResponse,
    toCityResponses
};
