// Mapping functions
async function toProvinceResponse(province) {
    const response = {
        oid: province.oid,
        countryOid: province.countryOid,
        provinceName: province.provinceName,
        createdBy: province.createdBy,
        updatedAt: province.updatedAt
    };
    if (province.country) {
        response.country = province.country;
    }
    return response;
}

async function toProvinceResponses(provinces) {
    const provinceResponses = await Promise.all(provinces.map(toProvinceResponse));
    return provinceResponses;
}

// Export everything
module.exports = {
    toProvinceResponse,
    toProvinceResponses
};


// // Export everything
// module.exports = {
//     toProvinceResponse,
//     toProvinceResponses
// };


// async function toProvinceResponse(province) {
//   return {
//     oid: province.oid,
//     countryOid: province.countryOid,
//     provinceName: province.provinceName,
//     createdBy: province.createdBy,
//     createdAt: province.createdAt,
//     lastModifiedBy: province.lastModifiedBy,
//     updatedAt: province.updatedAt,
//     deletedBy: province.deletedBy,
//     deletedAt: province.deletedAt,
//     // Include country if eager loaded
//     country: province.country ? {
//       oid: province.country.oid,
//       countryName: province.country.countryName, // adjust field names as needed
//       countryCode: province.country.countryCode,
//     } : undefined,
//     // Include districts if eager loaded
//     districts: province.districts ? await Promise.all(province.districts.map(district => ({
//       oid: district.oid,
//       districtName: district.districtName,
//       createdBy: district.createdBy,
//       createdAt: district.createdAt,
//       lastModifiedBy: district.lastModifiedBy,
//       updatedAt: district.updatedAt,
//       deletedBy: district.deletedBy,
//       deletedAt: district.deletedAt,
//     }))) : undefined,
//   };
// }

// async function toProvinceResponses(provinces) {
//   return await Promise.all(provinces.map(toProvinceResponse));
// }

// module.exports = {
//   toProvinceResponse,
//   toProvinceResponses,
// };
