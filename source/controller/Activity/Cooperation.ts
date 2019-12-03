import { Object as LCObject, Query } from 'leanengine';
import {
    JsonController,
    Post,
    Ctx,
    Param,
    Body,
    Get,
    QueryParam,
    Patch
} from 'routing-controllers';

import { LCContext } from '../../utility';
import { CooperationModel } from '../../model/Activity';
import { ActivityController } from './Activity';

export class Cooperation extends LCObject {}

@JsonController('/activity')
export class CooperationController {
    @Post('/:aid/cooperation')
    async create(
        @Ctx() { currentUser }: LCContext,
        @Param('aid') aid: string,
        @Body() { organizationId, contactId, ...rest }: CooperationModel
    ) {
        const activity = await ActivityController.assertAdmin(currentUser, aid);

        const cooperation = new Cooperation();

        await cooperation.save({
            ...rest,
            activity,
            organization: LCObject.createWithoutData(
                'Organization',
                organizationId
            ),
            contactUser: LCObject.createWithoutData('_User', contactId)
        });

        return cooperation.toJSON();
    }

    @Get('/:aid/cooperation')
    async getList(
        @Param('aid') aid: string,
        @QueryParam('pageSize') pageSize = 10,
        @QueryParam('pageIndex') pageIndex = 1
    ) {
        return new Query(Cooperation)
            .equalTo('activity', LCObject.createWithoutData('Activity', aid))
            .limit(pageSize)
            .skip(pageSize * --pageIndex)
            .find();
    }

    @Patch(':aid/cooperation/:id')
    async edit(
        @Ctx() { currentUser }: LCContext,
        @Param('aid') aid: string,
        @Param('id') id: string,
        @Body() body: CooperationModel
    ) {
        await ActivityController.assertAdmin(currentUser, aid);

        const cooperation = LCObject.createWithoutData(Cooperation, id);

        await cooperation.save(body);

        return cooperation.toJSON();
    }
}
