<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
      <router-link :to="{ name: 'memberRule'}" slot="right">等级规则</router-link>
    </head-bar>
    <div class="main-content" :style="{ height: wrapperHeight + 'px' }">
      <div class="grade-header">
        <!-- slides -->
        <swiper :options="swiperOption" ref="mySwiper" class="group">
          <swiper-slide v-for="(item,index) in 5" :key="index">
            <div :class="nowIndex==index ? 'group-swipe current' : 'group-swipe'">
              <!--<img :src="'./static/grade/grade-'+(index+1)+'.png'" v-if="index<current">-->
              <img :src="'./static/grade/unGrade-'+(index+1)+'.png'" v-if="index!=current">
              <img :src=userImg v-if="current==index" style="border-radius: 50%">
              <h4>{{star[index]}}会员</h4>
            </div>
          </swiper-slide>
        </swiper>
        <p v-if="nowIndex==current && current>1">有效期至{{member.levelEndTime | dateFormat('yyyy-MM-dd')}}</p>
        <p v-else></p>
      </div>
      <div class="content content-first" v-if="nowIndex>current">
        <h3 class="title">会员升级</h3>
        <p class="condition-top" v-if="nowIndex==1&&current==0">
          您还未<router-link :to="{ name: 'carBind'}"><span>认证车辆</span></router-link>
            ，认证成功后将升为
          <span>二星会员</span>
        </p>
        <p class="condition-top" v-if="nowIndex>1&&current==0">
          您还未<router-link :to="{ name: 'carBind'}"> <span>认证车辆</span></router-link>
            ，认证成功后查看
          <span>会员升级条件</span>
        </p>
        <!--<swiper :options="swiperGrade" ref="gradeSwiper" class="grade-info">-->
        <div class="grade-info" v-if="nowIndex>1&&current>0">
          <!--<swiper-slide>-->
          <!--<div :class="nowIndex>=1 ? 'active':''">-->
          <!--<h3>车辆认证</h3>-->
          <!--<div class="row">-->
          <!--<div class="progress-title"><span>未认证</span>已认证</div>-->
          <!--<div class="progress">-->
          <!--<div class="bar" v-if="member.type==1" style="width: 0;"></div>-->
          <!--<div class="bar" v-else style="width: 100%;"></div>-->
          <!--</div>-->
          <!--<div class="progress-title"><span>{{star[current]}}</span>{{star[nowIndex]}}</div>-->
          <!--</div>-->
          <!--</div>-->
          <!--</swiper-slide>-->
          <div class="list-row">
            <div :class="nowIndex>=2 ? 'active':''">
              <router-link :to="{ name: 'userIntegralRule'}">
                <h3>积分(分/年)</h3>
                <div class="row">
                  <div class="progress-title">
                    <span>当前 {{member.totalScore}}</span>{{maxNumber[nowIndex]}}</div>
                  <div class="progress">
                    <div class="bar" v-if="maxNumber[nowIndex]!=0" :style="{width:(member.totalScore/maxNumber[nowIndex])*100+'%'}"></div>
                    <div class="bar" v-else :style="{width:0}"></div>
                  </div>
                  <div class="progress-title">
                    <span>{{star[current]}}</span>{{star[nowIndex]}}</div>
                </div>
              </router-link>
            </div>
          </div>
          <div class="list-row">
            <div :class="nowIndex>=3 ? 'active':''">
              <router-link :to="{ name: 'referralTo'}">
                <h3>推荐购车(台)</h3>
                <div class="row">
                  <div class="progress-title">
                    <span>当前 {{member.introduceNum}}</span>{{referralMax[nowIndex]}}</div>
                  <div class="progress">
                    <div class="bar" v-if="referralMax[nowIndex]!=0" :style="{width:(member.introduceNum/referralMax[nowIndex])*100+'%'}"></div>
                    <div class="bar" v-else :style="{width:0}"></div>
                  </div>
                  <div class="progress-title">
                    <span>{{star[current]}}</span>{{star[nowIndex]}}</div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
        <!--</swiper>-->
      </div>
      <div class="content">
        <h3 class="title">会员权益</h3>
        <ul class="group-list">
          <li v-for="(item,index) in descript" :key="index">
            <a>
              <img :src=item.picUrl>
              <div class="content">
                <h3>{{item.name}}</h3>
                <div class="info">
                  <span>{{item.descript}}</span>
                </div>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { mapState } from 'vuex'
export default {
  data() {
    let self = this;
    return {
      title: '会员等级',
      wrapperHeight: 0,//下拉高度
      nowIndex: 0,
      current: 0,
      maxNumber: [0, 0, 3000, 8000, 13000],
      referralNow: 1,
      referralMax: [0, 0, 0, 3, 5],
      star: ['一星', '二星', '三星', '四星', '五星'],
      member: {},
      descript: [],
      swiperGrade: {
        freeMode: true,
        slidesPerView: 'auto',
      },
      swiperOption: {
        // notNextTick是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
        notNextTick: true,
        slidesPerView: 3,
        centeredSlides: true,
        paginationClickable: true,
        spaceBetween: 30,
        grabCursor: true,
        onSlideChangeStart(swiper) {
          self.nowIndex = swiper.activeIndex;
          self.init(self.nowIndex + 1);
        }
      }
    }
  },
  components: {
    swiper,
    swiperSlide
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    },
    ...mapState([
      'token', 'userImg'
    ])
  },
  mounted() {
    this.wrapperHeight = document.documentElement.clientHeight;
    this.grade();
    this.native.grabHandler('activity.member.grade');
  },
  methods: {
    /**会员等级*/
    grade() {
      var postData = {
        token: this.token
      };
      this.native.apiHandler('XS-BUS-YHJF', postData, (res) => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          this.member = response.body.resultData;
          this.init(this.member.grade);
          //            alert(this.member.grade);
          //            this.member.grade = 2;
          this.current = this.member.grade - 1;
          this.nowIndex = this.current;
          this.swiper.slideTo(this.current, 1000, false);
        }
      })
    },
    init(grade) {
      var postData = {
        grade: grade,
      };
      this.native.apiHandler('XS-BUS-DJQY', postData, (res) => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          this.descript = response.body.resultData;
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "grade.less";
.main-content{
  padding-bottom: 1rem;
}
</style>
