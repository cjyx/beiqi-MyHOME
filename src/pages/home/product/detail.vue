<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
      <a slot="right" @click="changeCar">切换车型</a>
    </head-bar>
    <div class="main-content">
      <mt-swipe :auto="0" :defaultIndex=previewIndexOne class="product-banner" v-if="previewTop">
        <mt-swipe-item v-for="(item,index) in detailInfo.carTypeImgs" :key="index">
          <img @click="previewShow(index)" :src="item">
        </mt-swipe-item>
      </mt-swipe>
      <div class="pd-content">
        <div class="pading">
          <p class="pd-content-title">
            <span>{{detailInfo.brandCarType}}</span>
            <button class="btn-red" @click="toDetial">使用说明书</button>
          </p>
          <p class="pd-content-price">
            <span>市场指导价:</span>
            <span>￥{{parseInt(detailInfo.price)}}</span>元起
          </p>
          <div class="pd-benefit">
            <button class="btn-red" v-if="detailInfo.policies.length>0">优惠</button>
            <ul>
              <li v-for="(item,index) in detailInfo.policies" :key="index">{{item}}</li>
            </ul>
          </div>
          <p class="parameter">
            <i class="iconfont icon-line-v"></i>
            <span>参数配置</span>
          </p>
          <div class="pd-detial">
            <div>
              <!--<img :src="detailInfo.configImg" ref="pic">-->
              <img :src="detailInfo.firstParamsImg" ref="picType" :style="{width:picTypeX +'px'}">
              <img :src="detailInfo.firstParamsImg" ref="picTypeX" style="display: none">
              <p>
                <img :src="detailInfo.configImg" ref="picContent" :style="{width:picContentX +'px','margin-left':picTypeX+'px'}">
                <img :src="detailInfo.configImg" ref="picContentX" style="display: none">
              </p>
            </div>
          </div>
        </div>
        <p class="all">以上详细解释权归北京汽车销售有限公司所有。</p>
      </div>
      <div class="detail-button">
        <a @click="testDrive">
          <button class="btn next-btn">预约试驾</button>
        </a>
      </div>

    </div>
    <!--mask star-->
    <mask-bar :maskHeader="1" v-if="maskDetail" @onHide="emitState"></mask-bar>
    <!--切换车型list-->
    <transition name="fade-up">
      <div class="pd-mask" v-if="maskDetail">
        <span v-for="(item,index) in carType" :key="index" :class="carTypeId==item.id ? 'activeBtn' : ''" @click.stop="active(index,item.id)">{{item.brandCarType}}</span>
      </div>
    </transition>
    <!--mask end-->
    <!--preview star-->
    <transition name="slide-left">
      <mask-bar :maskHeader="1" v-if="preview" class="mask-preview">
        <mt-swipe :auto="0" :defaultIndex=previewIndex class="preview-content" slot="content">
          <mt-swipe-item v-for="(item,index) in detailInfo.carTypeImgs" :key="index">
            <p @click="previewHide(index)">
              <img :src="item">
            </p>
          </mt-swipe-item>
        </mt-swipe>
      </mask-bar>
    </transition>
    <!--preview end-->
    <transition name="slide-left">
      <router-view class="child-view"></router-view>
    </transition>
    <loginPopup v-if="modalLogin" @onHide="modalLogin = false"></loginPopup>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
export default {
  data() {
    return {
      title: '产品大全',
      carTypeId: this.$route.query.id,
      maskDetail: false,
      preview: false,
      previewIndex: 0,
      previewIndexOne: 0,
      carType: [],
      carTypeIndex: 0,
      previewTop: true,
      detailInfo: {},
      picTypeX: 0,
      picContentX: 0,
      modalLogin:false,
    }
  },
  computed: {
    ...mapState([
      'token'
    ])
  },
  mounted() {
    this.native.grabHandler('home.product.productDetail.'+this.carTypeId);
    this.init();
    //      this.picT=document.getElementById('pic2').clientWidth/2;
  },
  methods: {
    toDetial() {
      this.native.grabHandler('home.product.productDetail.manual');
      this.$router.push({ name: 'manual', query: { carTypeId: this.carTypeId } });
    },
    init() {
      var postData = {
        carTypeId: this.carTypeId
      };
      this.native.apiHandler('XS-VEH-CXXQ', postData, (res) => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          this.detailInfo = response.body.resultData;
          setTimeout(() => {
            this.picTypeX = this.$refs.picTypeX.width / 2;
            this.picContentX = this.$refs.picContentX.width / 2;
          }, 1000)
        }
      })
    },
    previewShow(page) {
      this.previewIndex = page;
      this.preview = true;
      this.previewTop = false;
    },
    previewHide(page) {
      console.log(page);
      this.previewTop = true;
      this.previewIndexOne = page;
      this.preview = false;
    },
    //     切换车型
    changeCar() {
      this.maskDetail = true;
      var postData = {
        brandCarType: ''
      };
      this.native.apiHandler('XS-VEH-CXLB', postData, (res) => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          this.carType = response.body.resultData;
        }
      })
    },
    //点击车型显示对应信息
    active(index, id) {
      this.native.grabHandler('home.product.changeDetial.'+id);
      this.carTypeIndex = index;
      this.carTypeId = id;
      this.maskDetail = false;
      this.init();
    },
    emitState() {
      this.maskDetail = false;
    },
    testDrive(){
      this.native.grabHandler('home.product.productDetail.testDrive');
      if (this.token == '' || this.token == null) {
        this.modalLogin = true;
        return;
      }
      this.$router.push({ name: 'testDrive', query: {carType: this.detailInfo.brandCarType , carId: this.detailInfo.id } });
    }
  }
}
</script>
<style lang="less" scoped>
@import "product.less";
.pd-content{
  padding: 0;
}
.pading{
  padding:0.15rem;
}
.all{
  background: #fff;line-height: 0.8rem;text-align: center;
}
</style>
