<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <ul>
        <div class="oil_top">
          <p>地区</p>
          <p>90号汽油<br /><span>(元/升)</span></p>
          <p>93号汽油<br /><span>(元/升)</span></p>
          <p>97号汽油<br /><span>(元/升)</span></p>
        </div>
        <li v-for="(item,index) in list" :key="index">
          <span>{{item.city}}</span>
          <span>{{item.b90}}</span>
          <span>{{item.b93}}</span>
          <span>{{item.b97}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        title: '油价',
        list:[]
      }
    },
    mounted(){
      this.native.grabHandler('home.oil');
        this.init();
    },
    methods: {
        init(){
          this.native.apiHandler('XS-CPS-YJXXALL', {}, (res) => {
            let response = this.convert(res);
            if (response.body.isSuccessful == true) {
              this.list.pushs(response.body.resultData);
            }
          })
        }
    }
  }
</script>
<style lang="less" scoped>
@import "oil.less";
</style>
