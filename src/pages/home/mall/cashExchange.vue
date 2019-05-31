<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <ul class="group-list">
        <li>
          <a>
            <img :src="list.img">
            <div class="content">
              <p class="cash-coupon">
                <span>{{list.commodityName}}</span>
              </p>
              <div class="goods-list">
                <div>
                  <!--<span><i>{{list.presendScore}}</i>积分</span>-->
                  <span v-if="list.needScore==0"><i>现积分:{{list.presendScore}}积分</i></span>
                  <span class="old" v-if="list.needScore==0">原积分:{{list.origScore}}积分</span>
                  <span v-if="list.needScore!=0">所需积分:{{list.needScore}}积分</span>
                </div>
              </div>
            </div>
            </a>
        </li>
      </ul>
      <div class="caption-group">
        <div class="name">
          <i class="iconfont icon-line-v"></i>
          <div class="borNo">
            <h3>选择经销商</h3>
          </div>
        </div>
        <div class="form-content">
          <div class="form-group">
            <input type="text" placeholder="请选择经销商所在城市" v-model="cityName" @click="popCity=!popCity" readonly>
          </div>
          <div class="form-group">
            <input type="text" placeholder="请选择经销商" v-model="selDealer.companyName" @click="popDealer=!popDealer"
                   readonly :disabled="disDealer">
          </div>
        </div>
      </div>
    </div>
    <div class="submit-btn">
      <button class="btn next-btn" @click="toChange">确认兑换</button>
    </div>
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
    <!--经销商所在城市-->
    <city-popup :show="popCity" @onOk="emitCity"></city-popup>
    <!--经销商-->
    <dealerticket-Popup :show="popDealer" :cashId="list.id" :cityCode="selCity.code" @onOk="emitDealer" @onDisDealer="emitDisDealer"></dealerticket-Popup>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        title: '代金券兑换',
        popCity:false,//城市
        popDealer: false,//经销商
        list:{},//代金券基本信息
        modalShow:false,//登录注册弹框
        selCity: {},//城市组件
        selDealer: {},//经销商组件
        modalChange:false,//兑换代金券弹框
        modalSuccess:false,//判断库存不足弹框
        disDealer:true,
        msg:'',//库存不足信息
        cityName:'',
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
      this.list = this.$route.query.item;
      this.discount = this.discountNum;
      this.native.grabHandler('home.mall.cashExchange');
    },
    methods: {
      emitCity(data){
        this.cityCode = data.code;
        this.selCity = data;
        this.cityName=data.pName+'-'+data.name;
        this.selDealer={};
      },
      emitDealer(data){
        this.selDealer = data;
        this.form.dealerCode = data.dealerCode;
      },
//      暂无经销商时经销商不可选
      emitDisDealer(data){
        this.disDealer=data;
      },
//      确认兑换
      submit(){
        this.native.grabHandler('home.mall.cashExchange.submit');
        var postData = {
          dealerId:this.selDealer.id,
          id:this.list.id,
          token: this.token
        };
        this.native.apiHandler('XS-MAL-CJDJQDD', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            if(response.body.resultData.result==1){
              this.$router.push({name: 'success', query: {type:'ticket'}});
            }else {
                this.modalSuccess = true;
                this.modalChange = false;
                this.msg = response.body.resultData.msg;
            }
          }
        })
      },
      //    折扣比较
      bigger(){
        if(this.discount==0||this.discount==undefined){
          if(this.list.needScore==0){
            this.consume = this.list.presendScore;
          }else {
            this.consume = this.list.needScore;
          }
        }else if(this.discount!=0&&this.discount!=undefined){
          if(this.list.needScore==0){
            if(this.list.presendScore<=Math.round(this.list.origScore*this.discount/10)){
              this.consume = this.list.presendScore;
            }else {
              this.consume = Math.round(this.list.origScore*this.discount/10);
            }
          }else {
            this.consume = Math.round(this.list.needScore*this.discount/10);
          }
        }
      },
      toChange(){
        this.bigger();
        if(this.selDealer.id==undefined){
          this.toast('请选择经销商');
        }else{
          this.modalChange=true;
        }
      }
    }
  }
</script>
<style lang="less" scoped>
@import "mall.less";
</style>
