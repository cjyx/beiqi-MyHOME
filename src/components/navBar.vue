<template>
  <nav id="nav-bar" :style="{'z-index':zIndex}">
    <div class="nav-item">
      <router-link :to="{ name: 'home', params: { id: 123 }}">
        <i class="iconfont icon-home" v-if="selected!=1"></i>
        <i class="iconfont icon-home-active" v-if="selected==1"></i>
        <span :class="{'active':selected==1}">首页</span>
      </router-link>
    </div>
    <div class="nav-item">
      <router-link :to="{ name: 'activity', params: { id: 123 }}">
        <i class="iconfont icon-activity" v-if="selected!=2"></i>
        <i class="iconfont icon-activity-active" v-if="selected==2"></i>
        <span :class="{'active':selected==2}">活动</span>
      </router-link>
    </div>
    <div class="nav-item">
      <!--<router-link :to="{ name: 'friends', params: { id: 123 }}">-->
      <a @click="redirect('friends')" :class="{'router-link-active':selected==3 }">
        <!--<a @click="planning">-->
        <i class="iconfont icon-range" v-if="selected!=3"></i>
        <i class="iconfont icon-range-active" v-if="selected==3"></i>
        <span :class="{'active':selected==4}">圈子</span>
      </a>
      <!--</router-link>-->
    </div>
    <div class="nav-item">
      <router-link :to="{ name: 'user', params: { id: 123 }}">
        <i class="iconfont icon-me" v-if="selected!=4"></i>
        <i class="iconfont icon-me-active" v-if="selected==4"></i>
        <span :class="{'active':selected==5}">我的</span>
      </router-link>
    </div>
    <modal-bar v-if="modalLogin" :maskHeader="1" :canClose="true" :state="1" @onHide="emitHide" :content="'请登录后使用'" 
    :cancelText="'登录'" @onCancel="emitLogin" 
    :okText="'注册'" @onOk="emitRegister">
    </modal-bar>
  </nav>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      zIndex: 0,
      modalLogin: false,
    }
  },
  computed: {
    ...mapState([
      'token'
    ])
  },
  mounted() {
  },
  props: ['selected'],
  methods: {
    emitHide() {
      this.modalLogin = false;
      this.zIndex = 0;
    },
    emitLogin() {
      this.modalLogin = false;
      this.zIndex = 0;
      this.$router.push({ name: 'login' });
    },
    emitRegister() {
      this.modalLogin = false;
      this.zIndex = 0;
      this.$router.push({ name: 'register' });
    },
    redirect(path) {
      if (this.token == '') {
        this.modalLogin = true;
        this.zIndex = 99;
        return;
      }
      this.$router.push({ name: path, query: {} });
    },
  },
}
</script>
<style scoped>

</style>
