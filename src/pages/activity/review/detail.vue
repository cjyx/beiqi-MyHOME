<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
      <a slot="right" @click="shareBtn"><i class="iconfont icon-more-dot"></i></a>
    </head-bar>
    <mask-bar :maskHeader="2" v-if="mask" @onHide="emitState">
      <ul class="condition condition-detial" slot="content" v-if="maskShare">
        <li @click.stop="shareBottom">
          <i class="iconfont icon-share"></i>
          <span class="share-left">分享</span>
          <img src="../../../assets/img/up.png" alt="">
        </li>
        <li>
          <p v-if="!collection" @click="collectionSubmit(1)">
            <i class="iconfont icon-collect"></i>
            <span>收藏</span>
          </p>
          <p v-if="collection" class="collection" @click="collectionSubmit(2)">
            <i class="iconfont icon-collect"></i>
            <span>已收藏</span>
          </p>
        </li>
      </ul>
    </mask-bar>
    <share-bar v-if="maskContent" @onHide="emitState" @onLink="editLink" :title="contentList.title" :desc="contentList.memo" :url="contentList.activityReviewUrl" :id="this.$route.query.id" :status="2"></share-bar>
    <div class="main-content">
      <div class="page-loadmore-wrapper tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :autoFill="false" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange"
                     :bottom-all-loaded="allLoaded" ref="loadmore">
          <div class="detial-content">
            <h3>{{contentList.title}}</h3>
            <p class="title">{{contentList.createTime | date}}</p>
            <p class="dt-content" v-html="contentList.content"></p>
            <!--<img src="../../../../assets/img/user-head.png" alt="">-->
          </div>
          <div class="like-content">
            <p class="change" v-if="like">
              <!--@click="likeSubmit(2)"-->
              <i class="iconfont icon-liked"></i>
              <span>{{contentList.zanCount}}人喜欢</span>
            </p>
            <p v-if="!like" @click="likeSubmit(1)">
              <i class="iconfont icon-liked"></i>
              <span>{{contentList.zanCount}}人喜欢</span>
            </p>
            <p>
              <a @click="commentJump" class="commentBtn">
                <i class="iconfont icon-message"></i><span>评论</span>
              </a>
            </p>
          </div>
          <div class="detial-bottom">
            <div class="caption-group">
              <div class="name">
                <div>
                  <i class="iconfont icon-line-v"></i>
                  <h3>评论</h3>
                </div>
              </div>
            </div>
            <p class="unComment" v-if="commentData.length==0">暂时还没有评论哦</p>
            <div class="comment-list" v-for="(item,index) in commentData" :key="index">
              <div class="comment-list-top" :class="{ 'isgood': item.type==2}">
                <img v-if="item.imgUrl!=''" :src="item.imgUrl" alt="">
                <img v-if="item.imgUrl==''" src="../../../assets/img/man.png" alt="">
                <span class="top-left">{{item.name}}</span>
                <span class="top-right">{{item.createTime | date}}</span>
              </div>
              <p>{{item.content}}</p>
            </div>
          </div>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
            <span v-show="bottomStatus === 'loading'">
              <mt-spinner type="snake"></mt-spinner>
            </span>
          </div>
        </mt-loadmore>
      </div>
    </div>

    <loginPopup v-if="modalLogin" @onHide="modalLogin = false"></loginPopup>

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
        title: '活动详情',
