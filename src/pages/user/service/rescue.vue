<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <div class="form-content">
        <div class="form-group">
          <label class="required">姓名：</label>
          <input type="text" maxlength="20" v-model="information.customerName" readonly>
        </div>
        <div class="form-group">
          <label class="required">性别：</label>
          <div class="option">
            <input type="radio" name="sex" value="1" v-model="information.sex" readonly disabled>
            <span></span>
            <label>男</label>
          </div>
          <div class="option">
            <input type="radio" name="sex" value="0" v-model="information.sex" readonly disabled>
            <span></span>
            <label>女</label>
          </div>
        </div>
        <div class="form-group">
          <label class="required">手机号：</label>
          <input type="text"  v-model="information.mobile" readonly/>
        </div>
        <div class="form-group">
          <label class="required">预约经销商：</label>
          <input type="text"  v-model="information.dealerName" readonly>
        </div>
        <div class="form-group">
          <label class="required">救援日期：</label>
          <input type="text" v-model="information.reservationDate"  readonly>
        </div>
        <div class="form-group">
          <label class="required">救援详细位置：</label>
          <input type="text" v-model="information.rescueAddress" readonly/>
        </div>
        <div class="form-group">
          <label class="required">订单状态：</label>
          <input type="text"  v-model="orderState[information.status]" readonly>
        </div>
      </div>
      <button v-if="information.status==0" class="btn next-btn" @click="cancelModal = true">取消订单</button>
    </div>
    <!--确定取消-->
    <modal-bar :maskHeader="2" v-if="cancelModal" @onHide="cancelModal = false" :state="1" :content="'确定取消？'"
               :cancelText="'取消'" @onCancel="cancelModal = false"
               :okText="'确定'" @onOk="orderCancel()">
    </modal-bar>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  var currentDate = new Date();
  export default {
    data () {
      return {
        title: '救援订单',
        information:{},
        orderState:['已提交', '已确认', '', '已完成', '已评价', '已取消'],
        cancelModal:false,
      }
    },
    computed: {
      ...mapState([
        'token'
      ])
    },
    mounted(){
      this.native.grabHandler('user.service.serviceRescue.'+this.$route.query.id);
      this.init();
    },
    methods: {
      init(){
        var postData = {
          id:this.$route.query.id
        };
        this.native.apiHandler('XS-MAL-JYDDXQ', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            this.information = response.body.resultData;
          }
        })
      },
      //取消订单
      orderCancel(){
        this.native.grabHandler('user.service.serviceRescue.cancel');
        var postData = {
          id:this.$route.query.id,
          orderType:2,
          token:this.token,
        };
        this.native.apiHandler('XS-BUS-QXWDDD', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            if(response.body.resultData == true){
              this.toast('取消成功');
              this.$router.go(-1);
            }
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "information.less";
</style>
