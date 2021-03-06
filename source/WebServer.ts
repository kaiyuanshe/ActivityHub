import 'reflect-metadata';
import Koa from 'koa';
import Logger from 'koa-logger';
import { init, koa2, Cloud } from 'leanengine';
import { useKoaServer } from 'routing-controllers';

import MainController from './controller/Main';
import SessionController from './controller/Session';
import { UserController } from './controller/User';
import {
    ActivityController,
    ActiviySessionController,
    SessionSubmitController,
    CooperationController
} from './controller/Activity';
import {
    OrganizationController,
    PlaceController
} from './controller/Organization';

const {
    LEANCLOUD_APP_ID: appId,
    LEANCLOUD_APP_KEY: appKey,
    LEANCLOUD_APP_MASTER_KEY: masterKey,
    PORT,
    LEANCLOUD_APP_PORT: appPort
} = process.env;

const port = parseInt(appPort || PORT || '8080');

init({ appId, appKey, masterKey });

const app = new Koa()
    .use(Logger())
    .use(koa2())
    .use(
        // @ts-ignore
        Cloud.CookieSession({
            framework: 'koa2',
            secret: appKey,
            fetchUser: true
        })
    );

useKoaServer(app, {
    cors: { credentials: true },
    controllers: [
        CooperationController,
        SessionSubmitController,
        ActiviySessionController,
        ActivityController,
        PlaceController,
        OrganizationController,
        UserController,
        SessionController,
        MainController
    ]
});

app.listen(port, () =>
    console.log('HTTP Server runs at http://localhost:' + port)
);
