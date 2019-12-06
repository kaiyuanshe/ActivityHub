import { JsonController, Get, Param } from 'routing-controllers';
import { Query, User } from 'leanengine';

import { Organization } from './Organization';

@JsonController('/user')
export class UserController {
    @Get('/:id')
    async getOne(@Param('id') id: string) {
        const user = await new Query(User).get(id);

        return user.toJSON();
    }

    @Get('/:id/organization')
    async getOrganizationList(@Param('id') id: string) {
        const user = await new Query(User).get(id);

        return Promise.all(
            (await user.getRoles()).map(role =>
                new Query(Organization).get(role.getName().split('_')[0])
            )
        );
    }
}
