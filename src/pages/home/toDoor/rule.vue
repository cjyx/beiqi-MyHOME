<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'></head-bar>
    <div class="main-content">
      <div class="content">
        <h3>1、服务条件：</h3>
        <div class="group">
          <p>只有距离网点10KM以上、50KM以内的客户可享受此服务。</p>
        </div>
      </div>
      <div class="content">
        <h3>2、服务内容：</h3>
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
        title: '上门服务规则',
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "toDoor.less";
</style>
