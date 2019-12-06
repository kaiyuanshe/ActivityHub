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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const leanengine_1 = require("leanengine");
const leancloud_storage_1 = require("leancloud-storage");
const routing_controllers_1 = require("routing-controllers");
const User_1 = require("../model/User");
let SessionController = class SessionController {
    sendSMSCode({ phone }) {
        return leancloud_storage_1.Cloud.requestSmsCode(phone);
    }
    async signIn({ phone, code }, context) {
        const user = await leanengine_1.User.signUpOrlogInWithMobilePhone(phone, code);
        context.saveCurrentUser(user);
        return user.toJSON();
    }
    getProfile({ currentUser }) {
        if (!currentUser)
            throw new routing_controllers_1.UnauthorizedError();
        return currentUser.toJSON();
    }
    async editProfile({ currentUser }, body) {
        if (!currentUser)
            throw new routing_controllers_1.UnauthorizedError();
        await currentUser.save(body, { user: currentUser });
        return currentUser.toJSON();
    }
    destroy(context) {
        if (!context.currentUser)
            throw new routing_controllers_1.UnauthorizedError();
        context.currentUser.logOut();
        context.clearCurrentUser();
        return '';
    }
};
__decorate([
    routing_controllers_1.Post('/smsCode'),
    __param(0, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SessionController.prototype, "sendSMSCode", null);
__decorate([
    routing_controllers_1.Post('/'),
    __param(0, routing_controllers_1.Body()),
    __param(1, routing_controllers_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "signIn", null);
__decorate([
    routing_controllers_1.Get('/'),
    __param(0, routing_controllers_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "getProfile", null);
__decorate([
    routing_controllers_1.Patch('/'),
    __param(0, routing_controllers_1.Ctx()),
    __param(1, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, User_1.UserModel]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "editProfile", null);
__decorate([
    routing_controllers_1.Delete('/'),
    __param(0, routing_controllers_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SessionController.prototype, "destroy", null);
SessionController = __decorate([
    routing_controllers_1.JsonController('/session')
], SessionController);
exports.default = SessionController;
//# sourceMappingURL=Session.js.map