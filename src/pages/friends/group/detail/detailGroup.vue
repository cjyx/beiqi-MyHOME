<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
        <a @click="redirect('articleSearch',detialData.groupId)" slot="right" class="margin-right">
          <i class="iconfont icon-search"></i>
        </a>
        <a @click="redirect('articleCreate',detialData.groupId)" slot="right" v-if="detialData.isFollow!=-1">
          发布
        </a>
    </head-bar>
    <div class="main-content">
      <ul class="group-list" ref="ulHeight">
        <li class="detail-group-top">
          <a>
            <img :src="detialData.groupHeadFigureURL">
            <div class="content">
              <h3>{{detialData.groupName}}</h3>
              <div class="info">
                <span>{{detialData.followNumber}}人关注</span>
              </div>
            </div>
            <button class="btn" v-if="detialData.isFollow==-1" @click.stop="follow(1)">关注</button>
            <button class="btn" v-if="detialData.isFollow==1" @click.stop="follow(-1)">取消关注</button>
          </a>
        </li>
      </ul>
      <div class="page-loadmore-wrapper tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :autoFill="false" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
          <div class="brief">
            <h4>小组简介</h4>
            <p v-if="detialData.groupDesc!=null" :class="{showAll:true,active:showAll}">{{detialData.groupDesc}}</p>
            <span v-if="showAll==false&&detialData.groupDesc!=null" :class="{active:showAll}" @click="showAll=!showAll">展开<i class="iconfont icon-down"></i></span>
            <span v-if="showAll==true&&detialData.groupDesc!=null" :class="{active:showAll}" @click="showAll=!showAll">收起<i class="iconfont icon-up"></i></span>
          </div>
          <ul class="page-loadmore-list group-list">
            <li v-for="(item,index) in list" :key="index">
              <a @click="detial(item.articleId)">
                <img v-if="item.articleHeadFigureURL==''" :src="userImg">
                <img v-if="item.articleHeadFigureURL!=''" v-lazy="item.articleHeadFigureURL">
                <div class="content">
                  <h3>{{item.articleTitle}}</h3>
                  <div class="info">
                    <span>作者：{{item.articleAuthor}}</span>
                    <span>{{item.articleReleaseTime}}</span>
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
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    data() {
      return {
        title:'小组详情',
        list: [],
//        defImg: require('../../../../assets/img/user-head.png'),
        allLoaded: false,
        bottomStatus: '',
        wrapperHeight: 0,
        detialData:{},
        groupId:'',
        tbload: false,
        loadPage: 1,
        showAll:false,
      };
    },
    computed: {
      ...mapState([
        'token', 'userImg'
      ])
    },
    mounted() {
      this.wrapperHeight = document.documentElement.clientHeight-this.$refs.ulHeight.offsetHeight-44;
      this.groupId = this.$route.query.id;
      this.gropuDetial();
      this.articleDetial(1);
      this.native.grabHandler('detailGroup.index');
    },
    methods: {
//      路由跳转
      redirect(path,itemId){
        this.$router.push({
          name: path ,
          query: {id: itemId}
        });
        this.native.grabHandler('detailGroup.'+path+'.'+itemId);
      },
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
      loadBottom() {
        this.tbload = true;
        this.loadPage++;
        let that = this;
        setTimeout(() => {
          this.articleDetial(this.loadPage);
          this.$refs.loadmore.onBottomLoaded();
          this.tbload = false;
        }, 1500);
      },
      detial(articleId){
        if (this.tbload == true) {
          return false;
        } else {
          this.$router.push({name: 'detialArticle', query: {id:articleId}});
        }
        this.native.grabHandler('detailGroup.detialArticle.'+articleId);
      },
//      小组详情
      gropuDetial(){
        var postData = {
          groupId:this.groupId,
          token:this.token
        };
        this.native.apiHandler('XS-BUS-QZXZXQ', postData, (res) => {
          let response = this.convert(res);
          if(response.body.isSuccessful == true){
            this.detialData = response.body.resultData;
          }
        })
      },
//      文章详情
      articleDetial(page){
        var listData = {
          page:page,
          pageSize:10,
          groupId:this.groupId,
          token:this.token
        };
        this.native.apiHandler('XS-BUS-QZXZWZLB', listData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            if(response.body.resultData.rows.length>0) {
              this.list.pushs(response.body.resultData.rows);
            }else {
              this.allLoaded = true;
              this.toast('加载完成');
            }
          }
        })
      },
//      关注
      follow(isFollow){
        this.native.grabHandler('detailGroup.follow');
        var followData = {
          isFollow:isFollow,
          groupId:this.groupId,
          token:this.token
        };
        this.native.apiHandler('XS-BUS-QZGZ', followData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            if(response.body.resultData.status==1){
                if(isFollow==1){
                  this.detialData.isFollow=1;
                  this.toast('关注成功');
                }else if(isFollow==-1){
                  this.detialData.isFollow=-1;
                  this.toast('取消关注成功');
                }
              this.detialData.followNumber = response.body.resultData.followNumber;
            }else {
              this.toast('关注失败');
            }
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "detail.less";
</style>

