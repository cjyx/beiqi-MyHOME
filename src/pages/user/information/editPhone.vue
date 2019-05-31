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
          <countdown-btn :text="'获取验证码'" :type="3" :phone="phone" @onOk="emitCode"></countdown-btn>
        </div>
        <button class="btn next-btn" @click="submit">提交</button>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        title: '修改手机号',
        phone: '',
        code: '',
      }
    },
    computed: {
      ...mapState([
        'token'
      ])
    },
    mounted(){
      this.native.grabHandler('user.information.editPhone');
    },
    methods: {
      emitCode(code){
      },
      submit(){
        if (!this.verifyPhone(this.phone)) {
          return;
        }
        if (!this.verifyCode(this.code)) {
          return;
        }
        var postData = {
          mobilePhone: this.phone,
          smsValidCode: this.code,
          token: this.token
        };
        this.native.apiHandler('XS-VEH-SJBD', postData, (res) => {
          this.native.grabHandler('user.information.editPhone.submit');
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            if (resultData) {
              this.$router.push({name: 'login', params: {}});
            }
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "information.less";
</style>
