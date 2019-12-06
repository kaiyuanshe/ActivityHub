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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const leanengine_1 = require("leanengine");
const routing_controllers_1 = require("routing-controllers");
const utility_1 = require("../../utility");
const Activity_1 = require("../../model/Activity");
const Activity_2 = require("./Activity");
class Cooperation extends leanengine_1.Object {
}
exports.Cooperation = Cooperation;
let CooperationController = class CooperationController {
    async create({ currentUser }, aid, _a) {
        var _b;
        var { organizationId, contactId } = _a, rest = __rest(_a, ["organizationId", "contactId"]);
        const activity = await Activity_2.ActivityController.assertAdmin(aid, currentUser);
        const cooperation = new Cooperation().setACL(await utility_1.createAdminACL(currentUser, (_b = activity.get('organization')) === null || _b === void 0 ? void 0 : _b.id));
        await cooperation.save(Object.assign(Object.assign({}, rest), { activity, organization: leanengine_1.Object.createWithoutData('Organization', organizationId), contactUser: leanengine_1.Object.createWithoutData('_User', contactId) }));
        return cooperation.toJSON();
    }
    async getList(aid, pageSize = 10, pageIndex = 1) {
        return new leanengine_1.Query(Cooperation)
            .equalTo('activity', leanengine_1.Object.createWithoutData('Activity', aid))
            .limit(pageSize)
            .skip(pageSize * --pageIndex)
            .find();
    }
    async edit({ currentUser }, aid, id, _a) {
        var { organizationId, contactId } = _a, rest = __rest(_a, ["organizationId", "contactId"]);
        if (!currentUser)
            throw new routing_controllers_1.UnauthorizedError();
        const cooperation = leanengine_1.Object.createWithoutData(Cooperation, id).set(rest);
        if (organizationId)
            cooperation.set('organization', leanengine_1.Object.createWithoutData('Organization', organizationId));
        if (contactId)
            cooperation.set('contactUser', leanengine_1.Object.createWithoutData('_User', contactId));
        await cooperation.save();
        return cooperation.toJSON();
    }
};
__decorate([
    routing_controllers_1.Post('/:aid/cooperation'),
    __param(0, routing_controllers_1.Ctx()),
    __param(1, routing_controllers_1.Param('aid')),
    __param(2, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Activity_1.CooperationModel]),
    __metadata("design:returntype", Promise)
], CooperationController.prototype, "create", null);
__decorate([
    routing_controllers_1.Get('/:aid/cooperation'),
    __param(0, routing_controllers_1.Param('aid')),
    __param(1, routing_controllers_1.QueryParam('pageSize')),
    __param(2, routing_controllers_1.QueryParam('pageIndex')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CooperationController.prototype, "getList", null);
__decorate([
    routing_controllers_1.Patch(':aid/cooperation/:id'),
    __param(0, routing_controllers_1.Ctx()),
    __param(1, routing_controllers_1.Param('aid')),
    __param(2, routing_controllers_1.Param('id')),
    __param(3, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Activity_1.CooperationModel]),
    __metadata("design:returntype", Promise)
], CooperationController.prototype, "edit", null);
CooperationController = __decorate([
    routing_controllers_1.JsonController('/activity')
], CooperationController);
exports.CooperationController = CooperationController;
//# sourceMappingURL=Cooperation.js.map