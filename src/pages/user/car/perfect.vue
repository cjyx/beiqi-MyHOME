<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <div class="form-content">
        <div class="form-group">
          <label>发动机号：</label>
          <input type="text" placeholder="请输入发动机号" maxlength="20" v-model="form.enginId">
        </div>
        <div class="form-group">
          <label>车牌号：</label>
          <input type="text" placeholder="请输入车牌号" maxlength="7" v-model="form.lpn">
        </div>
        <div class="form-group" v-show="refShow==1">
          <label>购车推荐人：</label>
          <input type="text" placeholder="请输入购车推荐人手机号" maxlength="11" v-model="form.refereePhone">
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
        title: '完善信息',
        form: {
          id: this.$route.query.id,
          vin: this.$route.query.vin,
          enginId: this.$route.query.enginId,
          lpn: this.$route.query.lpn,
          refereePhone:''
        },
        refShow:'',
      }
    },
    computed: {
      ...mapState([
        'token'
      ])
    },
    mounted(){
      this.native.grabHandler('user.car.carPerfect');
      this.init();
    },
    methods: {
      init(){
        this.native.apiHandler('XS-VEH-RPBQ',{id:this.$route.query.id}, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            if (resultData==true) {
              this.refShow = 2;
            }else {
              this.refShow = 1;
            }
          }
        })
      },
      submit(){
        if (this.form.lpn.trimNo() != '') {
          if (!this.verifyCarNo(this.form.lpn)) {
            return;
          }
        }
        if (this.form.enginId.trimNo() != '') {
          if (!this.verifyLetterOrNumber('发动机号', this.form.enginId)) {
            return;
          }
        }
        if (this.form.refereePhone.trimNo() != '') {
          var reg = /^1\d{10}$/;
          if (!reg.test(this.form.refereePhone)) {
            this.toast('请输入推荐人正确手机号码');
            return;
          }
        }
        this.form.token = this.token;
        this.native.apiHandler('XS-VEH-CLBQ', this.form, (res) => {
          this.native.grabHandler('user.car.carPerfect.submit');
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            if (resultData) {
              if(resultData.code==1){
                this.toast('修改成功');
                this.$router.go(-1);
              }else {
                this.toast(resultData.msg);
              }
            }
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "car.less";
</style>
