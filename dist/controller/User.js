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
const routing_controllers_1 = require("routing-controllers");
const leanengine_1 = require("leanengine");
const Organization_1 = require("./Organization");
let UserController = class UserController {
    async getOne(id) {
        const user = await new leanengine_1.Query(leanengine_1.User).get(id);
        return user.toJSON();
    }
    async getOrganizationList(id) {
        const user = await new leanengine_1.Query(leanengine_1.User).get(id);
        return Promise.all((await user.getRoles()).map(role => new leanengine_1.Query(Organization_1.Organization).get(role.getName().split('_')[0])));
    }
};
__decorate([
    routing_controllers_1.Get('/:id'),
    __param(0, routing_controllers_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getOne", null);
__decorate([
    routing_controllers_1.Get('/:id/organization'),
    __param(0, routing_controllers_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getOrganizationList", null);
UserController = __decorate([
    routing_controllers_1.JsonController('/user')
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=User.js.map