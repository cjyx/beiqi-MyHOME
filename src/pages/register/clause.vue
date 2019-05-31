<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <img src="../../assets/img/clause.png" alt="">
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        title:'会员安全条例'
      }
    },
    mounted(){
      this.native.grabHandler('register.clause');
    },
    methods: {}
  }
</script>
<style lang="less" scoped>
  .main-content img{
    max-width: 100%;
    text-align: center;
    display: block;
  }
</style>
