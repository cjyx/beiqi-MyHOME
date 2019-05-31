<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <ul class="group-list">
        <li>
          <router-link :to="{ name: '', params: { id: 123 }}">
            <img :src="detialContent.img">
            <div class="content">
              <p class="cash-coupon">
                <span>{{detialContent.commodityName}}</span>
              </p>
              <div class="goods-list">
                <div>
                  <span class="color-title" v-if="detialContent.startDate!=''">{{detialContent.startDate|dateFormat('yyyy-MM-dd')}} 至 {{detialContent.endDate|dateFormat('yyyy-MM-dd')}}</span>
                </div>
              </div>
            </div>
          </router-link>
        </li>
      </ul>
      <div class="coupon-content">
        <div>
          <h3>票券介绍</h3>
          <div v-html="detialContent.describe" class="describe">
          </div>
        </div>
      </div>
    </div>
    <loginPopup v-if="modalLogin" @onHide="modalLogin = false"></loginPopup>
    <modal-bar v-if="modalNoScore" :maskHeader="1" :canClose="false" :state="3" @onHide="modalNoScore = false">
      <div slot="modal-main" class="dialog">
        <p>积分不足</p>
        <p>您的积分：{{restScore}}分</p>
        <p>需要积分：{{consume}}分</p>
        <button class="btn next-btn" @click="modalNoScore=false">确定</button>
      </div>
    </modal-bar>
    <modal-bar :maskHeader="2" v-if="modalChange" @onHide="modalChange = false" :state="3">
      <div slot="modal-main">
        <p>消耗积分：
          <span>{{consume}}积分</span>
        <p>确认兑换代金券？</p>
        <div class="modal-btn">
          <a @click="modalChange = false">取消</a>
          <a @click="submit">确定</a>
        </div>
      </div>
    </modal-bar>
    <modal-bar v-if="modalSuccess" :maskHeader="1" :canClose="false" :state="3">
      <div slot="modal-main" class="dialog">
        <p>{{msg}}</p>
        <router-link :to="{ name: 'mall', query: { }}">
          <button class="btn next-btn">返回积分商城</button>
        </router-link>
      </div>
    </modal-bar>
    <div class="submit-btn">
      <!--<span>积分：8888积分</span>-->
      <button class="btn next-btn" @click="goToChange">立即兑换</button>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        title: '商品说明',
        id:'',//代金券id
        detialContent:{},//代金券基本信息
        modalLogin:false,//登录注册弹框
        modalNoScore:false,//积分不足弹框
        restScore:0,//您的积分
        needScore:0,//需要的积分
        modalChange:false,//兑换代金券弹框
        modalSuccess:false,//判断库存不足弹框
        msg:'',//库存不足提示信息
        discount:0,
        consume:0,
      }
    },
    computed: {
      ...mapState([
        'token','discountNum'
      ])
    },
    mounted(){
      this.id = this.$route.query.id;
      this.init();
      this.discount = this.discountNum;
      this.native.grabHandler('home.mall.couponDetail');
      if(this.token!=''){
        this.getScore();
      }
    },
    methods: {
//      代金券基本信息
      init(){
        var postData = {
          id:this.id
        };
        this.native.apiHandler('XS-MAL-SPXQ', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            this.detialContent = response.body.resultData;
          }
        })
      },
//      代金券兑换
      goToChange(){
//        if( this.detialContent.needScore==0){
//          this.needScore = this.detialContent.presendScore;
//        }else {
//          this.needScore = this.detialContent.needScore;
//        }
        this.native.grabHandler('home.mall.couponDetail.change');
        if(this.token==''){
          this.modalLogin = true;
        }else{
          this.bigger();
          if(this.consume>this.restScore){
            this.modalNoScore = true;
          } else {
            if(this.detialContent.couponUseType==0){
              this.modalChange = true;
            }else if(this.detialContent.couponUseType==1){
              this.$router.push({name: 'cashExchange', query: {item:this.detialContent}});
            }
          }
        }
      },
//      兑换通用代金券
      submit(){
        this.native.grabHandler('home.mall.couponDetail.submit');
        var ticketData = {
          id:this.id,
          token: this.token
        };
        this.native.apiHandler('XS-MAL-CJDJQDD', ticketData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            if(response.body.resultData.result==1){
              this.modalChange = false;
              this.$router.push({name: 'success', query: {type:'ticket'}});
            }else{
              this.modalChange = false;
              this.modalSuccess = true;
              this.msg = response.body.resultData.msg;
//              this.toast(response.body.resultData.msg);
            }
          }
        })
      },
//      获取剩余积分
      getScore(){
        var scoreData = {
          token: this.token
        };
        this.native.apiHandler('	XS-MAL-SYJF', scoreData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            this.restScore = response.body.resultData;
          }
        })
      },
//    折扣比较
    bigger(){
      if(this.discount==0||this.discount==undefined){
        if(this.detialContent.needScore==0){
          this.consume = this.detialContent.presendScore;
        }else {
          this.consume = this.detialContent.needScore;
        }
      }else if(this.discount!=0&&this.discount!=undefined){
        if(this.detialContent.needScore==0){
          if(this.detialContent.presendScore<=Math.round(this.detialContent.origScore*this.discount/10)){
            this.consume = this.detialContent.presendScore;
          }else {
            this.consume = Math.round(this.detialContent.origScore*this.discount/10);
          }
        }else {
          this.consume = Math.round(this.detialContent.needScore*this.discount/10);
        }
      }
    }
    }
  }
</script>
<style lang="less" scoped>
@import "mall.less";
</style>
