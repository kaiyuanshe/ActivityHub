import { Object as LCObject, Query } from 'leanengine';
import {
    JsonController,
    Post,
    Ctx,
    Param,
    Body,
    Get,
    Patch,
    UnauthorizedError,
    QueryParam
} from 'routing-controllers';

import { LCContext, createAdminACL } from '../../utility';
import { PlaceModel } from '../../model/Organization';
import { OrganizationController } from './Organization';

export class Place extends LCObject {}

@JsonController('/organization')
export class PlaceController {
    @Post('/:oid/place')
    async create(
        @Ctx() { currentUser }: LCContext,
        @Param('oid') oid: string,
        @Body() { address, ...rest }: PlaceModel
    ) {
        await OrganizationController.assertAdmin(currentUser, oid);

        const place = new Place(),
            organization = LCObject.createWithoutData('Organization', oid);

        if (!address) {
            await organization.fetch();

            address = organization.get('address');
        }

        await place.setACL(await createAdminACL(currentUser, oid)).save({
            ...rest,
            address,
            organization
        });

        return place.toJSON();
    }

    @Get('/place/:id')
    async getOne(@Param('id') id: string) {
        const place = await new Query(Place).get(id);

        return place.toJSON();
    }

    @Patch('/:oid/place/:id')
    async edit(
        @Ctx() { currentUser }: LCContext,
        @Param('oid') oid: string,
        @Param('id') id: string,
        @Body() body: PlaceModel
    ) {
        if (!currentUser) throw new UnauthorizedError();

        const place = LCObject.createWithoutData('Place', id);

        await place.save({
            ...body,
            organization: LCObject.createWithoutData('Organization', oid)
        });

        return place.toJSON();
    }

    @Get('/:oid/place')
    getList(
        @Param('oid') oid: string,
        @QueryParam('pageSize') pageSize = 10,
        @QueryParam('pageIndex') pageIndex = 1
    ) {
        return new Query(Place)
            .equalTo(
                'organization',
                LCObject.createWithoutData('Organization', oid)
            )
            .limit(pageSize)
            .skip(pageSize * --pageIndex)
            .find();
    }
}
