<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'></head-bar>
    <div class="main-content">
      <img src="../../../assets/img/rules-3.png">
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        title: '积分规则',
      }
    },
    mounted(){
      this.native.grabHandler('user.userIntegral.userIntegralRule');
    }
  }
</script>
<style lang="less" scoped>
  .main-content img{
    max-width: 100%;
    text-align: center;
    display: block;
  }
</style>
