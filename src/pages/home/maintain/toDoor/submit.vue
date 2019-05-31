<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
      <router-link :to="{ name: 'toDoorContent', params: {  }}" slot="right">服务内容</router-link>
    </head-bar>
    <div class="main-content">
      <div class="form-content">
        <div class="form-group">
          <label>姓名：</label>
          <input type="text" placeholder="请输入姓名" v-model="name">
        </div>
        <div class="form-group">
          <label>手机号：</label>
          <input type="text" placeholder="请输入手机号" maxlength="11" v-model="phone">
        </div>
        <div class="form-group">
          <label>上门服务地址：</label>
          <input type="text"  placeholder="请输入上门服务地址" v-model="toAddress" disabled>
        </div>
        <div class="form-group">
          <label>详细地址：</label>
          <input type="text"  placeholder="请输入详细地址" v-model="address">
        </div>
        <div class="form-group">
          <label>服务内容：</label>
          <input type="text"  placeholder="请输入服务内容" v-model="content">
        </div>
        <p class="required">提交申请之日起，最长14个自然日之内将完成上门服务</p>
      </div>
      <button class="btn next-btn" @click="submit">提交</button>

      <!--前往我的服务-->
      <mask-bar :maskHeader="2" v-if="modalShow" @onHide="emitClose"></mask-bar>
      <transition name="modal-fade">
        <modal-bar v-if="modalShow" @onHide="emitClose" :state="false" :content="modalText">
          <div class="modal-btn" slot="modal-main">
            <a @click="emitClose">取消</a>
            <router-link :to="{ name: 'myMaintain', params: { id: 123 }}">前往</router-link>
          </div>
        </modal-bar>
      </transition>
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
        title: '上门服务',
        name:'',
        phone:'',
        toAddress:'',
        address:'',
        content:'',
        modalText:'预约成功，前往我的服务查看订单状态',
        modalShow:false,
      }
    },
    mounted(){
      this.native.grabHandler('home.maintain.toDoor.submit');
    },
    methods: {
      emitClose(){
        this.modalShow=false;
      },
      submit(){
        this.modalShow=true;
      },
    }
  }
</script>
<style lang="less" scoped>
@import "toDoor.less";
</style>
