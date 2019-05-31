<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <ul class="detial-content">
        <li>
          <h3>保养预约确认订单</h3>
          <p>2017-01-01 12:00</p>
          <p class="message">按照消息类型查看消息内容册客户可以使用该功能按照消息类型查看消息内容注册客户可以使用该功能</p>
          <router-link :to="{ name: 'messageDetial', params: { }}">
            <span>查看详情></span>
          </router-link>
        </li>
        <li>
          <h3>保养预约确认订单</h3>
          <p>2017-01-01 12:00</p>
          <p class="message">按照消息类型查看消息内容册客户可以使用该功能按照消息类型查看消息内容注册客户可以使用该功能</p>
        </li>
      </ul>
    </div>
    <transition name="slide-left">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        title: '保养消息',
      }
    },
    mounted(){
      this.native.grabHandler('home.message.list');
    },
    methods: {}
  }
</script>
<style lang="less" scoped>
  @import "message.less";
</style>
