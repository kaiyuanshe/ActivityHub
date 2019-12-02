import { Object as LCObject, Query } from 'leanengine';
import {
    JsonController,
    Post,
    Ctx,
    Body,
    UnauthorizedError,
    Get,
    Param,
    QueryParam,
    Patch,
    BadRequestError
} from 'routing-controllers';

import { LCContext } from '../../utility';
import { OrganizationModel, MemberRole } from '../../model/Organization';
import { Membership, MembershipController } from './Membership';

export class Organization extends LCObject {}

@JsonController('/organization')
export class OrganizationController {
    @Post()
    async create(
        @Ctx() { currentUser }: LCContext,
        @Body() body: OrganizationModel
    ) {
        if (!currentUser) throw new UnauthorizedError();

        const organization = new Organization();

        await organization.save(body);

        const membership = new Membership();

        await membership.save({
            user: currentUser,
            organization,
            role: MemberRole.Admin
        });

        return organization.toJSON();
    }

    @Get('/:id')
    async getOne(@Param('id') id: string) {
        const organization = await new Query(Organization).get(id);

        await organization.fetch();

        return organization.toJSON();
    }

    @Get()
    getList(
        @QueryParam('pageSize') pageSize = 10,
        @QueryParam('pageIndex') pageIndex = 1
    ) {
        return new Query(Organization)
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
        await MembershipController.assertAdmin(currentUser, id);

        const duplicate = await Query.or(
            new Query(Organization).equalTo('name', body.name),
            new Query(Organization).equalTo('englishName', body.englishName)
        ).first();

        if (duplicate) throw new BadRequestError();

        const organization = LCObject.createWithoutData('Organization', id);

        await organization.set(body).save();

        return organization.toJSON();
    }
}
