<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <div class="describe">
        <img :src="content" alt="">
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        title: '车型手册',
        list:[],
        content:this.$route.query.content,
      }
    },
    mounted(){
      this.native.grabHandler('home.product.manualDetial');
    },
    methods: {

    }
  }
</script>
<style lang="less" scoped>
  @import "manual.less";
</style>
