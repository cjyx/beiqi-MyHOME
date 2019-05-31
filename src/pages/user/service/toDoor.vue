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
          <input type="text" placeholder="请输入姓名" maxlength="20" v-model="information.customerName" :disabled="disabled">
        </div>
        <div class="form-group">
          <label class="required">手机号：</label>
          <input type="text" placeholder="请输入手机号" v-model="information.mobile" :disabled="disabled"/>
        </div>
        <div class="form-group">
          <label class="required">经销商名称：</label>
          <input type="text"  v-model="information.dealerName" readonly>
        </div>
        <div class="form-group">
          <label class="required">详细地址：</label>
          <input type="text"  placeholder="请输入详细地址" v-model="information.dtdAddress" :disabled="disabled">
        </div>
        <div class="form-group">
          <label class="required">服务内容：</label>
          <input type="text" v-model="information.dtdServices" placeholder="请选择服务内容" @click="popName=!popName" readonly :disabled="disabled">
          <i class="iconfont icon-right"></i>
        </div>
        <div class="form-group">
          <label class="required">申请上门时间：</label>
          <input type="text" v-model="information.dtdDate" placeholder="请选择申请上门时间"  @click="open('time')" readonly :disabled="disabled">
          <i class="iconfont icon-right"></i>
        </div>
        <div class="form-group">
          <label class="required">订单状态：</label>
          <input type="text"  v-model="statusArr[information.status]" readonly>
        </div>
      </div>
      <button v-if="cancelState && (information.status==0 || information.status==1)" class="btn next-btn"
              @click="cancelModal=true">取消订单
      </button>
      <button v-if="!cancelState" class="btn next-btn" @click="submit">提交</button>
    </div>
    <!--服务内容-->
    <type-popup :show="popName" :default="information.dtdServices" :list="nameList" @onOk="emitName"></type-popup>
    <!--申请上门时间-->
    <mt-datetime-picker ref="time" type="datetime" v-model="pickerValue" :startDate="new Date('1950')"
                        @confirm="handleChange"></mt-datetime-picker>
    <!--确定取消-->
    <modal-bar :maskHeader="2" v-if="cancelModal" @onHide="cancelModal = false" :state="1" :content="'确定取消？'"
               :cancelText="'取消'" @onCancel="cancelModal = false"
               :okText="'确定'" @onOk="cancelOrder()">
    </modal-bar>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        title: '上门服务',
        cancelState: true,//默认修改
        disabled:true,//禁用
        popName: false,//服务内容
        nameList: ['车辆小保养', '车辆常规检查'],//服务内容
        pickerValue: new Date(),//默认时间
        information:{},
        informationOld: {},
        statusArr:['已提交','已确认','','已完成','已评价','已取消'],
        cancelModal:false,
      }
    },
    computed: {
      ...mapState([
        'token'
      ])
    },
    mounted(){
      this.id = this.$route.query.id;
      this.init();
    },
    methods: {
      emitName(data){
        this.information.dtdServices= data;
      },
      update(){
        this.cancelState = false;
        this.disabled = false;
      },
      cancelDate(){
        this.cancelState = true;
        this.disabled = true;
        this.information = JSON.parse(JSON.stringify(this.informationOld));
      },
      //申请上门时间
      handleChange(value) {
        this.information.dtdDate = (new Date(value)).format('yyyy-MM-dd hh:mm');
      },
      open(picker) {
        this.$refs[picker].open();
      },
      //取消订单
      cancel(){

      },
      //提交订单
      submit(){
        if (this.information.customerName.trimNo() == '') {
          this.toast('请输入姓名');
          return;
        }
        if (!this.verifyPhone(this.information.mobile)) {
          return;
        }
        if (this.information.dtdAddress.trimNo() == '') {
          this.toast('请输入详细地址');
          return;
        }
        if (this.information.dtdServices.trimNo() == '') {
          this.toast('请选择服务内容');
          return;
        }
        if (this.information.dtdDate.trimNo() == '') {
          this.toast('请选择上门时间');
          return;
        }
        this.disabled=true;
        this.information.token = this.token;
        this.native.apiHandler('XS-BUS-XGSMFWDD', this.information, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            if(response.body.resultData == true){
              this.toast('提交成功');
              this.$router.go(-1);
            }
          }
        })
      },
      init(){
        var postData = {
          id:this.id,
        };
        this.native.apiHandler('XS-MAL-SMFWXQ', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            let resultData = response.body.resultData;
            this.information = resultData;
            this.informationOld = JSON.parse(JSON.stringify(resultData));
          }
        })
      },
//      取消订单
      cancelOrder(){
        let time =(new Date(this.information.maintTime)).format('yyyy-MM-dd');
        let day = new Date().format('yyyy-MM-dd');
        if(time == day){
          this.toast('您不能取消当天服务');
        }else {
          var cancelData = {
            id: this.id,
            orderType: 3,
            token: this.token,
          };
          this.native.apiHandler('XS-BUS-QXWDDD', cancelData, (res) => {
            let response = this.convert(res);
            if (response.body.isSuccessful == true) {
              if (response.body.isSuccessful == true) {
                this.toast('取消订单成功');
                this.$router.go(-1);
              }
            }
          })
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "information.less";
</style>
