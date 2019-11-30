# ActivityHub

开源的**活动筹办系统**，基于 [Koa][1]、[TypeScript][2] 和 [LeanCloud][3] 的 **Node.js RESTful API** 项目。

[![NPM Dependency](https://david-dm.org/kaiyuanshe/ActivityHub.svg)][4]

## 主要特性

1. [LeanCloud 手机短信验证码登录](source/controller/Session.ts)

## 数据模型

### 第一版

-   [x] [User](source/model/User.ts) 组织者、讲师、合作方联系人、志愿者等

-   [x] [Activity](source/model/Activity/Activity.ts) 小型沙龙、中型活动、大型会议

-   [x] [Session](source/model/Activity/Session.ts) 活动环节（演讲、实训等）

-   [x] [SessionSubmit](source/model/Activity/SessionSubmit.ts) 环节申报（Activity 与 Session）

-   [x] [Organization](source/model/Organization/Organization.ts) 合作方（场地、赞助、媒体等）

-   [ ] Place 会场（会议室、教室、咖啡馆等）

-   [ ] Cooperation 合作关系（Activity 与 Organization）

### 第二版

-   [ ] Track 分会场、议程轨（相当于分类）

-   [ ] Ticket 门票

-   [ ] Account 账目（赞助、差旅、物料、门票等）

## 本地开发

```shell
npm install

lean login
lean switch
lean up
```

[1]: https://koajs.com/
[2]: https://www.typescriptlang.org/
[3]: https://leancloud.cn/
[4]: https://david-dm.org/kaiyuanshe/ActivityHub
