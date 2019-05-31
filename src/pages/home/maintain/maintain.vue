<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
      <!--<router-link :to="{ name: 'myMaintain', params: {  }}" slot="right"> 我的预约 </router-link>-->
    </head-bar>
    <div class="main-content">
      <div class="drive-top">
        <p>可预约时间：{{startDate.toString() | dateFormat('yyyy-MM-dd')}}至{{endDate.toString() | dateFormat('yyyy-MM-dd')}}</p>
        <p>订单提交后工作人员将尽快为您确认订单信息，请耐心等待</p>
      </div>
      <div class="form-content">
        <div class="form-group">
          <label class="required">姓名：</label>
          <input type="text" placeholder="请输入姓名" maxlength="20" v-model="form.name">
        </div>
        <div class="form-group">
          <label class="required">性别：</label>
          <div class="option">
            <input type="radio" name="sex" value="1" checked v-model="form.sex">
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
          <label class="required">手机号：</label>
          <input type="text" placeholder="请输入手机号" maxlength="11" v-model="form.phone">
        </div>
        <div class="form-group">
          <label class="required">车型：</label>
          <input type="text" placeholder="请选择车型" v-model="selCarType.brandCarType" @click="popCarType=!popCarType"
                 readonly>
          <i class="iconfont icon-right"></i>
        </div>
        <div class="form-group">
          <label class="required">车牌号：</label>
          <input type="text" placeholder="请输入车牌号" v-model="form.carNumber" maxlength="7">
        </div>
        <div class="form-group ki-relative">
          <label class="required">当前里程：</label>
          <input type="number" placeholder="请输入当前里程" v-model="form.currentMileage" min="1" max="99999999">
          <span class="kilometre">公里</span>
        </div>
        <div class="form-group">
          <label class="required">经销商&nbsp;&nbsp;&nbsp;&nbsp;<br/>所在省市：</label>
          <input type="text" placeholder="请选择经销商所在省市" v-model="cityName" @click="popCity=!popCity" readonly>
          <i class="iconfont icon-right"></i>
        </div>
        <div class="form-group">
          <label class="required">预约经销商：</label>
          <input type="text" placeholder="请选择预约经销商" v-model="selDealer.companyName" @click="popDealer=!popDealer"
                 readonly :disabled="disDealer">
          <i class="iconfont icon-right"></i>
        </div>
         <div class="form-group">
          <label class="required">预约日期：</label>
          <input type="text" placeholder="请选择预约日期" @click="open('pkDate')" size="large" v-model="selDate" readonly>
          <i class="iconfont icon-right"></i>
        </div>
        <div class="form-group">
          <label class="required">预约时间：</label>
          <input type="text" placeholder="请选择预约时间" @click="open('pkTime')" size="large" v-model="selTime" readonly>
          <i class="iconfont icon-right"></i>
        </div>
        <div class="form-group">
          <label>服务顾问：</label>
          <input type="text" placeholder="请输入服务顾问" v-model="form.serviceAdvisor">
        </div>
        <button class="btn next-btn" @click="submit">提交</button>
        <!--<p class="drive-bottom">我家太远了，来-->
          <!--<router-link :to="{ name: 'toDoor', params: {  }}" style="color: #D3322A;border-bottom: 1px solid #D3322A">上门服务</router-link>-->
        <!--吧</p>-->
      </div>
    </div>

      <mt-datetime-picker ref="pkDate" type="date" :startDate="startDate" :endDate="endDate" v-model="pkDateVal" @confirm="dateChange"></mt-datetime-picker>
    <mt-datetime-picker ref="pkTime" type="time" v-model="pkTimeVal" @confirm="timeChange"  :startHour="9" :endHour="16" ></mt-datetime-picker>

    <!--车型-->
    <cartype-popup :show="popCarType" @onOk="emitCarType" :type="2"></cartype-popup>
    <!--经销商所在城市-->
    <city-popup :show="popCity" @onOk="emitCity"></city-popup>
    <!--经销商-->
    <dealer4s-popup :show="popDealer" :type="3" :cityCode="selCity.code" @onOk="emitDealer" @onDisDealer="emitDisDealer"></dealer4s-popup>

    <modal-bar v-if="modalSuccess" :maskHeader="1" :canClose="false" :state="1" @onHide="modalSuccess = true"
               :content="'预约成功，前往我的服务查看订单'"
               :cancelText="'取消'" @onCancel="$router.push({name:'home',query: {}})"
               :okText="'确定'" @onOk="$router.push({name:'service',query: {type: 1}})">
    </modal-bar>



    <transition name="slide-left">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import area from 'src/common/area';
