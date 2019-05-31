<template>
  <div class="app page-view">
    <head-bar :head-back='true' :head-title="title">
      <router-link slot="right" :to="{ name: 'toDoorRule', params: {  }}">上门服务规则</router-link>
    </head-bar>
    <div class="main-content">
      <div v-if="maintainList.length>0" class="prompt">
        您附近有4S店，到店维修保养更快捷
      </div>
      <div v-if="promptNo" class="prompt">
        您所在的区域不享受此服务
      </div>
      <div class="map" ref="mapHeight">
        <!--:search-option="searchOption"-->
        <el-amap-search-box class="search-box"
                            :on-search-result="onSearchResult"></el-amap-search-box>
        <el-amap vid="amapDemo" :center="mapCenter" :zoom="12">
          <el-amap-marker v-for="(marker,index) in markers" :key="index" :position="marker"></el-amap-marker>
        </el-amap>
      </div>

    </div>
    <ul class="caption-group" v-if="maintainList.length>0">
      <li v-for="(item,index) in maintainList" :key="item.id">
        <div class="name">
          <i class="iconfont icon-line-v"></i>
          <div><h3>{{item.companyName}}</h3> <span>{{item.range}}KM</span></div>
        </div>
        <div class="content">
          <div class="address"><p>服务地址：{{item.serviceAddress}}</p></div>
          <div class="list">
            <a @click="confirmPhone(item)">打电话</a>
            <a @click="submitMaintain(item)"> 到店保养预约</a>
            <!--<a @click="submitDoor(item)">上门服务</a>-->
          </div>
        </div>
      </li>
    </ul>
    <ul class="caption-group" v-if="toDoorList.length>0">
      <li v-for="(item,index) in toDoorList" :key="item.id">
        <div class="name">
          <i class="iconfont icon-line-v"></i>
          <div><h3>{{item.companyName}}</h3> <span>{{item.range}}KM</span></div>
        </div>
        <div class="content">
          <div class="address"><p>服务地址：{{item.serviceAddress}}</p></div>
          <div class="list">
            <a @click="confirmPhone(item)">打电话</a>
            <a @click="submitDoor(item)">上门服务</a>
          </div>
        </div>
      </li>
    </ul>

    <modal-bar v-if="modalHint" @onHide="modalHint=false" :state="2" :maskHeader="1"
               :title="'上门服务条件'" :content="'上门服务位置半径10-50km范围内有经销商，车主可申请上门服务'">
      <!--  <div class="modal-btn" slot="modal-main">
          <div class="option square">
            <input type="checkbox" name="" checked>
            <span></span>
            <label>不再提示</label>
          </div>
        </div>-->
    </modal-bar>


    <modal-bar v-if="modalPhone" :title="'确定拨打电话？'" :maskHeader="1" :canClose="true" :state="1"
               @onHide="modalPhone = false"
               :content="currPhone"
               :cancelText="'取消'" @onCancel="modalPhone=false"
               :okText="'呼叫'" @onOk="callPhone(currPhone)">
    </modal-bar>

    <transition name="slide-left">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>
<script>
  import '../../../common/map.js'
  import {mapState} from 'vuex'
  export default {
    data() {
      return {
        zoom: 10,
        title: '上门服务',
        promptNo: false,
        mapHeight: '',
        maintainList: [],
        toDoorList: [],
        modalHint: true,
        modalPhone: false,
        currPhone: '',
        markers: [],
        /* searchOption: {
         city: '上海',
         citylimit: true
         },*/
        mapCenter: [121.59996, 31.197646]
      };
    },
    computed: {
      ...mapState([
        'token', 'hotLine', 'adCode', 'lon', 'lat'
      ])
    },
    mounted(){
      this.init();
      this.$refs.mapHeight.style.height = ( document.documentElement.clientHeight - 50) + 'px';
    },
    methods: {
      init(){
        if (this.lon != '') {
          this.mapCenter = [this.lon, this.lat];
        }
      },
      onSearchResult(pois) {
//        alert(JSON.stringify(pois));
        var point;
        if (pois.length > 0) {
          this.modalHint = false;
          this.promptNo = false;
          point = pois[0];
          let {lng, lat} = point;
          this.mapCenter = [lng, lat];
          this.markers = [];
          this.markers.push([lng, lat]);
          this.get4sList(lng, lat);
        } else {
          this.promptNo = true;
        }
      },
      get4sList(lon, lat){
        var postData = {
          longitude: lon.toString(),
          latitude: lat.toString()
        };
        this.native.apiHandler('XS-MAL-FJJXS', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            this.maintainList = resultData.resultOne;
            this.toDoorList = resultData.resultTwo;
            this.maintainList.forEach(item => {
              this.markers.push([item.serviceLng, item.serviceLat]);
            })
            this.toDoorList.forEach(item => {
              this.markers.push([item.serviceLng, item.serviceLat]);
            })
            if (resultData.resultOne.length == 0 && resultData.resultTwo.length == 0) {
              this.promptNo = true;
            }
          }
        })
      },
      confirmPhone(item){
        this.currPhone = item.serviceTel;
        this.modalPhone = true;
      },
      callPhone(phone){
        var postData = {
          str: phone,
          type: 1
        };
        this.native.nativeHandler(postData, (res) => {
        })
      },
      submitDoor(item){
        this.$router.push({name: 'submitDoor', query: {id: item.id, companyName: item.companyName}});
      },
      submitMaintain(item){
        this.$router.push({name: 'submitMaintain', query: {id: item.id, companyName: item.companyName}});
      }
    }
  }
</script>

<style lang="less" scoped>

  .amap-demo {
    /*height: 300px;*/
  }

  .search-box {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
  }

  .amap-page-container {
    position: relative;
  }

  @import "toDoor.less";
</style>
