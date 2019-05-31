<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <div class="group">
        <h3>任务奖励</h3>
        <router-link :to="{ name: 'information', params: { }}" v-if="information">
          <i class="iconfont icon-me icontop icontop_01"></i>
          <p>
            <span>个人信息</span><br />
            <span>补全用户个人信息</span>
          </p>
          <div>
            <span class="red">+40积分</span>
            <i class="iconfont icon-more"></i>
          </div>
        </router-link>
        <router-link :to="{ name: 'service', query: { type: 4 }}">
          <i class="iconfont icon-message icontop icontop_02"></i>
          <p>
            <span>评价积分</span><br />
            <span>评价已完成订单获取积分</span>
          </p>
          <div>
            <span class="red">+20积分</span>
            <i class="iconfont icon-more"></i>
          </div>
        </router-link>
        <a @click="search">
          <i class="iconfont icon-msg-order icontop icontop_03"></i>
          <p>
            <span>在线调研</span><br />
            <span>回答问题完成问卷</span>
          </p>
          <div>
            <span class="red">+50积分</span><!--答题送好礼-->
            <i class="iconfont icon-more"></i>
          </div>
        </a>

      </div>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        title: '当前任务',
        information:false
      }
    },
    computed: {
      ...mapState([
        'feedBack','token',
      ])
    },
    mounted(){
        this.init();
      this.native.grabHandler('activity.task');
    },
    methods: {
      search(){
        this.native.grabHandler('activity.task.search');
        var postData = {
          obj: {title: '在线调研', url: this.feedBack},
          type: 4
        };
        this.native.nativeHandler(postData, (res) => {
        })
      },
      //是否补全信息
      init(){
        var postData={
          token:this.token
        }
        this.native.apiHandler('XS-VEH-YHBQ', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            if(resultData==true){
              this.information = false;
            }else {
              this.information = true;
            }
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "task.less";
</style>
