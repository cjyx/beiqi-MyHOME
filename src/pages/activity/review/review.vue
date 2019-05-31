<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'></head-bar>
    <div class="main-content">
      <div class="srach-btn">
        <input type="text" @click="searchPush" placeholder="请输入活动回顾的标题" readonly>
        <button class="iconfont icon-up-down" style="font-size: 0.35rem;" @click="search"></button>
      </div>
      <div class="page-loadmore-wrapper tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :autoFill="false" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
          <ul class="page-loadmore-list group-list">
            <li v-for="(item,index) in reviewList" :key="index">
              <router-link :to="{ name: 'reviewDetail', query: { id:item.id }}">
                <img v-lazy="item.imgUrl">
                <div class="content">
                  <h3>{{ item.title}}</h3>
                  <div class="info">
                    <span>阅读量：{{item.readCount}}</span>
                    <span>{{item.createTime | date}}</span>
                  </div>
                </div>
              </router-link>
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
    <mask-bar :maskHeader="1" v-if="showBtn" @onHide="emitState">
      <div class="search-condition" slot="content" @click="cancelSearch">
        <ul class="condition">
          <li :class="{'change':time}" @click="radioBtn(1)">
            时间
            <img src="../../../assets/img/up.png" alt="">
          </li>
          <li :class="{'change':read}" @click="radioBtn(2)">阅读量</li>
          <li :class="{'change':commentNum}" @click="radioBtn(3)">评论量</li>
        </ul>
      </div>
    </mask-bar>
    <transition name="slide-left">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        title: '活动回顾',
        reviewList:[],
        showBtn:false,
        allLoaded: false,
        allLoadedThree:false,
        bottomStatus: '',
        wrapperHeight: 0,
        page:1,
        orderBy:1,
        time:true,
        commentNum:false,
        read:false,
      }
    },
    mounted(){
      this.init(1,1);
      this.native.grabHandler('activity.review');
      this.wrapperHeight = document.documentElement.clientHeight-94;
    },
    methods: {
      init(order,page,type){
        var postData = {
          order:order,
          page:page,
          release:1
        };
        this.native.apiHandler('XS-BUS-HDHGLB', postData, (res) => {
          let response = this.convert(res);
          if(response.body.isSuccessful == true){
            var resultData = response.body.resultData;
            if(resultData.rows.length>0){
              this.reviewList.pushs(resultData.rows);
            }else{
              this.toast('加载完毕');
            }
          }
        })
      },
      /*排序**/
      search(){
        this.showBtn = true;
      },
      cancelSearch(){
        this.showBtn = false;
      },
      radioBtn(order){
        this.native.grabHandler('activity.review.order.'+order);
        if(order==1){
          this.time = true;
          this.commentNum=false;
          this.read=false;
        }else if(order==2){
          this.time = false;
          this.commentNum=false;
          this.read=true;
        }else{
          this.time = false;
          this.commentNum=true;
          this.read=false;
        }
        if(order==this.orderBy){
          return;
        }else{
          this.reviewList = [];
          this.init(order,1);
          this.orderBy = order;
        }
      },
      emitState(){
        this.showBtn = false;
      },
      /*分页**/
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
      loadBottom() {
        this.page++;
        setTimeout(() => {
          this.init(this.orderBy,this.page);
          this.$refs.loadmore.onBottomLoaded();
        }, 1500);
      },
      searchPush(){
        this.native.grabHandler('activity.review.searchPush');
        this.$router.push({name: 'reviewSearch', params: {}});
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "review.less";
</style>
