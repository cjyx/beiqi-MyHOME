<template>
  <section>
    <mask-bar :maskHeader="1" @onHide="onHide"></mask-bar>
    <div class="modal" :class="fadeIn==true ? 'fade-in' : 'fade-out'" ref="modal">
      <i class="iconfont icon-close" @click.self="onHide"></i>
      <div class="modal-body">
        <div>
          <p>请先进行车主认证</p>
          <div class="modal-btn">
            <a @click="cancel">取消</a>
            <a @click="ok">确定</a>
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
      cancel(){
        this.$emit("onCancel");
      },
      ok(){
        this.$router.push({name: 'carBind'})
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../less/modal.less";
</style>
