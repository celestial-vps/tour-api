// Mapping functions
async function toBillingResponse(billing) {
    const response = {
        oid: billing.oid,
        patientOid: billing.patientOid,
        amount: billing.amount,
        status: billing.status,
        createdBy: billing.createdBy,
        createdAt: billing.createdAt,
        lastModifiedBy: billing.lastModifiedBy,
        updatedAt: billing.updatedAt
    };
    return response;
}

async function toBillingResponses(billings) {
    const billingResponses = await Promise.all(billings.map(toBillingResponse));
    return billingResponses;
}

module.exports = {
    toBillingResponse,
    toBillingResponses
};
