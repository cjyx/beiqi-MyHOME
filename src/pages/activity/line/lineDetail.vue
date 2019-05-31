<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content aty-detail">
      <h3>{{entity.activityName}}</h3>
      <div class="content">
        <i>活动时间：{{ entity.startTime | dateFormat('yyyy-MM-dd')}} 至 {{entity.endTime | dateFormat('yyyy-MM-dd')}}</i>
        <!--<img v-lazy="entity.displayImg"/>-->
        <p>活动要求</p>
        <div class="dt-content" v-html="entity.content"></div>
      </div>
    </div>
    <div class="submit-btn">
      <button v-if="entity.status==1 || entity.status==6" class="btn next-btn" @click="signUp">立即报名 </button>
      <button v-if="entity.status==2" class="btn next-btn disabled-btn">不符合报名条件</button>
      <button v-if="entity.status==3" class="btn next-btn disabled-btn">已报名</button>
      <button v-if="entity.status==4" class="btn next-btn disabled-btn">已结束</button>
      <button v-if="entity.status==5" class="btn next-btn disabled-btn">报名人数已满</button>
      <button v-if="entity.status==7" class="btn next-btn disabled-btn">未开始</button>
    </div>

    <modal-bar v-if="modalForm" :maskHeader="1" :canClose="true" @onHide="modalForm = false">
      <div class="form-content" slot="modal-main">
        <div class="form-group" v-if="formNeed.applicantNameFlag">
          <label class="required">姓名：</label>
          <input type="text" placeholder="请输入姓名" v-model="form.applicantName" maxlength="12">
        </div>
        <div class="form-group" v-if="formNeed.applicantPhoneFlag">
          <label class="required">手机号：</label>
          <input type="text" placeholder="请输入手机号" v-model="form.applicantPhone" maxlength="11">
        </div>
        <div class="form-group" v-if="formNeed.applicantJoinNumFlag">
          <label class="required">参加人数：</label>
          <input type="number" placeholder="请输入参加人数" v-model="form.applicantJoinNum">
        </div>
        <div class="form-group" v-if="formNeed.applicantArrivalTimeFlag">
          <label class="required">到达时间：</label>
          <input type="text" placeholder="请输入到达时间" v-model="arriveTime" readonly="readonly" @click="open('arrivePicker')">
        </div>
        <div class="form-group" v-if="formNeed.applicantTransportFlag">
          <label class="required">到达方式：</label>
          <select v-model="form.applicantTransport">
            <option value="1">自驾</option>
            <option value="2">火车</option>
            <option value="3">飞机</option>
          </select>
        </div>
        <div class="form-group" v-if="formNeed.applicantLicenseFlag">
          <label class="required">车牌号：</label>
          <input type="text" placeholder="请输入车牌号" v-model="form.applicantLicense">
        </div>
        <button class="btn next-btn" @click="formSubmit">提交</button>
      </div>
    </modal-bar>

    <loginPopup v-if="modalLogin" @onHide="modalLogin = false"></loginPopup>

    <bindPopup v-if="modalBind" @onHide="modalBind = false" @onCancel="modalBind=false"></bindPopup>

    <modal-bar v-if="modalSuccess" :maskHeader="1" :canClose="true" :state="2" @onHide="modalSuccess=false" :content="'感谢您的报名，请耐心等待审核'">
    </modal-bar>

    <mt-datetime-picker ref="arrivePicker" type="datetime" v-model="pickerValue" @confirm="handleChange"></mt-datetime-picker>
  </div>
</template>
<script>
let refuseMsg = ['', '未登录', '地区不符', '未查询到活动数据'];
import { mapState } from 'vuex'
export default {
  data() {
    return {
      title: '活动内容',
      pickerValue: new Date(),
      modalLogin: false,
      modalBind: false,
      modalForm: false,
      modalSuccess: false,
      id: this.$route.query.id,
      entity: {},
      formNeed: {},
      arriveTime: '',
      form: {
        applicantName: '',
        applicantPhone: '',
        applicantJoinNum: '',
        applicantArrivalTime: '',
        applicantTransport: '',
        applicantLicense: '',
      }
    }
  },
  computed: {
    ...mapState([
      'token',
    ])
  },
  mounted() {
    this.init();
    this.native.grabHandler('activity.line.detail');
  },
  methods: {
    open(picker) {
      this.$refs[picker].open();
    },
    handleChange(value) {
      var selectTime = new Date(value);
      if ((new Date()) > selectTime) {
        this.toast('时间不能小于当前时间');
        return;
      }
      this.arriveTime = selectTime.format('yyyy-MM-dd hh:mm:ss');
    },
    init() {
      var postData = {
        activityId: this.id,
        token: this.token
      };
      this.native.apiHandler('XS-BUS-HDNR', postData, (res) => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          var resultData = response.body.resultData;
          this.entity = resultData;
        }
      })
    },
    /**报名，判断领取条件*/
    signUp() {
      this.native.grabHandler('activity.line.detail.signUp');
      if (this.token == '') {
        this.modalLogin = true;
        return;
      }
      var postData = {
        activityId: this.id,
        token: this.token
      };
      this.native.apiHandler('XS-BUS-HDBM', postData, (res) => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          var resultData = response.body.resultData;
          this.formNeed = resultData;
          if (resultData.applicantFlag) {
            this.modalForm = true;
          } else {
            this.toast(refuseMsg[resultData.refuseFlag]);
          }
        }
      })
    },
    formSubmit() {
      if (this.formNeed.applicantNameFlag && this.form.applicantName.trimNo() == '') {
        this.toast('请输入姓名');
        return;
      }
      if (this.formNeed.applicantPhoneFlag && this.verifyPhone(this.form.applicantPhone) == false) {
        return;
      }
      if (this.formNeed.applicantJoinNumFlag && this.form.applicantJoinNum.trimNo() == '') {
        this.toast('请输入参与人数');
        return;
      }
      if (this.formNeed.applicantJoinNumFlag) {
        var reg = /^[1-9]*[1-9][0-9]*$/;
        if (!reg.test(this.form.applicantJoinNum.trimNo())) {
          this.toast('请输入正确的参与人数');
          return;
        }
      }
      if (this.formNeed.applicantArrivalTimeFlag && this.arriveTime == '') {
        this.toast('请输入到达时间');
        return;
      } else {
        this.form.applicantArrivalTime = this.arriveTime;
      }
      if (this.formNeed.applicantTransportFlag && this.form.applicantTransport.trimNo() == '') {
        this.toast('请输入到达方式');
        return;
      }
      if (this.formNeed.applicantLicenseFlag && this.form.applicantLicense.trimNo() == '') {
        this.toast('请输入车牌号');
        return;
      }
      this.form.activityId = this.id;
      this.form.token = this.token;
      this.form.channel = '1';
      this.native.apiHandler('XS-BUS-YHBM', this.form, (res) => {
        let response = this.convert(res);
        this.native.grabHandler('activity.line.detail.submit');
        if (response.body.isSuccessful == true) {
          var resultData = response.body.resultData;
          if (resultData) {
            this.modalForm = false;
            this.modalSuccess = true;
            this.entity.status = 3;
          } else {
            this.toast('报名失败');
          }
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
@import "line.less";
</style>
