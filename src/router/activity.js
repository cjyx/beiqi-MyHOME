
export default [
  /**活动中心*/
  {
    path: '/activity', name: 'activity', component: resolve => require(['src/pages/activity/activity.vue'], resolve),
    children: [
      { path: 'rule', name: 'rule', component: resolve => require(['src/pages/activity/rule/rule.vue'], resolve) },
      { path: 'member/grade', name: 'grade', component: resolve => require(['src/pages/activity/member/grade.vue'], resolve) },
      { path: 'member/rule', name: 'memberRule', component: resolve => require(['src/pages/activity/member/rule.vue'], resolve) },
      /*线上活动*/
      { path: 'online/detail', name: 'onlineDetail', component: resolve => require(['src/pages/activity/line/onlineDetail.vue'], resolve) },
      /*线下活动*/
      {
        path: 'line', name: 'line', component: resolve => require(['src/pages/activity/line/line.vue'], resolve),
        children: [
          { path: 'detail', name: 'lineDetail', component: resolve => require(['src/pages/activity/line/lineDetail.vue'], resolve) },
        ]
      },
      // 活动征集信息
      { path: 'collect', name: 'collect', component: resolve => require(['src/pages/activity/line/collect.vue'], resolve) },
      /*我的活动*/
      { path: 'my', name: 'myActivity', component: resolve => require(['src/pages/activity/my/my.vue'], resolve) },
      /*当前任务*/
      { path: 'task', name: 'task', component: resolve => require(['src/pages/activity/task/task.vue'], resolve) },
      /*活动回顾*/
      {
        path: 'review', name: 'review', component: resolve => require(['src/pages/activity/review/review.vue'], resolve),
        children: [
          { path: 'detail', name: 'reviewDetail', component: resolve => require(['src/pages/activity/review/detail.vue'], resolve) },
          {
            path: 'search', name: 'reviewSearch', component: resolve => require(['src/pages/activity/review/search.vue'], resolve),
            children: [
              { path: 'detail', name: 'searchDetail', component: resolve => require(['src/pages/activity/review/detail.vue'], resolve) },
            ]
          },
          { path: 'comment', name: 'comment', component: resolve => require(['src/pages/activity/review/comment.vue'], resolve) },
        ]
      },
      /*每日签到*/
      { path: 'sign', name: 'sign', component: resolve => require(['src/pages/activity/sign/sign.vue'], resolve) },
      { path: 'sign/rule', name: 'signRule', component: resolve => require(['src/pages/activity/sign/rule.vue'], resolve) },
      /*论坛发帖*/
      { path: 'forum', name: 'forum', component: resolve => require(['src/pages/activity/forum/forum.vue'], resolve) },
      /*提交帖子*/
      {
        path: 'forum/post', name: 'forumPost', component: resolve => require(['src/pages/activity/forum/post.vue'], resolve),
        children: [
          { path: 'intro', name: 'forumIntro', component: resolve => require(['src/pages/activity/forum/intro.vue'], resolve) },
        ]
      },
      { path: 'scan', name: 'scan', component: resolve => require(['src/pages/activity/scan/scan.vue'], resolve) },
    ]
  },
]
