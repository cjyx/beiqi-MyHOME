<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <div class="srach-btn">
        <router-link :to="{ name: 'clubSearch'}">
          <input type="text" placeholder="请输入车友会名称/城市" readonly>
        </router-link>
      </div>
      <div class="page-loadmore-wrapper tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :autoFill="false" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
          <ul class="page-loadmore-list group-list">
            <li v-if="dataContent.auditType==0 || dataContent.auditType==1">
              <a @click="detial('clubJoin',dataContent.id,dataContent)"> <!--@click="detial('clubInformation',dataContent.id,dataContent)"-->
                <img :src="dataContent.picUrl">
                <div class="content">
                  <h3>{{dataContent.name}}<span class="red" v-if="dataContent.city!=null">（{{dataContent.city}}）</span></h3>
                  <div class="club-list">
                    <p>车友会规模：{{dataContent.total}}</p>
                    <p>成立时间：{{dataContent.createTime}}</p>
                  </div>
                </div>
                <button class="btn" v-if="dataContent.auditType==0">审核中</button>
                <button class="btn" v-if="dataContent.auditType==1">已加入</button>
              </a>
              <!--<p class="club-list-name">经销商名称：{{dataContent.dealerName}}</p>-->
            </li>
            <li v-for="(item,index) in list" :key="index" v-show="dataContent.id!=item.id">
              <a @click="detial('clubInformation',item.id,dataContent)">
                <img :src="item.picUrl">
                <div class="content">
                  <h3>{{item.name}}<span class="red" v-if="item.city!=null">（{{item.city}}）</span></h3>
                  <div class="club-list">
                    <p>车友会规模：{{item.total}}</p>
                    <p>成立时间：{{item.createTime}}</p>
                  </div>
                </div>
                <button class="btn" v-if="dataContent.auditType!=0 && dataContent.auditType!=1" @click.stop="join(item.id,index)">申请加入</button>
              </a>
              <!--<p class="club-list-name">经销商名称：{{item.dealerName}}</p>-->
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

      <loginPopup v-if="modalLogin" @onHide="modalLogin = false"></loginPopup>
      <loading-Bar v-if="loading"></loading-Bar>
    </div>
    <transition name="slide-left">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    data() {
      return {
        title:'车友会',
        list: [],
        allLoaded: false,
        bottomStatus: '',
        wrapperHeight: 0,
        loadPage: 1,
        dataContent:{},
        modalLogin:false,
        loading:false,
      };
    },
    computed: {
      ...mapState([
        'token'
      ])
    },
    methods: {
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
      loadBottom() {
        this.loadPage++;
        let that = this;
        setTimeout(() => {
          this.init(this.loadPage);
          this.$refs.loadmore.onBottomLoaded();
        }, 1500);
      },
      init(page){
        this.loading = true;
          var postData = {
            page: page,
            pageSize: 10,
//            token:this.token
          };
          this.native.apiHandler('XS-BUS-VCLB', postData, (res) => {
            let response = this.convert(res);
            if (response.body.isSuccessful == true) {
              if (response.body.resultData.rows.length > 0) {
                this.loading = false;
                this.list.pushs(response.body.resultData.rows);
              } else {
                this.loading = false;
                this.allLoaded = true;
                this.toast('加载完毕');
              }
            }
          })
      },
//      获取基本信息
      initTop(){
        var msgData = {
          token:this.token
        };
        this.native.apiHandler('XS-BUS-JRVC', msgData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            this.dataContent = response.body.resultData[0];
          }
        })
      },
//      跳转详情
      detial(name,id,type){
        this.native.grabHandler('home.club.list.'+id);
          this.$router.push({name: name, query: {id:id,type:type}});
      },
//      申请加入
      join(id){
        this.native.grabHandler('home.club.list.join');
        if(this.token==''){
          this.modalLogin = true;
        }else if(this.dataContent.type==0){
          this.toast('请先认证车辆');
        } else {
          this.$router.push({name: 'join', query: {id:id}});
        }
      }
    },
    mounted() {
      if(this.token!=''){
        this.initTop();
      }
      this.wrapperHeight = document.documentElement.clientHeight-94;
      this.init(1);
      this.native.grabHandler('home.club.list');
    }
  }
</script>
<style lang="less" scoped>
  @import "club.less";
  .group-list li a .content h3{
    margin-bottom: 0;
    font-size:0.3rem;
  }
</style>

