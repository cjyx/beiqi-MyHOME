<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'></head-bar>
    <div class="main-content">
      <router-link :to="{ name: 'selectAddress', query: { type:'order'}}" class="address">
        <div v-if="selAddress.name!=undefined">
          <h3>{{selAddress.name}}<span>{{selAddress.tel}}</span></h3>
          <p><i class="iconfont icon-location"></i> {{selAddress.addressDetail}}</p>
        </div>
        <div v-if="selAddress.name==undefined">
          请填写收货地址
        </div>
        <i class="iconfont icon-more"></i>
      </router-link>
      <ul class="group-list">
        <li v-for="(item,index) in orderList" :key="index">
          <a>
            <img :src="item.img">
            <div class="content">
              <div class="goods-list">
                <h2>{{item.commodityName}}</h2>
                <p class="gray">市场指导价:{{item.price}}元</p>
              </div>
              <div class="goods-list">
                <div>
                  <!--<span><i>{{item.presendScore}}</i>积分</span>-->
                  <!--<span class="old">{{item.origScore}}积分</span>-->
                  <span v-if="item.needScore==0"><i>现积分:{{item.presendScore}}积分</i></span>
                  <span class="old" v-if="item.needScore==0">原积分:{{item.origScore}}积分</span>
                  <span v-if="item.needScore!=0">所需积分:{{item.needScore}}积分</span>
                </div>
                <p class="gray">数量：{{item.amount}}</p>
              </div>
            </div>
          </a>
        </li>
      </ul>
      <div class="bottom-btn">
        <div>合计：
          <span class="line" v-if="(discount==undefined&&integral!=integralAllNow)|| (discount==0&&integral!=integralAllNow)
            || discount!=0&&discount!=undefined&&Math.round(integral*discount/10)<Math.round(integralAllDiscount)&&integral!=Math.round(integral*discount/10)
            || discount!=0&&discount!=undefined&&Math.round(integral*discount/10)>=Math.round(integralAllDiscount)&&integral!=Math.round(integralAllDiscount)">{{integral}}</span>
          <span v-else>{{integral}}</span>
          积分<br />
          <!--<span v-if="discount!=0&&discount!=undefined">会员{{discount}}折:{{Math.round(integral*discount/10)}}积分</span>-->
          <span v-if="discount!=0&&discount!=undefined&&Math.round(integral*discount/10)>=Math.round(integralAllDiscount)&&integral!=Math.round(integralAllDiscount)">折扣价:{{Math.round(integralAllDiscount)}}积分</span>
          <span v-if="discount!=0&&discount!=undefined&&Math.round(integral*discount/10)<Math.round(integralAllDiscount)&&integral!=Math.round(integral*discount/10)">折扣价:{{Math.round(integral*discount/10)}}积分</span>
          <span v-if="(discount==0&&integral!=integralAllNow)||(discount==undefined&&integral!=integralAllNow)">折扣价:{{integralAllNow}}积分</span>
        </div>
        <button class="btn next-btn" @click="modalChange=true">立即兑换</button>
      </div>
    </div>
    <modal-bar :maskHeader="2" v-if="modalChange" @onHide="modalChange = false" :state="1" :content="'确认兑换商品？'"
               :cancelText="'取消'" @onCancel="modalChange = false"
               :okText="'确定'" @onOk="submit">
    </modal-bar>
    <modal-bar v-if="modalSuccess" :maskHeader="1" :canClose="false" :state="3">
      <div slot="modal-main" class="dialog">
        <p>{{msg}}</p>
        <!--<router-link :to="{ name: 'shopCar', query: { }}">-->
          <button class="btn next-btn" @click="$router.go(-1)">返回购物车</button>
        <!--</router-link>-->
      </div>
    </modal-bar>
    <transition name="slide-left">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        title: '提交订单',
        orderList: [],//订单list
        integral: 0,//合计积分
        integralAllNow:0,
        integralAllDiscount:0,
        ids: [],//实物的ids
        modalChange: false,//弹框
        modalSuccess: false,//库存不足弹框
        msg: '',//库存不足信息
        discount:0,
      }
    },
    computed: {
      ...mapState([
        'token', 'selAddress', 'confirmOrder','discountNum'
      ])
    },
    mounted(){
      this.orderList = this.confirmOrder;
//      this.discount = this.$route.query.discount;
      this.discount = this.discountNum;
      this.init();
      this.native.grabHandler('home.mall.order');
    },
    methods: {
      init(){
        this.orderList.forEach((item, index) => {
          if(item.needScore==0){
            this.integral += item.origScore * item.amount;
            this.integralAllNow += item.presendScore * item.amount;
            this.integralAllDiscount += item.presendScore * item.amount;
          }else {
            this.integral += item.needScore * item.amount;
            this.integralAllNow += item.needScore * item.amount;
            this.integralAllDiscount += item.needScore * item.amount*this.discount/10;
          }
          this.ids.push(item.id);
        })
      },
      submit(){
          if(this.selAddress.name==undefined){
              this.toast('请填写收货地址');
          }else {
            this.native.grabHandler('home.mall.order.submit');
            var postData = {
              addressId: this.selAddress.id,
              ids: this.ids,
              token: this.token
            };
            this.native.apiHandler('XS-MAL-CJSWDD', postData, (res) => {
              let response = this.convert(res);
              if (response.body.isSuccessful == true) {
                if (response.body.resultData.result == 1) {
                  this.toast('提交成功');
                  this.$router.push({name: 'success', query: {type: 'order'}});
                } else {
                  this.modalChange = false;
                  this.modalSuccess = true;
                  this.msg = response.body.resultData.msg;
                }
              }
            })
          }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "order.less";
</style>
