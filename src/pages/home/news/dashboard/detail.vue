<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <img width="100%" :src="img" alt="">
    </div>

  </div>
</template>
<script>
  export default {
    data () {
      return {
        title: this.$route.query.name,
        id:this.$route.query.id,
        img:'',
      }
    },
    mounted(){
      this.native.grabHandler('home.news.dashboardDetail.'+this.$route.query.id);
      this.img=require('src/assets/dashboard/'+this.id+'.jpg');
    }
  }
</script>
<style lang="less" scoped>
  .main-content{
    background: #fff;
  }
</style>
