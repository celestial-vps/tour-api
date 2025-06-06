async function toCustomerResponse(customer) {
  return {
    oid: customer.oid,
    customerName: customer.customerName,
    customerPhone: customer.customerPhone,
    customerEmail: customer.customerEmail,
    customerPostalCode: customer.customerPostalCode,
    bankOid: customer.bankOid,
    // If you eager-load associations, you can include them here:
    bank: customer.bank ? {
      oid: customer.bank.oid,
      bankName: customer.bank.bankName, // adjust according to your Bank model fields
    } : undefined,
    subDistrictOid: customer.subDistrictOid,
    subDistrict: customer.subDistrict ? {
      oid: customer.subDistrict.oid,
      subDistrictName: customer.subDistrict.subDistrictName, // adjust if your model field is different
    } : undefined,
    createdBy: customer.createdBy,
    createdAt: customer.createdAt,
    lastModifiedBy: customer.lastModifiedBy,
    updatedAt: customer.updatedAt,
    deletedBy: customer.deletedBy,
    deletedAt: customer.deletedAt,
  };
}

async function toCustomerResponses(customers) {
  return await Promise.all(customers.map(toCustomerResponse));
}

module.exports = {
  toCustomerResponse,
  toCustomerResponses,
};
