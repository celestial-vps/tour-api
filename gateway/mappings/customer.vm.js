// Mapping functions
async function toCustomerResponse(Customer) {  
    const response = {
        oid: Customer.oid,
        customerName: Customer.customerName,
        customerPhone: Customer.customerPhone,
        customerEmail: Customer.customerEmail,
        customerPostalCode: Customer.customerPostalCode,
        bankOid: Customer.bankOid,
        createdBy: Customer.createdBy,
        updatedAt: Customer.updatedAt
    };
    return response;
}

async function toCustomerResponses(Customers) {
    const CustomerResponses = await Promise.all(Customers.map(toCustomerResponse));
    return CustomerResponses;
}

// Export everything
module.exports = {
    toCustomerResponse,
    toCustomerResponses
};
