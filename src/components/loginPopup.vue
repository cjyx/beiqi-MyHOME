<template>
  <section>
    <mask-bar :maskHeader="1" @onHide="onHide"></mask-bar>
    <div class="modal" :class="fadeIn==true ? 'fade-in' : 'fade-out'" ref="modal">
      <i class="iconfont icon-close" @click.self="onHide"></i>
      <div class="modal-body">
        <div>
          <p>请登录后使用</p>
          <div class="modal-btn">
            <a @click="login">登录</a>
            <a @click="register">注册</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
  export default {
    props: [],
    data(){
      return {
        fadeIn: true
      }
    },
    mounted(){
      let modalHeight = this.$refs.modal.offsetHeight;
      let domHeight = document.documentElement.clientHeight;
      this.$refs.modal.style.top = (domHeight - modalHeight - 44) / 2 + 'px';
    },
    methods: {
      onHide(){
        this.fadeIn = false;
        clearTimeout(times);
        var times = setTimeout(() => {
          this.$emit('onHide');
        }, 200)
      },
      register(){
        this.$router.push({name: 'register', query: {}})
      },
      login(){
        this.$router.push({name: 'login', query: {return: 1}})
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../less/modal.less";
</style>
