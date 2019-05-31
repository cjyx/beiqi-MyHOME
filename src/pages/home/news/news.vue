<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <mask-bar :maskHeader="1" v-if="showBtn" @onHide="emitState">
      <div class="search-condition" slot="content" @click="cancelSearch">
        <ul class="condition">
          <li :class="{'change':time}" @click="radioBtn(1)">
            时间
            <img src="../../../assets/img/up.png" alt="">
          </li>
          <li :class="{'change':read}" @click="radioBtn(2)">阅读量</li>
          <li :class="{'change':commentNum}" @click="radioBtn(3)">评论量</li>
        </ul>
      </div>
    </mask-bar>
    <div class="main-content">
      <div class="srach-btn">
        <input type="text" @click="searchPush" placeholder="请输入文章的标题" readonly>
        <button class="iconfont icon-up-down" style="font-size: 0.35rem;" @click="search"></button>
      </div>
      <!--main star-->
      <div class="btn-tab">
        <button :class="{'active':selected==1}" @click="selected=1">品牌资讯</button>
        <button :class="{'active':selected==2}" @click="selected=2">爱车知识</button>
        <button :class="{'active':selected==3}" @click="selected=3">休闲娱乐</button>
      </div>
      <div v-if="selected==1" class="tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <!--:top-method="loadTop"-->
        <mt-loadmore :autoFill="false" :bottom-method="loadBottomBrand" @bottom-status-change="handleBottomChange"
                     :bottom-all-loaded="allLoaded" ref="loadmore">
          <ul class="page-loadmore-list group-list">
            <li v-for="(item,index) in brandList" :key=index>
              <a @click="detial(item.id)">
                <img v-lazy="item.imgUrl">
                <div class="content">
                  <h3>{{ item.title}}</h3>
                  <div class="info">
                    <span>阅读量：{{item.readCount}}</span>
                    <span>{{item.createTime | date}}</span>
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
      <div v-if="selected==2" class="tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <div class="car-content">
            <a @click="redirect('dashboard',0)">
              <i class="iconfont icon-info-board"></i>
              <span>仪表盘说明</span>
            </a>
            <a @click="redirect('carSearch',1,'用车知识')">
              <i class="iconfont icon-che"></i>
              <span>用车知识</span>
            </a>
            <a @click="redirect('carSearch',2,'法律法规')">
              <i class="iconfont icon-info-law"></i>
              <span>法律法规</span>
            </a>
            <a @click="redirect('carSearch',3,'售后保养')">
              <i class="iconfont icon-info-sale"></i>
              <span>售后保养</span>
            </a>
            <a @click="redirect('carSearch',4,'驾驶课堂')">
              <i class="iconfont icon-info-wheel"></i>
              <span>驾驶课堂</span>
            </a>
        </div>
      </div>
      <div v-if="selected==3" class="tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :autoFill="false" :bottom-method="loadBottomPlay" @bottom-status-change="handleBottomChange"
                     :bottom-all-loaded="allLoadedThree" ref="loadmoreEarn">
          <ul class="page-loadmore-list group-list">
            <li v-for="(item,index) in playList" :key=index>
              <a @click="detial(item.id)">
                <img v-lazy="item.imgUrl">
                <div class="content">
                  <h3>{{ item.title}}</h3>
                  <div class="info">
                    <span>阅读量：{{item.readCount}}</span>
                    <span>{{item.createTime | date}}</span>
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
      <!--main end-->
    </div>
    <transition name="slide-left">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        title: '知识资讯',
        active: 'tab-container1',
        allLoaded: false,
        allLoadedThree:false,
        bottomStatus: '',
        wrapperHeight: 0,
        selected: 1,
        list:[],
        showBtn:false,
        time:true,
        commentNum:false,
        read:false,
        brandList:[],
        playList:[],
        tbload: false,
        brandPage: 1,
        playPage:1,
        orderBy:1,
        loadTopNo:false,
        downUp:1,//1为上2为下
      }
    },
    mounted() {
      this.native.grabHandler('home.news');
      this.wrapperHeight = document.documentElement.clientHeight-44*2-50;
      this.init(1,1,2);
      this.init(1,1,3);

    },
    methods: {

      handleBottomChange(status) {
        this.bottomStatus = status;
      },
      loadBottomBrand() {
        this.downUp =2;
        this.tbload = true;
        this.brandPage++;
        let that = this;
        setTimeout(() => {
          this.init(that.orderBy,that.brandPage,2);
          this.$refs.loadmore.onBottomLoaded();
          this.tbload = false;
        }, 1500);
      },
      loadBottomPlay(){
        this.tbload = true;
        this.playPage++;
        let that = this;
        setTimeout(() => {
          this.init(that.orderBy,that.playPage,3);
          this.$refs.loadmoreEarn.onBottomLoaded();
          this.tbload = false;
        }, 1500);
      },
      search(){
        this.native.grabHandler('home.news.order');
        this.showBtn = true;
      },
      cancelSearch(){
        this.showBtn = false;
      },
//      排序
      radioBtn(order){
          if(order==1){
            this.time = true;
            this.commentNum=false;
            this.read=false;
          }else if(order==2){
            this.time = false;
            this.commentNum=false;
            this.read=true;
          }else{
            this.time = false;
            this.commentNum=true;
            this.read=false;
          }
          if(order==this.orderBy){
             return;
          }else{
            this.brandList = [];
            this.playList = [];
            this.brandPage = 1;
            this.playPage = 1;
            this.init(order,1,2);
            this.init(order,1,3);
            this.orderBy = order;
          }
      },
      searchPush(){
        this.native.grabHandler('home.newsSearch');
        this.$router.push({name: 'newsSearch', query: {type:5}});
      },
//      初始化加载 顺序 页码 类型
      init(order,page,type){
        var postData = {
          order:order,
          page:page,
          pageSize:10,
          type:type
        };
        this.native.apiHandler('XS-BUS-ZXLB', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
              if(type==2){
                if(response.body.resultData.rows.length>0) {
                  this.allLoaded = false;
//                  if(this.downUp==1){
//                    this.brandList.unshifts(response.body.resultData.rows);
//                  }else{
                    this.brandList.pushs(response.body.resultData.rows);
//                  }
                }else{
                  this.allLoaded = true;
                  this.toast('加载完毕');
                  this.loadTopNo = true;
                }
              }else if(type==3){
                if(response.body.resultData.rows.length>0) {
                  this.allLoadedThree = false;
                  this.playList.pushs(response.body.resultData.rows);
                }else{
                  this.allLoadedThree = true;
                  this.toast('加载完毕');
                }
              }
          }
        })

      },
//      跳转详情
      detial(id){
        this.native.grabHandler('home.news.detail.'+id);
        if (this.tbload == true) {
          return false;
        } else {
          this.$router.push({name: 'detail', query: {id:id,title:this.title}});
        }
      },
      emitState(){
          this.showBtn = false;
      },
      loadTop() {
          this.downUp = 1;
          if(this.loadTopNo==true){
            this.toast('暂时没有最新哦~');
            this.$refs.loadmore.onTopLoaded();
            return false;
          }else{
            this.brandPage++;
            this.init(this.orderBy,this.brandPage,2);
            this.$refs.loadmore.onTopLoaded();
          }
      },
      redirect(path,type,detailTitle) {
        this.native.grabHandler('home.news.'+path+'.'+type);
        this.$router.push({ name: path, query: {type:type,detailTitle:detailTitle} });
      },
    },
  }
</script>
<style lang="less" scoped>
  @import "../../../less/article.less";
  @import "news.less";
</style>
