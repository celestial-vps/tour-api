async function toSubdistrictResponse(subdistrict) {
  return {
    oid: subdistrict.oid,
    districtOid: subdistrict.districtOid,
    subDistrictName: subdistrict.subDistrictName,
    postalCode: subdistrict.postalCode,
    createdBy: subdistrict.createdBy,
    createdAt: subdistrict.createdAt,
    lastModifiedBy: subdistrict.lastModifiedBy,
    updatedAt: subdistrict.updatedAt,
    deletedBy: subdistrict.deletedBy,
    deletedAt: subdistrict.deletedAt,
    // Include district info if eager loaded
    district: subdistrict.district ? {
      oid: subdistrict.district.oid,
      districtName: subdistrict.district.districtName,
      createdBy: subdistrict.district.createdBy,
      createdAt: subdistrict.district.createdAt,
      updatedAt: subdistrict.district.updatedAt,
      deletedBy: subdistrict.district.deletedBy,
      deletedAt: subdistrict.district.deletedAt,
    } : undefined,
    // Include hotels if eager loaded
    hotels: subdistrict.hotels ? await Promise.all(subdistrict.hotels.map(hotel => ({
      oid: hotel.oid,
      hotelName: hotel.hotelName,
      address: hotel.address,
      phone: hotel.phone,
      star_rating: hotel.star_rating,
      createdBy: hotel.createdBy,
      createdAt: hotel.createdAt,
      updatedAt: hotel.updatedAt,
      deletedBy: hotel.deletedBy,
      deletedAt: hotel.deletedAt,
    }))) : undefined,
    // Include customers if eager loaded
    customers: subdistrict.customers ? await Promise.all(subdistrict.customers.map(customer => ({
      oid: customer.oid,
      customerName: customer.customerName,
      customerPhone: customer.customerPhone,
      customerEmail: customer.customerEmail,
      customerPostalCode: customer.customerPostalCode,
      bankOid: customer.bankOid,
      createdBy: customer.createdBy,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      deletedBy: customer.deletedBy,
      deletedAt: customer.deletedAt,
    }))) : undefined,
    // Include owners if eager loaded
    owners: subdistrict.owners ? await Promise.all(subdistrict.owners.map(owner => ({
      oid: owner.oid,
      ownerName: owner.ownerName,
      contactNumber: owner.contactNumber,
      createdBy: owner.createdBy,
      createdAt: owner.createdAt,
      updatedAt: owner.updatedAt,
      deletedBy: owner.deletedBy,
      deletedAt: owner.deletedAt,
    }))) : undefined,
  };
}

async function toSubdistrictResponses(subdistricts) {
  return await Promise.all(subdistricts.map(toSubdistrictResponse));
}

module.exports = {
  toSubdistrictResponse,
  toSubdistrictResponses,
};
