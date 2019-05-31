<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <img src="../../../assets/img/grade_01.png" alt="">
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        title:'身份等级规则',
      }
    },
    mounted(){
      this.native.grabHandler('activity.member.rule');
    },
    methods: {}
  }
</script>
<style lang="less" scoped>
  @import "../rule/rule.less";
  .main-content img{
    max-width: 100%;
    text-align: center;
    display: block;
  }
</style>
