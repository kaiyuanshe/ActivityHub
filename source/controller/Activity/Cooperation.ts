import { Object as LCObject, Query } from 'leanengine';
import {
    JsonController,
    Post,
    Ctx,
    Param,
    Body,
    Get,
    QueryParam,
    Patch,
    UnauthorizedError
} from 'routing-controllers';

import { LCContext, createAdminACL } from '../../utility';
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
        const activity = await ActivityController.assertAdmin(aid, currentUser);

        const cooperation = new Cooperation().setACL(
            await createAdminACL(currentUser, activity.get('organization')?.id)
        );

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
        @Body() { organizationId, contactId, ...rest }: CooperationModel
    ) {
        if (!currentUser) throw new UnauthorizedError();

        const cooperation = LCObject.createWithoutData(Cooperation, id).set(
            rest
        );

        if (organizationId)
            cooperation.set(
                'organization',
                LCObject.createWithoutData('Organization', organizationId)
            );

        if (contactId)
            cooperation.set(
                'contactUser',
                LCObject.createWithoutData('_User', contactId)
            );

        await cooperation.save();

        return cooperation.toJSON();
    }
}
