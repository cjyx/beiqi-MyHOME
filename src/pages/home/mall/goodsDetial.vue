<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <div class="tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :autoFill="false" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange"
                     :bottom-all-loaded="allLoaded" ref="loadmore">
          <div class="good-detial-content top-content">
            <div class="caption-group">
              <div class="name">
                <div>
                  <i class="iconfont icon-line-v"></i>
                  <h3>{{detialContent.commodityName}}</h3>
                </div>
              </div>
            </div>
          </div>
          <div v-html="detialContent.describe" class="describe">
          </div>
          <div class="good-detial-content">
            <div class="top">
              <!--<h3>{{detialContent.commodityName}}</h3>-->
              <div class="like-content">
                <p class="change" v-if="changeLike"><i class="iconfont icon-liked"></i><span>{{goodCount}}喜欢</span>
                </p>
                <!--@click="like"-->
                <p v-if="!changeLike" @click="like"><i class="iconfont icon-liked"></i><span>{{goodCount}}喜欢</span></p>
              </div>
            </div>
            <!--<p>-->
            <!--<i class="content-num">2660</i>-->
            <!--<span>积分</span>-->
            <!--</p>-->
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
            <p class="unComment" v-if="list.length==0">暂时还没有评论哦</p>
            <div class="goods-comment" v-for="(item,index) in list" :key="index" v-else>
              <div class="goods-comment-top">
                <img v-if="item.customerImg!=''" :src="item.customerImg" alt="">
                <img v-if="item.customerImg==''" src="../../../assets/img/user-head.png" alt="">
                <span class="top-left">{{item.customerName}}</span>
                <span>{{item.opTime | date}}</span>
              </div>
              <p>{{item.content}}</p>
              <div class="comment-img">
                <!--<img src="../../../assets/img/user-head.png" alt="">-->
                <img v-if="imgItem!=''" :src="imgItem" alt="" v-for="(imgItem,index) in item.imgs" :key="index">
              </div>
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
      <div class="integral-submit" ref="goodsCar">
        <div class="join-car" @click="shopCar">
          <i class="iconfont icon-cart"></i>
          <span v-show="carNumShow">{{carNum}}</span>
        </div>
        <button class="btn next-btn integral-submit-btn" @click="joinCar">加入购物车</button>
      </div>
      <loginPopup v-if="modalLogin" @onHide="modalLogin = false"></loginPopup>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        title: '商品说明',
        list: [],//评论列表
        changeLike: false,//喜欢状态
        allLoaded: false,//禁止下拉
        bottomStatus: '',//下拉状态
        wrapperHeight: 0,//下拉高度
        detialContent: {},//商品基本信息
        id: '',//商品id
        loadPage: 1,//加载page
        goodCount: 0,//喜欢数量
        modalLogin: false,//登录注册弹框
        carNum: 0,//购物车数量
        carNumShow:true,
      }
    },
    computed: {
      ...mapState([
        'token'
      ])
    },
    mounted() {
      var goodsCarHeight = this.$refs.goodsCar.offsetHeight;
      this.wrapperHeight = document.documentElement.clientHeight - goodsCarHeight - 44;
      this.id = this.$route.query.id;
      this.init();
      this.native.grabHandler('home.mall.goodsDetail');
      if(this.token==''){
          this.carNumShow=false;
      }else {
        this.isLike();
        this.commentList(1);
        this.goodsNum();
      }
    },
    methods: {
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
      loadBottom() {
        this.loadPage++;
        setTimeout(() => {
          this.commentList(this.loadPage);
          this.$refs.loadmore.onBottomLoaded();
        }, 1500);
      },
//      商品基本信息
      init(){
        var postData = {
          id: this.id
        };
        this.native.apiHandler('XS-MAL-SPXQ', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            this.detialContent = response.body.resultData;
            this.goodCount=this.detialContent.goodCount;
          }
        })
      },
//      是否点赞过
      isLike(){
        var goodData = {
          commodityId: this.id,
          token: this.token,
        };
        this.native.apiHandler('XS-MAL-SPDZSL', goodData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            this.goodCount = response.body.resultData.goodCount;
            if (response.body.resultData.isGood == true) {
              this.changeLike = true;
            } else {
              this.changeLike = false;
            }
          }
        })
      },
//      评论列表
      commentList(page){
        var commentData = {
          commodityId: this.id,
          page: page,
          pageSize: 10,
        };
        this.native.apiHandler('XS-MAL-PJLB', commentData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            if (response.body.resultData.length > 0) {
              this.list.pushs(response.body.resultData);
            } else {
              this.allLoaded = true;
              this.toast('加载完毕');
            }
          }
        })
      },
//      点赞
      like(){
        this.native.grabHandler('home.mall.goodsDetail.like');
        if (this.token == '') {
          this.modalLogin=true;
        } else {
          var likeData = {
            commodityId: this.id,
            token: this.token,
          };
          this.native.apiHandler('XS-MAL-SPDZ', likeData, (res) => {
            let response = this.convert(res);
            if (response.body.isSuccessful == true) {
              if (response.body.resultData.result == 1) {
                if (this.changeLike == true) {
                  if (this.goodCount < 0) {
                    this.goodCount = 0;
                  } else {
                    this.goodCount--;
                  }
                  this.changeLike = false;
                  this.toast('取消喜欢');
                } else {
                  this.goodCount++;
                  this.changeLike = true;
                  this.toast('喜欢成功');
                }
              } else {
                this.toast(response.body.resultData.msg);
              }
            }
          })
        }
      },
//      加入购物车
      joinCar(){
        this.native.grabHandler('home.mall.goodsDetail.joinCar');
        if (this.token == '') {
          this.modalLogin = true;
        } else {
          var carData = {
            amount: 1,
            commodityId: this.id,
            token: this.token
          };
          this.native.apiHandler('XS-MAL-GWCJR', carData, (res) => {
            let response = this.convert(res);
            if (response.body.isSuccessful == true) {
              if (response.body.resultData == 1) {
                this.toast('加入购物车成功');
                this.goodsNum();
              } else {
                this.toast('加入购物车失败');
              }
            }
          })
        }
      },
//      获取购物车数量
      goodsNum(){
        var numData = {
          token: this.token
        };
        this.native.apiHandler('XS-MAL-GWCSL', numData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            this.carNum = response.body.resultData;
          }
        })
      },
//      去购物车
      shopCar(){
        this.native.grabHandler('home.mall.goodsDetail.shopCar');
        if (this.token == '') {
          this.modalLogin = true;
        } else {
          this.$router.push({name: 'shopCar'});
        }
      },
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../less/banner.less";
  @import "../../../less/article.less";
  @import "mall.less";
</style>