var currentDate = new Date();
export default {
  data() {
    return {
      title: '保养预约',
      modalSuccess: false,
      startDate: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000 * 2),
      endDate: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000 * 30),
      pkDateVal: new Date(),
      pkTimeVal: '',
      selDate: '',
      selTime: '',
      popCity: false,
      popCarType: false,
      popDealer: false,
      disDealer: true,
      selCarType: {},
      selCity: {},
      selDealer: {},
      cityName: '',
      form: {
        name: '',
        sex: 1,
        phone: '',
        models: '',
        carNumber: '',
        currentMileage: '',
        expectBuyDealer: '',
        expectTime: '',
        serviceAdvisor: '',
        orderSource: '0'
      }
    };
  },
  computed: {
    ...mapState(['token', 'user', 'defCar', 'defDealer'])
  },
  mounted() {
    this.form.name = this.user.name;
    this.form.sex = this.user.sex;
    this.form.phone = this.user.mobilePhone;
    this.selCarType.brandCarType = this.defCar.brandCarType;
    this.form.models = this.defCar.carTypeId;
    this.form.carNumber = this.defCar.lpn;
    //      显示默认经销商
    var dist = area.getCityByCode(this.defDealer.cityCode);
    if (
      this.defDealer.provinceCode == 110000 ||
      this.defDealer.provinceCode == 120000 ||
      this.defDealer.provinceCode == 500000 ||
      this.defDealer.provinceCode == 310000
    ) {
      this.cityName = dist.pName + '-' + dist.pName;
      this.selCity.code = dist.pCode;
    } else {
      this.cityName = dist.pName + '-' + dist.name;
      this.selCity.code = dist.code;
    }
    this.selDealer.companyName = this.defDealer.companyName;
    this.form.expectBuyDealer = this.defDealer.id;

    if (this.$route.query.dealerName) {
      this.cityName = this.$route.query.province + '-' + this.$route.query.city;
      this.selDealer.companyName = this.$route.query.dealerName;
      this.selCity.code = this.$route.query.cityCode;
      this.form.expectBuyDealer = this.$route.query.dealerId;
    }
    this.native.grabHandler('home.maintain');
  },
  methods: {
    open(picker) {
      this.$refs[picker].open();
    },
    emitCarType(data) {
      this.selCarType = data;
      this.form.models = data.id;
    },
    emitCity(data) {
      this.cityCode = data.code;
      this.selCity = data;
      this.cityName = data.pName + '-' + data.name;

      this.selDealer = {};
      this.form.expectBuyDealer = '';
    },
    emitDealer(data) {
      this.selDealer = data;
      this.form.expectBuyDealer = data.id;
    },
    //      暂无经销商时经销商不可选
    emitDisDealer(data) {
      this.disDealer = data;
    },
    dateChange(value) {
      this.selDate = new Date(value).format('yyyy-MM-dd');
    },
    timeChange(value) {
      this.selTime = value;
    },
    submit() {
      if (this.form.name.trimNo() == '') {
        this.toast('请输入姓名');
        return;
      }
      if (this.form.sex.trimNo() == '') {
        this.toast('请选择性别');
        return;
      }
      if (!this.verifyPhone(this.form.phone)) {
        return;
      }
      if (this.form.models.trimNo() == '') {
        this.toast('请选择车型');
        return;
      }
      if (!this.verifyCarNo(this.form.carNumber)) {
        return;
      }
      if (this.form.currentMileage.trimNo() == '') {
        this.toast('请输入当前里程数');
        return;
      }
      if (
        this.form.currentMileage <= 0 ||
        this.form.currentMileage >= 99999999
      ) {
        this.toast('当前里程：大于0小于99999999');
        return;
      }
      if (this.form.expectBuyDealer.trimNo() == '') {
        this.toast('请选择经销商');
        return;
      }
      if (this.selDate == '') {
        this.toast('请选择预约日期');
        return;
      }
      if (this.selTime == '') {
        this.toast('请选择预约时间');
        return;
      }
      this.native.grabHandler('home.maintain.submit');
      this.form.expectTime = this.selDate + ' ' + this.selTime;
      this.form.token = this.token;
      this.native.apiHandler('XS-MAL-CJYYFWDD', this.form, res => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          var resultData = response.body.resultData;
          if (resultData) {
            //              this.$router.go(-1);
            this.modalSuccess = true;
          }
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import 'maintain.less';
</style>
