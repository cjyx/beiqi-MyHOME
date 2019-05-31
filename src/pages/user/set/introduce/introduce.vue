<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
      <!--<a slot="left"><i class="iconfont icon-custom-service"></i></a>-->
    </head-bar>
    <div class="main-content">
      <ul class="group-list">
        <li>
          <router-link to="">
            <img src="../../../../assets/img/introduce-1.jpg">
            <div class="content">
              <h3>服务预约</h3>
              <div class="info">
                <p>在线提交保养信息，轻松进行保养服务</p>
              </div>
            </div>
          </router-link>
        </li>
        <li>
          <router-link to="">
            <img src="../../../../assets/img/introduce-2.jpg">
            <div class="content">
              <h3>车友会</h3>
              <div class="info">
                <p>查看车友会信息，参加车友会活动</p>
              </div>
            </div>
          </router-link>
        </li>
        <li>
          <router-link to="">
            <img src="../../../../assets/img/introduce-3.jpg">
            <div class="content">
              <h3>推荐购车</h3>
              <div class="info">
                <p>介绍意向购车客户，获得海量积分</p>
              </div>
            </div>
          </router-link>
        </li>
        <li>
          <router-link to="">
            <img src="../../../../assets/img/introduce-4.jpg">
            <div class="content">
              <h3>活动中心</h3>
              <div class="info">
                <p>定期举办活动，享受活动过程</p>
              </div>
            </div>
          </router-link>
        </li>
        <li>
          <router-link to="">
            <img src="../../../../assets/img/introduce-5.jpg">
            <div class="content">
              <h3>圈子</h3>
              <div class="info">
                <p>寻找趣味小组，分享身边乐事</p>
              </div>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        title: '功能介绍',
      }
    },
    mounted(){
      this.native.grabHandler('user.set.introduce');
    },
    methods: {}
  }
</script>
<style lang="less" scoped>
  @import "introduce.less";
</style>
