<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content" :style="{ height: wrapperHeight + 'px' }">
      <div class="form-content">
        <div class="form-group">
          <label class="required">身份证号：</label>
          <input type="text" placeholder="请输入身份证号" maxlength="18" v-model="form.idNumber">
        </div>
        <div class="form-group">
          <label class="required">VIN：</label>
          <input type="text" placeholder="请输入VIN号" maxlength="17" v-model="form.vin" @blur="reVin">
          <i class="iconfont icon-mark" style="color: #EA6E30;" @click="vinPic"></i>
        </div>
        <div class="form-group">
          <label>发动机号：</label>
          <input type="text" placeholder="请输入发动机号" maxlength="20" v-model="form.enginId">
          <i class="iconfont icon-mark" style="color: #EA6E30;" @click="enginImg=true"></i>
        </div>
        <div class="form-group">
          <label class="required">车型：</label>
          <input type="text" placeholder="请选择车型" v-model="carTypeName" @click="popCarType=!popCarType" readonly>
        </div>
        <div class="form-group">
          <label>车牌号：</label>
          <input type="text" placeholder="请输入车牌号" maxlength="7" v-model="form.lpn">
        </div>
        <div class="form-group">
          <label class="required">购车经销商&nbsp;&nbsp;<br/>所在省市：</label>
          <input type="text" placeholder="请选择购车经销商所在省市" v-model="cityName" @click="popCity=!popCity" readonly>
        </div>
        <div class="form-group">
          <label class="required">购车经销商：</label>
          <input type="text" placeholder="请选择购车经销商" v-model="dealerName" @click="popDealer=!popDealer" readonly :disabled="disDealer">
        </div>
        <div class="form-group">
          <label>购车推荐人：</label>
          <input type="text" placeholder="请输入购车推荐人手机号" maxlength="11" v-model="form.refereePhone">
        </div>
        <div class="form-group">
          <label class="required">行驶证/购车<br />发票照片：</label>
          <span @click="upImg" class="upload-img">上传照片</span>
          <i class="iconfont icon-mark" style="color: #EA6E30;" @click="driveImg=true"></i>
        </div>
        <div class="form-group up-pic" v-if="cardImg!=''">
          <img :src="cardImg">
        </div>
        <!--<div class="form-group">-->
          <!--<div>-->
            <!--<i class="iconfont icon-choose" @click="upImg"></i>-->
            <!--<span>点击拍摄/上传</span>-->
          <!--</div>-->
          <!--<img :src="cardImg">-->
        <!--</div>-->
        <p>上传行驶证/购车发票照片大小请勿超过5M，图片需死角对齐，如模糊、反光、太暗、有遮挡造成无法辨认等情况，将影响认证。</p>
        <button class="btn next-btn" @click="submit" :disabled="sub">提交</button>
      </div>
    </div>
    <!--车型-->
    <cartype-popup :show="popCarType" @onOk="emitCarType" :type="2"></cartype-popup>
    <!--经销商所在城市-->
    <city-popup :show="popCity" @onOk="emitCity"></city-popup>
    <!--经销商-->
    <dealer4s-popup :show="popDealer" :type="1" :cityCode="cityCode" @onOk="emitDealer" @onDisDealer="emitDisDealer"></dealer4s-popup>
    <!--VIN-->
    <transition name="slide-left">
      <mask-bar :maskHeader="1" @onHide="modalImg=false" v-if="modalImg" class="mask-preview">
        <img src="../../../assets/img/code_02.png" slot="content" class="bigImg">
      </mask-bar>
    </transition>
    <!--发动机号-->
    <transition name="slide-left">
      <mask-bar :maskHeader="1" @onHide="enginImg=false" v-if="enginImg" class="mask-preview">
        <img src="../../../assets/img/code_03.png" slot="content" class="bigImg">
      </mask-bar>
    </transition>
    <!--行驶证-->
    <transition name="slide-left">
      <mask-bar :maskHeader="1" @onHide="driveImg=false" v-if="driveImg" class="mask-preview">
        <img src="../../../assets/img/code_04.png" slot="content" class="bigImg drive-img">
      </mask-bar>
    </transition>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        title: '车辆认证',
        dealer: {},
        dealerName: '',
        city: {},
        cityCode: '',
        cityName: '',
        carType: {},
        carTypeName: '',
        popCity: false,
        popCarType: false,
        popDealer: false,
        disabled: true,
//        cardImg: require('../../../assets/img/cade_02.png'),
        cardImg:'',
        modalImg:false,
        enginImg:false,
        driveImg:false,
        disDealer:true,
        form: {
          idNumber: '',
          vin: '',
          enginId: '',
          lpn: '',
          picId: '',//906171e682cb4a63b96870baa78cab49
          refereePhone: '',
        },
        flagVin:false,
        sub:false,
        wrapperHeight:0
      }
    },
    computed: {
      ...mapState([
        'token', 'user'
      ])
    },
    mounted(){
      this.native.grabHandler('user.car.bind');
      this.wrapperHeight = document.documentElement.clientHeight-44;
      this.form.idNumber = this.user.idNumber;
      document.getElementById('bigImg')
    },
    methods: {
      emitCarType(data){
        this.carType = data;
        this.carTypeName = data.brandCarType;
      },
      emitCity(data){
        this.city = data;
        this.cityCode = data.code;
        this.cityName = data.pName + '-' + data.name;
        this.dealerName='';
      },
      emitDealer(data){
        this.dealer = data;
        this.dealerName = data.companyName;
      },
//    暂无经销商时经销商不可选
      emitDisDealer(data){
        this.disDealer=data;
      },
      upImg(){
        this.native.imgHandler(1, {token: this.token}, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            for (var i = 0, len = resultData.length; i < len; i++) {
              this.form.picId = resultData[i].fileId;
              this.cardImg = resultData[i].fileUrl;
            }
          }
        })
      },
      vinPic(){
        this.modalImg=true;
      },
//     失去焦点验证vin
      reVin(){
        if (!this.verifyVin(this.form.vin)) {
          return;
        }
        this.native.apiHandler('XS-VEH-JYVIN', {vin:this.form.vin}, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var vinResult = response.body.resultData;
            if(vinResult==0){
              this.toast('您输入的VIN有误');
              this.flagVin = false;
            }else if(vinResult==1){
              this.toast('VIN正确');
              this.flagVin = true;
            }else if(vinResult==-1){
              this.toast('VIN检验超时');
              this.flagVin = false;
            }
          }
        })
      },
      submit(){
        if (!this.verifyIdNumber(this.form.idNumber)) {
          return;
        }
        if (!this.verifyVin(this.form.vin)) {
          return;
        }
        if(this.flagVin==false){
          this.toast('请输入正确的VIN');
          return;
        }
        if (this.carTypeName == '') {
          this.toast('请选择车型');
          return;
        }
        if (this.dealerName == '') {
          this.toast('请选择经销商');
          return;
        }
        if (this.form.lpn.trimNo() != '') {
          if (!this.verifyCarNo(this.form.lpn)) {
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
        if (this.form.picId == '') {
          this.toast('请上传行驶证');
          return;
        }
        this.sub = true;
        this.form.vehicleType = this.carType.id;
        this.form.dealerCode = this.dealer.dealerCode;
        this.form.token = this.token;
        this.native.apiHandler('XS-VEH-CLBD', this.form, (res) => {
          this.native.grabHandler('user.car.bind.submit');
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            this.sub = false;
            var resultData = response.body.resultData;
            if (resultData.isSuccess) {
              this.toast('绑定成功，等待审核');
              this.$router.go(-1);
            } else {
              this.toast(resultData.msg);
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
