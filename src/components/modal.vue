<template>
  <section>
    <mask-bar :maskHeader="maskHeader" @onHide="onHide"></mask-bar>
    <!--<transition name="modal-fade">-->
      <div class="modal" :class="fadeIn==true ? 'fade-in' : 'fade-out'" ref="modal">
        <i class="iconfont icon-close" @click.self="onHide" v-if="canClose!=false"></i>
        <div class="modal-body">
          <h3>{{title}}</h3>
          <div v-if="state==1">
            <slot name="modal-data"></slot>
            <p class="mes-content">{{content}}</p>
            <div class="modal-btn">
              <a @click="cancel">{{cancelText}}</a>
              <a @click="ok">{{okText}}</a>
            </div>
          </div>
          <div v-if="state==2">
            <p>{{content}}</p>
            <!--<button class="btn next-btn" slot="modal-main" @click.self="onHide">确定</button>-->
          </div>
          <div v-if="state==5">
            <slot name="modal-data"></slot>
            <div class="modal-btn">
              <a @click="cancel">{{cancelText}}</a>
              <a @click="ok">{{okText}}</a>
            </div>
          </div>
          <slot name="modal-main"></slot>
        </div>
      </div>
    <!--</transition>-->
  </section>
</template>
<script>
  export default {
    props: ['state', 'canClose', 'title', 'content', 'okText', 'cancelText','maskHeader'],
    data(){
      return {
        fadeIn:true
      }
    },
    mounted(){
      let modalHeight = this.$refs.modal.offsetHeight;
      let domHeight = document.documentElement.clientHeight;
      this.$refs.modal.style.top = (domHeight - modalHeight - 44) / 2 + 'px';
    },
    methods: {
      onHide(){
        this.fadeIn=false;
        clearTimeout(times);
        var times=setTimeout(() =>{
          this.$emit('onHide');
        },200)
      },
      cancel(){
        this.$emit("onCancel");
      },
      ok(){
        this.$emit("onOk");
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../less/modal.less";
</style>
<!--<div class="modal-btn">-->
<!--<router-link :to="{ name: 'login', params: { id: 123 }}">登录</router-link>-->
<!--<router-link :to="{ name: 'register', params: { id: 123 }}">注册</router-link>-->
<!--</div>-->
