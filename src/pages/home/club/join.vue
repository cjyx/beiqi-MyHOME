<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <div class="form-content">
        <div class="form-group">
          <label class="required">姓名：</label>
          <input type="text" placeholder="请输入姓名" maxlength="20" v-model="realName" disabled>
        </div>
        <div class="form-group">
          <label class="required">性别：</label>
          <div class="option">
            <input type="radio" name="sex" checked value="1" v-model="user.sex" :disabled="sexAbled">
            <span></span>
            <label>男</label>
          </div>
          <div class="option">
            <input type="radio" name="sex" value="0" v-model="user.sex" :disabled="sexAbled">
            <span></span>
            <label>女</label>
          </div>
        </div>
        <div class="form-group">
          <label class="required">手机号：</label>
          <input type="text" placeholder="请输入手机号" maxlength="11" v-model="userPhone" disabled>
        </div>
        <div class="form-group">
          <label class="required">微信号：</label>
          <input type="text" placeholder="请输入微信号" v-model="form.wechatNumber">
        </div>
        <div class="form-group">
          <label class="required">出生日期：</label>
          <input type="text" placeholder="请选择出生日期" @click="open('birth')" size="large" v-model="birthday" readonly>
          <i class="iconfont icon-right"></i>
        </div>
        <div class="form-group">
          <label class="required">从事行业：</label>
          <input type="text" placeholder="请输入从事行业" v-model="form.job" maxlength="20">
        </div>
        <div class="form-group">
          <label class="required">车架号：</label>
          <!--<input type="text"  placeholder="请输入车架号" v-model="form.vin">-->
          <input type="text" placeholder="请选择车架号" v-model="vin" @click="popCarType=!popCarType" readonly>
          <i class="iconfont icon-right"></i>
        </div>
        <div class="form-group">
          <label class="required">所属车型：</label>
          <!--<input type="text" placeholder="请选择车型" v-model="carTypeName.brandCarType" @click="popCarType=!popCarType"-->
          <!--readonly>-->
          <input type="text" placeholder="请输入车型" v-model="brandCarType" disabled>
        </div>
        <div class="form-group">
          <label class="required">车牌号：</label>
          <input type="text" placeholder="请输入车牌号" v-model="lpn" :disabled="disabled">
        </div>
        <button class="btn next-btn" @click="submit">提交</button>
      </div>
      <!--出生日期-->
      <mt-datetime-picker ref="birth" type="date" v-model="pickerValue" :startDate="new Date('1950')" @confirm="handleChange"></mt-datetime-picker>
      <!--车型-->
      <type-popup :show="popCarType" :list="carTypeName" @onOk="emitCarType"></type-popup>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      title: '申请加入',
      pickerValue: new Date(),
      form: {
        wechatNumber: ''
      },
      selCarType: {},
      popCarType: false,
      cityName: '',
      carTypeName: [],
      birthday: '',
      vin: '',
      brandCarType: '',
      lpn: '',
      carList: [],
      id: '',
      disabled: true,
      sexAbled:false,
    }
  },
  computed: {
    ...mapState([
      'token', 'realName', 'user', 'userPhone', 'defCar'
    ])
  },
  mounted() {
    this.init();
    this.native.grabHandler('home.club.join');
    this.birthday = this.user.birthday;
    this.brandCarType = this.defCar.brandCarType;
    this.id = this.defCar.carTypeId;
    this.lpn = this.defCar.lpn;
    this.vin = this.defCar.vin;
    if (this.lpn == '') {
      this.disabled = false;
    }
    this.form.wechatNumber = this.userPhone;
    if(this.user.sex==''){
      this.sexAbled = false;
    }else {
      this.sexAbled = true;
    }
  },
  methods: {
    init() {
      var postData = {
        token: this.token
      };
      this.native.apiHandler('XS-BUS-VCXX', postData, (res) => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          var resultData = response.body.resultData;
          resultData.forEach((item, index) => {
            this.carTypeName.push(item.vin);
            this.carList.push(item);
          })
        }
      });
    },
    open(picker) {
      this.$refs[picker].open();
    },
    emitCarType(data) {
      this.vin = data;
      this.carList.forEach((item) => {
        if (this.vin == item.vin) {
          this.brandCarType = item.brandCarType;
          this.lpn = item.lpn;
          this.id = item.id;
          if (this.lpn == '') {
            this.disabled = false;
          } else {
            this.disabled = true;
          }
        }
      })
    },
    handleChange(value) {
      this.birthday = (new Date(value)).format('yyyy/MM/dd');
    },
    submit() {
      if (this.birthday == '' || this.id == ''
        || this.form.job == '' || this.form.job == undefined || this.userPhone == '' || this.realName == ''
        || this.user.sex == '' || this.vin == '' ||this.vin == undefined || this.form.wechatNumber == '') {
        this.toast('请补全信息');
      } else if (!this.verifyCarNo(this.lpn)) {
        return;
      } else {
        var submitData = {
          birthday: this.birthday,
          carTypeId: this.id,
          id: this.$route.query.id,
          job: this.form.job,
          lpn: this.lpn,
          mobilePhone: this.userPhone,
          name: this.realName,
          sex: this.user.sex,
          vin: this.vin,
          wechatNumber: this.form.wechatNumber,
          token: this.token
        };
        this.native.apiHandler('XS-BUS-RHSQ', submitData, (res) => {
          let response = this.convert(res);
          this.native.grabHandler('home.club.join.submit');
          if (response.body.isSuccessful == true) {
            if (response.body.resultData == true) {
              this.toast('提交成功，请等待审核');
              this.$router.push({ name: 'clubList', query: {} });
            } else {
              this.toast('提交失败');
            }
          }
        });
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import "club.less";
</style>
