<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
      <a @click="redirect('carBind')" slot="right" v-if="carCanAdd">添加车辆</a>
    </head-bar>
    <div class="main-content">
      <div class="car-content">
        <div class="group" v-for="(item,index) in carList" :key="item.id">
          <div class="info">
            <div>
              <h3>{{item.vehicleType}}</h3>
              <span class="carNum" v-if="item.lpn!=''">{{item.lpn}}</span>
              <span class="carNumUn" v-if="item.lpn==''">未知车牌号</span>
              <p v-if="item.reviewType==1">待审核</p>
            </div>
            <p>vin：{{item.vin}}</p>
            <p>购车经销商：{{item.dealerName}}</p>
            <p>发动机号：{{item.enginId}}</p>
            <p v-if="item.refereePhone!=''">购车推荐人：{{item.refereePhone}}</p>
            <!--<router-link-->
            <!--:to="{ name: 'carPerfect', query: { id: item.id,enginId:item.enginId, lpn:item.lpn,vin:item.vin}}"-->
            <!--v-if="item.reviewType==3" slot="right">完善信息-->
            <!--</router-link>-->
            <div class="list">
              <div class="option">
                <input type="radio" name="carRadio" value="1" v-model="item.isDefault" @click="defCar(item)" :disabled="item.reviewType!=3">
                <span></span>
                <label>默认车辆</label>
              </div>
              <div class="list-btn">
                <a @click="redirectInformation('carPerfect',item.id,item.enginId,item.lpn,item.vin)" v-if="item.reviewType==3" slot="right">编辑 </a>
                <a @click="unbind(item,index)" v-if="item.reviewType==3">解绑</a>
              </div>
            </div>
          </div>
          <!--<i v-if="item.reviewType==1" class="iconfont icon-un-approve"></i>-->
          <!--<button v-if="item.reviewType==3" class="btn" @click="unbind(item,index)">解绑</button>-->
        </div>
      </div>
    </div>
    <mask-bar :maskHeader="2" v-if="modalShow" @onHide="modalShow = false"></mask-bar>
    <modal-bar v-if="modalShow" @onHide="modalShow = false" :state="1" :content="'是否解绑该车辆'" :cancelText="'取消'" @onCancel="modalShow = false" :okText="'确定'" @onOk="emitUnBindOk">
    </modal-bar>
    <transition name="slide-left">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      title: '我的车辆',
      carList: [],
      carCanAdd: true,
      modalShow: false,
      currItem: {},
      currIndex: 0,
    }
  },
  computed: {
    ...mapState([
      'token'
    ])
  },
  mounted() {
    this.native.grabHandler('user.car');
    this.init();
  },
  methods: {
    emitUnBindOk() {
      var postData = {
        id: this.currItem.id,
        vin: this.currItem.vin,
        token: this.token
      };
      this.native.apiHandler('XS-VEH-CLJB', postData, (res) => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          var resultData = response.body.resultData;
          if (resultData) {
            this.toast('解绑成功');
            this.carList.splice(this.currIndex, 1);
            this.modalShow = false;
          }
        }
      })
    },
    /**加载车辆列表*/
    init() {
      var postData = {
        token: this.token
      };
      this.native.apiHandler('XS-VEH-CLLB', postData, (res) => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          var resultData = response.body.resultData;
          this.carList = resultData;
          this.carList.forEach((item, index) => {
            if (item.reviewType == 1) {
              this.carCanAdd = false;
            }
          })
        }
      })
    },
    /**解绑车辆*/
    unbind(item, index) {
      this.native.grabHandler('user.car.unbind');
      this.modalShow = true;
      this.currItem = item;
      this.currIndex = index;
    },
    /**设置用户默认车辆*/
    defCar(item) {
      this.native.grabHandler('user.car.defCar');
      var postData = {
        id: item.id,
        token: this.token,
      };
      this.native.apiHandler('XS-VEH-CLXG', postData, (res) => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          var resultData = response.body.resultData;
          if (resultData) {
            this.$store.commit('mttSaveDefCar', item);
            this.toast('设置默认车辆成功');
          }
        }
      })
    },
    redirect(path) {
      this.native.grabHandler('user.car.'+path);
      this.$router.push({ name: path, query: {} });
    },
    redirectInformation(path,id,enginId,lpn,vin) {
      this.native.grabHandler('user.car.'+path);
      this.$router.push({ name: path, query: { id: id,enginId:enginId, lpn:lpn,vin:vin}});
    },
  }
}
</script>
<style lang="less" scoped>
@import "car.less";
.main-content {
  background: @bg-color-base;
  padding: 0;
}
</style>
