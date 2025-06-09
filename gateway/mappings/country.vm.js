async function toCountryResponse(country) {  
    const response = {
        oid: country.oid,        
        countryCode: country.countryCode,        
        countryName: country.countryName,        
        countryCurrency: country.countryCurrency,         
        createdBy: country.createdBy,
        updatedAt: country.updatedAt
      };
    return response;
}

async function toCountryResponses(countrys) {
    const countryResponses = await Promise.all(countrys.map(toCountryResponse));
    return countryResponses;
}

// Export everything
module.exports = {
    toCountryResponse,
    toCountryResponses
};