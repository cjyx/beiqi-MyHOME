<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
      <router-link :to="{ name: 'toDoorContent', params: {  }}" slot="right">服务内容</router-link>
    </head-bar>
    <div class="main-content">
      <div class="form-content">
        <div class="form-group">
          <label class="required">姓名：</label>
          <input type="text" placeholder="请输入姓名" v-model="form.name">
        </div>
        <div class="form-group">
          <label class="required">手机号：</label>
          <input type="text" placeholder="请输入手机号" maxlength="11" v-model="form.phone">
        </div>
        <div class="form-group">
          <label class="required">省份：</label>
          <input type="text" placeholder="" v-model="form.dtdProvince" readonly="readonly">
        </div>
        <div class="form-group">
          <label class="required">城市：</label>
          <input type="text" placeholder="" v-model="form.dtdCity" readonly="readonly">
        </div>
        <div class="form-group">
          <label class="required">街道：</label>
          <input type="text" placeholder="" v-model="form.dtdStreet" readonly="readonly">
        </div>
        <div class="form-group">
          <label class="required">详细地址：</label>
          <input type="text" placeholder="请输入详细地址" v-model="form.dtdAddress">
        </div>
        <div class="form-group">
          <label class="required">服务内容：</label>
          <input type="text" placeholder="请输入服务内容" v-model="form.dtdServices" @click="popService=!popService"
                 readonly="readonly">
        </div>
        <div class="form-group">
          <label class="required">预约时间：</label>
          <input type="text" placeholder="请选择预约时间" @click="open('time')" size="large" v-model="form.dtdDate"
                 readonly>
          <i class="iconfont icon-right"></i>
        </div>
        <p class="required">提交申请之日起，最长14个自然日之内将完成上门服务</p>
      </div>
      <button class="btn next-btn" @click="submit">提交</button>
    </div>

    <mt-datetime-picker ref="time" v-model="timeValue" @confirm="handleChange" :startDate="startDate"
                        :endDate="endDate" type="datetime"
                        :startHour="9" :endHour="16"></mt-datetime-picker>

    <modal-bar v-if="modalSuccess" :maskHeader="1" :canClose="false" :state="1" @onHide="modalSuccess = true"
               :content="'预约成功，前往我的服务查看订单'"
               :cancelText="'取消'" @onCancel="$router.go(-1)"
               :okText="'确定'" @onOk="$router.push({name:'service',query: {type: 1}})">
    </modal-bar>

    <type-popup :show="popService" :default="''" :list="serviceList" @onOk="emitService"></type-popup>
    <transition name="slide-left">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import area from 'src/common/area'
  var currentDate = new Date();
  export default {
    data () {
      return {
        title: '上门服务',
        modalSuccess: false,
        startDate: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000 * 2),
        endDate: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000 * 30),
        timeValue: new Date(),
        popService: true,
        serviceList: ['车辆小保养', '车辆常规检查'],
        id: this.$route.query.id,
        form: {
          name: '',
          phone: '',
          dealerInfoId: '',
          dealerInfoName: '',
          dtdProvince: '',
          dtdCity: '',
          dtdStreet: '',
          dtdAddress: '',
          dtdServices: '车辆小保养',
          dtdDate: '',
          resource: '0'
        }
      }
    },
    computed: {
      ...mapState([
        'token', 'user'
      ])
    },
    mounted(){
      this.initGps();
      this.form.name = this.user.name;
      this.form.phone = this.user.mobilePhone;
    },
    methods: {
      open(picker) {
        this.$refs[picker].open();
      },
      emitService(data){
        this.form.dtdServices = data;
      },
      initGps(){
        this.native.gpsHandler('', '', (res) => {
          let response = this.convert(res);
          if (response || response.adCode) {
            this.$store.commit('mttSaveGps', response);
            var dist = area.getDistrictByCode(response.adCode);
            this.form.dtdProvince = dist.pName;
            this.form.dtdCity = dist.cName;
            this.form.dtdStreet = response.streetName;
          }
        })
      },
      handleChange(value) {
        var datetime = (new Date(value)).format('yyyy-MM-dd hh:mm');
        this.form.dtdDate = datetime;
      },
      submit(){
        if (this.form.name.trimNo() == '') {
          this.toast('请输入姓名');
          return;
        }
        if (!this.verifyPhone(this.form.phone)) {
          return;
        }
        if (this.form.dtdAddress.trimNo() == '') {
          this.toast('请输入详细地址');
          return;
        }
        if (this.form.dtdServices.trimNo() == '') {
          this.toast('请输入服务内容');
          return;
        }
        if (this.form.dtdDate.trimNo() == '') {
          this.toast('请选择上门时间');
          return;
        }
        this.form.dealerInfoId = this.id;
        this.form.token = this.token;
        this.native.apiHandler('XS-MAL-XZSMFW', this.form, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            if (resultData) {
//              this.$router.go(-1);
              this.modalSuccess = true;
            }
          }
        })
      },
    }
  }
</script>
<style lang="less" scoped>
  @import "toDoor.less";
</style>
