<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <div class="srach-btn">
        <input type="text" placeholder="请输入标题" v-model="searchContent">
        <!--<i class="iconfont icon-list"></i>-->
        <button class="iconfont icon-search" @click="search"></button>
      </div>
      <div class="page-loadmore-wrapper tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :autoFill="false" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
          <ul class="page-loadmore-list group-list">
            <li v-for="(item,index) in searchList" :key="index">
              <a @click="detailJump(item.articleId)">
                <img v-lazy=item.articleHeadFigureURL>
                <div class="content">
                  <h3>{{item.articleTitle}}</h3>
                  <div class="info">
                    <span>作者：{{item.articleAuthor}}</span>
                    <span>时间：{{item.articleReleaseTime | date}}</span>
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
        searchList: [],
        allLoaded: false,
        bottomStatus: '',
        wrapperHeight: 0,
        page:1,
        searchContent:'',
        tbload:false,
        id:'',
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
      this.id = this.$route.query.id;
      this.native.grabHandler('articleSearch.index');
    },
    methods: {
      init(page){
        this.loading = true;
        var postData = {
          page:page,
          searchContent:this.searchContent,
          searchRange:2,
          groupId:this.id,
          token: this.token,
        };
        this.native.apiHandler('XS-BUS-QZSSWZ', postData, (res) => {
          let response = this.convert(res);
          if(response.body.isSuccessful == true){
            this.loading = false;
            var resultData = response.body.resultData;
            if(resultData.rows.length>0){
              this.allLoaded = false;
              this.searchList.pushs(resultData.rows);
            }else{
              this.allLoaded = true;
              this.toast('加载完成');
            }
          }
        })
      },
      //搜索
      search(){
          this.searchList=[];
          this.page = 1;
          this.allLoaded = false;
          this.init(1);
          this.native.grabHandler('articleSearch.search');
      },
      //分页
      handleBottomChange(status){
        this.bottomStatus = status;
      },
      loadBottom() {
        this.tbload = true;
        this.page++;
        setTimeout(() => {
          this.tbload =false;
          this.init(this.page);
          this.$refs.loadmore.onBottomLoaded();
        }, 1500);
      },
      //跳转文章详情
      detailJump(id){
        if (this.tbload == true) {
          return false;
        } else {
          this.$router.push({name: 'detialArticle', query: {id:id}});
        }
        this.native.grabHandler('articleSearch.detialArticle.'+id);
      },
    }
  }
</script>
<style lang="less" scoped>
</style>

