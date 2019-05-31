<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <div class="srach-btn">
        <input type="text" placeholder="请输入文章的标题" v-model="titleContent">
        <!--<i class="iconfont icon-list"></i>-->
        <button class="iconfont icon-search" @click="search()"></button>
      </div>
      <div class="page-loadmore-wrapper tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :autoFill="false" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
         <ul class="page-loadmore-list group-list">
            <li v-for="(item,index) in list" :key=index>
              <!--<router-link :to="{name:'newsDetail',query: { id: item.id,title:this.$route.query.detailTitle}}">-->
              <a @click="detialContent(item.id)">
                <img v-lazy="item.imgUrl">
                <div class="content">
                  <h3>{{ item.title}}</h3>
                  <div class="info">
                    <span>阅读量：{{item.readCount}}</span>
                    <span>{{item.createTime | date}}</span>
                  </div>
                </div>
              </a>
              <!--</router-link>-->
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
  export default {
    data() {
      return {
        title:'搜索',
        list: [],
        allLoaded: false,
        bottomStatus: '',
        wrapperHeight: 0,
        tbload: false,
        loadPage: 1,
        titleContent:'',
        paramsType:''
      };
    },
    mounted() {
      this.wrapperHeight = document.documentElement.clientHeight-94;
      this.paramsType = this.$route.query.type;
      this.native.grabHandler('home.news.carSearch.'+this.paramsType);
      this.changeTitle();
      this.init(1);
    },
    methods: {
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
      detial(){
        if (this.tbload == true) {
          return false;
        } else {
          this.$router.push({name: 'newsDetail', query: {}});
        }
      },
      detialContent(id){
        this.native.grabHandler('home.news.carSearch.'+this.paramsType+'.'+id);
        this.$router.push({name:'newsDetail',query: { id:id,title:this.$route.query.detailTitle}});
      },
      init(page){
        var postData = {
          title:this.titleContent,
          type:this.paramsType,
          page:page,
          pageSize:10,
          order:1,
        };
        this.native.apiHandler('XS-BUS-ZSLXLB', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            if(response.body.resultData.rows.length>0){
              this.list.pushs(response.body.resultData.rows);
            }else {
              this.allLoaded = true;
              this.toast('未找到相关内容');
            }
          }
        })
      },
      search(){
          this.native.grabHandler('home.news.carSearch.'+this.paramsType+'.search');
          this.list = [];
          this.loadPage = 1;
          this.allLoaded = false;
          this.init(1);
      },
      changeTitle(){
        if(this.paramsType==1){
          this.title = '用车知识'
        }else if(this.paramsType==2){
          this.title = '法律法规'
        }else if(this.paramsType==3){
          this.title = '售车保养'
        }else if(this.paramsType==4){
          this.title = '驾驶课堂'
        }
      }
    },

  }
</script>
<style lang="less" scoped>
  @import "news.less";
</style>

