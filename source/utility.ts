import { Context } from 'koa';
import { User, ACL, Query, Role } from 'leanengine';

import { MemberRole } from './model/Organization';

export interface LCUser extends User {
    logOut(): any;
}

export interface LCContext extends Context {
    saveCurrentUser(user: User): any;
    currentUser: LCUser;
    clearCurrentUser(): any;
}

export async function createAdminACL(user: User, oid?: string) {
    const acl = new ACL();

    acl.setPublicReadAccess(true), acl.setPublicWriteAccess(false);

    if (!oid) acl.setWriteAccess(user, true);
    else {
        const role = await new Query(Role)
            .equalTo('name', `${oid}_${MemberRole.Admin}`)
            .first();

        acl.setRoleWriteAccess(role, true);
    }

    return acl;
}
