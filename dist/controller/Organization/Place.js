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
const Organization_2 = require("./Organization");
class Place extends leanengine_1.Object {
}
exports.Place = Place;
let PlaceController = class PlaceController {
    async create({ currentUser }, oid, _a) {
        var { address } = _a, rest = __rest(_a, ["address"]);
        await Organization_2.OrganizationController.assertAdmin(currentUser, oid);
        const place = new Place(), organization = leanengine_1.Object.createWithoutData('Organization', oid);
        if (!address) {
            await organization.fetch();
            address = organization.get('address');
        }
        await place.setACL(await utility_1.createAdminACL(currentUser, oid)).save(Object.assign(Object.assign({}, rest), { address,
            organization }));
        return place.toJSON();
    }
    async getOne(id) {
        const place = await new leanengine_1.Query(Place).get(id);
        return place.toJSON();
    }
    async edit({ currentUser }, oid, id, body) {
        if (!currentUser)
            throw new routing_controllers_1.UnauthorizedError();
        const place = leanengine_1.Object.createWithoutData('Place', id);
        await place.save(Object.assign(Object.assign({}, body), { organization: leanengine_1.Object.createWithoutData('Organization', oid) }));
        return place.toJSON();
    }
    getList(oid, pageSize = 10, pageIndex = 1) {
        return new leanengine_1.Query(Place)
            .equalTo('organization', leanengine_1.Object.createWithoutData('Organization', oid))
            .limit(pageSize)
            .skip(pageSize * --pageIndex)
            .find();
    }
};
__decorate([
    routing_controllers_1.Post('/:oid/place'),
    __param(0, routing_controllers_1.Ctx()),
    __param(1, routing_controllers_1.Param('oid')),
    __param(2, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Organization_1.PlaceModel]),
    __metadata("design:returntype", Promise)
], PlaceController.prototype, "create", null);
__decorate([
    routing_controllers_1.Get('/place/:id'),
    __param(0, routing_controllers_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlaceController.prototype, "getOne", null);
__decorate([
    routing_controllers_1.Patch('/:oid/place/:id'),
    __param(0, routing_controllers_1.Ctx()),
    __param(1, routing_controllers_1.Param('oid')),
    __param(2, routing_controllers_1.Param('id')),
    __param(3, routing_controllers_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Organization_1.PlaceModel]),
    __metadata("design:returntype", Promise)
], PlaceController.prototype, "edit", null);
__decorate([
    routing_controllers_1.Get('/:oid/place'),
    __param(0, routing_controllers_1.Param('oid')),
    __param(1, routing_controllers_1.QueryParam('pageSize')),
    __param(2, routing_controllers_1.QueryParam('pageIndex')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], PlaceController.prototype, "getList", null);
PlaceController = __decorate([
    routing_controllers_1.JsonController('/organization')
], PlaceController);
exports.PlaceController = PlaceController;
//# sourceMappingURL=Place.js.map