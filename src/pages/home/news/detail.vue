<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
      <a slot="right" @click="shareBtn">
        <i class="iconfont icon-more-dot"></i>
      </a>
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
          <p class="collection" v-if="collection" @click="collectionSubmit(2)">
            <i class="iconfont icon-collect"></i>
            <span>已收藏</span>
          </p>
        </li>
      </ul>
    </mask-bar>
    <share-bar v-if="maskContent" @onHide="emitState" @onLink="editLink" :title="contentData.title" :desc="contentData.memo" :url="contentData.infoUrl" :id="this.$route.query.id" :status="1"></share-bar>
    <div class="main-content">
      <div class="page-loadmore-wrapper tabs-1" ref="wrapper" id="load" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :autoFill="false" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
          <div class="detial-content">
            <h3>{{contentData.title}}</h3>
            <p class="title">类型：
              <span>{{contentData.typeName}}</span>
              <span>{{contentData.createTime | date}}</span>
            </p>
            <div v-html="contentData.content" class="dt-content"></div>
            <div class="like-content">
              <p class="change" v-if="like">
                <!--@click="likeSubmit(2)"-->
                <i class="iconfont icon-liked"></i>
                <span>{{contentData.zanCount}}人喜欢</span>
              </p>
              <p v-if="!like" @click="likeSubmit(1)">
                <i class="iconfont icon-liked"></i>
                <span>{{contentData.zanCount}}人喜欢</span>
              </p>
              <p>
                <a class="commentBtn" @click="comment">
                  <i class="iconfont icon-message"></i>
                  <span>评论</span>
                </a>
              </p>
            </div>
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
            <p class="unComment" v-if="commentList.length==0">暂时还没有评论哦</p>
            <div class="comment-list" v-for="(item,index) in commentList" :key=index v-else>
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
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      title: this.$route.query.title,
      like: false,
      collection: false,
      mask: false,
      maskContent: false,
      maskShare: false,
      allLoaded: false,
      bottomStatus: '',
      wrapperHeight: 0,
      modalLogin: false,
      contentData: {},
      commentList: [],
      loadPage: 1,
      id: ''
    }
  },
  computed: {
    ...mapState([
      'token'
    ])
  },
  mounted() {
    this.id = this.$route.query.id;
    this.native.grabHandler('home.news.detail.'+this.id);
    this.wrapperHeight = document.documentElement.clientHeight - 44;
    this.detailMsg();
    this.detailList(1);
    if (this.token != '') {
      this.isLike();
      this.isCollection();
    }
  },
  methods: {
    shareBtn() {
      this.mask = true;
      this.maskShare = true;
      this.maskContent = false;
    },
    shareBottom() {
      this.mask = false;
      this.maskContent = true;
      this.maskShare = false;
    },
    cancelShare() {
      this.mask = false;
      this.maskContent = false;
    },
    emitState(state) {
      this.mask = false;
      this.maskContent = false;
    },
    handleBottomChange(status) {
      this.bottomStatus = status;
    },
    loadBottom() {
      this.loadPage++;
      let that = this;
      setTimeout(() => {
        this.detailList(this.loadPage);
        this.$refs.loadmore.onBottomLoaded();
      }, 1500);
    },
    //      信息内容
    detailMsg() {
      var postData = {
        id: this.id,
      };
      this.native.apiHandler('XS-BUS-ZXXQ', postData, (res) => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          this.contentData = response.body.resultData;
        }
      })
    },
    //      评论列表
    detailList(page) {
      var detailData = {
        id: this.id,
        page: page,
        pageSize: 10
      };
      this.native.apiHandler('XS-BUS-ZXPLLB', detailData, (res) => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          if (response.body.resultData.length > 0) {
            this.commentList.pushs(response.body.resultData);
          } else {
            this.allLoaded = true;
            this.toast('加载完毕');
          }
        }
      })
    },
    //      是否喜欢
    isLike() {
      var detailData = {
        id: this.id,
        token: this.token,
      };
      this.native.apiHandler('XS-BUS-ZXSFXH', detailData, (res) => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          this.like = response.body.resultData.isLike ? true : false;
        }
      })
    },
    //      是否收藏
    isCollection() {
      var detailData = {
        id: this.id,
        token: this.token,
      };
      this.native.apiHandler('XS-BUS-ZXSFSC', detailData, (res) => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          this.collection = response.body.resultData.isCollect ? true : false;
        }
      })
    },
    //      提交喜欢
    likeSubmit(type) {
      this.native.grabHandler('home.news.detail.like');
      if (this.token == '') {
        this.modalLogin = true;
      } else {
        var detailData = {
          id: this.id,
          token: this.token,
          type: type,
        };
        this.native.apiHandler('XS-BUS-ZXTJXH', detailData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            if (type == 2) {
              if (this.contentData.zanCount > 0) {
                this.contentData.zanCount--;
              } else {
                this.contentData.zanCount = 0;
              }
              this.like = false;
              this.toast('取消喜欢');
            } else {
              this.contentData.zanCount++;
              this.like = true;
              this.toast('喜欢成功');
            }
          }
        })
      }
    },
    //      提交收藏
    collectionSubmit(type) {
      this.native.grabHandler('home.news.detail.collect.'+type);
      if (this.token == '') {
        this.modalLogin = true;
        return;
      }
      var colleationData = {
        id: this.id,
        token: this.token,
        type: type,
      };
      this.native.apiHandler('XS-BUS-ZXTJSC', colleationData, (res) => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          if (type == 2) {
            this.collection = false;
            this.toast('取消收藏');
          } else {
            this.collection = true;
            this.toast('收藏成功');
          }
        }
      })
    },
    //      跳转评论页
    comment() {
      this.native.grabHandler('home.news.detail.comment');
      if (this.token == '') {
        this.modalLogin = true;
      } else {
        this.$router.push({ name: 'newsComment', query: { id: this.id, detialTitle: this.contentData.title } });
      }
    },
    //      分享内容
    editLink(data) {
//      console.log(data)
    },
  }
}
</script>
<style lang="less" scoped>
@import "../../../less/article.less";
</style>
