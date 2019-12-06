"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const leanengine_1 = require("leanengine");
const Organization_1 = require("./model/Organization");
async function createAdminACL(user, oid) {
    const acl = new leanengine_1.ACL();
    acl.setPublicReadAccess(true),
        acl.setPublicWriteAccess(false),
        acl.setWriteAccess(user, true);
    if (oid) {
        const role = await new leanengine_1.Query(leanengine_1.Role)
            .equalTo('name', `${oid}_${Organization_1.MemberRole.Admin}`)
            .first();
        acl.setRoleWriteAccess(role, true);
    }
    return acl;
}
exports.createAdminACL = createAdminACL;
//# sourceMappingURL=utility.js.map