// Mapping functions
async function toBankResponse(bank) {  
    const response = {
        oid: bank.oid,
        bankCode: bank.bankCode,
        bankName: bank.bankName,        
        createdBy: bank.createdBy,
        createdAt: bank.createdAt,
        updatedAt: bank.updatedAt
      };
    return response;
}

async function toBankResponses(banks) {
    const bankResponses = await Promise.all(banks.map(toBankResponse));
    return bankResponses;
}

// Export everything
module.exports = {
    toBankResponse,
    toBankResponses
};