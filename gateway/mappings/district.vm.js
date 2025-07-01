async function toDistrictResponse(district) {
  const response = {
    oid: district.oid,
    cityOid: district.cityOid,
    districtName: district.districtName,
    createdBy: district.createdBy,
    createdAt: district.createdAt,
    lastModifiedBy: district.lastModifiedBy,
    updatedAt: district.updatedAt,
    deletedBy: district.deletedBy,
    deletedAt: district.deletedAt,
  };
  if (district.city) {
    response.city = district.city;
  }
  return response;
}

async function toDistrictResponses(districts) {
  return await Promise.all(districts.map(toDistrictResponse));
}

module.exports = {
  toDistrictResponse,
  toDistrictResponses,
};
