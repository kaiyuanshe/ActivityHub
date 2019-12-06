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
const Organization_1 = require("../../model/Organization");
const Activity_1 = require("../../model/Activity");
class Activity extends leanengine_1.Object {
}
exports.Activity = Activity;
let ActivityController = class ActivityController {
    static async assertAdmin(aid, user) {
        const activity = await new leanengine_1.Query(Activity).get(aid);
        const organization = activity.get('organization');
        const isAdmin = organization
            ? (await user.getRoles()).find(role => role.getName() ===
                `${organization.id}_${Organization_1.MemberRole.Admin}`)
            : activity.get('owner').id === user.id;
        if (isAdmin)
            return activity;
        throw new routing_controllers_1.ForbiddenError();
    }
    static async setAdminACL(activity, acl) {
        const organization = activity.get('organization');
        if (organization)
            acl.setRoleWriteAccess(await new leanengine_1.Query(leanengine_1.Role)
                .equalTo('name', `${organization.id}_${Organization_1.MemberRole.Admin}`)
                .first(), true);
        else
            acl.setWriteAccess(activity.get('owner'), true);
    }
    async create({ currentUser }, _a) {
        var { startTime, endTime, organizationId } = _a, rest = __rest(_a, ["startTime", "endTime", "organizationId"]);
        if (!currentUser)
            throw new routing_controllers_1.UnauthorizedError();
        const activity = new Activity().setACL(await utility_1.createAdminACL(currentUser, organizationId));
        await activity.save(Object.assign(Object.assign({}, rest), { startTime: new Date(startTime), endTime: new Date(endTime), owner: currentUser, organization: organizationId &&
                leanengine_1.Object.createWithoutData('Organization', organizationId) }));
        return activity.toJSON();
    }
    async getOne(id) {
        const activity = await new leanengine_1.Query(Activity).get(id);
        return activity.toJSON();
    }
    async edit({ currentUser }, id, _a) {
        var { startTime, endTime } = _a, rest = __rest(_a, ["startTime", "endTime"]);
        if (!currentUser)
            throw new routing_controllers_1.UnauthorizedError();
        const activity = leanengine_1.Object.createWithoutData('Activity', id);
        await activity
            .set(Object.assign(Object.assign({}, rest), { startTime: new Date(startTime), endTime: new Date(endTime), owner: currentUser }))
            .save();
        return activity.toJSON();
    }
    getList(pageSize = 10, pageIndex = 1) {
        return new leanengine_1.Query(Activity)
            .limit(pageSize)
            .skip(pageSize * --pageIndex)
            .find();
    }
};
__decorate([
    routing_controllers_1.Post(),
    __param(0, routing_controllers_1.Ctx()),
    __param(1, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Activity_1.ActivityModel]),
    __metadata("design:returntype", Promise)
], ActivityController.prototype, "create", null);
__decorate([
    routing_controllers_1.Get('/:id'),
    __param(0, routing_controllers_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ActivityController.prototype, "getOne", null);
__decorate([
    routing_controllers_1.Patch('/:id'),
    __param(0, routing_controllers_1.Ctx()),
    __param(1, routing_controllers_1.Param('id')),
    __param(2, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Activity_1.ActivityModel]),
    __metadata("design:returntype", Promise)
], ActivityController.prototype, "edit", null);
__decorate([
    routing_controllers_1.Get(),
    __param(0, routing_controllers_1.QueryParam('pageSize')),
    __param(1, routing_controllers_1.QueryParam('pageIndex')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ActivityController.prototype, "getList", null);
ActivityController = __decorate([
    routing_controllers_1.JsonController('/activity')
], ActivityController);
exports.ActivityController = ActivityController;
//# sourceMappingURL=Activity.js.map