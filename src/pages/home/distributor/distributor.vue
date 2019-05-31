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
            <li v-for="(item,index) in list" :key="index">
              <div class="name">
                <i class="iconfont icon-line-v"></i>
                <div>
                  <h3 @click="maskMakeBtn(item)">{{item.companyName}}</h3>
                  <span v-if="item.range!=0">{{item.range}}Km</span>
                </div>
              </div>
              <div class="content">
                <div class="address" @click="maskMakeBtn(item)">
                  <div v-if="item.serviceAddress!=item.saleAddress">
                    <p v-if="item.saleAddress">销售地址：{{item.saleAddress}}</p>
                    <p v-if="item.serviceAddress">服务地址：{{item.serviceAddress}}</p>
                  </div>
                  <p v-if="item.serviceAddress==item.saleAddress">销售/服务地址:{{item.saleAddress}}</p>
                </div>
                <div class="list">
                  <a @click="maskHereBtn(item)"><i class="iconfont icon-location"></i> 去这里</a>
                  <a @click="maskiPhone(item)"><i class="iconfont icon-phone"></i> 打电话</a>
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
        <div class="station-btn">
            <button @click="redirectStation('station')" class="btn-red">来此建站</button>
          <p>附近没有经销商，来此建站吧</p>
        </div>
      </div>
    </div>
    <!--phone star-->
    <mask-bar :maskHeader="1" v-if="maskPhone" @onHide="emitState"></mask-bar>
    <transition name="fade-up">
      <div class="db-phone" v-if="maskPhone">
        <div>
          <p v-if="dealerList.saleTel" @click="confirmPhone(dealerList.saleTel)">销售热线：{{dealerList.saleTel}}</p>
          <p v-if="dealerList.serviceTel" @click="confirmPhone(dealerList.serviceTel)">服务热线：{{dealerList.serviceTel}}</p>
          <p v-if="dealerList.rescueTel" @click="confirmPhone(dealerList.rescueTel)">
            救援热线：{{dealerList.rescueTel}}</p>
        </div>
        <button @click="maskHide">取消</button>
      </div>
    </transition>
    <modal-bar v-if="modalPhone" :maskHeader="1" :canClose="true" :state="1" @onHide="modalPhone = false"
               :content="currPhone"
               :cancelText="'取消'" @onCancel="modalPhone=false"
               :okText="'呼叫'" @onOk="callPhone(currPhone)">
    </modal-bar>
    <!--phone end-->
    <!--make  star-->
    <mask-bar :maskHeader="1" v-if="maskMake" @onHide="emitState"></mask-bar>
    <transition name="fade-up">
      <div class="db-phone" v-if="maskMake">
        <div>
          <p @click="maintain('maintain')" v-if="dealerList.serviceAddress">保养预约</p>
          <p v-if="dealerList.saleAddress" @click="toTestDrive('testDrive')">试乘试驾</p>
        </div>
        <button @click="maskHide">取消</button>
      </div>
    </transition>
    <!--make  end-->
    <!--goHere  star-->
    <mask-bar :maskHeader="1" v-if="maskHere" @onHide="emitState"></mask-bar>
    <transition name="fade-up">
      <div class="db-phone" v-if="maskHere">
        <div>
          <p v-if="dealerList.saleAddress" @click.stop="saleAddress(dealerList)">销售地址</p>
          <p v-if="dealerList.serviceAddress" @click.stop="serviceAddress(dealerList)">服务地址</p>
        </div>
        <button @click="maskHide">取消</button>
      </div>
    </transition>
    <!--goHere  end-->
    <!--city  star-->
    <mask-bar :maskHeader="2" v-if="MaskCitys" @onHide="emitState"></mask-bar>
    <transition name="fade-down">
      <div class="db-citys" v-if="MaskCitys">
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
    <loginPopup v-if="modalLogin" @onHide="modalLogin = false"></loginPopup>

    <bindPopup v-if="modalBind" @onHide="modalBind = false" @onCancel="modalBind=false"></bindPopup>

    <transition name="slide-left">
      <router-view></router-view>
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
        list: [],
        allLoaded: false,
        bottomStatus: '',
        wrapperHeight: 0,
        maskPhone: false,
        maskMake: false,
        maskHere: false,
        MaskCitys: false,
        modalPhone: false,
        tbload: false,
        modalLogin:false,
        modalBind:false,
        GpsShow:true,
        currPhone: '',
        provinces: [],
        city: [],
        page: 1,
        currentProvince: {},
        currentCity: {},
        dealerList: {},
      };
    },
    computed: {
      ...mapState([
        'lon', 'lat', 'adCode','token','carCount','adProvince','unaudited'
      ])
    },
    mounted() {
      if (!this.lon || !this.lat) {
        this.initGps();
      }
      this.initCity();
      this.wrapperHeight = document.documentElement.clientHeight - 44;
      this.native.grabHandler('home.distributor');
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
          if (!response || !response.adCode){
            this.GpsShow=false;
          }else{
            this.GpsShow=true;
            this.$store.commit('mttSaveGps', response);
          }
        })
      },
      //点击选择省市
      citysMaskBtn(){
        this.native.grabHandler('home.distributor.cityMask');
        this.MaskCitys = true;
      },
      getCitys(item){
        this.currentProvince = item;
//        alert(item.code)
        this.city = area.getCityByPCode(item.code);

      },
      getCitysContent(item){
        this.MaskCitys = false;
        this.currentCity = item;
        this.list = [];
        this.init(1);
        this.tbload = false;
      },
      init(page){
        var postData = {
          channel: 2,
          cityCode: this.currentCity.code,
          lat: this.lat,
          lng: this.lon,
          page: page
        };
        this.native.apiHandler('XS-VEH-CSLB', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            if (resultData.totalRows > 0) {
              this.list.pushs(resultData.rows);
            } else {
              this.allLoaded = true;
            }
          }
        })
      },
      //分页
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
      loadBottom() {
        this.tbload = true;
        this.page++;
        setTimeout(() => {
          this.init(this.page, this.cityCode)
          this.$refs.loadmore.onBottomLoaded();
          this.tbload = false;
        }, 1500);
      },
      //打电话
      maskiPhone(item){
        if (this.tbload == true) {
          return false;
        }
        this.native.grabHandler('home.distributor.phone');
        this.maskPhone = true;
        this.dealerList = item
      },
      confirmPhone(phone){
        this.native.grabHandler('home.distributor.confirmPhone');
        this.modalPhone = true;
        this.maskPhone = false;
        this.currPhone = phone;
      },
      callPhone(phone){
        var postData = {
          str: phone,
          type: 1
        }
        this.native.nativeHandler(postData, (res) => {
        })
      },
      //销售地址
      saleAddress(item){
        this.native.mapHandler(item.saleLng, item.saleLat, item.saleAddress, (res) => {
        })
      },
      //服务地址
      serviceAddress(item){
        this.native.mapHandler(item.serviceLng, item.serviceLat, item.serviceAddress, (res) => {
        })
      },
      maskHide(){
        this.maskPhone = false;
        this.maskMake = false;
        this.maskHere = false;
      },
      maskMakeBtn(item){
        if (this.tbload == true) {
          return false;
        }
        this.maskMake = true;
        this.dealerList = item
      },
      //点击去这里显示服务地址和销售地址
      maskHereBtn(item){
        if (this.tbload == true) {
          return false;
        }
        this.native.grabHandler('home.distributor.here')
        this.maskHere = true;
        this.dealerList = item;
      },
      emitState(state){
        this.maskPhone = false;
        this.maskMake = false;
        this.maskHere = false;
        this.MaskCitys = false;
      },
      //保养预约  试驾预约
      maintain(path){
        if (this.token == '') {
          this.modalLogin = true;
          return;
        }
        if (this.carCount ==0) {
          this.modalBind = true;
          this.maskMake = false;
          return;
        }
        if (this.unaudited == 0) {
          this.toast('车辆正在认证中，认证通过可使用此功能');
          return;
        }
        this.$router.push({
          name:path,
          query: {'dealerName':this.dealerList.companyName,'dealerId':this.dealerList.id,'province':this.currentProvince.name,'city':this.currentCity.name,'cityCode':this.currentCity.code}
        });
      },
      toTestDrive(path){
        if (this.token == '') {
          this.modalLogin = true;
          return;
        }
        this.$router.push({
          name:path,
          query: {'dealerName':this.dealerList.companyName,'dealerId':this.dealerList.id,'province':this.currentProvince.name,'city':this.currentCity.name,'cityCode':this.currentCity.code}
        });
      },
      //跳转路径
      redirect(path){
        if (this.token == '') {
          this.modalLogin = true;
          return;
        }
        this.$router.push({name: path, query: {}});
      },
  //  GPS开启跳转来此建站
      redirectStation(path) {
        if (!this.GpsShow) {
          this.toast('需开启定位权限后使用此功能')
          return;
        }
        this.native.grabHandler('home.distributor.redirectStation')
        this.$router.push({ name: path });
      },
    },
  }
</script>
<style lang="less" scoped>
  @import "distributor.less";
  #head-bar h2{
    display: block;
    i{
      margin-left: 0.15rem;
    }
  }
</style>

