<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <div class="form-content">
        <div class="form-group">
          <label class="required">手机号：</label>
          <input type="text" placeholder="请输入手机号" maxlength="11" v-model="phone">
          <i class="iconfont icon-refresh" @click="refresh"></i>
        </div>
        <div class="form-group">
          <label class="required">验证码：</label>
          <input type="text" placeholder="请输入验证码" v-model="code" maxlength="6">
          <countdown-btn :text="'获取验证码'" :type="1" :phone="phone" @onOk="emitCode"></countdown-btn>
        </div>
        <div class="form-group">
          <label class="required">姓名：</label>
          <input type="text" placeholder="请输入姓名" maxlength="20" v-model="name" :disabled="disabled">
        </div>
        <div class="form-group">
          <label class="required">密码：</label>
          <input type="password" placeholder="请输入密码" maxlength="16" v-model="password">
        </div>
        <div class="form-group">
          <label>注册邀请码：</label>
          <input type="text" placeholder="请输入注册邀请码" maxlength="20" v-model="registerCode">
        </div>
        <button class="btn next-btn" @click="submit">注册</button>
        <p class="clause">注册即视为同意
          <a @click="redirect('clause')">会员信息安全条款</a>
        </p>
      </div>
    </div>

    <modal-bar v-if="modalLogin" :maskHeader="1" :canClose="false" :state="1" :content="'注册成功！如果您已购北京汽车车辆，快来认证会员吧!'"
               :cancelText="'已购'" @onCancel="emitCancel"
               :okText="'未购'" @onOk="emitOk">
    </modal-bar>

    <transition name="slide-left">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        title: '注册',
        phone: '',
        code: '',
        name: '',
        password: '',
        registerCode: '',
        modalLogin: false,
        disabled:false,
        isResultData:''
      }
    },
    computed: {
      ...mapState([
        'deviceId'
      ])
    },
    mounted(){
      this.native.grabHandler('login.register');
    },
    methods: {
      emitCode(data){
        if(data==''){
          this.disabled = false;
        }else {
          this.name = data;
          this.disabled = true;
        }
      },
      emitCancel(){
        this.native.grabHandler('register.regBind');
        this.modalLogin = false;
        this.$router.push({name: 'regBind', query: {}});
      },
      emitOk(){
        this.native.grabHandler('register.regPerfect');
        this.modalLogin = false;
        this.$router.push({name: 'regPerfect', query: {}});
      },
      refresh(){
        this.phone = '';
        this.code = '';
        this.name = '';
        this.password = '';
        this.registerCode='';
      },
      /**提交注册信息*/
      submit(){
        if (!this.verifyPhone(this.phone)) {
          return;
        }
        if (!this.verifyCode(this.code)) {
          return;
        }
        if (this.name.trimNo() == '') {
          this.toast('请输入姓名');
          return;
        }
        if (!this.verifyPassword(this.password)) {
          return;
        }
        var postData = {
          mobile: this.phone,
          code: this.code,
          name: this.name,
          password: this.password,
          registerCode: this.registerCode,
        };
        this.native.apiHandler('XS-VEH-YHZC', postData, (res) => {
          this.native.grabHandler('login.register.submit');
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            this.isResultData = resultData;
            if (resultData == '1'||resultData == '10') {
              this.login();
            }
          }
        })
      },
      /**提交登录信息*/
      login(){
        var postData = {
          deviceId: this.deviceId, lat: '', lon: '',
          username: this.phone,
          password: this.password,
          ostype: this.browser.versions.android ? '1' : '0',
        };
        this.native.apiHandler('XS-VEH-YHDL', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            this.saveUser(resultData);
          }
        })
      },
      /**保存用户登录信息*/
      saveUser(resultData){
        this.$store.commit('mttSaveToken', resultData.token);
        localStorage.token = resultData.token;
        var db = {token: resultData.token, username: this.phone, password: this.password};
        this.native.dbHandler(0, db, (res) => {
          this.saveUserInfo(resultData);
        })
      },
      /**保存用户个人信息*/
      saveUserInfo(resultData){
        var postData = {
          token: resultData.token,
        };
        this.native.apiHandler('XS-VEH-YHXX', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            this.$store.commit('mttSaveUserInfo', resultData);
            if(this.isResultData=='10'){
              this.modalLogin = true;
              return;
            }
            this.modalLogin = false;
            this.$router.push({name: 'home'});
          }
        })
      },
      redirect(path) {
        this.native.grabHandler('register.'+path);
        this.$router.push({ name: path, query: {} });
      },
    }
  }
</script>
<style lang="less" scoped>
  @import "register.less";
</style>
