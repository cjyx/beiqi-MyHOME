<template>
  <div class="app">
    <head-bar :head-title="title" :head-back="returnIcon">
      <router-link v-if="returnIcon==false" slot="left" :to="{ name: 'user'}"><i class="iconfont icon-left"></i></router-link>
    </head-bar>
    <div class="main-content">
      <div class="btn-tab">
        <button :class="{'active':selected==0}" @click="goods">实物商品</button>
        <button :class="{'active':selected==1}" @click="ticket">代金券</button>
      </div>
      <div v-if="selected==0" class="tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :autoFill="false" :bottom-method="goodsLoad" @bottom-status-change="handleBottomChange"
                     :bottom-all-loaded="allLoadedGoods" ref="loadmoreGoods" v-if="modalEmpty==false">
          <ul class="page-loadmore-list group-list">
            <li v-for="(item,index) in goodsList" :key="index">
              <a>
                <img v-lazy="item.img">
                <div class="content">
                  <div class="goods-list">
                    <h2>{{item.commodityName}}</h2>
                    <p class="active-red" v-if="item.status==0">未发货</p>
                    <p class="active-red" v-if="item.status==1">已发货</p>
                    <p class="active-red" v-if="item.status==2">已作废</p>
                  </div>
                  <div class="goods-list">
                    <div>
                      <span>兑换日期：{{item.createTime | dateFormat('yyyy-MM-dd')}}</span><br />
                      <span v-if="item.status==1">发货时间：{{item.deliveryTime}}</span>
                    </div>
                    <p>数量:{{item.amount}}</p>
                  </div>
                </div>
              </a>
              <p class="goods-btn" v-if="item.status==1">
                <router-link :to="{ name: 'express', query: {information:item}}">
                  <button class="goods-button">追踪物流</button>
                </router-link>
                <router-link :to="{ name: 'eval', query: {info:item }}" v-if="!item.isCommented">
                  <button class="goods-button">评价</button>
                </router-link>
              </p>
            </li>
          </ul>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
            <span v-show="bottomStatus === 'loading'">
            <mt-spinner type="snake"></mt-spinner>
          </span>
          </div>
        </mt-loadmore>
        <!--空白页-->
        <empty-page v-if="modalEmpty"></empty-page>
      </div>
      <div v-if="selected==1" class="tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :autoFill="false" :bottom-method="ticketLoad" @bottom-status-change="handleBottomChange"
                     :bottom-all-loaded="allLoadedTicket" ref="loadmoreTicket" v-if="ticketEmpty==false">
          <ul class="page-loadmore-list group-list">
            <li v-for="(item,index) in ticketList" :key="index">
              <a @click="redirect('ticketDetail',item.id)">
                <img :src="item.img">
                <div class="content">
                  <h3>{{item.commodityName}}</h3>
                  <div class="info">
                    <span>{{item.startDate | dateFormat('yyyy-MM-dd')}}至{{item.endDate| dateFormat('yyyy-MM-dd')}}</span>
                  </div>
                </div>
                <button class="btn" v-if="item.couponStatus==0">待使用</button>
                <button class="btn" :disabled="disabled" :class="disabled ? 'disabled-btn': ''" v-if="item.couponStatus==1">已使用</button>
                <button class="btn" :disabled="disabled" :class="disabled ? 'disabled-btn': ''" v-if="item.couponStatus==2">已失效</button>
              </a>
            </li>
          </ul>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
            <span v-show="bottomStatus === 'loading'">
            <mt-spinner type="snake"></mt-spinner>
          </span>
          </div>
        </mt-loadmore>
        <!--空白页-->
        <empty-page v-if="ticketEmpty"></empty-page>
      </div>
    </div>

    <transition name="slide-left">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        title: '我的票券',
        selected: 0,
        wrapperHeight:0,
        allLoadedGoods:false,
        allLoadedTicket: false,
        returnIcon:true,
        bottomStatus: '',
        disabled:false,
        goodsList:[],
        ticketList:[],
        goodsPage:1,
        ticketPage:1,
        modalEmpty:false,
        ticketEmpty:false,
      }
    },
    mounted() {
      this.native.grabHandler('user.ticket');
      this.wrapperHeight = document.documentElement.clientHeight-44*2;
      if(this.$route.query.ticketIndex!=undefined){
          this.selected=this.$route.query.ticketIndex;
          this.returnIcon=false;
      }else{
          this.selected=0
      }
      this.init(this.goodsPage, 0);
      this.init(this.ticketPage, 1);
    },
    computed: {
      ...mapState([
        'token'
      ])
    },
    methods: {
      init(page,type){
        var postData = {
          orderType:type.toString(),
          page:page,
          token:this.token
        };
        this.native.apiHandler('XS-MAL-DDLB', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            if(type==0) {
              if(response.body.resultData==undefined){
                this.modalEmpty=true;
              }
              if (response.body.resultData.length > 0) {
                this.goodsList.pushs(response.body.resultData);
              }else {
                this.allLoadedGoods = true;
                this.toast('加载完毕');
              }

            }
            if(type==1) {
              if(response.body.resultData==undefined){
                this.ticketEmpty=true;
              }
              if (response.body.resultData.length > 0) {
                this.ticketList.pushs(response.body.resultData);
              } else {
                this.allLoadedTicket = true;
                this.toast('加载完毕');
              }

            }
          }
        })
      },
      /*分页**/
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
      goodsLoad() {
        this.goodsPage++;
        setTimeout(() => {
          this.init(this.goodsPage,0)
          this.$refs.loadmoreGoods.onBottomLoaded();
        }, 1500);
      },
      ticketLoad() {
        this.ticketPage++;
        setTimeout(() => {
          this.init(this.ticketPage,1)
          this.$refs.loadmoreTicket.onBottomLoaded();
        }, 1500);
      },
      goods(){
        this.selected=0;
        this.native.grabHandler('user.ticket.goods');
      },
      ticket(){
        this.selected=1;
        this.native.grabHandler('user.ticket.ticket');
      },
      redirect(path,id) {
        this.native.grabHandler('user.ticket'+path+'.'+id);
        this.$router.push({ name: path, query: {id:id} });
      },
    }
  }
</script>
<style lang="less" scoped>
  @import "ticket.less";
</style>
