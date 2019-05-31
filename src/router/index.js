import Vue from 'vue'
import Router from 'vue-router'
import Home from './home'
import Activity from './activity'
import Friends from './friends'
import User from './user'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '', redirect: '/home'},//地址为空时跳转home页面
    {path: '/logout', name: 'logout', component: resolve => require(['src/pages/login/logout.vue'], resolve)},
    ...Home,
    ...Activity,
    ...Friends,
    ...User
    // /**扩展*/
    // { path: '/extend', name: 'extend', component: resolve => require(['src/pages/extend/extend.vue'], resolve),}
  ]
})
