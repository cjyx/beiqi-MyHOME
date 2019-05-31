<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'></head-bar>
    <div class="main-content">
      <img src="../../../assets/img/rules-1.png">
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        title: '签到规则',
      }
    },
    mounted () {
      this.native.grabHandler('activity.sign.rule');
    }
  }
</script>
<style lang="less" scoped>
  @import "sign.less";
  .main-content{
    overflow: hidden;
    img{
      max-width: 100%;
      text-align: center;
      display: block;
    }
  }
</style>
