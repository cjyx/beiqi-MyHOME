<template xmlns="http://www.w3.org/1999/html">
  <div class="app">
    <head-bar :head-back='true' :head-title="title">
    </head-bar>
    <div class="main-content rescue-map" v-if="pickerMap">
      <el-amap vid="amap" :center="center" :zoom="zoom" :events="events">
        <el-amap-marker v-for="(marker,index) in markers" :position="marker.position" :events="marker.events" :visible="marker.visible" :draggable="marker.draggable" :key="index"></el-amap-marker>
      </el-amap>
      <div class="form-content">
        <div class="form-group">
          <label>所在省份</label>
          <input type="text" v-model="province" readonly>
        </div>
        <div class="form-group">
          <label>所在城市</label>
          <input type="text" v-model="city" readonly>
        </div>
        <div class="form-group">
          <label>所在区</label>
          <input type="text" v-model="district" readonly>
        </div>
        <div class="form-group">
          <label>所在街道</label>
          <input type="text" v-model="street" readonly>
        </div>
        <button class="btn-red" @click="submitGps">提交</button>
      </div>
    </div>
    <div class="main-content" v-if="pickerMap==false">
      <div class="rescue-title">
        <span>北汽客户服务热线：</span>
        <p @click="callPhone(hotLine)">{{hotLine}}</p>
        <i class="iconfont icon-phone" @click="callPhone(hotLine)"></i>
      </div>
      <div class="rescue-item" v-for="(item,index) in def4s" :key="index" v-if="item.serviceAddress">
        <div class="rescue-top">
          <h3>{{item.companyName}}</h3><span>{{item.range}}Km</span>
        </div>
        <div class="content">
          <div class="line" v-if="item.saleAddress">
            <span>销售地址: </span>
            <p>{{item.saleAddress}}</p>
            <i @click="navigate(item,1)" class="iconfont icon-location"></i>
          </div>
          <div class="line" v-if="item.serviceAddress">
            <span>服务地址: </span>
            <p>{{item.serviceAddress}}</p>
            <i @click="navigate(item,2)" class="iconfont icon-location"></i>
          </div>
          <div class="line" v-if="item.rescueTel">
            <span>救援热线: </span>
            <p @click="callHelp(item)">{{item.rescueTel}}</p>
            <i @click="callHelp(item)" class="iconfont icon-phone"></i>
          </div>
        </div>
      </div>
    </div>

    <modal-bar v-if="modalSuccess" :maskHeader="1" :canClose="false" :state="1" @onHide="modalSuccess = true" :content="'救援信息已发送，前往我的服务查看救援订单详情'" :cancelText="'取消'" @onCancel="$router.push({name:'home',query: {}})" :okText="'确定'" @onOk="$router.push({name:'service',query: {type: 1}})">
    </modal-bar>

  </div>
