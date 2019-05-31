<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
        <a @click="redirect('groupSearch')" slot="right">
          <i class="iconfont icon-search"></i>
        </a>
        <a @click="redirect('groupCreate')" slot="right">
          <i class="iconfont icon-add"></i>
        </a>
    </head-bar>
    <div class="main-content">
      <div class="page-loadmore-wrapper tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :autoFill="false" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
          <ul class="page-loadmore-list group-list">
            <li v-for="(item,index) in list" :key="index">
              <a @click="detial(item.groupId)">
                <img v-lazy="item.groupHeadFigureURL">
                <div class="content">
                  <h3>{{ item.groupName }}</h3>
                  <div class="info">
                    <span>{{item.followNumber}}人关注</span>
                  </div>
                </div>
                <button class="btn" v-if="item.isFollow==-1" @click.stop="follow(1,item.groupId,index)">关注</button>
                <button class="btn" v-if="item.isFollow==1" @click.stop="follow(-1,item.groupId,index)">取消关注</button>
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
        title:'小组',
        list: [],
        allLoaded: false,
        bottomStatus: '',
        wrapperHeight: 0,
        tbload: false,
        loadPage: 1,
      };
    },
    computed: {
      ...mapState([
        'token'
      ])
    },
    mounted() {
      this.wrapperHeight = document.documentElement.clientHeight-44;
      this.init(1);
      this.native.grabHandler('group.index');
    },
    methods: {
//      路由跳转
      redirect(path){
        this.$router.push({ name: path });
        this.native.grabHandler('group.'+path)
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
      detial(groupId){
        if (this.tbload == true) {
          return false;
        } else {
          this.$router.push({name: 'detailGroup', query: {id:groupId }});
        }
        this.native.grabHandler('group.detailGroup.'+groupId);
      },
      init(page){
        var postData = {
          page:page,
          pageSize:10,
          requestSource:2,
          token:this.token
        };
        this.native.apiHandler('XS-BUS-QZXZ', postData, (res) => {
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
      follow(isFollow,id,index){
        this.native.grabHandler('group.follow');
        var followData = {
          isFollow:isFollow,
          groupId:id,
          token:this.token
        };
        this.native.apiHandler('XS-BUS-QZGZ', followData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            if(response.body.resultData.status==1){
              if(isFollow==1){
                this.list[index].isFollow=1;
                this.toast('关注成功');
              }else if(isFollow==-1){
                this.list[index].isFollow=-1;
                this.toast('取消关注成功');
              }
              this.list[index].followNumber = response.body.resultData.followNumber;
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
</style>

