// Mapping functions
async function toCustomerResponse(customer) {
    const response = {
        oid: customer.oid,
        customerName: customer.customerName,
        customerPhone: customer.customerPhone,
        customerEmail: customer.customerEmail,
        customerPostalCode: customer.customerPostalCode,
        bankOid: customer.bankOid,
        createdBy: customer.createdBy,
        updatedAt: customer.updatedAt
    };
    return response;
}

async function toCustomerResponses(customers) {
    const customerResponses = await Promise.all(customers.map(toCustomerResponse));
    return customerResponses;
}

// Export everything
module.exports = {
    toCustomerResponse,
    toCustomerResponses
};