</template>
<script>
import '../../../common/map.js'
import { mapState } from 'vuex'
export default {
  data() {
    let self = this;
    return {
      title: '紧急救援',
      pickerMap: true,
      modalSuccess: false,
      def4s: [],
      zoom: 13,
      center: [0, 0],
      markerAddress: {},
      province: '',
      city: '',
      district: '',
      street: '',
      positionLng: 0,
      positionLat: 0,
      markers: [
        {
          position: [0, 0],
          events: {
            dragend: (e) => {
              this.markers[0].position = [e.lnglat.lng, e.lnglat.lat];
            }
          },
          visible: true,
          draggable: false
        }
      ],
      events: {
        click(e) {
          let { lng, lat } = e.lnglat;
          self.lng = lng;
          self.lat = lat;
          self.markers[0].position = [lng, lat];
          // 这里通过高德 SDK 完成。
          var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: 'all'
          });
          geocoder.getAddress([lng, lat], function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
              if (result && result.regeocode) {
                self.positionLng = lng;
                self.positionLat = lat;
                self.markerAddress = result.regeocode.addressComponent;
                self.province = self.markerAddress.province;
                self.city = self.markerAddress.city == '' ? self.markerAddress.province : self.markerAddress.city;
                self.district = self.markerAddress.district;
                self.street = self.markerAddress.street == '' ? self.markerAddress.province : self.markerAddress.township;
                self.street += self.markerAddress.streetNumber;
              }
            }
          });
        }
      },
    };
  },
  computed: {
    ...mapState([
      'token', 'hotLine', 'ad', 'lon', 'lat', 'adCode', 'token'
    ])
  },
  mounted() {
    this.native.grabHandler('home.rescue');
    if (!this.lon || !this.lat) {
      this.initGps();
    }
    this.initCity();
  },
  methods: {
    /**定位*/
    initGps() {
      this.native.gpsHandler('', '', (res) => {
        let response = this.convert(res);
        if (response || response.adCode) {
          this.$store.commit('mttSaveGps', response);
        }
      })
    },
    initCity() {
      this.positionLng = this.lon;
      this.positionLat = this.lat;
      this.markerAddress = this.ad;
      this.province = this.ad.province;
      this.city = this.ad.city;
      this.street = this.ad.street;
      this.district = this.ad.district;
      this.street = this.ad.streetName + this.ad.houseNumber;
      this.center = [this.positionLng, this.positionLat];
      this.markers[0].position = [this.positionLng, this.positionLat];
    },
    /**获取默认经销商*/
    submitGps() {
      if (this.token == '') {
        return;
      }
      var postData = {
        dealerNum: 1,
        lat: this.positionLat,   //this.positionLat   java要求经纬度倒着传
        lng: this.positionLng    //this.positionLng
      };
      this.native.apiHandler('XS-BUS-JYJXS', postData, (res) => {
        this.native.grabHandler('home.rescue.submit');
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          this.pickerMap = false;
          var resultData = response.body.resultData;
          this.def4s = resultData;
        }
      })
    },
    callPhone(phone) {
      this.native.grabHandler('home.rescue.'+phone);
      var postData = {
        str: phone,
        type: 1
      };
      this.native.nativeHandler(postData, (res) => {
      })
      var postData = {
        dealerInfoId: '',
        rescueAddress: this.ad.formattedAddress,
        rescuePosition: this.positionLng + ',' + this.positionLat,
        rescuePositionAddress: this.province + this.city+this.district +this.street,
        token: this.token
      };
      // alert(JSON.stringify(postData))
      this.native.apiHandler('XS-BUS-JJJY', postData, (res) => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          var resultData = response.body.resultData;
          if (resultData == '1') {
            this.modalSuccess = true;
          } else {
            this.toast('提交失败');
          }
        }
      })
    },
    callHelp(item) {
      var postData = {
        str: item.rescueTel,
        type: 1
      };
      this.native.nativeHandler(postData, (res) => {
      })
      this.submit(item);
    },
    navigate(item, type) {
      this.native.grabHandler('home.rescue.toHere');
      if (type == 1) {
        this.native.mapHandler(item.saleLng, item.saleLat, item.saleAddress, (res) => {
        })
      } else {
        this.native.mapHandler(item.serviceLng, item.serviceLat, item.serviceAddress, (res) => {
        })
      }
    },
    submit(item) {
      this.native.grabHandler('home.rescue.call.submit');
      var postData = {
        dealerInfoId: item.dealerCode,
        rescueAddress: this.ad.formattedAddress,
        rescuePosition:  this.positionLng + ',' + this.positionLat,
        rescuePositionAddress: this.province + this.city+this.district +this.street,
        token: this.token
      };
      // alert(JSON.stringify(postData))
      this.native.apiHandler('XS-BUS-JJJY', postData, (res) => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          var resultData = response.body.resultData;
          if (resultData == '1') {
            this.modalSuccess = true;
          } else {
            this.toast('提交失败');
          }
        }
      })
    }
  },

}
</script>
<style lang="less" scoped>
@import "rescue.less";
</style>

