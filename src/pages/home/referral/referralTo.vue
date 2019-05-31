<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
      <a slot="right">
        <a @click="redirect('myReferral')">我的推荐</a>
      </a>
    </head-bar>
    <div class="main-content">
      <div class="btn-tab">
        <button :class="{'active':selected==1}" @click="selected=1">我要推荐</button>
        <button :class="{'active':selected==2}" @click="selected=2">我已推荐</button>
      </div>
      <div v-if="selected==1" class="detail">
        <div class="import">
          如果您有好友想要购买本品车型，填写他的意向购车信息吧。<br>
          当他已购车并完成车主认证后，您将自动获得<span>2000</span>积分。
        </div>
        <h4 class="title">被推荐人（意向购车人）</h4>
        <div class="form-content">
          <div class="form-group">
            <label class="required">姓名：</label>
            <input type="text" placeholder="请输入姓名" maxlength="20" v-model="form.name">
          </div>
          <div class="form-group">
            <label class="required">性别：</label>
            <div class="option">
              <input type="radio" value="1" name="sex" checked v-model="form.sex">
              <span></span>
              <label>男</label>
            </div>
            <div class="option">
              <input type="radio" value="0" name="sex" v-model="form.sex">
              <span></span>
              <label>女</label>
            </div>
          </div>
          <div class="form-group">
            <label class="required">手机号：</label>
            <input type="text" placeholder="请输入手机号" maxlength="11" v-model="form.phone">
          </div>
          <div class="form-group">
            <label class="required">意向车型：</label>
            <input type="text" placeholder="请选择车型" v-model="selCarType.brandCarType" @click="popCarType=!popCarType"
                   readonly>
            <i class="iconfont icon-right"></i>
          </div>
          <div class="form-group">
            <label class="required">购车预算：</label>
            <input type="text" placeholder="请输入购车预算" v-model="form.budgetName" readonly @click="popBudget=!popBudget">
          </div>
          <div class="form-group">
            <label class="required">预计购车时间：</label>
            <input type="text" placeholder="请选择预计购车时间" v-model="form.expectBuyTimeName" @click="popExpect=!popExpect"
                   readonly>
            <i class="iconfont icon-right"></i>
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
          <!--<div class="form-group" v-if="other" v-model="form.dealerName">-->
            <!--<label>其他经销商：</label>-->
            <!--<input type="text" placeholder="请输入其他经销商" maxlength="20">-->
          <!--</div>-->
          <button class="btn next-btn" @click="submitTo">提交</button>
        </div>
      </div>
      <div v-if="selected==2" class="detail">
        <div class="referralTwo">
          <div class="import">
            如果您推荐的好友已购买本品车型，赶紧领取<span>2000</span>积分吧！
          </div>
          <img src="../../../assets/img/step_01.png">
        </div>
        <p class="prompt">
          推荐人在新购车主完成购车的60天内提交申请才视为有效，否则将不予积分奖励。提交申请成功后请耐心等待后台审核，审核结果将以消息推送形式告知。<br>
          您推荐的朋友在2016年9月10日后购车才可赚取积分哦！
        </p>
        <h4 class="title">被推荐人（新购车主）</h4>
        <div class="form-content">
          <div class="form-group">
            <label class="required">介绍给谁：</label>
            <input type="text" placeholder="请输入姓名" maxlength="20" v-model="to.introduceTo">
          </div>
          <div class="form-group">
            <label class="required">他的手机号：</label>
            <input type="text" placeholder="请输入手机号" maxlength="11" v-model="to.mobile">
          </div>
          <div class="form-group">
            <label class="required">购买车型：</label>
            <input type="text" placeholder="请选择车型" v-model="selCarTypeTo.brandCarType" @click="popCarTypeTo=!popCarTypeTo"
                   readonly>
          </div>
          <div class="form-group">
            <label class="required">车辆VIN码：</label>
            <input type="text" placeholder="请输入VIN" v-model="to.vin" maxlength="17">
            <i class="iconfont icon-mark" style="color: #EA6E30;" @click="vinPic"></i>
          </div>
          <button class="btn next-btn" @click="submit">提交</button>
        </div>
      </div>
    </div>
    <!--车型-->
    <cartype-popup :show="popCarType" @onOk="emitCarType" :type="2"></cartype-popup>
    <!--我已推荐车型-->
    <cartype-popup :show="popCarTypeTo" @onOk="emitCarTypeTo" :type="2"></cartype-popup>
    <!--经销商所在城市-->
    <city-popup :show="popCity" @onOk="emitCity"></city-popup>
    <!--经销商-->
    <dealer4s-popup :show="popDealer" :type="2" :cityCode="selCity.code" @onOk="emitDealer" @onDisDealer="emitDisDealer"></dealer4s-popup>
    <!--预算-->
    <type-popup :show="popBudget" :list="budgetList" @onOk="emitBudget"></type-popup>
    <!--预计购车时间-->
    <type-popup :show="popExpect" :list="expectList" @onOk="emitExpect"></type-popup>
    <!--错误信息-->
    <modal-bar v-if="modalSuccess" :maskHeader="1" :canClose="true" :state="2" @onHide="modalSuccess=false"
               :content="msg">
    </modal-bar>
    <!--VIN-->
    <transition name="slide-left">
      <mask-bar :maskHeader="1" @onHide="modalImg=false" v-if="modalImg" class="mask-preview">
        <img src="../../../assets/img/code_02.png" slot="content" class="bigImg">
      </mask-bar>
    </transition>

    <transition name="slide-left">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      title: '推荐购车',
      selected: 1,
      popCity: false,
      popCarType: false,
      popCarTypeTo: false,
      popDealer: false,
      popBudget: false,
      popExpect: false,
      modalImg: false,
      disDealer:true,
      selCarType: {},
      selCarTypeTo: {},
      selCity: {},
      selDealer: {},
      budgetList: ['5-10万', '10-15万', '15-20万', '20万以上'],
      expectList: ['1个月内', '1-3个月', '3-6个月', '6个月以上'],
      other: false,
      cityName: '',
      form: {
        budget: '',
        budgetName: '', //购车预算
        budgetTime: '',
        expectBuyTimeName: '', //预计购车时间
        carId: '', //意向车型
        dealerId: '', //经销商id
        dealerName: '', //其他经销商名称
        name: '',
        order_from: '0', //订单来源
        phone: '',
        sex: ''
      },
      to: {
        introduceTo: '',
        mobile: '',
        vin: '',
        carTypeId: ''
      },
      modalSuccess: false,
      msg: '',
    };
  },
  computed: {
    ...mapState(['token'])
  },
  mounted(){
    this.native.grabHandler('home.referralTo');
  },
  methods: {
    emitCarType(data) {
      this.selCarType = data;
      this.form.carId = data.id;
    },
    emitCarTypeTo(data) {
      this.selCarTypeTo = data;
      this.to.carTypeId = data.id;
    },
    emitCity(data) {
      this.cityCode = data.code;
      this.selCity = data;
      this.cityName = data.pName + '-' + data.name;
      this.selDealer = {};
      this.form.dealerId = '';
    },
    emitDealer(data) {
      this.selDealer = data;
      this.form.dealerId = data.id;
      if (this.selDealer.companyName == '其他') {
        this.other = true;
      } else {
        this.other = false;
      }
    },
//   暂无经销商时经销商不可选
    emitDisDealer(data){
      this.disDealer=data;
    },
    emitBudget(data) {
      this.form.budgetName = data;
      this.budgetList.forEach((item, index) => {
        if (this.form.budgetName == item) {
          this.form.budget = index.toString();
        }
      });
    },
    emitExpect(data) {
      this.form.expectBuyTimeName = data;
      this.expectList.forEach((item, index) => {
        if (this.form.expectBuyTimeName == item) {
          this.form.budgetTime = index.toString();
        }
      });
    },
    vinPic() {
      this.modalImg = true;
    },
    submitTo() {
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
      if (this.form.carId.trimNo() == '') {
        this.toast('请选择车型');
        return;
      }
      if (this.form.budget.trimNo() == '') {
        this.toast('请选择预算');
        return;
      }
      if (this.form.budgetTime.trimNo() == '') {
        this.toast('请选择预计购车时间');
        return;
      }
      if (this.form.dealerId.trimNo() == '') {
        this.toast('请选择经销商');
        return;
      }
      this.form.token = this.token;
      this.native.apiHandler('XS-JS-ZWYZJS', this.form, res => {
        this.native.grabHandler('home.referralTo.to');
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          if (response.body.resultData.status == 1) {
            this.toast('提交成功');
          } else if (response.body.resultData.status == 2) {
            this.toast('同一手机号不能重复提交哦');
          } else {
            this.toast(response.body.resultData.msg);
          }
        }
      });
    },
    submit() {
      if (this.to.introduceTo.trimNo() == '') {
        this.toast('请输入姓名');
        return;
      }
      if (!this.verifyPhone(this.to.mobile)) {
        return;
      }
      if (this.to.carTypeId.trimNo() == '') {
        this.toast('请选择车型');
        return;
      }
      if (!this.verifyVin(this.to.vin)) {
        return;
      }
      this.to.token = this.token;
      this.native.apiHandler('XS-BUS-WYZJS', this.to, res => {
        this.native.grabHandler('home.referralTo.submit');
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          if (response.body.resultData.result == 1) {
            this.$router.push({ name: 'home' });
          } else if (response.body.resultData.result == -1) {
            this.modalSuccess = true;
            this.msg = response.body.resultData.msg;
          } else {
            this.toast(response.body.resultData.msg);
          }
        }
      });
    },
    redirect(path) {
      this.native.grabHandler('home.referralTo.'+path);
      this.$router.push({ name: path, query: {} });
    },

  }
};
</script>
<style lang="less" scoped>
@import 'referral.less';
</style>
