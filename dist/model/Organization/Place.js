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
const class_validator_1 = require("class-validator");
var PlaceType;
(function (PlaceType) {
    PlaceType[PlaceType["Room"] = 0] = "Room";
    PlaceType[PlaceType["Hall"] = 1] = "Hall";
    PlaceType[PlaceType["Cafe"] = 2] = "Cafe";
    PlaceType[PlaceType["Restaurant"] = 3] = "Restaurant";
})(PlaceType = exports.PlaceType || (exports.PlaceType = {}));
var DeviceType;
(function (DeviceType) {
    DeviceType[DeviceType["Network"] = 0] = "Network";
    DeviceType[DeviceType["Projector"] = 1] = "Projector";
    DeviceType[DeviceType["LED"] = 2] = "LED";
    DeviceType[DeviceType["Microphone"] = 3] = "Microphone";
})(DeviceType = exports.DeviceType || (exports.DeviceType = {}));
class PlaceModel {
}
__decorate([
    class_validator_1.IsEnum(PlaceType),
    __metadata("design:type", Number)
], PlaceModel.prototype, "type", void 0);
__decorate([
    class_validator_1.Length(3),
    __metadata("design:type", String)
], PlaceModel.prototype, "name", void 0);
__decorate([
    class_validator_1.Length(10),
    __metadata("design:type", String)
], PlaceModel.prototype, "address", void 0);
__decorate([
    class_validator_1.IsPositive(),
    __metadata("design:type", Number)
], PlaceModel.prototype, "size", void 0);
__decorate([
    class_validator_1.IsArray(),
    __metadata("design:type", Array)
], PlaceModel.prototype, "devices", void 0);
__decorate([
    class_validator_1.IsArray(),
    __metadata("design:type", Array)
], PlaceModel.prototype, "openWeekDays", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], PlaceModel.prototype, "openTime", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], PlaceModel.prototype, "closeTime", void 0);
exports.PlaceModel = PlaceModel;
//# sourceMappingURL=Place.js.map