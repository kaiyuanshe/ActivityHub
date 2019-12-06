import { Object as LCObject, Query, ACL, User, Role } from 'leanengine';
import {
    JsonController,
    UnauthorizedError,
    ForbiddenError,
    Post,
    Ctx,
    Body,
    Get,
    Param,
    QueryParam,
    Patch,
    BadRequestError,
    OnUndefined,
    Delete
} from 'routing-controllers';

import { LCContext } from '../../utility';
import {
    OrganizationModel,
    MemberRole,
    MemberModel
} from '../../model/Organization';

export class Organization extends LCObject {}

@JsonController('/organization')
export class OrganizationController {
    static async assertAdmin(user: User, oid: string) {
        if (!user) throw new UnauthorizedError();

        const isAdmin = (await user.getRoles()).find(
            role => role.getName().split('_')[0] === oid
        );

        if (!isAdmin) throw new ForbiddenError();
    }

    createRole(user: User, name: string) {
        const acl = new ACL();

        acl.setPublicReadAccess(true),
            acl.setPublicWriteAccess(false),
            acl.setWriteAccess(user, true);

        return new Role(name, acl);
    }

    @Post()
    async create(
        @Ctx() { currentUser }: LCContext,
        @Body() body: OrganizationModel
    ) {
        if (!currentUser) throw new UnauthorizedError();

        const organization = new Organization();

        await organization.save(body);

        const admin = this.createRole(
            currentUser,
            `${organization.id}_${MemberRole.Admin}`
        );
        admin.getUsers().add(currentUser);
        await admin.save();

        await this.createRole(
            currentUser,
            `${organization.id}_${MemberRole.Worker}`
        ).save();

        const acl = new ACL();

        acl.setPublicReadAccess(true),
            acl.setPublicWriteAccess(false),
            acl.setRoleWriteAccess(admin, true);

        await organization.setACL(acl).save();

        return organization.toJSON();
    }

    @Get('/:id')
    async getOne(@Param('id') id: string) {
        const organization = await new Query(Organization).get(id);

        return organization.toJSON();
    }

    @Get()
    getList(
        @QueryParam('pageSize') pageSize = 10,
        @QueryParam('pageIndex') pageIndex = 1
    ) {
        return new Query(Organization)
            .limit(pageSize)
            .skip(pageSize * --pageIndex)
            .find();
    }

    @Patch('/:id')
    async edit(
        @Ctx() { currentUser }: LCContext,
        @Param('id') id: string,
        @Body() body: OrganizationModel
    ) {
        if (!currentUser) throw new UnauthorizedError();

        const duplicate = await Query.or(
            new Query(Organization).equalTo('name', body.name),
            new Query(Organization).equalTo('englishName', body.englishName)
        ).first();

        if (duplicate) throw new BadRequestError();

        const organization = LCObject.createWithoutData('Organization', id);

        await organization.set(body).save();

        return organization.toJSON();
    }

    @Post('/:id/member')
    @OnUndefined(201)
    async addMember(
        @Ctx() { currentUser }: LCContext,
        @Param('id') id: string,
        @Body() { roleType, userId }: MemberModel
    ) {
        if (!currentUser) throw new UnauthorizedError();

        const role = await new Query(Role)
            .equalTo('name', `${id}_${roleType}`)
            .first();

        if (!role) throw new BadRequestError();

        role.getUsers().add(LCObject.createWithoutData('_User', userId));

        await role.save();
    }

    @Delete('/:id/member')
    @OnUndefined(204)
    async deleteMember(
        @Ctx() { currentUser }: LCContext,
        @Param('id') id: string,
        @Body() { roleType, userId }: MemberModel
    ) {
        if (!currentUser) throw new UnauthorizedError();

        const role = await new Query(Role)
            .equalTo('name', `${id}_${roleType}`)
            .first();

        if (!role) throw new BadRequestError();

        role.getUsers().remove(LCObject.createWithoutData('_User', userId));

        await role.save();
    }

    @Get('/:id/member')
    async getMemberList(
        @Param('id') id: string,
        @QueryParam('roleType') roleType = ''
    ) {
        const roles = await new Query(Role)
            .startsWith('name', `${id}_${roleType}`)
            .find();

        const users = await Promise.all(
            roles.map(role =>
                role
                    .getUsers()
                    .query()
                    .find()
            )
        );

        return users.flat();
    }
}
