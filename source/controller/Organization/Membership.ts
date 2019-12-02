import { Object as LCObject, User, Query } from 'leanengine';
import {
    JsonController,
    Post,
    OnUndefined,
    Ctx,
    UnauthorizedError,
    ForbiddenError,
    Param,
    Body,
    Get,
    Patch,
    Delete
} from 'routing-controllers';

import { LCContext } from '../../utility';
import { MemberRole, MemberModel } from '../../model/Organization';

export class Membership extends LCObject {}

@JsonController('/organization')
export class MembershipController {
    static async assertAdmin(user: User, oid: string) {
        if (!user) throw new UnauthorizedError();

        const admin = await new Query(Membership)
            .equalTo('user', user)
            .equalTo(
                'organization',
                LCObject.createWithoutData('Organization', oid)
            )
            .equalTo('role', MemberRole.Admin)
            .first();

        if (!admin) throw new ForbiddenError();
    }

    @Post('/:id/member')
    @OnUndefined(201)
    async addMember(
        @Ctx() { currentUser }: LCContext,
        @Param('id') id: string,
        @Body() { userId, role }: MemberModel
    ) {
        await MembershipController.assertAdmin(currentUser, id);

        const membership = new Membership();

        await membership.save({
            user: LCObject.createWithoutData('_User', userId),
            organization: LCObject.createWithoutData('Organization', id),
            role
        });
    }

    @Get('/:id/member')
    getMemberList(@Param('id') id: string) {
        return new Query(Membership)
            .equalTo(
                'organization',
                LCObject.createWithoutData('Organization', id)
            )
            .find();
    }

    @Patch('/:id/member')
    @OnUndefined(204)
    async editMember(
        @Ctx() { currentUser }: LCContext,
        @Param('id') id: string,
        @Body() { userId, role }: MemberModel
    ) {
        await MembershipController.assertAdmin(currentUser, id);

        const membership = await new Query(Membership)
            .equalTo('user', LCObject.createWithoutData('_User', userId))
            .equalTo(
                'organization',
                LCObject.createWithoutData('Organization', id)
            )
            .first();

        await membership.save({ role });
    }

    @Delete('/:id/member/:uid')
    @OnUndefined(204)
    async deleteMember(
        @Ctx() { currentUser }: LCContext,
        @Param('id') id: string,
        @Param('uid') uid: string
    ) {
        await MembershipController.assertAdmin(currentUser, id);

        const membership = await new Query(Membership)
            .equalTo('user', LCObject.createWithoutData('_User', uid))
            .equalTo(
                'organization',
                LCObject.createWithoutData('Organization', id)
            )
            .first();

        await membership.destroy();
    }
}
