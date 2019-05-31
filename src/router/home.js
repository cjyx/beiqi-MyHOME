
export default  [
  /**首页*/
  {path: '/home', name: 'home', component: resolve => require(['src/pages/home/home.vue'], resolve)},
  {path: '/oil', name: 'oil', component: resolve => require(['src/pages/home/oil/oil.vue'], resolve)},
  /*知识资讯*/
  {
    path: '/news', name: 'news', component: resolve => require(['src/pages/home/news/news.vue'], resolve),
    children: [
      {path: 'detail', name: 'detail', component: resolve => require(['src/pages/home/news/detail.vue'], resolve)},
      {
        path: 'search',
        name: 'newsSearch',
        component: resolve => require(['src/pages/home/news/search.vue'], resolve),
        children: [
          {
            path: 'detail',
            name: 'newsDetail',
            component: resolve => require(['src/pages/home/news/detail.vue'], resolve)
          }
        ]
      },
      {
        path: 'comment',
        name: 'newsComment',
        component: resolve => require(['src/pages/home/news/comment.vue'], resolve)
      },
      {
        path: 'carSearch',
        name: 'carSearch',
        component: resolve => require(['src/pages/home/news/carSearch.vue'], resolve)
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: resolve => require(['src/pages/home/news/dashboard/dashboard.vue'], resolve),
        children: [
          {
            path: 'detail',
            name: 'dashboardDetail',
            component: resolve => require(['src/pages/home/news/dashboard/detail.vue'], resolve),
          }
        ]
      },
    ]
  },
  /*经销商查询*/
  {
    path: '/distributor',
    name: 'distributor',
    component: resolve => require(['src/pages/home/distributor/distributor.vue'], resolve),
    children: [
      {
        path: 'station',
        name: 'station',
        component: resolve => require(['src/pages/home/distributor/station.vue'], resolve)
      },
    ]
  },
  /*车友会*/
  {
    path: '/clubList', name: 'clubList', component: resolve => require(['src/pages/home/club/list.vue'], resolve),
    children: [
      { path: 'club', name: 'clubInformation', component: resolve => require(['src/pages/home/club/club.vue'], resolve)},

      { path: 'clubSearch', name: 'clubSearch', component: resolve => require(['src/pages/home/club/search.vue'], resolve),
        children: [
          {path: 'club', name: 'club', component: resolve => require(['src/pages/home/club/club.vue'], resolve)},
          { path: 'clubJoin', name: 'clubSearchJoin', component: resolve => require(['src/pages/home/club/joinClub.vue'], resolve)},
        ]}
    ]
  },
  { path: '/clubJoin', name: 'clubJoin', component: resolve => require(['src/pages/home/club/joinClub.vue'], resolve)},
  /*申请加入车友会*/
  {path: '/join', name: 'join', component: resolve => require(['src/pages/home/club/join.vue'], resolve)},

  /*救援*/
  {path: '/rescue', name: 'rescue', component: resolve => require(['src/pages/home/rescue/rescue.vue'], resolve)},
  /*消息中心*/
  {
    path: '/message', name: 'message', component: resolve => require(['src/pages/home/message/message.vue'], resolve),
    children: [
      {
        path: 'messageList', name: 'messageList', component: resolve => require(['src/pages/home/message/list.vue'], resolve),
        children: [
          { path: 'messageDetial', name: 'messageDetial', component: resolve => require(['src/pages/home/message/detial.vue'], resolve)},
        ]
      },
      {path: 'gift', name: 'gift', component: resolve => require(['src/pages/home/message/gift.vue'], resolve)}
    ]
  },
  /*产品大全*/
  {
    path: '/product', name: 'product', component: resolve => require(['src/pages/home/product/product.vue'], resolve),
    children: [
      {
        path: 'detail', name: 'productDetail', component: resolve => require(['src/pages/home/product/detail.vue'], resolve),
        children: [
          {
            path: 'manual', name: 'manual', component: resolve => require(['src/pages/home/product/manual.vue'], resolve),
            children: [
              {path: 'manualDetial', name: 'manualDetial', component: resolve => require(['src/pages/home/product/manualDetial.vue'], resolve)}
            ]
          }
        ]
      },
    ]
  },
  /*试驾预约*/
  { path: '/testDrive', name: 'testDrive', component: resolve => require(['src/pages/home/testDrive/testDrive.vue'], resolve)},
  /*保养预约*/
  { path: '/maintain', name: 'maintain', component: resolve => require(['src/pages/home/maintain/maintain.vue'], resolve),},
  {
    path: '/toDoor', name: 'toDoor', component: resolve => require(['src/pages/home/toDoor/toDoor.vue'], resolve),
    children: [
      {path: 'rule', name: 'toDoorRule', component: resolve => require(['src/pages/home/toDoor/rule.vue'], resolve)},
      {
        path: 'submitDoor',
        name: 'submitDoor',
        component: resolve => require(['src/pages/home/toDoor/submitDoor.vue'], resolve),
        children: [
          {
            path: 'content',
            name: 'toDoorContent',
            component: resolve => require(['src/pages/home/toDoor/content.vue'], resolve)
          },
        ]
      },
      {
        path: 'submitMaintain',
        name: 'submitMaintain',
        component: resolve => require(['src/pages/home/toDoor/submitMaintain.vue'], resolve)
      },
    ]
  },
  /*推荐购车*/
  {
    path: '/referralTo',
    name: 'referralTo',
    component: resolve => require(['src/pages/home/referral/referralTo.vue'], resolve)
  },
  {
    path: '/myReferral',
    name: 'myReferral',
    component: resolve => require(['src/pages/home/referral/my.vue'], resolve)
  },
  /*积分商城*/
  {
    path: '/mall', name: 'mall', component: resolve => require(['src/pages/home/mall/mall.vue'], resolve),
    children: [
      {
        path: 'cashExchange',
        name: 'cashExchange',
        component: resolve => require(['src/pages/home/mall/cashExchange.vue'], resolve)
      },
      {path: 'success', name: 'success', component: resolve => require(['src/pages/home/mall/success.vue'], resolve)},
    ]
  },
  /*商品详情*/
  {
    path: '/goodsDetial',
    name: 'goodsDetial',
    component: resolve => require(['src/pages/home/mall/goodsDetial.vue'], resolve)
  },
  /*提交评价*/
  {
    path: '/order', name: 'order', component: resolve => require(['src/pages/home/mall/order/order.vue'], resolve),
    children: [
      {
        path: 'address',
        name: 'selectAddress',
        component: resolve => require(['src/pages/user/address/address.vue'], resolve),
      },
      {
        path: 'address/add',
        name: 'selectAddressAdd',
        component: resolve => require(['src/pages/user/address/add.vue'], resolve)
      },
      {
        path: 'address/edit',
        name: 'selectAddressEdit',
        component: resolve => require(['src/pages/user/address/edit.vue'], resolve)
      },
    ]
  },
  /*购物车*/
  {
    path: '/shopCar',
    name: 'shopCar',
    component: resolve => require(['src/pages/home/mall/shopCar/shopCar.vue'], resolve)
  },
  // 代金券详情
  {
    path: '/couponDetial',
    name: 'couponDetial',
    component: resolve => require(['src/pages/home/mall/couponDetial.vue'], resolve)
  },
]
