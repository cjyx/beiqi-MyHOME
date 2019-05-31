<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='false'>
      <router-link slot="left" :to="{ name: 'mall'}">
        <i class="iconfont icon-left"></i>
      </router-link>
    </head-bar>
    <div class="main-content">
      <div class="success-content" v-if="orderShow">
        <img src="../../../assets/img/goods_01.png" alt="">
        <h3>您已兑换成功！</h3>
        <router-link :to="{ name: 'ticket',query: {ticketIndex:1}}">
          <button class="btn goods-button">查看已兑商品</button>
        </router-link>
      </div>
      <div class="success-content" v-if="!orderShow">
        <img src="../../../assets/img/goods_02.png" alt="">
        <h3>您已兑换成功！</h3>
        <router-link :to="{ name: 'ticket'}">
          <button class="btn goods-button">查看订单</button>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        title: '提交订单',
        type:'',
        orderShow:false,
      }
    },
    mounted(){
        this.type = this.$route.query.type;
      this.native.grabHandler('home.mall.success');
        if(this.type=='order'){
            this.orderShow = false;
            this.title = '提交订单';
        }else{
            this.orderShow = true;
            this.title = '代金券兑换';
        }
    },
    methods: {}
  }
</script>
<style lang="less" scoped>
@import "mall.less";
</style>
