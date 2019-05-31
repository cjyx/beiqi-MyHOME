<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'></head-bar>
    <div class="main-content">
      <div class="name">
        <i class="iconfont icon-line-v"></i>
        <div>
          <h3>服务内容</h3>
        </div>
      </div>
      <div class="content">
        <div class="group">
          <div><i>1</i></div>
          <p>车辆小保养：更换机油和机油滤清器</p>
        </div>
        <div class="group">
          <div><i>2</i></div>
          <p>车辆常规检查：包含空调系统、车身电器系统、油液类、发动机舱、全车轮胎、制动系统等六大类30余个检查项目</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        title: '上门服务内容',
      }
    },
    mounted () {
      this.native.grabHandler('home.maintain.toDoor.content');
    }
  }
</script>
<style lang="less" scoped>
  @import "toDoor.less";
</style>
