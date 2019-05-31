<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
      <!--<a slot="left"><i class="iconfont icon-custom-service"></i></a>-->
    </head-bar>
    <div class="main-content">
      <ul class="set-list">
        <li v-if="token!=''">
          <a @click="redirect('password')">
            <span>修改密码</span>
            <i class="iconfont icon-more"></i>
          </a>
        </li>
        <li>
          <a @click="redirect('introduce')">
            <span>功能介绍</span>
            <i class="iconfont icon-more"></i>
          </a>
        </li>
        <li>
          <router-link to="">
            <span>清除缓存</span>
            <i class="iconfont icon-more"></i>
          </router-link>
        </li>
        <li>
          <router-link to="">
            <span>软件版本</span>
            <p>{{version}}</p>
          </router-link>
        </li>
      </ul>
      <button v-if="token!=''" class="btn next-btn" @click="signOut">退出登录</button>
    </div>
    <transition :name="transitionName">
      <router-view class="child-view"></router-view>
    </transition>

  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      title: '设置',
      transitionName: 'slide-left',
      version: '0.1.0'
    }
  },
  computed: {
    ...mapState([
      'token',
    ])
  },
  mounted() {
    this.native.grabHandler('user.set');
    this.initVersion();
  },
  methods: {
    initVersion() {
      var postData = {
        type: 5
      };
      this.native.nativeHandler(postData, (res) => {
        let response = JSON.parse(res);
        this.version = response.apiData.str;
      })
    },
    signOut() {
      this.native.grabHandler('user.set.signOut');
      var db = { token: '', username: '', password: '' };
      this.native.dbHandler(0, db, (res) => {
        this.$store.commit('mttSaveToken', '');
         localStorage.token = '';
        this.$router.push({ name: 'login', params: {} });
      })
    },
    redirect(path) {
      this.native.grabHandler('user.set.'+path);
        if(path=='password'){
          if (this.token == '') {
            this.toast('请先登录');
            return;
          }
        }
      this.$router.push({ name: path, params: {} });
    }
  }
}
</script>
<style lang="less" scoped>
@import "set.less";
</style>
