<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
      <a slot="right" v-if="cancelState && (information.status==0)" @click="update">修改</a>
      <a slot="right" v-if="!cancelState" @click="cancelDate">取消</a>
    </head-bar>
    <div class="main-content">
      <div class="form-content">
        <div class="form-group">
          <label class="required">姓名：</label>
          <input type="text" placeholder="请输入姓名" maxlength="20" v-model="information.name" :disabled="disabled">
        </div>
        <div class="form-group">
          <label class="required">性别：</label>
          <div class="option">
            <input type="radio" name="sex" value="1" v-model="information.sex" :disabled="disabled">
            <span></span>
            <label>男</label>
          </div>
          <div class="option">
            <input type="radio" name="sex" value="0" v-model="information.sex" :disabled="disabled">
            <span></span>
            <label>女</label>
          </div>
        </div>
        <div class="form-group">
          <label class="required">手机号：</label>
          <input type="text" placeholder="请输入手机号" maxlength="11" v-model="information.phone" :disabled="disabled">
        </div>
        <div class="form-group">
          <label class="required">车型：</label>
          <input type="text" placeholder="请选择车型" v-model="information.nodels" @click="popCarType=!popCarType"
                 readonly :disabled="disabled">
          <i class="iconfont icon-right"></i>
        </div>
        <div class="form-group">
          <label class="required">车牌号：</label>
          <input type="text" placeholder="请输入车牌号" v-model="information.carNumber" :disabled="disabled">
        </div>
        <div class="form-group ki-relative">
          <label class="required">当前里程：</label>
          <input type="number" placeholder="请输入当前里程" v-model="information.maintMileage" :disabled="disabled">
          <span class="kilometre">公里</span>
        </div>
        <div class="form-group">
          <label class="required">预约经销商：</label>
          <p>{{information.dealerName}}</p>
        </div>
        <div class="form-group">
          <label class="required">预约日期：</label>
          <input type="text" placeholder="请选择预约日期" @click="open('pkDate')" size="large" v-model="selDate" readonly :disabled="disabled">
          <i class="iconfont icon-right"></i>
        </div>
        <div class="form-group">
          <label class="required">预约时间：</label>
          <input type="text" placeholder="请选择预约时间" @click="open('pkTime')" size="large" v-model="selTime" readonly :disabled="disabled">
          <i class="iconfont icon-right"></i>
        </div>
        <div class="form-group">
          <label>服务顾问：</label>
          <input type="text" v-model="information.maintAdviser" :disabled="disabled">
        </div>
        <div class="form-group">
          <label>订单状态：</label>
          <p>{{statusArr[information.status]}}</p>
        </div>
      </div>
      <button v-if="cancelState && (information.status==0 || information.status==1)" class="btn next-btn"
              @click="cancelModal = true">取消订单
      </button>
      <button v-if="!cancelState" class="btn next-btn" @click="submit">提交</button>
    </div>
    <!--车型-->
    <cartype-popup :show="popCarType" @onOk="emitCarType" :type="2"></cartype-popup>
    <!--预约日期-->
       <mt-datetime-picker ref="pkDate" type="date" :startDate="startDate" :endDate="endDate" v-model="pkDateVal" @confirm="dateChange"></mt-datetime-picker>
    <mt-datetime-picker ref="pkTime" type="time" v-model="pkTimeVal" @confirm="timeChange"  :startHour="9" :endHour="16" ></mt-datetime-picker>
    <!--确定取消-->
    <modal-bar :maskHeader="2" v-if="cancelModal" @onHide="cancelModal = false" :state="1" :content="'确定取消？'"
               :cancelText="'取消'" @onCancel="cancelModal = false"
               :okText="'确定'" @onOk="cancelOrder()">
    </modal-bar>
  </div>
</template>
<script>
import { mapState } from 'vuex';
var currentDate = new Date();
export default {
  data() {
    return {
      title: '保养预约',
      startDate: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000 * 2),
      endDate: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000 * 30),
      pkDateVal: new Date(),
      pkTimeVal: '',
      selDate: '',
      selTime: '',
      cancelState: true, //默认修改按钮
      popCarType: false, //车型
      selCarType: {}, //车型
      disabled: true, //禁用
      information: {}, //基本信息
      informationOld: {}, //老日期
      id: '', //订单id
      statusArr: ['已提交', '已确认', '', '已完成', '已评价', '已取消'], //订单状态
      cancelModal:false,
    };
  },
  computed: {
    ...mapState(['token'])
  },
  mounted() {
    this.id = this.$route.query.id;
    this.native.grabHandler('user.service.serviceMaintain.'+this.id);
    this.init();
  },
  methods: {
    emitCarType(data) {
      this.selCarType = data;
      this.information.models = data.id;
      this.information.nodels = data.brandCarType;
    },
    update() {
      this.cancelState = false;
      this.disabled = false;
    },
    cancelDate() {
      this.cancelState = true;
      this.disabled = true;
      this.information = JSON.parse(JSON.stringify(this.informationOld));
    },
    dateChange(value) {
      this.selDate = new Date(value).format('yyyy-MM-dd');
    },
    timeChange(value) {
      this.selTime = value;
    },
    open(picker) {
      this.$refs[picker].open();
    },
    //提交订单
    submit() {
      if (this.information.name.trimNo() == '') {
        this.toast('请输入姓名');
        return;
      }
      if (this.information.sex.trimNo() == '') {
        this.toast('请选择性别');
        return;
      }
      if (!this.verifyPhone(this.information.phone)) {
        return;
      }
      if (this.information.models.trimNo() == '') {
        this.toast('请选择车型');
        return;
      }
      if (!this.verifyCarNo(this.information.carNumber)) {
        return;
      }
      if (this.information.maintMileage.trimNo() == '') {
        this.toast('请输入当前里程数');
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
      this.information.maintTime = this.selDate + ' ' + this.selTime;
      this.disabled = true;
      this.information.token = this.token;
      this.native.apiHandler('XS-BUS-XGFWYYDD', this.information, res => {
        this.native.grabHandler('user.service.serviceMaintain.submit');
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          if (response.body.resultData == true) {
            this.toast('提交成功');
            this.$router.go(-1);
          }
        }
      });
    },
    init() {
      var postData = {
        id: this.id
      };
      this.native.apiHandler('XS-MAL-FWYYDDXQ', postData, res => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          let resultData = response.body.resultData;
          this.information = resultData;
          this.selDate = this.information.maintTime.split(' ')[0];
          this.selTime = this.information.maintTime.split(' ')[1];
          this.informationOld = JSON.parse(JSON.stringify(resultData));
        }
      });
    },
    //      取消订单
    cancelOrder() {
      this.native.grabHandler('user.service.serviceMaintain.cancel');
      let time = new Date(this.information.maintTime).format('yyyy-MM-dd');
      let day = new Date().format('yyyy-MM-dd');
      if (time == day) {
        this.toast('您不能取消当天服务');
      } else {
        var cancelData = {
          id: this.id,
          orderType: 1,
          token: this.token
        };
        this.native.apiHandler('XS-BUS-QXWDDD', cancelData, res => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            if (response.body.isSuccessful == true) {
              this.toast('取消订单成功');
              this.$router.go(-1);
            }
          }
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import 'information.less';
</style>
