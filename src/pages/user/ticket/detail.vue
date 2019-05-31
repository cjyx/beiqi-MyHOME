<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='false'>
      <router-link slot="left" :to="{ name: 'ticket',query:{'ticketIndex':1}}"><i class="iconfont icon-left"></i></router-link>
    </head-bar>
    <div class="main-content main-content-detail">
      <div>
        <h2 class="title">{{content.commodityName}}</h2>
        <div class="content">
          <p>有效时间：{{content.startDate | dateFormat('yyyy-MM-dd')}}-{{content.endDate | dateFormat('yyyy-MM-dd')}}</p>
          <p>经销商：{{content.dealerInfo}}</p>
          <p>代金券状态：{{status}}</p>
          <p>票券码：{{content.verifycationCode}}</p>
          <p>代金券二维码：</p>
          <div class="code">
            <code-bar :bgColor="bgColor" :fgColor="fgColor" :size="size" level="L" :val="val"></code-bar>
          </div>
        </div>
      </div>
      <div>
        <h4 class="title">商品内容</h4>
        <div class="content">
          <p v-html="content.describe" class="describe"></p>
        </div>
      </div>

    </div>

  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import Qrcode from 'v-qrcode'
  export default {
    data () {
      return {
        title: '代金券详情',
        val: "",
        bgColor: "#FFFFFF",
        fgColor: "#000000",
        size: 200,
        content: {},
        id: '',
        status: '',
      }
    },
    computed: {
      ...mapState([
        'token'
      ])
    },
    mounted(){
      this.id = this.$route.query.id;
      this.native.grabHandler('user.ticket.ticketDetail.'+this.id);
      this.init();
    },
    methods: {
      init(){
        var postData = {
          id: this.id,
          token: this.token,
        };
        this.native.apiHandler('XS-MAL-DJQDDXQ', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            this.content = response.body.resultData;
            this.val = this.content.qrCodeUrl;
            if (this.content.couponStatus == 0) {
              this.status = '待使用'
            } else if (this.content.couponStatus == 1) {
              this.status = '已使用'
            } else {
              this.status = '失效'
            }
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "ticket.less";
</style>
