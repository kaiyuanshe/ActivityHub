import { Object as LCObject, Query } from 'leanengine';
import {
    JsonController,
    Post,
    Ctx,
    Param,
    Body,
    UnauthorizedError,
    ForbiddenError,
    Get,
    QueryParam,
    Patch
} from 'routing-controllers';

import { LCContext } from '../../utility';
import { CooperationModel } from '../../model/Organization';

const Cooperation = LCObject.extend('Cooperation');

@JsonController('/organization')
export class CooperationController {
    @Post('/:oid/cooperation')
    async create(
        @Ctx() { currentUser }: LCContext,
        @Param('oid') oid: string,
        @Body() { activityId, contactId, ...rest }: CooperationModel
    ) {
        if (!currentUser) throw new UnauthorizedError();

        const activity = await new Query('Activity')
            .equalTo('id', activityId)
            .equalTo('owner', currentUser)
            .first();

        if (!activity) throw new ForbiddenError();

        const cooperation = new Cooperation();

        await cooperation.save({
            ...rest,
            organization: LCObject.createWithoutData('Organization', oid),
            contactUser: LCObject.createWithoutData('_User', contactId),
            activity,
            endTime: activity.get('endTime')
        });

        return cooperation.toJSON();
    }

    @Get('/:oid/cooperation')
    async getList(
        @Param('oid') oid: string,
        @QueryParam('pageSize') pageSize = 10,
        @QueryParam('pageIndex') pageIndex = 1
    ) {
        return new Query('Cooperation')
            .equalTo(
                'organization',
                LCObject.createWithoutData('Organization', oid)
            )
            .limit(pageSize)
            .skip(pageSize * --pageIndex)
            .find();
    }

    @Patch('/cooperation/:id')
    async edit(
        @Ctx() { currentUser }: LCContext,
        @Param('id') id: string,
        @Body() { activityId, ...rest }: CooperationModel
    ) {
        if (!currentUser) throw new UnauthorizedError();

        const activity = await new Query('Activity')
            .equalTo('id', activityId)
            .equalTo('owner', currentUser)
            .first();

        const cooperation = await new Query('Cooperation')
            .equalTo('id', id)
            .equalTo('activity', activity)
            .first();

        if (!activity || !cooperation) throw new ForbiddenError();

        await cooperation.set(rest).save();

        return cooperation.toJSON();
    }
}
