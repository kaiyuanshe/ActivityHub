import { Object as LCObject, Query, User } from 'leanengine';
import {
    JsonController,
    Post,
    Ctx,
    Body,
    UnauthorizedError,
    Get,
    Param,
    Patch,
    ForbiddenError
} from 'routing-controllers';

import { LCContext, createAdminACL } from '../../utility';
import { SessionModel } from '../../model/Activity';

export class Session extends LCObject {}

@JsonController('/activity/session')
export class ActiviySessionController {
    static async assertOwner(id: string, user: User) {
        const session = await new Query(Session)
            .equalTo('id', id)
            .equalTo('owner', user)
            .first();

        if (session) return session;

        throw new ForbiddenError();
    }

    @Post()
    async create(
        @Ctx() { currentUser }: LCContext,
        @Body() body: SessionModel
    ): Promise<SessionModel> {
        if (!currentUser) throw new UnauthorizedError();

        const session = new Session().setACL(await createAdminACL(currentUser));

        await session.save({ ...body, owner: currentUser });

        return session.toJSON();
    }

    @Get('/:id')
    async getOne(@Param('id') id: string): Promise<SessionModel> {
        const session = await new Query(Session).get(id);

        return session.toJSON();
    }

    @Patch('/:id')
    async edit(
        @Ctx() { currentUser }: LCContext,
        @Param('id') id: string,
        @Body() body: SessionModel
    ): Promise<SessionModel> {
        if (!currentUser) throw new UnauthorizedError();

        const session = LCObject.createWithoutData('Session', id);

        await session.save({ ...body, owner: currentUser });

        return session.toJSON();
    }
}
