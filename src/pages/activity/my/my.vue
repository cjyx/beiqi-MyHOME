<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <div class="page-loadmore-wrapper tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }" v-if="modalEmpty==false">
        <mt-loadmore :autoFill="false" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange"
                     :bottom-all-loaded="allLoaded" ref="loadmore">
          <ul class="page-loadmore-list group-list">
            <li v-for="(item,index) in list" :key="item.id">
              <a @click="detail(item)">
                <img v-lazy="item.compressImg" alt="item.activityName">
                <div class="content">
                  <h3>{{item.activityName}}</h3>
                  <div class="info">
                    <span>{{ item.startTime | dateFormat('yyyy-MM-dd')}} 至 {{item.endTime | dateFormat('yyyy-MM-dd')}}</span>
                  </div>
                </div>
                <i class="aty-status iconfont icon-no-begin" v-if="item.status==1"></i>
                <i class="aty-status iconfont icon-ended" v-if="item.status==3"></i>
              </a>
            </li>
          </ul>
        </mt-loadmore>
        <!--空白页-->
        <empty-page v-if="modalEmpty"></empty-page>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    data() {
      return {
        title: '我的活动',
        searchKey: '',
        list: [],
        allLoaded: false,
        bottomStatus: '',
        wrapperHeight: 0,
        page: 1,
        keyword: '',
        modalEmpty:false
      };
    },
    computed: {
      ...mapState([
        'token',
      ])
    },
    mounted() {
      this.wrapperHeight = document.documentElement.clientHeight - 44;
      if (this.token != '') {
        this.loadPage();
      }
      this.native.grabHandler('activity.my');
    },
    methods: {
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
      loadBottom() {
        setTimeout(() => {
          this.page++;
          this.loadPage();
          this.$refs.loadmore.onBottomLoaded();
        }, 1500);
      },
      loadPage(){
        var postData = {
          token: this.token,
          page: this.page,
          pageSize: 10
        };
        this.native.apiHandler('XS-BUS-WDHD', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            if (resultData.length > 0) {
              this.list.pushs(resultData);
            } else if(this.list.length==0){
              this.modalEmpty=true;
              return;
            } else {
              this.toast('加载完成');
              this.allLoaded = true;
            }
          }
        })
      },
      detail(item){
        this.native.grabHandler('activity.my.detail.'+item.id);
        if (item.activityType == '1') {
          var postData = {
            obj: {title: item.activityName, url: item.url},
            type: 4
          };
          this.native.nativeHandler(postData, (res) => {
          })
        }
        else if (item.activityType == '2') {
          this.$router.push({name: 'onlineDetail', query: {id: item.id}});
        }
        else if (item.activityType == '3') {
          this.$router.push({name: 'lineDetail', query: {id: item.id}});
        }
      },
    },

  }
</script>
<style lang="less" scoped>
  @import "my.less";
</style>

