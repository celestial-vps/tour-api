"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationMapping = exports.NotificationVm = void 0;
const common_1 = require("@nestjs/common");
const user_vm_1 = require("./user-vm");
class NotificationVm {
    oid;
    user;
    title;
    message;
    isRead;
    createdAt;
    updatedAt;
}
exports.NotificationVm = NotificationVm;
let NotificationMapping = class NotificationMapping {
    userMapping;
    constructor(userMapping) {
        this.userMapping = userMapping;
    }
    toNotificationResponse(notification) {
        return {
            oid: notification.oid,
            user: this.userMapping.toUserResponse(notification.user),
            title: notification.title,
            message: notification.message,
            isRead: notification.isRead,
            createdAt: notification.createdAt,
            updatedAt: notification.updatedAt,
        };
    }
    toNotificationResponses(notifications) {
        return notifications.map(n => this.toNotificationResponse(n));
    }
};
exports.NotificationMapping = NotificationMapping;
exports.NotificationMapping = NotificationMapping = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_vm_1.UserMapping])
], NotificationMapping);
//# sourceMappingURL=notification-vm.js.map