<template>
  <div id="mask-bar">
    <div :class="{'mark-item':maskHeader==1,'mark-item-header':maskHeader==2,'mark-item-score':maskHeader==3,}" @click="maskHide">
      <slot name="content"></slot>
    </div>
  </div>
</template>
<script>
  export default{
    data(){
      return {}
    },
    props: ['maskHeader'],
    methods: {
      maskHide(){
        this.$emit('onHide', this.maskHeader);
      }
    },
  }
</script>
<style lang="less" scoped>
  @import "../less/mask.less";
</style>
