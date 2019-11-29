import { Object as LCObject } from 'leanengine';
import {
    JsonController,
    Post,
    Ctx,
    Body,
    UnauthorizedError,
    Get,
    Param,
    Patch
} from 'routing-controllers';

import { LCContext } from '../../utility';
import { SessionModel } from '../../model/Activity';

const Session = LCObject.extend('Session');

@JsonController('/activity/session')
export class ActiviySessionController {
    @Post()
    async create(
        @Ctx() { currentUser }: LCContext,
        @Body() body: SessionModel
    ): Promise<SessionModel> {
        if (!currentUser) throw new UnauthorizedError();

        const session = new Session();

        await session.save({
            ...body,
            owner: currentUser
        });

        return session.toJSON();
    }

    @Get('/:id')
    async getOne(@Param('id') id: string): Promise<SessionModel> {
        const session = LCObject.createWithoutData('Session', id);

        await session.fetch();

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

        await session.save(body);

        return session.toJSON();
    }
}
