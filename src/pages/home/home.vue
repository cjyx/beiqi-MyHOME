<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='false' :head-logo='true'>
      <a slot="left" @click="phoneShow">
        <i class="iconfont icon-call-service"></i>
      </a>
      <a slot="right" @click="message">
        <i class="iconfont icon-message" :class="{'message-num':messageNumber>0}"></i>
      </a>
    </head-bar>
    <nav-bar :selected="1"></nav-bar>
    <div class="main-content">
      <div class="banner-icon">
        <!--<router-link :to="{ name: 'rescue', params: {}}">-->
        <img class="call call-help" v-lazy="callHelp" alt="" @click="showTake">
        <!--</router-link>-->
        <!--<router-link :to="{ name: 'rescue', params: {}}">-->
        <a>
          <img class="call call-sos" v-lazy="callSos" alt="" @click="redirectAuth('rescue')">
        </a>
        <!--</router-link>-->
      </div>
      <mt-swipe :auto="autoMillisecond" :defaultIndex="0" class="banner">
        <mt-swipe-item class="slide3" v-for="(item,index) in bannerList" :key="index">
          <img :src="item.pictureUrl" alt="" @click="banner(item)">
        </mt-swipe-item>
      </mt-swipe>
      <div class="location">
        <router-link :to="{ name: 'oil', params: {  }}" v-if="GpsShow">
          <i class="iconfont icon-aim"></i>
          <span> {{adProvince}} </span>
          <marquee behavior="scroll" direction="left">油价(元/升)：90号({{oil.b90}})、93号({{oil.b93}})、97号({{oil.b97}})</marquee>
        </router-link>
        <p v-else>GPS未开启</p>
      </div>
      <div class="floor-menu">
        <a @click="redirectMenu('distributor')">
        <!--<router-link :to="{ name: 'distributor', params: {  }}">-->
          <i class="iconfont icon-dealer"></i>
          <span>经销商</span>
        <!--</router-link>-->
        </a>
        <a @click="redirectMenu('product')">
          <i class="iconfont icon-car"></i>
          <span>产品大全</span>
        </a>
        <a  @click="redirectMenu('news')">
          <i class="iconfont icon-information"></i>
          <span>知识资讯</span>
        </a>
        <a @click="redirectMenu('illegal')">
          <i class="iconfont icon-illegal"></i>
          <span>违章查询</span>
        </a>
        <a  @click="redirectMenu('clubList')">
          <!--<a @click="planning">-->
          <i class="iconfont icon-car-friends"></i>
          <span>车友会</span>
          <!--</a>-->
        </a>
      </div>
      <div class="floor-service">
        <!--<router-link :to="{ name: 'testDrive', params: {  }}">-->
        <a @click="redirect('testDrive')">
          <!--<a @click="planning">-->
          <h2>试驾预约</h2>
          <p>试乘试驾随时约</p>
          <p class="img-home">
            <img src="../../assets/img/service-1.jpg" alt="">
          </p>
        </a>
        <!--</router-link>-->
        <!--<router-link :to="{ name: 'maintain', params: {  }}">-->
        <a @click="redirectAuth('maintain')">
          <!--<a @click="planning">-->
          <h2>保养预约</h2>
          <p>维修保养更方便</p>
          <p class="img-home">
            <img src="../../assets/img/service-2.jpg" alt="">
          </p>
        </a>
        <!--</router-link>-->
        <!--<router-link :to="{ name: 'referralTo', params: {  }}">-->
        <a @click="redirectAuth('referralTo')">
          <h2>推荐购车</h2>
          <p>推荐成功即获2000分</p>
          <p class="img-home">
            <img src="../../assets/img/service-3.jpg" alt="">
          </p>
        </a>
        <!--</router-link>-->
        <router-link :to="{ name: 'mall', params: {  }}">
          <!--<a @click="planning">-->
          <h2>积分商城</h2>
          <p>专属福利免费领</p>
          <p class="img-home">
            <img src="../../assets/img/service-4.jpg" alt="">
          </p>
          <!--</a>-->
        </router-link>
      </div>
    </div>

    <modal-bar v-if="modalHotLine" :maskHeader="1" :canClose="true" @onHide="modalHotLine = false">
      <div class="hotline" slot="modal-main">
        <p style="padding-top: 0">北汽服务热线</p>
        <button @click="confirmPhone(hotLine)">{{hotLine}}</button>
        <p v-if="def4s.companyName!=undefined">{{def4s.companyName}}</p>
        <button v-if="def4s.companyName!=undefined" @click="confirmPhone(def4s.serviceTel)">服务热线：{{def4s.serviceTel}}
        </button>
        <button v-if="def4s.companyName!=undefined" @click="confirmPhone(def4s.saleTel)">销售热线：{{def4s.saleTel}}</button>
      </div>
    </modal-bar>

    <modal-bar v-if="modalService" :maskHeader="1" :canClose="true" @onHide="modalService = false">
      <div class="hotline" slot="modal-main">
        <button @click="service(1)">在线客服</button>
        <button @click="service(2)">我要吐槽</button>
      </div>
    </modal-bar>

    <modal-bar v-if="modalPhone" :maskHeader="1" :canClose="true" :state="1" @onHide="modalPhone = false" :content="currPhone" :cancelText="'取消'" @onCancel="modalPhone=false" :okText="'呼叫'" @onOk="callPhone(currPhone)">
    </modal-bar>

    <loginPopup v-if="modalLogin" @onHide="modalLogin = false"></loginPopup>

    <bindPopup v-if="modalBind" @onHide="modalBind = false" @onCancel="modalBind=false"></bindPopup>
    <!--日期等待咨询弹框-->
    <modal-bar v-if="waiter" :maskHeader="1" :canClose="true" :state="2" @onHide="waiter=false" :content="'我们的工作时间(8:30-22:00)请您在相应时间段进行咨询'">
    </modal-bar>
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
      title: '首页',
      callHelp: require('../../assets/img/call-help.png'),
      callSos: require('../../assets/img/call-sos.png'),
      bannerList: [],
      modalLogin: false,
      modalHotLine: false,
      modalService: false,
      modalPhone: false,
      modalBind: false,
      modalSuccess: false,
      GpsShow: false,
      appMsg: {},
      def4s: {},
      oil: {},
      currPhone: '',
      messageNumber: 0,
      autoMillisecond: 3000,
      userCarCount: 0, //用户车辆
      userAuthCarCount: 0, //用户认证的车辆
      waiter: false
    };
  },
  computed: {
    ...mapState([
      'token',
      'hotLine',
      'adCode',
      'adProvince',
      'realName',
      'userPhone'
    ])
  },
  mounted() {
    try {
      if (this.token == '') {
        this.initToken();
      } else {
        this.initUser();
        this.getDefCar();
        this.init4s();
        this.initMsg();
        this.initUserCar();
        this.initApp();
        //        this.initDealer();
      }
      this.initBanner();
      this.initGps();

      this.native.grabHandler('home.index');
    } catch (e) {
      // alert(e.message)
    }
  },
  methods: {
    /**定位*/
    initGps() {
      this.native.gpsHandler('', '', res => {
        let response = this.convert(res);
        if (!response || !response.adCode) {
          this.GpsShow = false;
          //          this.toast('定位失败');
        } else {
          this.GpsShow = true;
          this.$store.commit('mttSaveGps', response);
          this.initOil();
        }
      });
    },
    /**油价*/
    initOil() {
      var province = this.adProvince.replace('市', '').replace('省', '');
      var postData = {
        city: province
      };
      this.native.apiHandler('XS-CPS-YJXX', postData, res => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          var resultData = response.body.resultData;
          this.oil = resultData;
        }
      });
    },
    /**获取Token*/
    initToken() {
      if (localStorage.token && localStorage.token != '') {
        this.$store.commit('mttSaveToken', localStorage.token);
        this.initUser();
        this.getDefCar();
        this.init4s();
        this.initMsg();
        this.initUserCar();
      }
      this.initApp();

      var db = { deviceId: '' };
      this.native.dbHandler(3, db, res => {
        var response = this.convert(res);
        this.$store.commit('mttSaveDeviceId', response.deviceId);
      });
    },
    initUser() {
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
    /**初始化接口*/
    initApp() {
      var postData = {
        token: this.token
      };
      this.native.apiHandler('XS-BUS-YYCS', postData, res => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          var resultData = response.body.resultData;
          this.appMsg = resultData;
          this.$store.commit('mttSaveHotLine', resultData.hotLine);
          this.$store.commit('mttSaveExpress', resultData.express);
          this.$store.commit('mttSaveFeedBack', resultData.feedBack);
          localStorage.gameUrl = resultData.gameUrl ? resultData.gameUrl : '';
        }
      });
    },
    /**获取默认经销商*/
    init4s() {
      if (this.token == '') {
        return;
      }
      var postData = {
        token: this.token
      };
      this.native.apiHandler('XS-VEH-MRCS', postData, res => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          var resultData = response.body.resultData;
          this.def4s = resultData;
          this.$store.commit('mttSaveDefDealer', this.def4s);
        }
      });
    },
    /**未读消息*/
    initMsg() {
      var postData = {
        token: this.token
      };
      this.native.apiHandler('XS-BUS-WDXX', postData, res => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          var resultData = response.body.resultData;
          this.messageNumber = resultData;
        }
      });
    },
    /**导航栏*/
    initBanner() {
      var postData = {};
      this.native.apiHandler('XS-BUS-SYGG', postData, res => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          var resultData = response.body.resultData;
          if (resultData.length > 0) {
            this.autoMillisecond = parseInt(resultData[0].waitSecond) * 1000;
          }
          this.bannerList = resultData;
        }
      });
    },
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
          resultData.forEach(item => {
            if (item.reviewType == '3') {
              this.userAuthCarCount++;
            }
          });
          this.$store.commit('mttSaveUnaudited', this.userAuthCarCount);
        }
      });
    },
    getDefCar() {
      var postData = {
        token: this.token
      };
      this.native.apiHandler('XS-VEH-MRCL', postData, res => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          var resultData = response.body.resultData;
          this.$store.commit('mttSaveDefCar', resultData);
        }
      });
    },
    /**导航栏跳转*/
    banner(item) {
      this.native.grabHandler('home.banner.' + item.id);
      // 1 跳转链接 2 关联资讯 3 关联活动
      if (item.type == '1') {
        if (item.url == '' || item.url == undefined) {
          return;
        }
        var postData = {
          obj: { title: item.title, url: item.url },
          type: 4
        };
        this.native.nativeHandler(postData, res => {});
      } else if (item.type == '2') {
        this.$router.push({
          name: 'newsDetail',
          query: { id: item.id, title: '资讯详情' }
        });
      } else if (item.type == '3') {
        // this.$router.push({ name: 'maintain', query: { id: item.id } });
        if (item.activityType == 1 || item.activityType == 3) {
          this.$router.push({ name: 'onlineDetail', query: { id: item.id } });
        } else if (item.activityType == 2) {
          this.$router.push({ name: 'lineDetail', query: { id: item.id } });
        } else if (item.activityType == 4) {
          if (item.url == '' || item.url == undefined) {
            return;
          }
          var postData = {
            obj: { title: item.title, url: item.url },
            type: 4
          };
          this.native.nativeHandler(postData, res => {});
        }
      }
    },
    redirectMenu(path) {
      this.native.grabHandler('home.menu.' + path);
      if (path == 'distributor') {
        if (!this.GpsShow) {
          this.toast('需开启定位权限后使用此功能');
          return;
        }
        this.$router.push({ name: path });
      } else if (path == 'illegal') {
        if (this.token == '') {
          this.modalLogin = true;
          return;
        }
        if (this.appMsg.illegalUrl != '') {
          var postData = {
            obj: { title: '违章查询', url: this.appMsg.illegalUrl },
            type: 4
          };
          this.native.nativeHandler(postData, res => {});
        }
      } else {
        this.$router.push({ name: path });
      }
    },
    /*认证通过以后跳转*/
    redirectAuth(path) {
      this.native.grabHandler('home.menu.' + path);
      if (this.token == '') {
        this.modalLogin = true;
        return;
      }
      if (!this.GpsShow && path == 'rescue') {
        this.toast('需开启定位权限后使用此功能');
        return;
      }
      if (this.userCarCount == 0) {
        this.modalBind = true;
        return;
      }
      if (this.userAuthCarCount == 0) {
        this.toast('车辆正在认证中，认证通过可使用此功能');
        return;
      }

      this.$router.push({ name: path, query: {} });
    },
    /**客服*/
    service(type) {
      this.native.grabHandler('home.service.' + type);
      if (this.token == '') {
        this.modalService = false;
        this.modalLogin = true;
        return;
      }
      var title = type == 1 ? '在线客服' : '我要吐槽';
      var url =
        type == 1
          ? 'https://www.sobot.com/chat/h5/index.html?sysNum=58e8021b74324ee89e626252961e1132&source=2&partnerId=' +
            this.userPhone +
            '&realname=' +
            this.realName
          : 'https://www.sobot.com/chat/h5/index.html?sysNum=58e8021b74324ee89e626252961e1132&source=2&partnerId=' +
            this.userPhone +
            '&realname=' +
            this.realName;
      var postData = {
        obj: { title: title, url: url },
        type: 4
      };
      this.native.nativeHandler(postData, res => {});
    },
    //   路由跳转
    redirect(path) {
      this.native.grabHandler('home.menu.' + path);
      if (this.token == '') {
        this.modalLogin = true;
        return;
      }
      this.$router.push({ name: path });
    },
    message() {
      this.native.grabHandler('home.message');
      if (this.token == '') {
        this.modalLogin = true;
        return;
      }
      if (this.token != '') {
        var postData = {
          token: this.token,
          readStatus: '1'
        };
        this.native.apiHandler('XS-BUS-XGZT', postData, res => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            this.messageNumber = 0;
          }
        });
      }
      this.$router.push({ name: 'message' });
    },
    confirmPhone(phone) {
      this.currPhone = phone;
      this.modalHotLine = false;
      this.modalPhone = true;
    },
    callPhone(phone) {
      this.native.grabHandler('home.phone.' + phone);
      var postData = {
        str: phone,
        type: 1
      };
      this.native.nativeHandler(postData, res => {});
    },
    phoneShow() {
      if (this.token == '') {
        this.modalLogin = true;
        return;
      }
      this.modalHotLine = true;
    },
    showTake() {
      var starDate = this.GetNextDate(new Date(), '08:30:00');
      var endDate = this.GetNextDate(new Date(), '22:00:00');
      var nowDate = new Date().getTime();
      if (nowDate > starDate && nowDate < endDate) {
        this.modalService = true;
      } else {
        this.waiter = true;
      }
    },
    GetNextDate(date, time) {
      //获取当前时间年月日
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      var d = date.getDate();
      var t = y + '-' + m + '-' + d + ' ' + time;
      var tDate = new Date(Date.parse(t.replace(/-/g, '/')));
      tDate = new Date(tDate).getTime();
      return tDate;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import 'home.less';
</style>
