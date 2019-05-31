<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'></head-bar>
    <div class="main-content">
      <div class="grade">
        <div class="group">
          <img :src=content.img>
          <span>{{content.name}}</span>
          <p>LV{{content.grade}}</p>
        </div>
      </div>
      <h3 class="title">勋章介绍</h3>
      <p class="prompt">
        {{content.desc}}
      </p>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        title: '',
        val:2,
        content:this.$route.query.content
      }
    },
    mounted(){
      this.native.grabHandler('user.medal.medalDetail');
    },
    methods: {}
  }
</script>
<style lang="less" scoped>
@import "medal.less";
#head-bar{
  background: #1e1c1c;
}
</style>
