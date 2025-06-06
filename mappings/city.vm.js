async function toCityResponse(city) {
  return {
    oid: city.oid,
    provinceOid: city.provinceOid,
    cityName: city.cityName,
    createdBy: city.createdBy,
    createdAt: city.createdAt,
    lastModifiedBy: city.lastModifiedBy,
    updatedAt: city.updatedAt,
    deletedBy: city.deletedBy,
    deletedAt: city.deletedAt,
  };
}

async function toCityResponses(cities) {
  return await Promise.all(cities.map(toCityResponse));
}

module.exports = {
  toCityResponse,
  toCityResponses,
};
