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
const routing_controllers_1 = require("routing-controllers");
const utility_1 = require("../../utility");
const Activity_1 = require("../../model/Activity");
class Session extends leanengine_1.Object {
}
exports.Session = Session;
let ActiviySessionController = class ActiviySessionController {
    static async assertOwner(id, user) {
        const session = await new leanengine_1.Query(Session)
            .equalTo('id', id)
            .equalTo('owner', user)
            .first();
        if (session)
            return session;
        throw new routing_controllers_1.ForbiddenError();
    }
    async create({ currentUser }, body) {
        if (!currentUser)
            throw new routing_controllers_1.UnauthorizedError();
        const session = new Session().setACL(await utility_1.createAdminACL(currentUser));
        await session.save(Object.assign(Object.assign({}, body), { owner: currentUser }));
        return session.toJSON();
    }
    async getOne(id) {
        const session = await new leanengine_1.Query(Session).get(id);
        return session.toJSON();
    }
    async edit({ currentUser }, id, body) {
        if (!currentUser)
            throw new routing_controllers_1.UnauthorizedError();
        const session = leanengine_1.Object.createWithoutData('Session', id);
        await session.save(Object.assign(Object.assign({}, body), { owner: currentUser }));
        return session.toJSON();
    }
};
__decorate([
    routing_controllers_1.Post(),
    __param(0, routing_controllers_1.Ctx()),
    __param(1, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Activity_1.SessionModel]),
    __metadata("design:returntype", Promise)
], ActiviySessionController.prototype, "create", null);
__decorate([
    routing_controllers_1.Get('/:id'),
    __param(0, routing_controllers_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ActiviySessionController.prototype, "getOne", null);
__decorate([
    routing_controllers_1.Patch('/:id'),
    __param(0, routing_controllers_1.Ctx()),
    __param(1, routing_controllers_1.Param('id')),
    __param(2, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Activity_1.SessionModel]),
    __metadata("design:returntype", Promise)
], ActiviySessionController.prototype, "edit", null);
ActiviySessionController = __decorate([
    routing_controllers_1.JsonController('/activity/session')
], ActiviySessionController);
exports.ActiviySessionController = ActiviySessionController;
//# sourceMappingURL=Session.js.map