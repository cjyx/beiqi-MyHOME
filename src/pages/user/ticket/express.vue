<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <div class="express-content">
        <p>快递公司：{{information.expressCompany}}</p>
        <p>
          快递单号：{{information.expressNo}}
          <!--<button class="goods-button" @click="copy">复制</button>-->
        </p>
      </div>
      <button class="btn next-btn" @click="search">查询快递</button>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        title: '物流详情',
        information: this.$route.query.information,
      }
    },
    computed: {
      ...mapState([
        'express'
      ])
    },
    mounted(){
      this.native.grabHandler('user.ticket.express');
    },
    methods: {
      copy(){
        window.clipboardData.setData('text', this.express);
        this.toast('复制成功');
      },
      search(){
        var postData = {
          obj: {title: '快递查询', url: this.express},
          type: 4
        };
        this.native.nativeHandler(postData, (res) => {
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "ticket.less";
</style>
