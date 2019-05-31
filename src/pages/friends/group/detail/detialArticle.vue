<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
      <a slot="right" @click="shareBtn"><i class="iconfont icon-more-dot"></i></a>
    </head-bar>
    <mask-bar :maskHeader="2" v-if="mask" @onHide="emitState">
      <ul class="condition condition-detial" slot="content" v-if="maskShare">
        <!--<li @click.stop="shareBottom">-->
          <!--<i class="iconfont icon-share"></i>-->
          <!--<span class="share-left">分享</span>-->
          <!--<img src="../../../../assets/img/up.png" alt="">-->
        <!--</li>-->
        <li>
          <p v-if="contentList.isCollection==-1" @click="collectionSubmit(1)">
            <i class="iconfont icon-collect"></i>
            <span>收藏</span>
          </p>
          <p class="collection" v-if="contentList.isCollection==1" @click="collectionSubmit(-1)">
            <i class="iconfont icon-collect"></i>
            <span>已收藏</span>
          </p>
        </li>
      </ul>
    </mask-bar>
    <share-bar v-if="maskContent" @onHide="emitState" @onLink="editLink" :title="contentList.articleName" :desc="contentList.memo" :url="contentList.group.groupHeadFigure" :id="this.$route.query.id" :status="3"></share-bar>
    <div class="main-content">
      <div class="page-loadmore-wrapper tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :autoFill="false" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange"
                     :bottom-all-loaded="allLoaded" ref="loadmore">
          <div class="detial-content">
            <h3>{{contentList.articleName}}</h3>
            <p class="title">作者：{{contentList.articleAuthor}}  {{contentList.articleReleaseTime | date}}</p>
            <p class="dt-content" v-html="contentList.articleContent"></p>
            <!--<img src="../../../../assets/img/user-head.png" alt="">-->
          </div>
          <div class="like-content" v-if="contentList.isFollow==1 || contentList.isFollow==0">
            <p class="change" v-if="contentList.isLike==1">
              <!--@click="likeSubmit(-1)"-->
              <i class="iconfont icon-liked"></i><span>{{contentList.likeNumbers}}人喜欢</span>
            </p>
            <p v-if="contentList.isLike==-1" @click="likeSubmit(1)">
              <i class="iconfont icon-liked"></i><span>{{contentList.likeNumbers}}人喜欢</span>
            </p>
            <p>
              <a @click="commentJump" class="commentBtn">
                <i class="iconfont icon-message"></i><span>评论</span>
              </a>
            </p>
          </div>
          <div class="group comment-content article-content" v-if="contentList.isFollow==-1">
            <div class="comment-list-title">
              <p></p>
              <span>小组</span>
              <p></p>
            </div>
            <ul class="group-list">
              <li>
                <a @click="redirect('detailGroup',group.groupId)" >
                  <img :src=group.groupHeadFigure>
                  <div class="content">
                    <h3>{{group.groupName}}</h3>
                  </div>
                  <button class="btn">进入小组</button>
                </a>
              </li>
            </ul>
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
                <img v-if="item.userAvatar!=''" v-lazy=item.userAvatar>
                <img v-if="item.userAvatar==''" src="../../../../assets/img/man.png">
                <span class="top-left">{{item.userName}}</span>
                <span class="top-right">{{item.commentTime | date}}</span>
              </div>
              <p>{{item.commentContent}}</p>
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
        title: '文章详情',
//        defImg: require('../../../../assets/img/icon_01.jpg'),
        changeLike: false,
        mask: false,
        maskContent: false,
        maskShare: false,
        modalLogin: false,
        contentList: {},
        group: {},
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
      this.native.grabHandler('detialArticle.index');
    },
    methods: {
      init(){
        var postData = {
          articleId: this.$route.query.id,
          token: this.token
        };
        this.native.apiHandler('XS-BUS-QZWZXQ', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            this.contentList = response.body.resultData;
            this.group = response.body.resultData.group;
          }
        })
      },
      comment(page){
        var postData = {
          articleId: this.$route.query.id,
          page: page,
          token: this.token
        };
        this.native.apiHandler('XS-BUS-QZWZPLLB', postData, (res) => {
          let response = this.convert(res);
          var resultData = response.body.resultData;
          if (resultData.rows.length > 0) {
            this.allLoaded = false;
            this.commentData.pushs(resultData.rows);
          } else {
            this.allLoaded = true;
          }
        })
      },
      //提交收藏
      collectionSubmit(type){
        this.native.grabHandler('detialArticle.collection');
        if (this.token == '') {
          this.modalLogin = true;
          return;
        } else {
          var postData = {
            articleId: this.$route.query.id,
            isCollection: type,
            token: this.token
          };
          this.native.apiHandler('XS-BUS-QZSC', postData, (res) => {
            let response = this.convert(res);
            if (response.body.isSuccessful == true) {
              if (response.body.resultData == 1) {
                if (type == 1) {
                  this.contentList.isCollection = 1;
                  this.toast('收藏成功');
                } else if (type = -1) {
                  this.contentList.isCollection = -1;
                }
              }
            }
          })
        }
      },
      //提交喜欢
      likeSubmit(type){
        this.native.grabHandler('detialArticle.like');
        if (this.token == '') {
          this.modalLogin = true;
          return;
        } else {
          var postData = {
            articleId: this.$route.query.id,
            isLike: type,
            token: this.token
          };
          this.native.apiHandler('XS-BUS-QZDZ', postData, (res) => {
            let response = this.convert(res);
            if (response.body.isSuccessful == true) {
              if (response.body.resultData.status == 1) {
                if (type == 1) {
                  this.contentList.isLike = 1;
                } else if (type = -1) {
                  this.contentList.isLike = -1;
                }
                this.contentList.likeNumbers = response.body.resultData.likeNumbers;
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
        if (this.token == '') {
          this.modalLogin = true;
          return;
        } else {
          this.$router.push({name: 'detailComment', query: {id: this.$route.query.id}});
        }
        this.native.grabHandler('detialArticle.detailComment.'+this.$route.query.id);
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
        this.mask = true;
        this.maskContent=false;
        this.maskShare = true;
      },
      shareBottom(){
        this.mask = false;
        this.maskContent = true;
        this.maskShare = false;
      },
      editLink(data){
        console.log(data)
      },
      emitState(state){
        this.mask = false;
        this.maskContent = false;
      },
      //进入小组
      redirect(path,groupId){
        this.$router.push({ name: path, query: { id: groupId}});
        this.native.grabHandler('detialArticle.'+path+'.'+groupId);
      },
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../../less/article.less";
  @import "detail.less";
</style>
