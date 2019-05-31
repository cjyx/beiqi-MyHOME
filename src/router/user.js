/**用户中心*/
export default [
  /*登陆*/
  {
    path: '/login', name: 'login', component: resolve => require(['src/pages/login/login.vue'], resolve),
  },
  /*注册*/
  {
    path: '/register',
    name: 'register',
    component: resolve => require(['src/pages/register/register.vue'], resolve),
    children: [
      {
        path: 'perfect',
        name: 'regPerfect',
        component: resolve => require(['src/pages/register/regPerfect.vue'], resolve)
      },
      {path: 'bind', name: 'regBind', component: resolve => require(['src/pages/register/bind.vue'], resolve),},
      {
        path: 'bind/perfect',
        name: 'bindPerfect',
        component: resolve => require(['src/pages/register/bindPerfect.vue'], resolve)
      },
    ]
  },
  {path: '/clause', name: 'clause', component: resolve => require(['src/pages/register/clause.vue'], resolve)},
  /*忘记密码*/
  {path: '/forget', name: 'forget', component: resolve => require(['src/pages/register/forget.vue'], resolve)},
  {
    path: '/user', name: 'user', component: resolve => require(['src/pages/user/user.vue'], resolve),
    children: [
      /*设置*/
      {
        path: 'set', name: 'set', component: resolve => require(['src/pages/user/set/set.vue'], resolve),
        children: [
          {
            path: 'password',
            name: 'password',
            component: resolve => require(['src/pages/user/set/password/password.vue'], resolve)
          },
          {
            path: 'introduce',
            name: 'introduce',
            component: resolve => require(['src/pages/user/set/introduce/introduce.vue'], resolve)
          },
        ]
      },

      /*我的信息*/
      {
        path: 'information',
        name: 'information',
        component: resolve => require(['src/pages/user/information/information.vue'], resolve),
        children: [
          {
            path: 'edit',
            name: 'informationEdit',
            component: resolve => require(['src/pages/user/information/edit.vue'], resolve)
          },
          {
            path: 'editPhone',
            name: 'editPhone',
            component: resolve => require(['src/pages/user/information/editPhone.vue'], resolve)
          },
          {
            path: 'address/add',
            name: 'addressAdd',
            component: resolve => require(['src/pages/user/address/add.vue'], resolve)
          },
          {
            path: 'address/edit',
            name: 'addressEdit',
            component: resolve => require(['src/pages/user/address/edit.vue'], resolve)
          },
        ]
      },
      /*编辑收货地址*/
      {path: 'address', name: 'address', component: resolve => require(['src/pages/user/address/address.vue'], resolve)},
      /*我的车辆*/
      {path: 'car', name: 'car', component: resolve => require(['src/pages/user/car/car.vue'], resolve)},

      {
        path: 'car/perfect',
        name: 'carPerfect',
        component: resolve => require(['src/pages/user/car/perfect.vue'], resolve)
      },

      /*我的票卷*/
      {
        path: 'ticket', name: 'ticket', component: resolve => require(['src/pages/user/ticket/ticket.vue'], resolve),
      },
      {path: 'ticket/detail',name: 'ticketDetail',component: resolve => require(['src/pages/user/ticket/detail.vue'], resolve)},
      {
        path: 'ticket/express',
        name: 'express',
        component: resolve => require(['src/pages/user/ticket/express.vue'], resolve)
      },
      {
        path: 'ticket/eval',
        name: 'eval',
        component: resolve => require(['src/pages/user/ticket/eval/eval.vue'], resolve)
      },
      /*我的积分*/
      {
        path: 'integral',
        name: 'userIntegral',
        component: resolve => require(['src/pages/user/integral/integral.vue'], resolve)
      },
      {
        path: 'integral/rule',
        name: 'userIntegralRule',
        component: resolve => require(['src/pages/user/integral/rule.vue'], resolve)
      },
      /*我的经销商*/
      {
        path: 'dealer',
        name: 'userDealer',
        component: resolve => require(['src/pages/user/dealer/dealer.vue'], resolve)
      },
      {
        path: 'dealerAdd',
        name: 'dealerAdd',
        component: resolve => require(['src/pages/user/dealer/add.vue'], resolve)
      },
      /*我的收藏*/
      {
        path: 'userCollect',
        name: 'userCollect',
        component: resolve => require(['src/pages/user/collect/collect.vue'], resolve)
      },
      /*分享好友*/
      {path: 'share', name: 'share', component: resolve => require(['src/pages/user/share/share.vue'], resolve)},
      /*我的服务*/
      {
        path: 'service',
        name: 'service',
        component: resolve => require(['src/pages/user/service/service.vue'], resolve)},
        // children: [
        //
        // ]
      /*救援订单*/
      {
        path: 'rescue',
        name: 'serviceRescue',
        component: resolve => require(['src/pages/user/service/rescue.vue'], resolve)
      },
      /*上门服务*/
      {
        path: 'toDoor',
        name: 'serviceToDoor',
        component: resolve => require(['src/pages/user/service/toDoor.vue'], resolve)
      },
      /*试驾订单*/
      {
        path: 'testDrive',
        name: 'serviceTestDrive',
        component: resolve => require(['src/pages/user/service/testDrive.vue'], resolve)
      },
      /*保养预约*/
      {
        path: 'maintain',
        name: 'serviceMaintain',
        component: resolve => require(['src/pages/user/service/maintain.vue'], resolve)
      },
      /*我的经验*/
      {path: 'experience', name: 'experience', component: resolve => require(['src/pages/user/experience/experience.vue'], resolve)},
      {path: 'experience/rule', name: 'experienceRule', component: resolve => require(['src/pages/user/experience/rule.vue'], resolve)},
      /*勋章墙*/
      {path: 'medal', name: 'medal', component: resolve => require(['src/pages/user/medal/medal.vue'], resolve)},
      {path: 'medal/detail', name: 'medalDetail', component: resolve => require(['src/pages/user/medal/detail.vue'], resolve)},
    ]
  },
  {path: '/car/bind', name: 'carBind', component: resolve => require(['src/pages/user/car/bind.vue'], resolve)},
]
