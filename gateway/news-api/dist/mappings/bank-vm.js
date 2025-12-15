"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankMapping = exports.BankVm = void 0;
const common_1 = require("@nestjs/common");
class BankVm {
    oid;
    bankCode;
    bankName;
    shortName;
    createdAt;
    updatedAt;
}
exports.BankVm = BankVm;
let BankMapping = class BankMapping {
    toBankResponse(bank) {
        return {
            oid: bank.oid,
            bankCode: bank.bankCode,
            bankName: bank.bankName ?? '',
            shortName: bank.shortName ?? '',
            createdAt: bank.createdAt,
            updatedAt: bank.updatedAt,
        };
    }
    toBankResponses(banks) {
        return banks.map(bank => this.toBankResponse(bank));
    }
};
exports.BankMapping = BankMapping;
exports.BankMapping = BankMapping = __decorate([
    (0, common_1.Injectable)()
], BankMapping);
//# sourceMappingURL=bank-vm.js.map