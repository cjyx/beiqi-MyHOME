// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'//兼容性
import Vue from 'vue'

import VueAwesomeSwiper from 'vue-awesome-swiper'
Vue.use(VueAwesomeSwiper)

// import lazy from 'vue-lazy-component';
// Vue.use(lazy);
/*懒加载*/
// import VueLazyload from 'vue-lazyload'
// Vue.use(VueLazyload)
// Vue.use(VueLazyload, {
//   // error: 'dist/error.png',
//   // loading: 'dist/loading.gif',
//   src: '../static/loading.jpg',
//   error: '../static/loading.jpg',
//   loading:'../static/loading.jpg',
//   try: 3 // default 1
// })
/*引入富文本*/
// import VueHtml5Editor from 'vue-html5-editor'
// Vue.use(VueHtml5Editor)
/**Vuex*/
import Vuex from 'vuex'
Vue.use(Vuex)

/**引入FastClick，去掉click事件300毫秒的延迟*/
import FastClick from 'fastclick'
if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function () {
    FastClick.attach(document.body);
  }, false);
}

/**引入mint-ui*/
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css'
Vue.use(Mint)
/**引入高德地图**/
// import AMap from 'vue-amap';
// Vue.use(AMap);
// AMap.initAMapApiLoader({
//   // 高德的key
//   key: '9c210ccb984778f885aea055c904d750',
//   // 插件集合
//   plugin: ['AMap.Geocoder','AMap.Geolocation']
// });

/**阿里巴巴图标*/
import './assets/font/iconfont.css'

/**对导入的组件进行全局组件注册*/
import components from './components/index.js';
Object.keys(components).forEach((key) => {
  console.log(key);
  Vue.component(key, components[key])
})


/** px 转rem */
import './common/rem'


/**原生和H5交互*/
import {JsBridge, browser} from './common/native.js'
Vue.prototype.native = JsBridge;
Vue.prototype.browser = browser;

/**扩展函数*/
import util from './common/util.js'
import prototype from './common/prototype.js'
Vue.use(util);
Vue.use(prototype);

/**日期过滤器*/
import './common/filter.js'

/**各种扩展*/
import './common/array.js'

/**路由*/
import router from './router'

/**组件共享信息*/
import store from './store'

Vue.config.productionTip = false

import App from './App'
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App},
  mounted: function () {
  }
})
