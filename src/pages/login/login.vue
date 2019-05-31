<template>
  <div class="app">
    <div class="main-content">
      <router-link class="return" :to="{ name: 'user', query: { id: 123 }}">
        <i class="iconfont icon-left"></i>
      </router-link>
      <div class="logo">
        <img src="../../assets/img/login_02.png">
        <!--<img src="../../assets/img/login_01.png">-->
      </div>
      <div class="form-content">
        <div class="form-group">
          <label>账号：</label>
          <input type="text" placeholder="请输入手机号" maxlength="11" v-model="username">
        </div>
        <div class="form-group">
          <label>密码：</label>
          <input type="password" placeholder="请输入密码" v-model="password" maxlength="16">
        </div>
      </div>
      <!--<div class="option square">-->
      <!--<input type="checkbox" name="" checked>-->
      <!--<span></span>-->
      <!--<label>自动登录</label>-->
      <!--</div>-->
      <button class="btn next-btn" @click="submit">登录</button>
      <div class="detail">
        <a @click="redirect('forget')">忘记密码</a>
        <a @click="redirect('register')">注册</a>
      </div>
    </div>
    <transition name="slide-left">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      username: '',
      password: '',
      return: ''
    };
  },
  computed: {
    ...mapState(['deviceId'])
  },
  mounted() {
    this.native.grabHandler('login.index');
    /**判断是否回退*/
    if (this.$route.query.return == '1') {
      this.return = this.$route.query.return;
    }
  },
  methods: {
    /**提交登录信息*/
    submit() {
      if (!this.verifyUserName(this.username)) {
        return;
      }
      if (!this.verifyPassword(this.password)) {
        return;
      }
      var postData = {
        deviceId: this.deviceId,
        lat: '',
        lon: '',
        username: this.username,
        password: this.password,
        ostype: this.browser.versions.android ? '1' : '0'
      };
      this.native.apiHandler('XS-VEH-YHDL', postData, res => {
        this.native.grabHandler('login.index.submit');
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          var resultData = response.body.resultData;
          this.saveUser(resultData);
        }
      });
    },
    /**保存用户信息*/
    saveUser(resultData) {
      this.$store.commit('mttSaveToken', resultData.token);
      localStorage.token = resultData.token;
      var db = {
        token: resultData.token,
        username: this.username,
        password: this.password
      };
      this.native.dbHandler(0, db, res => {
        if (this.return != '') {
          this.$router.go(-1);
        } else {
          this.$router.push({ name: 'user', query: {} });
        }
        /*  $route.path
           字符串，等于当前路由对象的路径，会被解析为绝对路径，如 "/home/news" 。
           $route.query
           对象，包含路由中查询参数的键值对。例如，对于 /home/news/detail/01?favorite=yes ，会得到$route.query.favorite == 'yes' 。
           */
      });
    },
    redirect(path) {
      this.native.grabHandler('login.'+path);
      this.$router.push({ name: path, query: {} });
    },
  }
};
</script>
<style lang="less" scoped>
@import 'login.less';
</style>
