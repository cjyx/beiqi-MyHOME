<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <div class="srach-btn">
        <input type="text" placeholder="请输入标题" v-model="titleContent">
        <!--<i class="iconfont icon-list"></i>-->
        <button class="iconfont icon-search" @click="search"></button>
      </div>
      <div class="page-loadmore-wrapper tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :autoFill="false" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
          <ul class="page-loadmore-list group-list">
            <li v-for="(item,index) in reviewList" :key=index>
              <router-link :to="{ name: 'searchDetail', query: { id:item.id}}">
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
    <transition name="slide-left">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        title:'搜索',
        reviewList: [],
        allLoaded: false,
        bottomStatus: '',
        wrapperHeight: 0,
        loadPage: 1,
        titleContent:''
      };
    },
    mounted() {
      this.wrapperHeight = document.documentElement.clientHeight-94;
      this.native.grabHandler('activity.review.search');
    },
    methods: {
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
      loadBottom() {
        this.loadPage++;
        let that = this;
        setTimeout(() => {
          this.init(this.loadPage);
          this.$refs.loadmore.onBottomLoaded();
        }, 1500);
      },
      init(page){
//      搜索
        if(this.titleContent==''){
          this.toast('未找到您搜索的内容');
          return false;
        }else {
          var postData = {
            title: this.titleContent,
            page: page
          };
          this.native.apiHandler('XS-BUS-HDHGSS', postData, (res) => {
            let response = this.convert(res);
            if (response.body.isSuccessful == true) {
              if (response.body.resultData.rows.length > 0) {
                this.reviewList.pushs(response.body.resultData.rows);
              } else {
                this.allLoaded = true;
                this.toast('加载完毕');
              }
            }
          })
        }
      },
      search(){
        this.native.grabHandler('activity.review.searchBtn');
          this.allLoaded = false;
          this.reviewList = [];
          this.loadPage = 1;
          this.init(this.loadPage);
      }
    },

  }
</script>
<style lang="less" scoped>
  @import "review.less";
</style>

