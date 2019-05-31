<template>
  <div class="app">
      <head-bar :head-title="title" :head-back='true'>
        <a slot="right" @click="add()" v-if="showBtn">编辑</a>
        <a slot="right" @click="cancel()" v-if="!showBtn">取消</a>
      </head-bar>
      <div class="main-content">
        <div class="page-loadmore-wrapper tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }" v-if="modalEmpty==false">
          <mt-loadmore :autoFill="false" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
            <ul class="page-loadmore-list group-list">
              <li v-for="(item,index) in list" :key="index">
                <div class="option" v-if="!showBtn" @click="changeId(item)">
                  <input type="checkbox" :value="index"  v-model="checked">
                  <span></span>
                </div>
                <div class="info-content">
                  <a @click="detial(item.infoId,item.type)" v-if="item.type==1">
                    <img v-lazy="item.imgUrl">
                    <div class="content">
                      <h3>{{ item.title}}</h3>
                      <div class="info">
                        <span>类型：{{item.typeName}}</span>
                        <span>阅读量：{{item.readCount}}</span>
                        <span>{{item.createTime | date}}</span>
                      </div>
                    </div>
                  </a>
                  <a @click="detial(item.articleId,item.type)" v-if="item.type==2">
                    <!--<img v-lazy="item.imgUrl">-->
                    <div class="content">
                      <h3>{{ item.title}}</h3>
                      <div class="info">
                        <span>作者：{{item.customerName}}</span>
                        <span>小组：{{item.groupName}}</span>
                        <span>{{item.createTime | date}}</span>
                      </div>
                    </div>
                  </a>
                  <a @click="detial(item.ActivityId,item.type)" v-if="item.type==3">
                    <img v-lazy="item.imgUrl">
                    <div class="content">
                      <h3>{{ item.title}}</h3>
                      <div class="info">
                        <!--<span>类型：{{item.typeName}}</span>-->
                        <span>阅读量：{{item.readCount}}</span>
                        <span>{{item.createTime | date}}</span>
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
          </mt-loadmore>
        </div>
        <!--空白页-->
        <empty-page v-if="modalEmpty"></empty-page>
      </div>
      <transition name="fade">
        <div class="operate" v-if="!showBtn" @click="cancelCollect">
          <a>删除</a>
        </div>
      </transition>
  </div>
</template>
<script>
  import Vue from 'vue'
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        title: '我的收藏',
        showBtn:true,
        checked:[],
        allLoaded: false,
        bottomStatus: '',
        wrapperHeight: 0,
        tbload: false,
        loadPage: 1,
        list:[],
        listId:[],
        currentIndex:[],
        modalEmpty:false,
      }
    },
    computed: {
      ...mapState([
        'token'
      ])
    },
    mounted(){
      this.native.grabHandler('user.userCollect');
      this.wrapperHeight = document.documentElement.clientHeight-44;
      this.init(1);
    },
    methods: {
      add(){
        this.listId = [];
        this.showBtn=false
      },
      cancel(){
        this.checked = [];
        this.listId = [];
        this.currentIndex = [];
        this.showBtn=true;
        this.clear();
      },
      init(page){
        var postData = {
          page:page,
          pageSize:10,
          token:this.token,
        };
        this.native.apiHandler('XS-BUS-WDSC', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true){
            if(response.body.resultData.rows.length>0) {
              this.allLoaded = false;
              this.list.pushs(response.body.resultData.rows);
              this.list.forEach((item,i) => {
                Vue.set(item,"checked",false);
              });
            }else if(this.list.length==0){
              this.modalEmpty=true;
              return;
            }else{
                this.allLoaded = true;
                this.toast('加载完毕');
            }

          }
        })
      },
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
//      跳转详情
      detial(id,type){
        if (this.tbload == true) {
          return false;
        } else {
            if(type==1){
              this.native.grabHandler('user.userCollect.newsDetail.'+id);
              this.$router.push({name: 'newsDetail', query: {id:id,title:'资讯详情'}});
            }else if(type==2){
              this.native.grabHandler('user.userCollect.detialArticle.'+id);
              this.$router.push({name: 'detialArticle', query: {id:id}});
            }else if(type==3){
              this.native.grabHandler('user.userCollect.reviewDetail.'+id);
              this.$router.push({name: 'reviewDetail', query: {id:id,title:'活动详情'}});
            }
        }
      },
//      取消收藏调接口
      cancelCollect(){
          this.native.grabHandler('user.userCollect.delete');
          if(this.listId==''){
              this.toast('请选择删除内容');
          }else {
            var cancelData = {
              ids:this.listId,
              token:this.token,
            };
            this.native.apiHandler('XS-BUS-ZXQXSC', cancelData, (res) => {
              let response = this.convert(res);
              if (response.body.isSuccessful == true){
                this.currentIndex.reverse().forEach((item) => {
                  this.list.splice(item, 1);
                });
                this.clear();
                this.toast('取消收藏成功');
                this.showBtn = true;
              }
            })
          }
      },
//      追加要取消收藏的id
      changeId(item){
        if( typeof item.checked == 'undefined'){
          Vue.set(item,"checked",true);
        }else {
          item.checked = !item.checked;
        }
        this.listId = [],
        this.currentIndex = [],
        this.list.forEach((item,i) => {
          if(item.checked){
            this.listId.push(item.id);
            this.currentIndex.push(i);
          }
        });
      },
//      取消的时候清空
      clear(){
        this.checked = [];
        this.list.forEach((item,i) => {
          Vue.set(item,"checked",false);
        });
      }
    },
  }
</script>
<style lang="less" scoped>
  @import "collect.less";
</style>
