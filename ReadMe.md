# ActivityHub

开源的**活动筹办系统**，基于 [Koa][1]、[TypeScript][2] 和 [LeanCloud][3] 的 **Node.js RESTful API** 项目。

[![NPM Dependency](https://david-dm.org/kaiyuanshe/ActivityHub.svg)][4]

## 主要特性

1. [LeanCloud 手机短信验证码登录](source/controller/Session.ts)

## 数据模型

### 第一版

办完一场**小型免费活动**的建模，且兼容后续大中型活动的数据结构：

-   [x] [User](source/model/User.ts) 组织者、讲师、合作方联系人、志愿者等

-   [x] [Organization](source/model/Organization/Organization.ts) 主办、协办、场地、赞助、媒体、展商等

-   [x] [Membership](source/model/Organization/Membership.ts) 组织关系（User 与 Organization）

-   [ ] Place 会场（会议室、教室、咖啡馆等）

-   [x] [Activity](source/model/Activity/Activity.ts) 小型沙龙、中型活动、大型会议

-   [x] [Cooperation](source/model/Organization/Cooperation.ts) 合作关系（Activity 与 Organization）

-   [x] [Session](source/model/Activity/Session.ts) 活动环节（演讲、实训等）

-   [x] [SessionSubmit](source/model/Activity/SessionSubmit.ts) 环节申报（Activity 与 Session）

-   [ ] Ticket 门票类别（单 Activity、多 Session）

-   [ ] TicketOrder 门票订单（User 与 Ticket）

-   [ ] SessionSignin 环节签到（Session 与 TicketOrder）

### 第二版

-   [ ] Track 分会场、议程轨（相当于分类）

-   [ ] Exhibition 外场展位

-   [ ] Material 物料

-   [ ] Account 账目（赞助、差旅、物料、门票等）

-   [ ] Feedback 活动反馈（多 Session、多 Exhibition）

## 本地开发

```shell
npm install

lean login
lean switch
lean up
```

## 竞品

-   https://github.com/freeCodeCamp/chapter
-   https://www.bagevent.com/introduce/academic_introduce.html
-   https://www.bagevent.com/introduce/exhibitor_introduce.html

[1]: https://koajs.com/
[2]: https://www.typescriptlang.org/
[3]: https://leancloud.cn/
[4]: https://david-dm.org/kaiyuanshe/ActivityHub
