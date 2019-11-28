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
    QueryParam
} from 'routing-controllers';

import { ActivityModel } from '../model/Activity';
import { Context } from 'koa';

const Activity = LCObject.extend('Activity');

@JsonController('/activity')
export default class ActivityController {
    @Post()
    async create(@Ctx() { currentUser }: Context, @Body() body: ActivityModel) {
        if (!currentUser) throw new UnauthorizedError();

        const activity = new Activity();

        await activity.save(body);

        return activity.toJSON();
    }

    @Get('/:id')
    async getOne(@Param('id') id: string) {
        const activity = LCObject.createWithoutData('Activity', id);

        await activity.fetch();

        return activity.toJSON();
    }

    @Patch('/:id')
    async edit(
        @Ctx() { currentUser }: Context,
        @Param('id') id: string,
        @Body() body: ActivityModel
    ) {
        if (!currentUser) throw new UnauthorizedError();

        const activity = LCObject.createWithoutData('Activity', id);

        await activity.save(body);

        return activity.toJSON();
    }

    @Get()
    getList(@QueryParam('pageSize') pageSize = 10) {
        return new Query('Activity').limit(pageSize).find();
    }
}
