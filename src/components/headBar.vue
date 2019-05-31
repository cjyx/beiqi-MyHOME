<template>
  <header id='head-bar'>
    <section class="head-left">
      <a v-if="headBack" @click="$router.go(-1)"><i class="iconfont icon-left"></i></a>
      <slot name="left"></slot>
    </section>
    <h2 v-if="headLogo==true"><img src="../assets/img/logo-header.png" alt=""></h2>
    <h2 class="title" v-else>{{headTitle}}</h2>
    <h2>
      <slot name="center"></slot>
    </h2>
    <section class="head-right">
      <slot name="right"></slot>
    </section>
  </header>
</template>
<script>
  export default{
    data(){
      return {}
    },
    mounted(){

    },
    props: ['headTitle', 'headBack', 'headLogo'],
  }
</script>
<style scoped>

</style>
