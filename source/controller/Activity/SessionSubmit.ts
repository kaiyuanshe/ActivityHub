import { Object as LCObject, Query } from 'leanengine';
import {
    JsonController,
    Post,
    Ctx,
    UnauthorizedError,
    Param,
    Body,
    Get,
    Patch
} from 'routing-controllers';

import { LCContext, createAdminACL } from '../../utility';
import { SessionSubmitModel } from '../../model/Activity';
import { ActiviySessionController } from './Session';
import { Activity, ActivityController } from './Activity';

export class SessionSubmit extends LCObject {}

@JsonController('/activity')
export class SessionSubmitController {
    @Post('/session/:sid/submit')
    async create(
        @Ctx() { currentUser }: LCContext,
        @Param('sid') sid: string,
        @Body() { activityId, mentorIds = [], adopted }: SessionSubmitModel
    ) {
        if (!currentUser) throw new UnauthorizedError();

        const session = await ActiviySessionController.assertOwner(
            sid,
            currentUser
        );

        const activity = await new Query(Activity).get(activityId),
            acl = await createAdminACL(currentUser);

        await ActivityController.setAdminACL(activity, acl);

        const submit = new SessionSubmit().setACL(acl);

        await submit.save({
            session,
            activity,
            mentors: [
                currentUser,
                ...mentorIds.map(id => LCObject.createWithoutData('_User', id))
            ],
            adopted: false
        });

        return submit.toJSON();
    }

    @Get('/session/submit/:id')
    async getOne(@Param('id') id: string) {
        const submit = await new Query(SessionSubmit).get(id);

        return submit.toJSON();
    }

    @Patch('/session/submit/:id')
    async edit(
        @Ctx() { currentUser }: LCContext,
        @Param('id') id: string,
        @Body() { activityId, mentorIds = [], adopted }: SessionSubmitModel
    ) {
        if (!currentUser) throw new UnauthorizedError();

        const submit = LCObject.createWithoutData('SessionSubmit', id);

        await submit.save({
            activity: LCObject.createWithoutData('Activity', activityId),
            mentors: [
                currentUser,
                ...mentorIds.map(id => LCObject.createWithoutData('_User', id))
            ]
        });

        return submit.toJSON();
    }

    @Get('/:aid/session/submit')
    getList(@Param('aid') aid: string) {
        return new Query(SessionSubmit)
            .equalTo('activity', LCObject.createWithoutData('Activity', aid))
            .find();
    }

    @Patch('/:aid/session/submit/:id')
    async adopt(
        @Ctx() { currentUser }: LCContext,
        @Param('aid') aid: string,
        @Param('id') id: string,
        @Body() { adopted }: SessionSubmitModel
    ) {
        if (!currentUser) throw new UnauthorizedError();

        const submit = LCObject.createWithoutData('SessionSubmit', id);

        await submit.save({ adopted });

        return submit.toJSON();
    }
}
