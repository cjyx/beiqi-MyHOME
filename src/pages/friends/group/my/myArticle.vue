<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
      <!--<a slot="left"><i class="iconfont icon-custom-service"></i></a>-->
      <!--<a slot="right"><i class="iconfont icon-message"></i></a>-->
      <a slot="right" @click="add()" v-if="showBtn">编辑</a>
      <a slot="right" @click="cancel()" v-if="!showBtn">取消</a>
    </head-bar>
    <div class="main-content">
      <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }" v-if="modalEmpty==false">
        <mt-loadmore :autoFill="false" :top-method="loadTop" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
          <ul class="page-loadmore-list group-list">
            <li v-for="(item,index) in articleList" :key="index">
              <div class="option" v-if="!showBtn" @click="selectedProduct(item,index)">
                <input type="checkbox" :value="index" v-model="check">
                <span></span>
              </div>
              <div class="info">
                <a @click="detailJump(item.articleId)">
                  <img v-lazy=item.articleHeadFigureURL>
                  <div class="content">
                    <h3>{{item.articleTitle}}</h3>
                    <div class="info">
                      <span>时间：{{item.articleReleaseTime | date}}</span>
                      <span>小组：{{item.articleGroup}}</span>
                      <span>评论数：{{item.articleCommentNumber}}</span>
                    </div>
                  </div>
                </a>
              </div>
            </li>
          </ul>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
              <span v-show="bottomStatus === 'loading'">
              <mt-spinner type="snake"></mt-spinner>
            </span>
          </div>
          <!--<div slot="top" class="mint-loadmore-top">-->
            <!--<span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓</span>-->
              <!--<span v-show="topStatus === 'loading'">-->
              <!--<mt-spinner type="snake"></mt-spinner>-->
            <!--</span>-->
          <!--</div>-->
        </mt-loadmore>
      </div>
      <transition name="fade">
        <div class="operate" v-if="!showBtn">
          <div>
            <div class="option" @click="checkedAll()">
              <input type="checkbox" name="" v-model="checkAll">
              <span></span>
              <label>全选</label>
            </div>
          </div>
          <a @click="deleteItem">删除</a>
        </div>
      </transition>
      <!--空白页-->
      <empty-page v-if="modalEmpty"></empty-page>
    </div>
    <transition name="slide-left">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>
<script>
  import Vue from 'vue'
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        title: '我发布的',
        showBtn:true,
        checkAll:false,
        articleList:[],
        check:[],
        wrapperHeight:0,
        allLoaded: true,
        bottomStatus: '',
        page:1,
        tbload:false,
        articleId:[],
        current:[],
        totalPage:0,
        modalEmpty:false,
      }
    },
    computed:{
      ...mapState([
        'token'
      ])
    },
    watch: {//深度 watcher
      'check': {
        handler: function (val, oldVal) {
          if (this.check.length === this.articleList.length) {
            this.checkAll=true;
          }else{
            this.checkAll=false;
          }
        },
        deep: true
      }
    },
    mounted(){
      this.wrapperHeight = document.documentElement.clientHeight-44;
      this.init(this.page);
      this.native.grabHandler('myArticle.index')
    },
    methods: {
      init(page){

        var postData = {
          page:page,
          requestSource:3,
          token:this.token
        };
        this.native.apiHandler('XS-BUS-QZWZ', postData, (res) => {
          let response = this.convert(res);
          if(response.body.isSuccessful == true){
            var resultData = response.body.resultData;
            this.totalPage=resultData.totalPage;
            if(resultData.rows.length>0){
              this.allLoaded = false;
              this.articleList.pushs(resultData.rows);
            } else if(this.articleList.length==0){
              this.modalEmpty=true;
              return;
            } else{
              this.toast('加载完成');
              this.allLoaded = true;
            }
          }
        })
      },
      add(){
        if(this.articleList.length!=0){
          this.showBtn=false
        }
      },
      cancel(){
        this.check = [];
        this.articleId=[];
        this.current=[];
        this.articleList.forEach((item,i) => {
          Vue.set(item,"checked",false);
        });
        this.showBtn=true
      },
      //单选
      selectedProduct(item,index) {
        if( typeof item.checked == 'undefined'){
          Vue.set(item,"checked",true);
        }else {
          item.checked = !item.checked;
        }
        this.pushId();
      },
      pushId(){
        this.articleId=[];
        this.current=[];
        this.articleList.forEach((item,index) => {
          if(item.checked){
            this.articleId.push(item.articleId);
            this.current.push(index)
          }
        })

      },
      //全选
      checkedAll(){
        this.articleId=[];
        if(this.checkAll==false){
          this.check = [];
          this.articleList.forEach((item,i) => {
            Vue.set(item,"checked",false);
          });
        }else{
          this.check = [];
          this.articleList.forEach((item,index) => {
            this.check.push(index);
            Vue.set(item,"checked",true);
            if(item.checked){
              this.articleId.push(item.articleId);
              this.current.push(index);
            }
          });
        }
      },
      //删除
      deleteItem(){
          this.native.grabHandler('myArticle.delete')
          if(this.articleId==''){
            this.toast('请选择删除内容');
          }else{
            var postData = {
              articleId:this.articleId.join(','),
              token:this.token
            };
            this.native.apiHandler('XS-BUS-QZSCWZ', postData, (res) => {
              let response = this.convert(res);
              if(response.body.isSuccessful==true){
                if(response.body.resultData==0){
                  this.toast('删除失败');
                }else if(response.body.resultData==1){
                  this.current.reverse().forEach((item) => {
                    this.articleList.splice(item, 1);
                  })
                  this.showBtn=true;
                  this.checkedAll();
                  this.toast('删除成功');
                  this.showBtn = true;
                }
              }
            })
          }
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
      loadTop() {
        this.tbload = true;
        setTimeout(() => {
          this.$refs.loadmore.onTopLoaded();
        }, 1500);
      },
      //跳转文章详情
      detailJump(id){
        this.native.grabHandler('myArticle.detialArticle.'+id)
        if (this.tbload == true) {
          return false;
        } else {
          this.$router.push({name: 'detialArticle', query: {id:id}});
        }
      },
    }
  }
</script>
<style lang="less" scoped>
  @import "my.less";
</style>
