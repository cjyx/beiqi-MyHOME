<template>
  <div class="app">

    <div class="main-content">
      <div class="share">
        <div>
          <p>XXXX的邀请码为</p>
          <h2>1312-4785-5221-5566</h2>
          <span>长按复制邀请码</span>
        </div>
        <button class="btn next-btn"><i class="iconfont icon-share"></i> 下载APP</button>
      </div>
      <div class="infomation">
        <h3>功能介绍</h3>
        <ul class="group-list">
          <li>
            <router-link to="">
              <img src="../../../assets/img/introduce-1.jpg">
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
              <img src="../../../assets/img/introduce-2.jpg">
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
              <img src="../../../assets/img/introduce-3.jpg">
              <div class="content">
                <h3>转介绍</h3>
                <div class="info">
                  <p>介绍意向购车客户，获得海量积分</p>
                </div>
              </div>
            </router-link>
          </li>
          <li>
            <router-link to="">
              <img src="../../../assets/img/introduce-4.jpg">
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
              <img src="../../../assets/img/introduce-5.jpg">
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
  </div>
</template>
<script>
  export default {
    data () {
      return {
        title: '分享好友',
      }
    },
    mounted(){
    },
    methods: {}
  }
</script>
<style lang="less" scoped>
  @import "share.less";
</style>
