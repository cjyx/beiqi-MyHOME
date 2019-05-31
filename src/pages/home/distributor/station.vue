<template>
  <div class="app page-view">
    <head-bar :head-back='true' :head-title="title">
    </head-bar>
    <div class="main-content">
      <el-amap
        vid="amap"
        :center="center"
        :zoom="zoom"
        :events="events">
        <el-amap-marker v-for="(marker,index) in markers" :position="marker.position" :events="marker.events"
        :visible="marker.visible" :draggable="marker.draggable" :key="index"></el-amap-marker>
        <!--<el-amap-info-window v-for="window in windows" :visible="show" :position="window.position"-->
        <!--:content="window.content" :open="window.open" :events="window.events"></el-amap-info-window>-->
      </el-amap>
      <div class="form-content">
        <div class="form-group">
          <label>所在省份</label>
          <input type="text" v-model="stationList.province" readonly>
        </div>
        <div class="form-group">
          <label>所在城市</label>
          <input type="text" v-model="city" readonly>
        </div>
        <div class="form-group">
          <label>所在区</label>
          <input type="text" v-model="stationList.district" readonly>
        </div>
        <div class="form-group">
          <label>所在街道</label>
          <input type="text" v-model="street" readonly>
        </div>
        <button class="btn-red" @click="stationSubmit">提交</button>
      </div>
    </div>
    <!--提示框-->
    <modal-bar v-if="modalShow" :maskHeader="1" :canClose="true" :state="2" @onHide="modalShow=false"
               :title="'建站申请的条件'" :content="'提交建站需求，就有可能在附近区域建立北汽绅宝专属服务网点'">
    </modal-bar>
    <modal-bar v-if="modalForm" :maskHeader="1" :canClose="true" @onHide="modalForm = false">
      <div slot="modal-main">
        <p>您的申请已收到，感谢您的支持</p>
        <button class="btn next-btn" @click="submit">提交</button>
      </div>
    </modal-bar>
  </div>
</template>
<script>
  import '../../../common/map.js'
  import {mapState} from 'vuex'
  export default {
    data () {
      let self = this;
      return {
        title: '来此建站',
        zoom: 12,
        center:[0, 0],
        city:'',
        street:'',
        stationList:{},
        modalShow:true,
        modalForm: false,
        positionLng:0,
        positionLat:0,
        markers: [
          {
            position: [0, 0],
            events: {
//              click: () => {
//                alert('click marker' + this.show);
//              },
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
            self.changePosition(lng,lat);
            // 这里通过高德 SDK 完成。
            var geocoder = new AMap.Geocoder({
              radius: 1000,
              extensions: 'all'
            });
            geocoder.getAddress([lng ,lat], function(status, result) {
              if (status === 'complete' && result.info === 'OK') {
                if (result && result.regeocode) {
                  self.positionLng=lng;
                  self.positionLat =lat;
                  self.stationList=result.regeocode.addressComponent;
                  if(self.stationList.city==''){
                    self.city=self.stationList.province;
                  }else{
                    self.city=self.stationList.city;
                  }
                  if(self.stationList.street!=''){
                    self.street=self.stationList.street;
                  }else{
                    self.street=self.stationList.township;
                  }
                }
              }
            });
          }
        },
      }
    },
    computed: {
      ...mapState([
        'lon','lat','adCode','adProvince','adCity','adDistrict','adStreet','token'
      ])
    },
    mounted(){
      if(!this.lon || !this.lat){
        this.initGps();
      }
      this.initCity();
      this.native.grabHandler('home.distributor.station');
    },
    methods: {
      /**定位*/
      initGps(){
        this.native.gpsHandler('', '', (res) => {
          let response = this.convert(res);
          if (response) {
            this.$store.commit('mttSaveGps', response);
          }
        })
      },
      initCity(){
        this.positionLng=this.lon;
        this.positionLat=this.lat;
        this.stationList={adcode:this.adCode,province:this.adProvince,district:this.adDistrict}
        this.city=this.adCity;
        this.street=this.adStreet;
        this.center=[this.positionLng,this.positionLat];
        this.markers[0].position=[this.positionLng,this.positionLat];
      },
      changePosition(lng,lat) {
        let position = this.markers[0].position;
        this.markers[0].position = [lng,lat];
      },
      //提交建站申请
      stationSubmit(){
        this.native.grabHandler('home.distributor.station.submit');
        var postData={
          provinceCode:this.stationList.province,
          cityCode:this.city,
          areaCode:this.stationList.adcode,
          lat:this.positionLat,
          lng:this.positionLng,
          street:this.street,
          token:this.token
        };
        this.native.apiHandler('XS-VEH-JZSQ',postData,(res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            if(response.body.resultData.resultCode==1){
                if(response.body.resultData.repeatSubmit==0){
                  this.modalForm=true;
                }else if(response.body.resultData.repeatSubmit==1){
                    this.toast('您已经提交过申请');
                }
            }else {
                this.toast('建站失败');
            }
          }
        })
      },
      submit(){
        this.native.grabHandler('home.distributor.station.pushSubmit');
        this.$router.push({name: 'distributor'});
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "distributor.less";
</style>