//        defImg: require('../../../assets/img/icon_01.jpg'),
        like: false,
        collection: false,
        mask: false,
        maskContent: false,
        maskShare: false,
        modalLogin: false,
        contentList: {},
        commentData: [],
        allLoaded: false,
        bottomStatus: '',
        wrapperHeight: 0,
        page: 1,
      }
    },
    computed: {
      ...mapState([
        'token'
      ])
    },
    mounted() {
      this.wrapperHeight = document.documentElement.clientHeight - 44;
      //文章详情
      this.init();
      //评论
      this.comment(this.page);
      if (this.token != '') {
        this.isLike();
        this.isCollection();
      }
      this.native.grabHandler('activity.review.detail');
    },
    methods: {
      init(){
        var postData = {
          id: this.$route.query.id
        };
        this.native.apiHandler('XS-BUS-HDHGXQ', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            this.contentList = response.body.resultData;
          }
        })
      },
      comment(page){
        var postData = {
          id: this.$route.query.id,
          page: page
        };
        this.native.apiHandler('XS-BUS-HDHGPLLB', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            if (response.body.resultData.length > 0) {
              this.commentData.pushs(response.body.resultData);
            } else {
              this.allLoaded = true;
              this.toast('加载完毕');
            }
          }
        })
      },
      //      是否喜欢
      isLike(){
        var detailData = {
          id: this.$route.query.id,
          token: this.token,
        };
        this.native.apiHandler('XS-BUS-HDHGSFXH', detailData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            this.like = response.body.resultData.isLike ? true : false;
          }
        })
      },
//      是否收藏
      isCollection(){
        var detailData = {
          id: this.$route.query.id,
          token: this.token,
        };
        this.native.apiHandler('XS-BUS-HDHGSFSC', detailData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            this.collection = response.body.resultData.isCollect ? true : false;
          }
        })
      },
      //提交收藏
      collectionSubmit(type){
        this.native.grabHandler('activity.review.detail.collection');
        if (this.token == '') {
          this.modalLogin = true;
          return;
        } else {
          var postData = {
            id: this.$route.query.id,
            type: type,
            token: this.token
          };
          this.native.apiHandler('XS-BUS-HDHGTJSC', postData, (res) => {
            let response = this.convert(res);
            if (response.body.isSuccessful == true) {
              if (response.body.resultData == true) {
                if (type == 2) {
                  this.collection = false;
                  this.toast('取消收藏');
                } else {
                  this.collection = true;
                  this.toast('收藏成功');
                }
              }
            }
          })
        }
      },
      //提交喜欢
      likeSubmit(type){
        this.native.grabHandler('activity.review.detail.likeSubmit');
        if (this.token == '') {
          this.modalLogin = true;
          return;
        } else {
          var postData = {
            id: this.$route.query.id,
            type: type,
            token: this.token
          };
          this.native.apiHandler('XS-BUS-HDHGTJXH', postData, (res) => {
            let response = this.convert(res);
            if (response.body.isSuccessful == true) {
              if (response.body.resultData == true) {
                if (type == 2) {
                  if (this.contentList.zanCount > 0) {
                    this.contentList.zanCount--;
                  } else {
                    this.contentList.zanCount = 0;
                  }
                  this.like = false;
                  this.toast('取消喜欢');
                } else {
                  this.contentList.zanCount++;
                  this.like = true;
                  this.toast('喜欢成功');
                }
              }
            }
          })
        }
      },
      //提交分享
      editLink(data){
      },
      //跳转评论页
      commentJump(){
        this.native.grabHandler('activity.review.detail.commentJump');
        if (this.token == '') {
          this.modalLogin = true;
          return;
        } else {
          this.$router.push({name: 'comment', query: {id: this.$route.query.id , detialTitle:this.contentList.title}});
        }
      },
      //分页
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
      loadBottom() {
        this.page++;
        setTimeout(() => {
          this.comment(this.page);
          this.$refs.loadmore.onBottomLoaded();
        }, 1500);
      },
      //分享内容
      shareBtn(){
        this.native.grabHandler('activity.review.detail.shareBtn');
        this.mask = true;
        this.maskContent=false;
        this.maskShare = true;
      },
      shareBottom(){
        this.native.grabHandler('activity.review.detail.shareBottom');
        this.mask = false;
        this.maskContent = true;
        this.maskShare = false;
      },
      //登陆，注册
      emitLogin(){
        this.$router.push({name: 'login'});
      },
      emitRegister(){
        this.$router.push({name: 'register'});
      },
      emitState(state){
        this.mask = false;
        this.maskContent = false;
      },
    }
  }
</script>
<style lang="less" scoped>
  @import "detail.less";
</style>
