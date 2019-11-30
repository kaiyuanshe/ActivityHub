import { Object as LCObject, Query } from 'leanengine';
import {
    JsonController,
    Post,
    Ctx,
    UnauthorizedError,
    Param,
    ForbiddenError,
    Body,
    Get,
    Patch
} from 'routing-controllers';
import { LCContext } from '../../utility';

import { SessionSubmitModel } from '../../model/Activity';

const SessionSubmit = LCObject.extend('SessionSubmit');

@JsonController('/activity')
export class SessionSubmitController {
    @Post('/session/:sid/submit')
    async create(
        @Ctx() { currentUser }: LCContext,
        @Param('sid') sid: string,
        @Body() { activityId, mentorIds = [], adopted }: SessionSubmitModel
    ) {
        if (!currentUser) throw new UnauthorizedError();

        const session = LCObject.createWithoutData('Session', sid);

        await session.fetch();

        if (session.get('owner').id !== currentUser.id)
            throw new ForbiddenError();

        const submit = new SessionSubmit();

        await submit.save({
            session,
            activity: LCObject.createWithoutData('Activity', activityId),
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
        const submit = LCObject.createWithoutData('SessionSubmit', id);

        await submit.fetch();

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

        await submit.fetch();

        if (submit.get('mentors')[0].id !== currentUser.id)
            throw new ForbiddenError();

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
        return new Query('SessionSubmit')
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

        const activity = LCObject.createWithoutData('Activity', aid);

        await activity.fetch();

        if (activity.get('owner').id !== currentUser.id)
            throw new ForbiddenError();

        const submit = LCObject.createWithoutData('SessionSubmit', id);

        await submit.save({ adopted });

        return submit.toJSON();
    }
}
