<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <div class="form-content">
        <div class="form-group">
          <label class="required">手机号：</label>
          <input type="text" placeholder="请输入手机号" maxlength="11" v-model="phone">
        </div>
        <div class="form-group">
          <label class="required">验证码：</label>
          <input type="text" placeholder="请输入验证码" maxlength="6" v-model="code">
          <countdown-btn :text="'获取验证码'" :type="2" :phone="phone" @onOk="emitCode"></countdown-btn>
        </div>
        <div class="form-group">
          <label class="required">密码：</label>
          <input type="password" placeholder="请输入密码" v-model="password" maxlength="16">
        </div>
        <div class="form-group">
          <label class="required">确认密码：</label>
          <input type="password" placeholder="请输入密码" v-model="pwdConfirm" maxlength="16">
        </div>
        <button class="btn next-btn" @click="submit">提交</button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        title: '修改密码',
        phone: '',
        code: '',
        password: '',
        pwdConfirm: '',
      }
    },
    mounted(){
      this.native.grabHandler('login.forget');
    },
    methods: {
      emitCode(code){

      },
      /**提交表单信息*/
      submit(){
        if (!this.verifyPhone(this.phone)) {
          return;
        }
        if (!this.verifyCode(this.code)) {
          return;
        }
        if (!this.verifyPassword(this.password)) {
          return;
        }
        if (!this.verifyConfirmPassword(this.pwdConfirm)) {
          return;
        }
        if (this.password != this.pwdConfirm) {
          this.toast('两次密码输入不一致');
          return;
        }
        var postData = {
          mobile: this.phone,
          code: this.code,
          newPassword: this.password,
        };
        this.native.apiHandler('XS-VEH-CZMM', postData, (res) => {
          this.native.grabHandler('login.forget.submit');
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            this.toast('密码修改成功');
            this.$router.push({name: 'login', params: {}});
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "register.less";
</style>
