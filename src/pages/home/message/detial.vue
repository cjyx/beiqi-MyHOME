<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
      <!--<a slot="left"><i class="iconfont icon-custom-service"></i></a>-->
      <!--<a slot="right"><i class="iconfont icon-message"></i></a>-->
    </head-bar>
    <div class="main-content">
      消息详情
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        title: '消息详情',
      }
    },
    mounted(){
      this.native.grabHandler('home.message.detial');
    },
    methods: {}
  }
</script>
<style lang="less" scoped>

</style>
