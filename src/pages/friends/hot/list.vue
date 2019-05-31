<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
      <!--<a slot="left"><i class="iconfont icon-left"></i></a>-->
        <a click="redirect('hotSearch')" slot="right">
          <i class="iconfont icon-search"></i>
        </a>
    </head-bar>
    <!--<nav-bar :selected="3"></nav-bar>-->
    <div class="main-content">
      <div class="page-loadmore-wrapper tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :autoFill="false" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
          <ul class="group-list">
            <li v-for="(item,index) in hotList" :key="index">
              <a @click="detailJump(item.articleId)">
                <img v-if="item.articleHeadFigureURL==''" :src="defImg">
                <img v-if="item.articleHeadFigureURL!=''" v-lazy=item.articleHeadFigureURL>
                <div class="content">
                  <h3>{{item.articleTitle}}</h3>
                  <div class="info">
                    <span>作者：{{item.articleAuthor}}</span>
                    <span>小组：{{item.articleGroup}}</span>
                    <!--<span>评论数：{{item.articleCommentNumber}}</span>-->
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
  export default{
    data(){
        return {
          title:"精彩推荐",
          allLoaded: false,
          defImg: require('../../../assets/img/user-head.png'),
          bottomStatus: '',
          wrapperHeight: 0,
          hotList:[],
          page:1,
          tbload: false,
        }
    },
    computed:{
      ...mapState([
        'token'
      ])
    },
    mounted(){
      this.init(this.page);
      this.wrapperHeight = document.documentElement.clientHeight-44;
      this.native.grabHandler('list.index')
    },
    methods: {
      init(page){
        var postData = {
          page:page,
          requestSource:2,
          token:this.token
        };
        this.native.apiHandler('XS-BUS-QZWZ', postData, (res) => {
          let response = this.convert(res);
          if(response.body.isSuccessful == true){
            var resultData = response.body.resultData;
            if(resultData.rows.length>0){
              this.allLoaded = false;
              this.hotList.pushs(resultData.rows);
            }else{
              this.allLoaded = true;
            }
          }
        })
      },
      //分页
      handleBottomChange(status) {
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
        this.native.grabHandler('list.detialArticle.'+id)
      },
      //路由跳转
      redirect(path){
        this.$router.push({ name: path });
        this.native.grabHandler('list.'+path)
      }
    },
  }
</script>
<style lang="less" scoped>
  @import "list.less";
</style>
