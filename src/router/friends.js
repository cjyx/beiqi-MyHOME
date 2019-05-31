/**圈子*/
export default [
  {path: '/friends', name: 'friends', component: resolve => require(['src/pages/friends/friends.vue'], resolve)},
  {path: '/hot', name: 'hotList', component: resolve => require(['src/pages/friends/hot/list.vue'], resolve)},
  {
    path: '/articleSearch', name: 'articleSearch', component: resolve => require(['src/pages/friends/search/articleSearch.vue'], resolve),
    children:[
      {
        path: 'search', name: 'hotSearch', component: resolve => require(['src/pages/friends/search/hotSearch.vue'], resolve),
        children:[
          {
            path: 'detialArticle', name: 'detialArticle', component: resolve => require(['src/pages/friends/group/detail/detialArticle.vue'], resolve),
            children:[
              {path: 'detailComment', name: 'detailComment', component: resolve => require(['src/pages/friends/group/detail/detailComment.vue'], resolve)},
            ]
          },
        ]
      },
    ]
  },
  {
    path: '/groupSearch', name: 'groupSearch', component: resolve => require(['src/pages/friends/search/groupSearch.vue'], resolve),
    children:[
      {path: 'detailGroup', name: 'detailGroup', component: resolve => require(['src/pages/friends/group/detail/detailGroup.vue'], resolve)},
    ]
  },
  {path: '/groupCreate', name: 'groupCreate', component: resolve => require(['src/pages/friends/group/create/create.vue'], resolve)},
  {path: '/articleCreate', name: 'articleCreate', component: resolve => require(['src/pages/friends/group/create/articleCreate.vue'], resolve)},
  {path: '/friendsGroup', name: 'friendsGroup', component: resolve => require(['src/pages/friends/group/group/group.vue'], resolve)},
  {path: '/myGroup', name: 'myGroup', component: resolve => require(['src/pages/friends/group/my/my.vue'], resolve)},

  {path: '/myArticle', name: 'myArticle', component: resolve => require(['src/pages/friends/group/my/myArticle.vue'], resolve)},
]
