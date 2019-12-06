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
const Organization_1 = require("../../model/Organization");
class Organization extends leanengine_1.Object {
}
exports.Organization = Organization;
let OrganizationController = class OrganizationController {
    static async assertAdmin(user, oid) {
        if (!user)
            throw new routing_controllers_1.UnauthorizedError();
        const isAdmin = (await user.getRoles()).find(role => role.getName().split('_')[0] === oid);
        if (!isAdmin)
            throw new routing_controllers_1.ForbiddenError();
    }
    createRole(user, name) {
        const acl = new leanengine_1.ACL();
        acl.setPublicReadAccess(true),
            acl.setPublicWriteAccess(false),
            acl.setWriteAccess(user, true);
        return new leanengine_1.Role(name, acl);
    }
    async create({ currentUser }, body) {
        if (!currentUser)
            throw new routing_controllers_1.UnauthorizedError();
        const organization = new Organization();
        await organization.save(body);
        const admin = this.createRole(currentUser, `${organization.id}_${Organization_1.MemberRole.Admin}`);
        admin.getUsers().add(currentUser);
        await admin.save();
        await this.createRole(currentUser, `${organization.id}_${Organization_1.MemberRole.Worker}`).save();
        const acl = new leanengine_1.ACL();
        acl.setPublicReadAccess(true),
            acl.setPublicWriteAccess(false),
            acl.setRoleWriteAccess(admin, true);
        await organization.setACL(acl).save();
        return organization.toJSON();
    }
    async getOne(id) {
        const organization = await new leanengine_1.Query(Organization).get(id);
        return organization.toJSON();
    }
    getList(pageSize = 10, pageIndex = 1) {
        return new leanengine_1.Query(Organization)
            .limit(pageSize)
            .skip(pageSize * --pageIndex)
            .find();
    }
    async edit({ currentUser }, id, body) {
        if (!currentUser)
            throw new routing_controllers_1.UnauthorizedError();
        const duplicate = await leanengine_1.Query.or(new leanengine_1.Query(Organization).equalTo('name', body.name), new leanengine_1.Query(Organization).equalTo('englishName', body.englishName)).first();
        if (duplicate)
            throw new routing_controllers_1.BadRequestError();
        const organization = leanengine_1.Object.createWithoutData('Organization', id);
        await organization.set(body).save();
        return organization.toJSON();
    }
    async addMember({ currentUser }, id, { roleType, userId }) {
        if (!currentUser)
            throw new routing_controllers_1.UnauthorizedError();
        const role = await new leanengine_1.Query(leanengine_1.Role)
            .equalTo('name', `${id}_${roleType}`)
            .first();
        if (!role)
            throw new routing_controllers_1.BadRequestError();
        role.getUsers().add(leanengine_1.Object.createWithoutData('_User', userId));
        await role.save();
    }
    async deleteMember({ currentUser }, id, { roleType, userId }) {
        if (!currentUser)
            throw new routing_controllers_1.UnauthorizedError();
        const role = await new leanengine_1.Query(leanengine_1.Role)
            .equalTo('name', `${id}_${roleType}`)
            .first();
        if (!role)
            throw new routing_controllers_1.BadRequestError();
        role.getUsers().remove(leanengine_1.Object.createWithoutData('_User', userId));
        await role.save();
    }
    async getMemberList(id, roleType = '') {
        const roles = await new leanengine_1.Query(leanengine_1.Role)
            .startsWith('name', `${id}_${roleType}`)
            .find();
        const users = await Promise.all(roles.map(role => role
            .getUsers()
            .query()
            .find()));
        return users.flat();
    }
};
__decorate([
    routing_controllers_1.Post(),
    __param(0, routing_controllers_1.Ctx()),
    __param(1, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Organization_1.OrganizationModel]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "create", null);
__decorate([
    routing_controllers_1.Get('/:id'),
    __param(0, routing_controllers_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "getOne", null);
__decorate([
    routing_controllers_1.Get(),
    __param(0, routing_controllers_1.QueryParam('pageSize')),
    __param(1, routing_controllers_1.QueryParam('pageIndex')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OrganizationController.prototype, "getList", null);
__decorate([
    routing_controllers_1.Patch('/:id'),
    __param(0, routing_controllers_1.Ctx()),
    __param(1, routing_controllers_1.Param('id')),
    __param(2, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Organization_1.OrganizationModel]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "edit", null);
__decorate([
    routing_controllers_1.Post('/:id/member'),
    routing_controllers_1.OnUndefined(201),
    __param(0, routing_controllers_1.Ctx()),
    __param(1, routing_controllers_1.Param('id')),
    __param(2, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Organization_1.MemberModel]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "addMember", null);
__decorate([
    routing_controllers_1.Delete('/:id/member'),
    routing_controllers_1.OnUndefined(204),
    __param(0, routing_controllers_1.Ctx()),
    __param(1, routing_controllers_1.Param('id')),
    __param(2, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Organization_1.MemberModel]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "deleteMember", null);
__decorate([
    routing_controllers_1.Get('/:id/member'),
    __param(0, routing_controllers_1.Param('id')),
    __param(1, routing_controllers_1.QueryParam('roleType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "getMemberList", null);
OrganizationController = __decorate([
    routing_controllers_1.JsonController('/organization')
], OrganizationController);
exports.OrganizationController = OrganizationController;
//# sourceMappingURL=Organization.js.map