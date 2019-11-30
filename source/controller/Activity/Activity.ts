import { Object as LCObject, Query } from 'leanengine';
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

import { LCContext } from '../../utility';
import { ActivityModel } from '../../model/Activity';

const Activity = LCObject.extend('Activity');

@JsonController('/activity')
export class ActivityController {
    @Post()
    async create(
        @Ctx() { currentUser }: LCContext,
        @Body() { startTime, endTime, ...rest }: ActivityModel
    ): Promise<ActivityModel> {
        if (!currentUser) throw new UnauthorizedError();

        const activity = new Activity();

        await activity.save({
            ...rest,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            owner: currentUser
        });

        return activity.toJSON();
    }

    @Get('/:id')
    async getOne(@Param('id') id: string): Promise<ActivityModel> {
        const activity = LCObject.createWithoutData('Activity', id);

        await activity.fetch();

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

        await activity.fetch();

        if (activity.get('owner').id !== currentUser.id)
            throw new ForbiddenError();

        await activity.save({
            ...rest,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            owner: currentUser
        });

        return activity.toJSON();
    }

    @Get()
    getList(
        @QueryParam('pageSize') pageSize = 10,
        @QueryParam('pageIndex') pageIndex = 1
    ) {
        return new Query('Activity')
            .limit(pageSize)
            .skip(pageSize * --pageIndex)
            .find();
    }
}
