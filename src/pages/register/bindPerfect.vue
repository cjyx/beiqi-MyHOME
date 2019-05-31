<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='false'>
      <router-link :to="{ name: 'home'}" slot="right">关闭</router-link>
    </head-bar>
    <div class="main-content">
      <div class="form-content">
        <div class="form-group">
          <label class="">性别：</label>
          <div class="option">
            <input type="radio" name="sex" value="1" v-model="form.sex">
            <span></span>
            <label>男</label>
          </div>
          <div class="option">
            <input type="radio" name="sex" value="0" v-model="form.sex">
            <span></span>
            <label>女</label>
          </div>
        </div>
        <div class="form-group">
          <label>出生日期：</label>
          <input type="text" placeholder="请选择出生日期" v-model="birthday" @click="open('birth')" readonly>
          <i class="iconfont icon-right"></i>
        </div>
        <div class="form-group">
          <label>所在城市：</label>
          <input type="text" placeholder="请选择所在城市" v-model="cityName" @click="popCity=!popCity" readonly>
          <i class="iconfont icon-right"></i>
        </div>
        <div class="form-group">
          <label>常用地址：</label>
          <input type="text" placeholder="请输入常用地址" v-model="form.adress">
        </div>
        <div class="form-group">
          <label>发动机号：</label>
          <input type="text" placeholder="请输入发动机号" maxlength="20" v-model="car.enginId">
          <i class="iconfont icon-mark" style="color: #EA6E30;" @click="enginImg=true"></i>
        </div>
        <div class="form-group">
          <label>车牌号：</label>
          <input type="text" placeholder="请输入车牌号" maxlength="7" v-model="car.lpn">
        </div>
        <div class="form-group">
          <label>汽车之家论坛名：</label>
          <input type="text" value="" placeholder="请输入论坛名" v-model="form.autohomeName" maxlength="20">
        </div>
        <div class="form-group">
          <label>越野 E 族论坛名：</label>
          <input type="text" value="" placeholder="请输入论坛名" v-model="form.fblifeName" maxlength="20">
        </div>
        <div class="form-group">
          <label>兴趣爱好：</label>
          <input type="text" placeholder="请输入您的兴趣爱好"  v-model="hobby">
        </div>
        <button class="btn next-btn" @click="submit">保存</button>
      </div>
    </div>
    <!--所在城市-->
    <pcity-popup :show="popCity" :default="cityName" @onOk="emitCity"></pcity-popup>
    <!--出生日期-->
    <mt-datetime-picker ref="birth" type="date" v-model="pickerValue" :startDate="new Date('1950')"
                        @confirm="handleChange"></mt-datetime-picker>
    <!--发动机号-->
    <transition name="slide-left">
      <mask-bar :maskHeader="1" @onHide="enginImg=false" v-if="enginImg" class="mask-preview">
        <img src="../../assets/img/code_03.png" slot="content" class="bigImg">
      </mask-bar>
    </transition>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import area from 'src/common/area'
  export default {
    data () {
      return {
        title: '补全信息',
        enginImg:false,
        id: this.$route.query.id,
        vin: this.$route.query.vin,
        city: {},
        cityName: '',
        pickerValue: new Date(),
        popCity: false,

        birthday: '',
        hobby: '',
        form: {
          sex: '1'
        },
        car: {
          enginId: '',
          lpn: ''
        },
      }
    },
    computed: {
      ...mapState([
        'token', 'user'
      ])
    },
    mounted(){
      this.native.grabHandler('bind.regPerfect');
      this.form = this.user;
      this.init();
    },
    methods: {
      emitCity(data){
        this.city = data;
        this.cityName = data.pName + '-' + data.name;
      },
      open(picker) {
        this.$refs[picker].open();
      },
      handleChange(value) {
        this.birthday = (new Date(value)).format('yyyy/MM/dd');
      },
      /**获取用户信息*/
      init(){
        if (this.token == '') {
          return;
        }
        this.birthday = this.user.birthday;
        if (this.user.cityCode != '') {
          this.city = area.getCityByCode(this.user.cityCode);
          this.cityName = this.city.pName + '-' + this.city.name;
        }
//        if (this.user.interest != '') {
//          this.hobby = this.user.interest.split(',');
//        }
      },
      /**提交用户完善信息*/
      submit(){
        if (this.cityName != '') {
          this.form.cityCode = this.city.code;
          this.form.provinceCode = this.city.pCode;
        }

        this.form.birthday = this.birthday;
        this.form.interest = this.hobby;
        this.form.token = this.token;
        this.native.apiHandler('XS-VEH-YHXG', this.form, (res) => {
          this.native.grabHandler('bind.regPerfect.submit');
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            if (resultData==0) {
              if (this.car.enginId != '' || this.car.lpn != '') {
                this.submitCar();
              } else {
                this.$router.push({name: 'home', params: {}});
              }
            }else if(resultData==1){
              this.toast('汽车之家用户名已存在');
              return;
            }else if(resultData==2){
              this.toast('越野e族用户名已存在');
              return;
            }else if(resultData==3){
              this.toast('论坛用户名已存在');
              return;
            }
          }
        })
      },
      /**提交车辆完善信息*/
      submitCar(){
        if (this.car.lpn.trimNo() != '') {
          if (!this.verifyCarNo(this.car.lpn)) {
            return;
          }
        }
        this.car.token = this.token;
        this.car.vin = this.vin;
        this.car.id = this.id;
        this.native.apiHandler('XS-VEH-CLBQ', this.car, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            if (resultData) {
                if(resultData.code==1){
                  this.$router.push({name: 'home', params: {}});
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
  @import "register.less";
  .mask-preview{
    background:rgba(0, 0, 0, 0.1)!important;
  }
  .bigImg{
    max-width: 90%;
    height: auto;
    display: block;
    margin: 45% auto 0;
    border-radius:0.3rem;
  }
</style>
