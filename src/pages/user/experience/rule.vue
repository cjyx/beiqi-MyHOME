<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <img src="../../../assets/img/rules-2.png">
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        title: '获取经验规则',
      }
    },
    mounted(){
      this.native.grabHandler('user.experience.experienceRule');
    }
  }
</script>
<style lang="less" scoped>
  @import "experience.less";
 .main-content{
   overflow: hidden;
   img{
     max-width: 100%;
     text-align: center;
     display: block;
   }
 }
</style>
