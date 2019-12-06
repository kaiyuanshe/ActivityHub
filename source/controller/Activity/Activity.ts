import { Object as LCObject, User, Query, Role, ACL } from 'leanengine';
import {
    JsonController,
    Post,
    Ctx,
    Body,
    UnauthorizedError,
    Get,
    Param,
    Patch,
    QueryParam,
    ForbiddenError
} from 'routing-controllers';

import { LCContext, createAdminACL } from '../../utility';
import { MemberRole } from '../../model/Organization';
import { ActivityModel } from '../../model/Activity';

export class Activity extends LCObject {}

@JsonController('/activity')
export class ActivityController {
    static async assertAdmin(aid: string, user: User) {
        const activity = await new Query(Activity).get(aid);

        const organization = activity.get('organization');

        const isAdmin = organization
            ? (await user.getRoles()).find(
                  role =>
                      role.getName() ===
                      `${organization.id}_${MemberRole.Admin}`
              )
            : activity.get('owner').id === user.id;

        if (isAdmin) return activity;

        throw new ForbiddenError();
    }

    static async setAdminACL(activity: Activity, acl: ACL) {
        const organization = activity.get('organization');

        if (organization)
            acl.setRoleWriteAccess(
                await new Query(Role)
                    .equalTo('name', `${organization.id}_${MemberRole.Admin}`)
                    .first(),
                true
            );
        else acl.setWriteAccess(activity.get('owner'), true);
    }

    @Post()
    async create(
        @Ctx() { currentUser }: LCContext,
        @Body() { startTime, endTime, organizationId, ...rest }: ActivityModel
    ): Promise<ActivityModel> {
        if (!currentUser) throw new UnauthorizedError();

        const activity = new Activity().setACL(
            await createAdminACL(currentUser, organizationId)
        );

        await activity.save({
            ...rest,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            owner: currentUser,
            organization:
                organizationId &&
                LCObject.createWithoutData('Organization', organizationId)
        });

        return activity.toJSON();
    }

    @Get('/:id')
    async getOne(@Param('id') id: string): Promise<ActivityModel> {
        const activity = await new Query(Activity).get(id);

        return activity.toJSON();
    }

    @Patch('/:id')
    async edit(
        @Ctx() { currentUser }: LCContext,
        @Param('id') id: string,
        @Body() { startTime, endTime, ...rest }: ActivityModel
    ): Promise<ActivityModel> {
        if (!currentUser) throw new UnauthorizedError();

        const activity = LCObject.createWithoutData('Activity', id);

        await activity
            .set({
                ...rest,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                owner: currentUser
            })
            .save();

        return activity.toJSON();
    }

    @Get()
    getList(
        @QueryParam('pageSize') pageSize = 10,
        @QueryParam('pageIndex') pageIndex = 1
    ) {
        return new Query(Activity)
            .limit(pageSize)
            .skip(pageSize * --pageIndex)
            .find();
    }
}
