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
const Session_1 = require("./Session");
const Activity_2 = require("./Activity");
class SessionSubmit extends leanengine_1.Object {
}
exports.SessionSubmit = SessionSubmit;
let SessionSubmitController = class SessionSubmitController {
    async create({ currentUser }, sid, { activityId, mentorIds = [], adopted }) {
        if (!currentUser)
            throw new routing_controllers_1.UnauthorizedError();
        const session = await Session_1.ActiviySessionController.assertOwner(sid, currentUser);
        const activity = await new leanengine_1.Query(Activity_2.Activity).get(activityId), acl = await utility_1.createAdminACL(currentUser);
        await Activity_2.ActivityController.setAdminACL(activity, acl);
        const submit = new SessionSubmit().setACL(acl);
        await submit.save({
            session,
            activity,
            mentors: [
                currentUser,
                ...mentorIds.map(id => leanengine_1.Object.createWithoutData('_User', id))
            ],
            adopted: false
        });
        return submit.toJSON();
    }
    async getOne(id) {
        const submit = await new leanengine_1.Query(SessionSubmit).get(id);
        return submit.toJSON();
    }
    async edit({ currentUser }, id, { activityId, mentorIds = [], adopted }) {
        if (!currentUser)
            throw new routing_controllers_1.UnauthorizedError();
        const submit = leanengine_1.Object.createWithoutData('SessionSubmit', id);
        await submit.save({
            activity: leanengine_1.Object.createWithoutData('Activity', activityId),
            mentors: [
                currentUser,
                ...mentorIds.map(id => leanengine_1.Object.createWithoutData('_User', id))
            ]
        });
        return submit.toJSON();
    }
    getList(aid) {
        return new leanengine_1.Query(SessionSubmit)
            .equalTo('activity', leanengine_1.Object.createWithoutData('Activity', aid))
            .find();
    }
    async adopt({ currentUser }, aid, id, { adopted }) {
        if (!currentUser)
            throw new routing_controllers_1.UnauthorizedError();
        const submit = leanengine_1.Object.createWithoutData('SessionSubmit', id);
        await submit.save({ adopted });
        return submit.toJSON();
    }
};
__decorate([
    routing_controllers_1.Post('/session/:sid/submit'),
    __param(0, routing_controllers_1.Ctx()),
    __param(1, routing_controllers_1.Param('sid')),
    __param(2, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Activity_1.SessionSubmitModel]),
    __metadata("design:returntype", Promise)
], SessionSubmitController.prototype, "create", null);
__decorate([
    routing_controllers_1.Get('/session/submit/:id'),
    __param(0, routing_controllers_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SessionSubmitController.prototype, "getOne", null);
__decorate([
    routing_controllers_1.Patch('/session/submit/:id'),
    __param(0, routing_controllers_1.Ctx()),
    __param(1, routing_controllers_1.Param('id')),
    __param(2, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Activity_1.SessionSubmitModel]),
    __metadata("design:returntype", Promise)
], SessionSubmitController.prototype, "edit", null);
__decorate([
    routing_controllers_1.Get('/:aid/session/submit'),
    __param(0, routing_controllers_1.Param('aid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SessionSubmitController.prototype, "getList", null);
__decorate([
    routing_controllers_1.Patch('/:aid/session/submit/:id'),
    __param(0, routing_controllers_1.Ctx()),
    __param(1, routing_controllers_1.Param('aid')),
    __param(2, routing_controllers_1.Param('id')),
    __param(3, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Activity_1.SessionSubmitModel]),
    __metadata("design:returntype", Promise)
], SessionSubmitController.prototype, "adopt", null);
SessionSubmitController = __decorate([
    routing_controllers_1.JsonController('/activity')
], SessionSubmitController);
exports.SessionSubmitController = SessionSubmitController;
//# sourceMappingURL=SessionSubmit.js.map