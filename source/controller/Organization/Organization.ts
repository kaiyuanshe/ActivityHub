import { Object as LCObject, Query } from 'leanengine';
import {
    JsonController,
    Post,
    Ctx,
    Body,
    UnauthorizedError,
    ForbiddenError,
    Get,
    Param,
    QueryParam,
    Patch,
    BadRequestError
} from 'routing-controllers';

import { LCContext } from '../../utility';
import { OrganizationModel } from '../../model/Organization';

const Organization = LCObject.extend('Organization');

@JsonController('/organization')
export class OrganizationController {
    @Post()
    async create(
        @Ctx() { currentUser }: LCContext,
        @Body() body: OrganizationModel
    ) {
        if (!currentUser) throw new UnauthorizedError();

        const activity = await new Query('Activity')
            .equalTo('owner', currentUser)
            .greaterThan('endTime', new Date())
            .first();

        if (!activity) throw new ForbiddenError();

        const organization = new Organization();

        await organization.save(body);

        return organization.toJSON();
    }

    @Get('/:id')
    async getOne(@Param('id') id: string) {
        const organization = LCObject.createWithoutData('Organization', id);

        await organization.fetch();

        return organization.toJSON();
    }

    @Get()
    getList(
        @QueryParam('pageSize') pageSize = 10,
        @QueryParam('pageIndex') pageIndex = 1
    ) {
        return new Query('Organization')
            .limit(pageSize)
            .skip(pageSize * --pageIndex)
            .find();
    }

    @Patch('/:id')
    async edit(
        @Ctx() { currentUser }: LCContext,
        @Param('id') id: string,
        @Body() body: OrganizationModel
    ) {
        if (!currentUser) throw new UnauthorizedError();

        const cooperation = await new Query('Cooperation')
            .equalTo(
                'organization',
                LCObject.createWithoutData('Organization', id)
            )
            .equalTo('contactUser', currentUser)
            .greaterThan('endTime', new Date())
            .first();

        if (!cooperation) throw new ForbiddenError();

        const duplicate = await new Query('Organization')
            .equalTo('name', body.name)
            .first();

        if (duplicate) throw new BadRequestError();

        const organization = LCObject.createWithoutData('Organization', id);

        await organization.set(body).save();

        return organization.toJSON();
    }
}
