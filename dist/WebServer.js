"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const koa_1 = __importDefault(require("koa"));
const koa_logger_1 = __importDefault(require("koa-logger"));
const leanengine_1 = require("leanengine");
const routing_controllers_1 = require("routing-controllers");
const Main_1 = __importDefault(require("./controller/Main"));
const Session_1 = __importDefault(require("./controller/Session"));
const User_1 = require("./controller/User");
const Activity_1 = require("./controller/Activity");
const Organization_1 = require("./controller/Organization");
const { LEANCLOUD_APP_ID: appId, LEANCLOUD_APP_KEY: appKey, LEANCLOUD_APP_MASTER_KEY: masterKey, PORT, LEANCLOUD_APP_PORT: appPort } = process.env;
const port = parseInt(appPort || PORT || '8080');
leanengine_1.init({ appId, appKey, masterKey });
const app = new koa_1.default()
    .use(koa_logger_1.default())
    .use(leanengine_1.koa2())
    .use(
// @ts-ignore
leanengine_1.Cloud.CookieSession({
    framework: 'koa2',
    secret: appKey,
    fetchUser: true
}));
routing_controllers_1.useKoaServer(app, {
    cors: { credentials: true },
    controllers: [
        Activity_1.CooperationController,
        Activity_1.SessionSubmitController,
        Activity_1.ActiviySessionController,
        Activity_1.ActivityController,
        Organization_1.PlaceController,
        Organization_1.OrganizationController,
        User_1.UserController,
        Session_1.default,
        Main_1.default
    ]
});
app.listen(port, () => console.log('HTTP Server runs at http://localhost:' + port));
//# sourceMappingURL=WebServer.js.map