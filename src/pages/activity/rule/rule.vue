<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content" :style="{ height: wrapperHeight + 'px' }">
      <div class="rule-header">
        <h3>欢迎加入北京汽车会员大家庭。</h3>
        <p>如果您是北京汽车车主或者拥趸，那么这里就是您的家。在这里，您可以享受到会员专属权益、参与会员活动、商城积分兑换、以及尊贵服务。</p>
        <p>
          我们诚邀您的加入，并将始终秉承以车主为核心的服务理念，致力于打造愉悦的体验环境，为会员提供更丰富、更便捷、更专业的服务，共同分享精彩的爱车生活。
        </p>
      </div>
      <p class="rule-top" @click="oneRule=!oneRule">
        <img src="../../../assets/ruleImg/rule_01.png" alt="">
        <span>如何成为会员</span>
        <img v-if="oneRule" src="../../../assets/ruleImg/up.png" alt="">
        <img v-if="!oneRule" src="../../../assets/ruleImg/down.png" alt="">
      </p>
      <p class="rule-bottom" v-show="oneRule">
        <img src="../../../assets/ruleImg/content_01.jpg" alt="">
      </p>
      <p class="rule-top" @click="twoRule=!twoRule">
        <img src="../../../assets/ruleImg/rule_02.png" alt="">
        <span>会员等级体系</span>
        <img v-if="twoRule" src="../../../assets/ruleImg/up.png" alt="">
        <img v-if="!twoRule" src="../../../assets/ruleImg/down.png" alt="">
      </p>
      <p class="rule-bottom" v-show="twoRule">
        <img src="../../../assets/ruleImg/content_02.jpg" alt="">
      </p>
      <p class="rule-top" @click="threeRule=!threeRule">
        <img src="../../../assets/ruleImg/rule_03.png" alt="">
        <span>会员权益</span>
        <img v-if="threeRule" src="../../../assets/ruleImg/up.png" alt="">
        <img v-if="!threeRule" src="../../../assets/ruleImg/down.png" alt="">
      </p>
      <p class="rule-bottom" v-show="threeRule">
        <img src="../../../assets/ruleImg/content_03.jpg" alt="">
      </p>
      <p class="rule-top" @click="fourRule=!fourRule">
        <img src="../../../assets/ruleImg/rule_04.png" alt="">
        <span>积分规则</span>
        <img v-if="fourRule" src="../../../assets/ruleImg/up.png" alt="">
        <img v-if="!fourRule" src="../../../assets/ruleImg/down.png" alt="">
      </p>
      <p class="rule-bottom" v-show="fourRule">
        <img src="../../../assets/ruleImg/content_04.jpg" alt="">
      </p>
      <p class="rule-top" @click="fiveRule=!fiveRule">
        <img src="../../../assets/ruleImg/rule_05.png" alt="">
        <span>勋章墙</span>
        <img v-if="fiveRule" src="../../../assets/ruleImg/up.png" alt="">
        <img v-if="!fiveRule" src="../../../assets/ruleImg/down.png" alt="">
      </p>
      <p class="rule-bottom" v-show="fiveRule">
        <img src="../../../assets/ruleImg/content_05.jpg" alt="">
      </p>
      <p class="rule-top" @click="sixRule=!sixRule">
        <img src="../../../assets/ruleImg/rule_06.png" alt="">
        <span>经验体系</span>
        <img v-if="sixRule" src="../../../assets/ruleImg/up.png" alt="">
        <img v-if="!sixRule" src="../../../assets/ruleImg/down.png" alt="">
      </p>
      <p class="rule-bottom" v-show="sixRule">
        <img src="../../../assets/ruleImg/content_06.jpg" alt="">
      </p>
      <p class="rule-top last-bor" @click="sevenRule=!sevenRule">
        <img src="../../../assets/ruleImg/rule_07.png" alt="">
        <span>重要声明</span>
        <img v-if="sevenRule" src="../../../assets/ruleImg/up.png" alt="">
        <img v-if="!sevenRule" src="../../../assets/ruleImg/down.png" alt="">
      </p>
      <p class="rule-bottom" v-show="sevenRule">
        <img src="../../../assets/ruleImg/content_07.jpg" alt="">
      </p>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        title:'会员制细则',
        oneRule:false,
        twoRule:false,
        threeRule:false,
        fourRule:false,
        fiveRule:false,
        sixRule:false,
        sevenRule:false,
        wrapperHeight:0,
      }
    },
    mounted(){
      this.wrapperHeight = document.documentElement.clientHeight;
      this.native.grabHandler('activity.rule');
    },
    methods: {}
  }
</script>
<style lang="less" scoped>
  @import "rule.less";
  .main-content{
    padding-bottom: 0.6rem;
  }
</style>
