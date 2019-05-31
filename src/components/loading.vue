<template>
  <div id="loading-bar">
    <div class="loading">
      <img src="../assets/img/loading.gif" alt="">
    </div>
  </div>
</template>
<script>
  export default{
    data(){
      return {}
    },
    props: [],
    methods: {
    },
  }
</script>
<style lang="less" scoped>
  .loading{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    img{
      position: fixed;
      top: 38%;
      left: 46%;
      width: 1rem;
    }
  }

</style>
