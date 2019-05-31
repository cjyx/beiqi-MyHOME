<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <div class="srach-btn">
        <input type="text" placeholder="请输入车型名称" v-model="titleText" >
        <!--<i class="iconfont icon-list"></i>-->
        <button class="iconfont icon-search" @click="search"></button>
      </div>
      <div class="page-loadmore-wrapper tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :autoFill="false" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
          <ul class="page-loadmore-list group-list">
            <li v-for="(item,index) in list" :key="index">
              <a @click="redirect('productDetail',item.id)">
                <div class="mark-top" v-if="item.policyCount>0"><p>惠</p></div>
                <img v-if="item.carTypeLittleImg!=''" v-lazy="item.carTypeLittleImg">
                <img v-if="item.carTypeLittleImg==''" :src="defImg">
                <div class="content">
                  <h3>{{item.brandCarType}}</h3>
                  <div class="info pd-list">
                    <span>市场指导价</span>
                    <p><span>￥{{parseInt(item.price)}}</span>元起</p>
                  </div>
                </div>
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
      </div>

    </div>
    <transition name="slide-left">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    data() {
      return {
        title:'产品大全',
        titleText:'',
        defImg: require('../../../assets/img/user-head.png'),
        list: [],
        allLoaded: false,
        bottomStatus: '',
        wrapperHeight: 0,
      };
    },
    computed: {
      ...mapState([
        'token'
      ])
    },
    mounted(){
      this.native.grabHandler('home.product');
      this.wrapperHeight = document.documentElement.clientHeight-94;
      this.init();
    },
    methods: {
      search(){
        this.native.grabHandler('home.product.search');
        this.init();
      },
      init(){
        var postData = {
          brandCarType:this.titleText,
          page:1,
          pageSize:-1
        };
        this.native.apiHandler('XS-VEH-CXLB', postData, (res) => {
          let response = this.convert(res);
          if(response.body.isSuccessful == true){
            this.list = response.body.resultData;
            this.allLoaded = true;
          }
        })
      },
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
      loadBottom() {
        setTimeout(() => {
          this.allLoaded = true;
          this.$refs.loadmore.onBottomLoaded();
        }, 1500);
        this.allLoaded = true;
        this.$refs.loadmore.onBottomLoaded();
      },
      redirect(path,id) {
        this.native.grabHandler('home.product.'+path+'.'+id);
        this.$router.push({ name: path, query: {id:id} });
      },
    }
  }
</script>
<style lang="less" scoped>
  @import "product.less";
</style>

