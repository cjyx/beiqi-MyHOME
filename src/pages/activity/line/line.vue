<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <div class="srach-btn">
        <input type="text" placeholder="请输入活动名称" v-model="keyword">
        <!--<i class="iconfont icon-list"></i>-->
        <button class="iconfont icon-search" @click="search"></button>
      </div>
      <div class="page-loadmore-wrapper tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :autoFill="false" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
          <ul class="page-loadmore-list group-list aty-line">
            <li v-for="(item,index) in list" :key="item.id">
              <router-link :to="{ name: 'lineDetail', query: { id:item.id }}">
                <img v-lazy="item.compressImg" alt="item.activityName">
                <div class="content">
                  <h3>{{item.activityName}}</h3>
                  <div class="info">
                    <!--new Date(item.startTime).format('yyyy-MM-dd')-->
                    <span>{{ item.startTime | dateFormat('yyyy-MM-dd')}} 至 {{item.endTime | dateFormat('yyyy-MM-dd')}}</span>
                  </div>
                  <i v-if="item.status==1" class="iconfont icon-no-begin"></i>
                  <i v-if="item.status==3" class="iconfont icon-ended"></i>
                </div>
              </router-link>
            </li>
          </ul>
        </mt-loadmore>
      </div>
    </div>
    <transition name="slide-left">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: '线下活动',
      searchKey: '',
      list: [],
      allLoaded: false,
      bottomStatus: '',
      wrapperHeight: 0,
      page: 1,
      keyword: ''
    };
  },
  mounted() {
    this.wrapperHeight = document.documentElement.clientHeight - 94;
    this.loadPage();
    this.native.grabHandler('activity.line');
  },
  methods: {
    handleBottomChange(status) {
      this.bottomStatus = status;
    },
    loadBottom() {
      setTimeout(() => {
        this.page++;
        this.loadPage();
        this.$refs.loadmore.onBottomLoaded();
      }, 1000);
    },
    loadPage() {
      var postData = {
        name: this.keyword,
        page: this.page,
        pageSize: 10
      };
      this.native.apiHandler('XS-BUS-XXHD', postData, (res) => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          var resultData = response.body.resultData;
          if (resultData.length > 0) {
            this.list.pushs(resultData);
          } else {
            this.allLoaded = true;
            this.toast('加载完毕');
          }
        }
      })
    },
    search() {
      this.native.grabHandler('activity.line.search');
      this.allLoaded = false;
      this.list = [];
      this.page = 1;
      this.loadPage();
    }
  },

}
</script>
<style lang="less" scoped>
@import 'line.less';
</style>

