<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
      <a slot="right" v-if="updateState && information.status==0" @click="update">修改</a>
      <a slot="right" v-if="!updateState" @click="cancel">取消</a>
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
          <input type="text" placeholder="请输入手机号" v-model="information.phone" :disabled="disabled"/>
        </div>
        <div class="form-group">
          <label class="required">车型：</label>
          <input type="text" placeholder="请选择车型" v-model="information.modelsName" @click="popCarType=!popCarType"
                 readonly :disabled="disabled" />
          <i class="iconfont icon-right"></i>
        </div>
        <div class="form-group">
          <label class="required">购车预算：</label>
          <input type="text" placeholder="请选择购车预算" v-model="information.budget"
                 readonly :disabled="disabled" @click="popBudget=!popBudget">
          <i class="iconfont icon-right"></i>
        </div>
        <div class="form-group">
          <label class="required">预计购车时间：</label>
          <input type="text" placeholder="请选择预计购车时间" v-model="information.expectBuyTime" @click="popExpect=!popExpect"
                 readonly :disabled="disabled">
          <i class="iconfont icon-right"></i>
        </div>
        <div class="form-group">
          <label class="required">预约经销商：</label>
          <input type="text"  v-model="information.dealerName" readonly>
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
          <label class="required">订单状态：</label>
          <input type="text" v-model="orderState[information.status]" readonly>
        </div>
      </div>
      <button v-if="updateState && (information.status==0 || information.status==1)" class="btn next-btn" @click="cancelModal = true">取消订单</button>
      <button v-if="!updateState" class="btn next-btn" @click="submit">提交</button>
    </div>
    <!--车型-->
    <cartype-popup :show="popCarType" @onOk="emitCarType" :type="1"></cartype-popup>
    <!--购车预算-->
    <type-popup :show="popBudget" :list="budgetList" @onOk="emitBudget"></type-popup>
    <!--预计购车时间-->
    <type-popup :show="popExpect" :list="expectList" @onOk="emitExpect"></type-popup>
    <!--预约日期-->
   <mt-datetime-picker ref="pkDate" type="date" :startDate="startDate" :endDate="endDate" v-model="pkDateVal" @confirm="dateChange"></mt-datetime-picker>
    <mt-datetime-picker ref="pkTime" type="time" v-model="pkTimeVal" @confirm="timeChange"  :startHour="9" :endHour="16" ></mt-datetime-picker>
    <!--确定取消-->
    <modal-bar :maskHeader="2" v-if="cancelModal" @onHide="cancelModal = false" :state="1" :content="'确定取消？'"
               :cancelText="'取消'" @onCancel="cancelModal = false"
               :okText="'确定'" @onOk="orderCancel()">
    </modal-bar>
  </div>
</template>
<script>
import { mapState } from 'vuex';
var currentDate = new Date();
export default {
  data() {
    return {
      title: '试驾订单',
      startDate: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000 * 2),
      endDate: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000 * 30),
      pkDateVal: new Date(),
      pkTimeVal: '',
      selDate: '',
      selTime: '',
      updateState: true,
      popCarType: false,
      popBudget: false,
      popExpect: false,
      budgetList: ['5-10万', '10-15万', '15-20万', '20万以上'],
      expectList: ['1个月内', '1-3个月', '3-6个月', '6个月以上'],
      disabled: true,
      information: {},
      orderState: ['已提交', '已确认', '', '已完成', '已评价', '已取消'],
      cancelModal:false,
    };
  },
  computed: {
    ...mapState(['token'])
  },
  mounted() {
    this.native.grabHandler('user.service.serviceTestDrive.'+this.$route.query.id);
    this.init();
  },
  methods: {
    init() {
      var postData = {
        id: this.$route.query.id
      };
      this.native.apiHandler('XS-MAL-YYSJDDXQ', postData, res => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          this.information = response.body.resultData;
          this.selDate = this.information.expectTime.split(' ')[0];
          this.selTime = this.information.expectTime.split(' ')[1];
          this.informationOld = JSON.parse(JSON.stringify(resultData));
        }
      });
    },
    emitCarType(data) {
      this.information.modelsName = data.brandCarType;
      this.information.models = data.id;
    },
    update() {
      this.updateState = false;
      this.disabled = false;
    },
    cancel() {
      this.updateState = true;
      this.disabled = true;
      this.information = JSON.parse(JSON.stringify(this.informationOld));
    },
    open(picker) {
      this.$refs[picker].open();
    },
    dateChange(value) {
      this.selDate = new Date(value).format('yyyy-MM-dd');
    },
    timeChange(value) {
      this.selTime = value;
    },
    //购车预算
    emitBudget(data) {
      this.information.budget = data;
    },
    emitExpect(data) {
      this.information.expectBuyTime = data;
    },
    //取消订单
    orderCancel() {
      this.native.grabHandler('user.service.serviceTestDrive.cancel');
      let expectTime = new Date(this.information.expectTime).format(
        'yyyy-MM-dd'
      );
      let day = new Date().format('yyyy-MM-dd');
      if (expectTime == day) {
        this.toast('您不能取消当天服务');
      } else {
        var postData = {
          id: this.$route.query.id,
          orderType: 0,
          token: this.token
        };
        this.native.apiHandler('XS-BUS-QXWDDD', postData, res => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            if (response.body.resultData == true) {
              this.toast('取消成功');
              this.$router.go(-1);
            }
          }
        });
      }
    },
    //提交订单
    submit() {
      if (this.information.budget.trimNo() == '') {
        this.toast('请选择购车预算');
        return;
      }
      if (this.information.expectBuyTime.trimNo() == '') {
        this.toast('请选择预计购车时间');
        return;
      }
      if (this.information.expectTime.trimNo() == '') {
        this.toast('请选择预约日期');
        return;
      }
      if (!this.verifyPhone(this.information.phone)) {
        return;
      }
      if (this.information.modelsName.trimNo() == '') {
        this.toast('请选择车型');
        return;
      }
      if (this.information.name.trimNo() == '') {
        this.toast('请输入姓名');
        return;
      }
      if (this.information.sex.trimNo() == '') {
        this.toast('请选择性别');
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
      this.information.expectTime = this.selDate + ' ' + this.selTime;
      this.information.token = this.token;
      this.native.apiHandler('XS-BUS-XGSJDD', this.information, res => {
        this.native.grabHandler('user.service.serviceTestDrive.submit');
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          if (response.body.resultData == true) {
            this.toast('修改成功');
            this.$router.go(-1);
          }
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import 'information.less';
</style>
