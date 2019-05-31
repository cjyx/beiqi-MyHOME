<template>
  <div class="app">
    <nav-bar :selected="2"></nav-bar>
    <div class="main-content">
      <div class="header">
        <p class="scan">
        <i class="iconfont icon-scan" @click="scan"></i>
        </p>
        <div>
          <img v-if="token!=''" :src="userImg" alt="">
          <img v-if="token==''" src="../../assets/img/man.png" alt="">
          <div class="info" v-if="token!=''">
            <a> {{realName}} </a>
            <a>
              <span>经验：{{grades.number}} </span>
              <span>积分：{{grades.score}}</span>
            </a>
            <p @click="jumpGrade">{{star[grades.grade-1]}}</p>
          </div>
          <div class="info" v-if="token==''">
            <router-link :to="{ name: 'login'}"> 登录 </router-link>
          </div>
          <div class="action">
            <router-link :to="{ name: 'mall',query:{'toMall':'activity'}}">
              <i class="iconfont icon-integral"></i>
              <span>积分兑换</span>
              <i class="iconfont icon-more"></i>
            </router-link>
            <router-link :to="{ name: 'rule'}">
              <!--<i class="iconfont icon-what"></i>-->
              <span>会员制介绍</span>
              <i class="iconfont icon-more"></i>
            </router-link>
          </div>
        </div>
      </div>
      <div class="content">
        <h3 class="title">勋章墙</h3>
        <div ref="mySwiper" class="swip">
          <!-- slides -->
          <div class="list">
            <div v-for="(item,index) in medals" :key="index" class="list-item">
              <router-link :to="{name:'medalDetail',query:{'content':item}}">
                <img :src="item.img">
                <p v-if="item.grade!=''">LV{{item.grade}}</p>
                <span>{{item.name}}</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <mt-swipe :auto="3000" :defaultIndex="0" class="banner" v-if="onlineList.length>0">
        <mt-swipe-item v-for="(item,index) in onlineList" :key="item.id">
          <!--<router-link :to="{ name: 'lineUp', params: { id: 123 }}">-->
          <a @click="online(item)">
            <img v-lazy="item.displayImg" alt="item.activityName">
          </a>
          <!--</router-link>-->
        </mt-swipe-item>
      </mt-swipe>
      <div class="aty-work">
        <a @click="redirect('task')">
          <img width="56" src="../../assets/img/activity-work-1.png" alt="">
          <div class="content">
            <h2>当前任务</h2>
            <p>完成任务赚取奖励</p>
          </div>
        </a>
        <a @click="luckDraw">
          <img width="56" src="../../assets/img/activity-work-2.png" alt="">
          <div class="content">
            <h2>运气红包</h2>
            <p>抽取代金券</p>
          </div>
        </a>
      </div>
      <div class="aty-card">
        <a @click="redirect('sign')">
          <i class="iconfont icon-day-sign"></i>
          <h4>每日签到</h4>
        </a>
        <a @click="redirect('forum')">
          <i class="iconfont icon-forum"></i>
          <h4>论坛发帖</h4>
        </a>
        <router-link :to="{ name: 'review'}">
          <i class="iconfont icon-action"></i>
          <h4>活动回顾</h4>
        </router-link>
      </div>
      <!--<div class="hot-list">-->
        <!--<div class="hot-hd">-->
          <!--<h4>热门推荐</h4>-->
          <!--<a @click="redirect('myActivity')">-->
            <!--我的活动-->
            <!--<i class="iconfont icon-more"></i>-->
          <!--</a>-->
        <!--</div>-->
        <!--<ul class="hot-bd">-->
          <!--<li v-for="(item,index) in lineList" :key="item.id">-->
            <!--<router-link :to="{ name: 'lineDetail', query: { id: item.id }}">-->
              <!--<img v-lazy="item.compressImg" alt="item.activityName">-->
              <!--<div class="content">-->
                <!--<h4>{{item.activityName}}</h4>-->
                <!--<p class="desc">-->
                  <!--{{ item.startTime | dateFormat('yyyy-MM-dd')}} 至 {{item.endTime | dateFormat('yyyy-MM-dd')}}-->
                <!--</p>-->
              <!--</div>-->
            <!--</router-link>-->
          <!--</li>-->
        <!--</ul>-->
        <!--<div class="hot-fd">-->
          <!--<router-link :to="{ name: 'line'}">-->
            <!--查看更多-->
          <!--</router-link>-->
        <!--</div>-->
      <!--</div>-->
    </div>

    <loginPopup v-if="modalLogin" @onHide="modalLogin = false"></loginPopup>

    <transition name="slide-left">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      title: '活动',
      modalLogin: false,
      onlineList: [],
      lineList: [],
      medals: [],
      grades: {},
      star: ['一星会员', '二星会员', '三星会员', '四星会员', '五星会员'],
      swiperOption: {
        freeMode: true,
        slidesPerView: 'auto'
        //          freeModeSticky : true ,
      },
      gameUrl: ''
    };
  },
  computed: {
    ...mapState(['token', 'realName', 'userImg']),
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  mounted() {
    this.initOnLine();
    this.initLine();
    this.medal();
    this.grade();
    this.initLuck();
    this.native.grabHandler('activity');
  },
  methods: {
    initLuck() {
      //获取积分活动路径
      // this.native.dbHandler('')
      //      this.native.dbHandler(3, { gameUrl: '' }, (res) => {
      //        var response = this.convert(res);
      //        this.gameUrl = response.gameUrl;
      //      })
      // this.gameUrl = 'http://prod.auto-link.com.cn/xs-game-web/duiba/play';
    },
    /**线上活动*/
    initOnLine() {
      this.native.apiHandler('XS-BUS-XSHD', {}, res => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          var resultData = response.body.resultData;
          this.onlineList = resultData;
        }
      });
    },
    /**线上活动详情跳转*/
    online(item) {
      this.native.grabHandler('activity.online.' + item.id);
      if (item.activityType == '1') {
        var postData = {
          obj: { title: item.activityName, url: item.url },
          type: 4
        };
        this.native.nativeHandler(postData, res => {});
      } else if (item.activityType == '2' || item.activityType == '4') {
        this.$router.push({ name: 'onlineDetail', query: { id: item.id } });
      }
    },
    /**线下活动*/
    initLine() {
      var postData = {
        page: 1,
        pageSize: 2
      };
      this.native.apiHandler('XS-BUS-XXHD', postData, res => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          var resultData = response.body.resultData;
          this.lineList = resultData;
        }
      });
    },
    /**跳转*/
    redirect(path) {
      this.native.grabHandler('activity.' + path);
      if (this.token == '') {
        this.modalLogin = true;
        return;
      }
      this.$router.push({ name: path, query: {} });
    },
    /**扫一扫*/
    scan() {
      this.native.grabHandler('activity.scan');
      if (this.token == '') {
        this.modalLogin = true;
        return;
      }
      var postData = { type: 3 };
      this.native.nativeHandler(postData, res => {
        var response = JSON.parse(res);
        var result = response.apiData.str;
        if (result.indexOf('auto-link.com') >= 0) {
          this.$router.push({ name: 'scan' });
        } else {
          this.toast('您的二维码不正确');
        }
        //        prod.auto-link.com
        //        var myCode = this.parseURL(result).params.code;
        //        if (myCode == undefined || myCode == '') {
        //          this.toast('二维码不正确')
        //        } else {
        //          this.$router.push({ name: 'scan', query: { code: myCode } });
        //        }
      });
    },
    /**勋章墙*/
    medal() {
      var postData = {
        token: this.token
      };
      this.native.apiHandler('XS-BUS-WDXZ', postData, res => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          this.medals = response.body.resultData;
        }
      });
    },
    /**会员等级*/
    grade() {
      if (this.token == '') {
        return;
      }
      var postData = {
        token: this.token
      };
      this.native.apiHandler('XS-BUS-YHJF', postData, res => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          this.grades = response.body.resultData;
        }
      });
    },
    jumpGrade() {
      this.native.grabHandler('activity.grade');
      if (this.token == '') {
        this.modalLogin = true;
        return;
      }
      this.$router.push({ name: 'grade', query: { item: this.grades } });
    },
    luckDraw() {
      this.native.grabHandler('activity.luckdraw');
      if (this.token == '') {
        this.modalLogin = true;
        return;
      }
      this.gameUrl = localStorage.gameUrl ? localStorage.gameUrl : '';
      if (this.gameUrl == '') {
        this.toast('未获取到游戏地址');
        return;
      }
      this.native.apiHandler('XS-GAME-JFID', { token: this.token }, res => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          var resultData = response.body.resultData;
          if (resultData.gameid == '') {
            this.toast('活动尚未开始');
          } else {
            var url =
              this.gameUrl +
              '?gameid=' +
              resultData.gameid +
              '&userid=' +
              resultData.userid;
            var postData = {
              obj: { title: '运气红包', url: url },
              type: 4
            };
            this.native.nativeHandler(postData, res => {});
          }
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import 'activity.less';
</style>
