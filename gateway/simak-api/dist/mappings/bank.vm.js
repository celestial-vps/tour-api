"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankVm = void 0;
exports.toBankResponse = toBankResponse;
exports.toBankResponses = toBankResponses;
class BankVm {
    oid;
    bankCode;
    bankName;
    shortName;
    createdAt;
    updatedAt;
}
exports.BankVm = BankVm;
function toBankResponse(bank) {
    return {
        oid: bank.id,
        bankCode: bank.bankCode,
        bankName: bank.bankName,
        shortName: bank.shortName,
        createdAt: bank.createdAt,
        updatedAt: bank.updatedAt,
    };
}
function toBankResponses(banks) {
    return banks.map(toBankResponse);
}
//# sourceMappingURL=bank.vm.js.map