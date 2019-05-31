<template>
  <div class="app page-view">
    <head-bar :head-back='true' :head-title="title">
      <router-link slot="right" :to="{ name: 'rule', params: {  }}">上门服务规则</router-link>
    </head-bar>
    <div class="main-content">
      <div class="todoor-position">
        <router-link :to="{ name: 'toDoorSearch', params: {  }}">
          <input type="text" placeholder="请输入要上门服务的地址" readonly>
        </router-link>
        <p>
          <i class="iconfont icon-check"></i>
          当前位置
        </p>
        <span>您附近有4S店，到店维修保养更快捷</span>
        <!--<span>您所在的区域不享受此服务</span>-->
      </div>
      <div class="map" ref="mapHeight">
        <el-amap vid="amap" :plugin="plugin" class="amap-demo" :center="center">
          <el-amap-marker v-for="(marker,index) in markers" :key="index" :position="marker.position" :events="marker.events"
                          :visible="marker.visible" :draggable="marker.draggable"></el-amap-marker>
        </el-amap>
      </div>
      <div class="toolbar">
        <span v-if="loaded">
          location: lng = {{ lng }} lat = {{ lat }}
        </span>
        <span v-else>正在定位</span>
      </div>
      <ul class="caption-group" ref="doorList">
        <li>
          <div class="name">
            <i class="iconfont icon-line-v"></i>
            <div>
              <h3>北京北汽鹏元汽车销售有限公司</h3>
              <span>默认</span>
            </div>
          </div>
          <div class="content">
            <div class="address">
              <p>服务地址：北京市朝阳区环球贸易中心</p>
            </div>
            <div class="list">
              <a @click="emitPhoneShow">打电话</a>
              <router-link :to="{ name: 'toDoorSubmit', params: {  }}"> 到店保养预约</router-link>
            </div>
          </div>
        </li>
        <li>
          <div class="name">
            <i class="iconfont icon-line-v"></i>
            <div>
              <h3>北京北汽鹏元汽车销售有限公司</h3>
              <span>默认</span>
            </div>
          </div>
          <div class="content">
            <div class="address">
              <p>服务地址：北京市朝阳区环球贸易中心</p>
            </div>
            <div class="list">
              <a @click="emitPhoneShow">打电话</a>
              <router-link :to="{ name: 'toDoorSubmit', params: {  }}"> 到店保养预约</router-link>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!--todoor star-->
    <mask-bar :maskHeader="2" v-if="modalShow" @onHide="emitClose"></mask-bar>
    <transition name="modal-fade">
      <modal-bar v-if="modalShow" @onHide="emitClose" :state="false" :title="modalTitle" :content="modalText">
        <div class="modal-btn" slot="modal-main">
          <div class="option square">
            <input type="checkbox" name="" checked>
            <span></span>
            <label>不再提示</label>
          </div>
        </div>
      </modal-bar>
    </transition>
    <!--todoor end-->
    <!--phone star-->
    <mask-bar :maskHeader="2" v-if="phoneShow" @onHide="emitClosePhone"></mask-bar>
    <transition name="modal-fade">
      <modal-bar v-if="phoneShow" @onHide="emitClosePhone" :state="false" :title="phoneTitle" :content="phoneText">
        <div class="modal-btn" slot="modal-main">
          <a @click="emitClosePhone">取消</a>
          <a>确定</a>
        </div>
      </modal-bar>
    </transition>
    <!--phone end-->
    <transition name="slide-left">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>
<script>
  import '../../../../common/map.js'
  export default {
    data() {
      let self = this;
      return {
        zoom: 10,
        title:'上门服务',
        modalTitle:'上门服务条件',
        modalText:'上门服务位置半径10-50km范围内有经销商，车主可申请上门服务',
        phoneTitle:'拨打电话',
        phoneText:'服务热线 010-111111111111',
        center: [121.59996, 31.197646],
        lng: 0,
        lat: 0,
        loaded: false,
        plugin: [{
          pName: 'Geolocation',
          events: {
            init(o) {
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                if (result && result.position) {
                  self.lng = result.position.lng;
                  self.lat = result.position.lat;
                  self.center = [self.lng, self.lat];

                  let position = self.markers[0].position;
                  self.markers[0].position = [self.lng, self.lat];

                  self.loaded = true;
                  self.$nextTick();
                }
              });
            }
          }
        }],
        modalShow:true,
        phoneShow:false,
        markers: [
          {
            position: [10.411945, 39.972351],
            events: {
              click: () => {
                alert('click marker');
                console.log(self.lng);
                console.log(self.lat);
              },
              dragend: (e) => {
                this.markers[0].position = [e.lnglat.lng, e.lnglat.lat];
              }
            },
            visible: true,
            draggable: false
          }
        ],
      };
    },
    methods:{
      emitClose(){
        this.modalShow=false;
      },
      emitClosePhone(){
        this.phoneShow=false;
      },
      emitPhoneShow(){
        this.native.grabHandler('home.maintain.toDoor.toDoor.phone');
        this.phoneShow=true;
      }
    },
    mounted(){
      let doorListHeight=this.$refs.doorList.offsetHeight;
      let domHeight=document.documentElement.clientHeight;
      this.$refs.mapHeight.style.height=(domHeight-doorListHeight-50)+'px';
      this.native.grabHandler('home.maintain.toDoor.toDoor');
    },

  }
</script>

<style lang="less" scoped>
@import "toDoor.less";
</style>
