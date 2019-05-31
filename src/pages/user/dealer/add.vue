<template>
  <div class="app">
    <head-bar :head-back='true'>
      <h2 slot="center" class="title" @click="citysMaskBtn"><span>{{currentCity.name}}</span><i class="iconfont icon-down-fill"></i></h2>
    </head-bar>
    <div class="main-content">
      <div class="page-loadmore-wrapper tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :autoFill="false" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange"
                     :bottom-all-loaded="allLoaded" ref="loadmore">
          <ul class="page-loadmore-list caption-group">
            <li v-for="(item,index) in dealerList" :key="index">
              <div class="name">
                <i class="iconfont icon-line-v"></i>
                <div>
                  <h3>{{item.companyName}}</h3>
                  <p class="add-btn" @click="dealerAdd(item)">
                    <button v-if="item.addStatus==1">添加</button>
                    <button v-if="item.addStatus==2" disabled>已添加</button>
                  </p>
                </div>
              </div>
              <div class="content">
                <div class="address" @click="maskMakeBtn">
                  <div v-if="item.serviceAddress!=item.saleAddress">
                    <p v-if="item.saleAddress">销售地址：{{item.saleAddress}}</p>
                    <p v-if="item.serviceAddress">服务地址：{{item.serviceAddress}}</p>
                  </div>
                  <p v-if="item.serviceAddress==item.saleAddress">销售/服务地址:{{item.saleAddress}}</p>
                </div>
              </div>
            </li>
          </ul>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
            <span v-show="bottomStatus === 'loading'">
              <mt-spinner type="snake"></mt-spinner>
            </span>
          </div>
        </mt-loadmore>
      </div>
    </div>
    <!--city  star-->
    <mask-bar :maskHeader="2" v-if="citysMask" @onHide="emitState"></mask-bar>
    <transition name="fade-down">
      <div class="db-citys" v-if="citysMask">
        <ul class="citys-left">
          <li v-for="(item,index) in provinces" :key="index" :class="item.code==currentProvince.code ? 'active' : ''"
              @click="getCitys(item)">{{item.name}}
          </li>
        </ul>
        <ul class="citys-right">
          <li v-for="(item,index) in city" :key="index" @click="getCitysContent(item)">{{item.name}}</li>
        </ul>
      </div>
    </transition>
    <!--city  end-->

    <transition name="slide-left">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import area from 'src/common/area'
  export default {
    data() {
      return {
        title: '北京',
        dealerList: [],
        allLoaded: false,
        bottomStatus: '',
        wrapperHeight: 0,
        citysMask: false,
        provinces: [],
        city: [],
        page: 1,
        currentProvince: {},
        currentCity: {},
        test:{}
      };
    },
    computed: {
      ...mapState([
        'lon', 'lat', 'adCode', 'token'
      ])
    },
    mounted() {
      this.native.grabHandler('user.userDealer.dealerAdd');
      if (!this.lon || !this.lat) {
        this.initGps();
      }
      this.initCity();
      this.wrapperHeight = document.documentElement.clientHeight - 44;
    },
    methods: {
      initCity(){
        var dist;
        if(!this.adCode){
          dist = area.getDistrictByCode(110105);
        }else{
          dist = area.getDistrictByCode(this.adCode);
        }
        if(dist.pCode==110000 || dist.pCode==120000 || dist.pCode==500000 || dist.pCode==310000){
          this.currentCity = {code: dist.pCode, name: dist.pName};
        }else{
          this.currentCity = {code: dist.cCode, name: dist.cName};
        }
        this.currentProvince = {code: dist.pCode, name: dist.pName};
        this.provinces = area.getAllProvince();
        this.getCitys(this.currentProvince);
        this.init(this.page);
      },
      /**定位*/
      initGps(){
        this.native.gpsHandler('', '', (res) => {
          let response = this.convert(res);
          if (response || response.adCode!='') {
            this.$store.commit('mttSaveGps', response);
          }
        })
      },
      //点击选择省市
      citysMaskBtn(){
        this.citysMask = true;
      },
      getCitys(item){
        this.currentProvince = item;
        this.city = area.getCityByPCode(item.code);
      },
      getCitysContent(item){
        this.citysMask = false;
        this.currentCity = item;
        this.dealerList = [];
        this.page = 1;
        this.init(this.page)
      },
      init(page){
        //经销商列表
        var postData = {
          channel: 1,
          cityCode: this.currentCity.code,
          lat: this.lat,
          lng: this.lon,
          page: page,
          token: this.token
        };
        this.native.apiHandler('XS-VEH-CSLB', postData, (res) => {
          var response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            if (resultData.totalRows > 0) {
              this.dealerList.pushs(resultData.rows);
            } else {
              this.allLoaded = true;
            }
          }
        })
      },
//      添加经销商
      dealerAdd(item){
        this.native.grabHandler('user.userDealer.dealerAdd.submit');
        var postData = {
          dealerCode: item.dealerCode,
          token: this.token
        };
        this.native.apiHandler('	XS-VEH-XZCS', postData, (res) => {
          var response = this.convert(res);
          if (response.body.isSuccessful == true) {
            if (response.body.resultData == 1) {
              item.addStatus = 2;
              this.toast('添加经销商成功');
            } else if (response.body.resultData == 0) {
              this.toast('添加经销商失败');
            }
          }
        })
      },
      emitState(state){
        this.citysMask = false;
      },
      //分页
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
      loadBottom() {
        this.page++;
        setTimeout(() => {
          this.init(this.page, this.cityCode)
          this.$refs.loadmore.onBottomLoaded();
        }, 1500);
      },


    },
  }
</script>
<style lang="less" scoped>
  @import "dealer.less";
  #head-bar h2{
    display: block;
    i{
      margin-left: 0.15rem;
    }
  }
</style>

