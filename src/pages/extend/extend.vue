<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
      <!--<a slot="left"><i class="iconfont icon-custom-service"></i></a>-->
    </head-bar>
    <div class="main-content">
      <div class="form-content">
        <div class="form-group">
          <label>手机号：</label>
          <input type="text" placeholder="请输入手机号" maxlength="11" v-model="phone">
          <countdown-btn :text="'获取验证码'" @onOk="emitCode"></countdown-btn>
        </div>
        <div class="form-group">
          <label>验证码：</label>
          <input type="text" placeholder="请输入验证码" maxlength="4" v-model="code">
        </div>
        <div class="form-group">
          <label>密码：</label>
          <input type="password" placeholder="请输入密码" v-model="password">
        </div>
        <div class="form-group">
          <label>城市：</label>
          <input type="text" placeholder="" v-model="cityName" @click="popCity=!popCity">
        </div>
        <div class="form-group">
          <label>经销商：</label>
          <input type="text" placeholder="" v-model="dealerName" @click="popDealer=!popDealer" readonly>
        </div>
        <div class="form-group">
          <label>车型：</label>
          <input type="text" placeholder="" v-model="carTypeName" @click="popCarType=!popCarType">
        </div>
        <div class="form-group">
          <label>生日：</label>
          <input type="text" placeholder="" v-model="carTypeName" @click="open('birth')">
        </div>
        <button class="btn next-btn" @click="next">下一步</button>
      </div>
    </div>
    <city-popup :show="popCity" :default="cityName" @onOk="emitCity"></city-popup>
    <!--<car-type-popup :show="popCarType"  :default="cityName" @onOk="emitCarType"></car-type-popup>-->
    <mt-datetime-picker ref="birth" type="date" v-model="value2" @confirm="handleChange"></mt-datetime-picker>
    <dealer-popup :state="0" :show="popDealer" @onOk="editDealer"></dealer-popup>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        title: '修改密码',
        codeText: '获取验证码',
        disabled: false,
        phone: '',
        times: 60,
        code: '',
        password: '',
        value2: '',
        cityName: '',
        carTypeName: '',
        dealerName:'',
        popCity: false,
        popCarType: false,
        popDealer:false,
        show:false
      }
    },
    mounted(){
    },
    methods: {
      dealer(){
        this.show=true
      },
      close(){
          this.show=false
      },
      emitCode(code){
        console.log(code);
      },
      emitCity(data){
        this.cityName = data.name;
      },
      editDealer(data){
        this.show=false
        this.dealerName = data;
      },
      emitCarType(data){
        this.carTypeName = data;
      },
      open(picker) {
        this.$refs[picker].open();
      },
      handleChange(value) {
        console.log(value);
      },
      next(){

      }
    }
  }
</script>
<style lang="less" scoped>
  @import "entend.less";
</style>
