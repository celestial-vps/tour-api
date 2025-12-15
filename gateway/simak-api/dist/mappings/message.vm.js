"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageVm = void 0;
exports.toMessageResponse = toMessageResponse;
exports.toMessageResponses = toMessageResponses;
class MessageVm {
    value;
    name;
}
exports.MessageVm = MessageVm;
function toMessageResponse(data) {
    return {
        value: data.id,
        name: data.Name,
    };
}
function toMessageResponses(datas) {
    return datas.map(toMessageResponse);
}
//# sourceMappingURL=message.vm.js.map