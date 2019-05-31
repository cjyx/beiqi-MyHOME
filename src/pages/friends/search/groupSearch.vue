<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <div class="srach-btn">
        <input type="text" placeholder="请输入小组名称" v-model="searchContent">
        <!--<i class="iconfont icon-list"></i>-->
        <button class="iconfont icon-search" @click="search"></button>
      </div>
      <div class="page-loadmore-wrapper tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :autoFill="false" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
          <ul class="page-loadmore-list group-list">
            <li v-for="(item,index) in list" :key="index">
              <!--<router-link :to="{ name: 'newsDetail', params: { id: 123 }}">-->
              <a @click="detial(item.groupId)">
                <img v-lazy="item.groupHeadFigureURL">
                <div class="content">
                  <h3>{{ item.groupName }}</h3>
                  <div class="info">
                    <span>{{item.followNumber}}人关注</span>
                  </div>
                </div>
              </a>
              <!--</router-link>-->
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
    <loading-Bar v-if="loading"></loading-Bar>
    <transition name="slide-left">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    data() {
      return {
        title:'搜索',
        list: [],
        allLoaded: false,
        bottomStatus: '',
        wrapperHeight: 0,
        tbload: false,
        loadPage: 1,
        searchContent:'',
        loading:false,
      };
    },
    computed: {
      ...mapState([
        'token'
      ])
    },
    mounted() {
      this.wrapperHeight = document.documentElement.clientHeight-94;
      this.native.grabHandler('groupSearch.index');
    },
    methods: {
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
      loadBottom() {
        this.tbload = true;
        this.loadPage++;
        let that = this;
        setTimeout(() => {
          this.init(this.loadPage);
          this.$refs.loadmore.onBottomLoaded();
          this.tbload = false;
        }, 1500);
      },
      detial(groupId){
        if (this.tbload == true) {
          return false;
        } else {
          this.$router.push({name: 'detailGroup', query: {id:groupId}});
          this.native.grabHandler('groupSearch.detailGroup.'+groupId);
        }
      },
      init(page){
        this.loading = true;
        var postData = {
          page:page,
          pageSize:10,
          searchContent:this.searchContent,
          token:this.token
        };
        this.native.apiHandler('XS-BUS-QZSSXZ', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            if(response.body.resultData.rows.length>0) {
              this.loading = false;
              this.list.pushs(response.body.resultData.rows);
            }else {
              this.loading = false;
              this.allLoaded = true;
              this.toast('加载完成');
            }
          }
        })
      },
      search(){
        this.list = [];
        this.loadPage = 1;
        this.allLoaded = false;
        this.init(1);
      }
    }
  }
</script>
<style lang="less" scoped>
</style>

