<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='false' :head-logo='true'></head-bar>
    <nav-bar :selected="4"></nav-bar>
    <div class="main-content">
      <div class="header">
        <div class="setting">
          <a @click="redirect('set')">
            <i class="iconfont icon-set"></i>
          </a>
        </div>
        <div class="info">
          <a @click="redirect('information')">
            <!--<router-link :to="{ name: 'information', query: { id: 123 }}">-->
            <img v-if="token!=''" :src="userImg" alt="">
            <img v-if="token==''" src="../../assets/img/man.png" alt="">
          </a>
          <!--</router-link>-->
          <a @click="redirect('information')" v-if="token!=''"> {{realName}} </a>
          <a @click="redirect('login')" v-if="token==''"> 登录</a>
        </div>
      </div>
      <div class="user-status">
        <!--<a @click="planning">-->
        <a @click="service(2)">
          <i class="iconfont icon-confirmed"></i>
          <span>待确认</span>
        </a>
        <!--<a @click="planning">-->
        <a @click="service(3)">
          <i class="iconfont icon-clock"></i>
          <span>待服务</span>
        </a>
        <!--<a @click="planning">-->
        <a @click="service(4)">
          <i class="iconfont icon-evaluate"></i>
          <span>待评价</span>
        </a>
        <!--<a @click="planning">-->
        <a @click="service(1)">
          <i class="iconfont icon-services"></i>
          <span>我的服务</span>
        </a>
        <!--</a>-->
      </div>
      <div class="user-card">
        <a @click="myCar">
          <i class="iconfont icon-car"></i>
          <span>我的车辆</span>
        </a>
        <!--<router-link :to="{ name: 'ticket', query: { id: 123 }}">-->
        <a @click="redirect('ticket')">
          <i class="iconfont icon-ticket"></i>
          <span>我的票券</span>
        </a>
        <!--</router-link>-->
        <!--<router-link :to="{ name: 'integral', query: { id: 123 }}">-->
        <a @click="redirect('userIntegral')">
          <i class="iconfont icon-integral"></i>
          <span>我的积分</span>
        </a>
        <!--</router-link>-->
        <a @click="redirect('userDealer')">
          <!--<a @click="planning">-->
          <i class="iconfont icon-4s"></i>
          <span>我的经销商</span>
        </a>
        <a @click="redirect('userCollect')">
          <!--<a @click="planning">-->
          <i class="iconfont icon-collected"></i>
          <span>我的收藏</span>
        </a>
        <a @click="shareApp">
          <i class="iconfont icon-share"></i>
          <span>分享好友</span>
        </a>
        <!--<a @click="planning">-->
        <a @click="redirect('grade')">
          <i class="iconfont icon-v"></i>
          <span>我的等级</span>
        </a>
        <!--<a @click="planning">-->
        <a @click="redirect('experience')">
          <i class="iconfont icon-fire"></i>
          <span>我的经验</span>
        </a>
        <!--<a @click="planning">-->
        <a @click="redirect('medal')">
          <i class="iconfont icon-medal"></i>
          <span>勋章墙</span>
        </a>
      </div>
    </div>
    <!--分享-->
    <share-bar v-if="modalShare" :title="share.title" :desc="share.desc" :url="share.url" @onHide="modalShare=false"
               @onLink="emitShare"></share-bar>

    <!--登录-->
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
            title: '用户中心',
            modalShare: false,
            modalLogin: false,
            share: {
                title: '绅宝之家APP邀您加入',
                desc: '享服务、聚优惠、交朋友，家一般的愉悦体验由此开启',
                url: ''
            },
          userAuthCarCount:0,
        };
    },
    computed: {
        ...mapState(['token', 'realName', 'userImg', 'carCount', 'user'])
    },
    watch: {
        //如果token有变化，重新请求一次
        token(val) {
            if (val != '') {
                this.init();
            }
        }
    },
    mounted() {
        if (this.token != '') {
            this.init();
            this.initUserCar();
            this.initCode();
            this.native.grabHandler('user.index');
        }
    },
    methods: {
        initUserCar() {
            var postData = {
                token: this.token
            };
            this.native.apiHandler('XS-VEH-CLLB', postData, res => {
                let response = this.convert(res);
                if (response.body.isSuccessful == true) {
                  var resultData = response.body.resultData;
                  this.userCarCount = resultData.length;
                  this.$store.commit('mttSaveCarCount', this.userCarCount);
                  resultData.forEach((item) => {
                    if (item.reviewType == '3') {
                      this.userAuthCarCount++;
                    }
                  });
                  this.$store.commit('mttSaveUnaudited', this.userAuthCarCount);
                }
            });
        },
        emitShare() {
            this.modalShare = false;
        },
        /**用户信息*/
        init() {
            var postData = {
                token: this.token
            };
            this.native.apiHandler('XS-VEH-YHXX', postData, res => {
                let response = this.convert(res);
                if (response.body.isSuccessful == true) {
                    var resultData = response.body.resultData;
                    this.$store.commit('mttSaveUserInfo', resultData);
                }
            });
        },
        /**用户邀请码*/
        initCode() {
            var postData = {
                token: this.token
            };
            this.native.apiHandler('XS-VEH-YHYM', postData, res => {
                let response = this.convert(res);
                if (response.body.isSuccessful == true) {
                    var resultData = response.body.resultData;
                    this.share.url =resultData.shareUrl;   //encodeURI
                }
            });
        },
        shareApp() {
            if (this.token == '') {
                this.modalLogin = true;
                return;
            }
            this.modalShare = true;
        },
        service(type) {
          this.native.grabHandler('user.service.'+type);
            if (this.token == '') {
                this.modalLogin = true;
                return;
            }
            this.$router.push({ name: 'service', query: { type: type } });
        },
        redirect(path) {
          this.native.grabHandler('user.'+path);
          if(path!='login' && this.token == ''){
                this.modalLogin = true;
                return;
            }
            this.$router.push({ name: path, query: {} });
        },
        myCar() {
          this.native.grabHandler('user.car');
            if (this.token == '') {
              this.modalLogin = true;
              return;
            }
            if (this.carCount == 0 || this.carCount == undefined) {
                this.$router.push({ name: 'carBind' });
            } else {
                this.$router.push({ name: 'car' });
            }
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import 'user.less';
</style>
