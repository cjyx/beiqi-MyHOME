<template>
  <div class="app page-view">
    <head-bar :head-back='true' :head-title="title">
    </head-bar>
    <div class="main-content">
      <div class="srach-btn">
        <input type="text" placeholder="请输入要上门服务的地址">
        <!--<i class="iconfont icon-list"></i>-->
        <button class="iconfont icon-search"></button>
      </div>

    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        title:'上门服务',
      };
    },
    mounted () {
      this.native.grabHandler('home.maintain.toDoor.search');
    }
  }
</script>

<style lang="less" scoped>
  @import "toDoor.less";
</style>
