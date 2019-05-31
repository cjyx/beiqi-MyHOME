<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content aty-detail">
      <h3>{{entity.activityName}}</h3>
      <div class="content">
        <i>活动时间：{{ entity.startTime | dateFormat('yyyy-MM-dd')}} 至 {{entity.endTime | dateFormat('yyyy-MM-dd')}}</i>
        <!--<img v-lazy="entity.displayImg"/>-->
        <!--<p>活动要求</p>-->
        <div class="dt-content" v-html="entity.content"></div>
      </div>
    </div>
    <div class="submit-btn" v-if="entity.activityType!=4">
      <button v-if="entity.status==1 || entity.status==6" class="btn next-btn" @click="signUp">红包一键领取</button>
      <button v-if="entity.status==2" class="btn next-btn disabled-btn">不符合领取条件</button>
      <button v-if="entity.status==3" class="btn next-btn disabled-btn">已领取</button>
      <button v-if="entity.status==4" class="btn next-btn disabled-btn">已结束</button>
      <button v-if="entity.status==5" class="btn next-btn disabled-btn">已领完</button>
      <button v-if="entity.status==7" class="btn next-btn disabled-btn">未开始</button>
    </div>
    <div class="submit-btn" v-if="entity.activityType==4">
      <button v-if="entity.status==1 || entity.status==6" class="btn next-btn" @click="collect">上传征集信息</button>
      <button v-if="entity.status==4" class="btn next-btn disabled-btn">已结束</button>
      <button v-if="entity.status==7" class="btn next-btn disabled-btn">未开始</button>
    </div>

    <mask-bar :maskHeader="2" v-if="modalSuccess" @onHide="modalSuccess=false"></mask-bar>
    <transition name="modal-fade">
      <div class="up-modal" v-if="modalSuccess" ref="modal">
        <i class="iconfont icon-clock" @click="modalSuccess=false"></i>
        <div>
          <h4>领取成功</h4>
          <p>请到我的-我的票券 查看</p>
        </div>
        <router-link class="btn next-btn" :to="{ name: 'ticket', query: {ticketIndex:1}}"> 确定 </router-link>
      </div>
    </transition>

    <modal-bar v-if="modalForm" :maskHeader="1" :canClose="true" @onHide="modalForm = false">
      <div class="form-content" slot="modal-main">
        <div class="form-group">
          <label>省份：</label>
          <select v-model="selectedProvince">
            <option value="" disabled selected>请选择省份</option>
            <option v-for="option in listProvince" v-bind:value="option" :key="option.proviceCode">
              {{ option.provinceName }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>城市：</label>
          <select v-model="selectedCity">
            <option value="" disabled selected>请选择城市</option>
            <option v-for="option in listCity" v-bind:value="option" :key="option.cityCode">
              {{ option.cityName }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>经销商：</label>
          <select v-model="selected4s" placeholder="请输入手机号">
            <option value="" disabled selected>请选择经销商</option>
            <option v-for="option in list4s" v-bind:value="option.dealerId" :key="option.dealerId">
              {{ option.dealerName }}
            </option>
          </select>
        </div>
        <button class="btn next-btn" @click="submit">提交</button>
      </div>
    </modal-bar>

    <loginPopup v-if="modalLogin" @onHide="modalLogin = false"></loginPopup>

    <bindPopup v-if="modalBind" @onHide="modalBind = false" @onCancel="modalBind=false"></bindPopup>
  </div>
</template>
<script>
let refuseMsg = ['', '未登录或注册', '未认证', '车型信息不符', '性别不符', '地区不符', '生日不符','特殊活动用户无参加资格','活动尚未开始','活动已结束'];
import { mapState } from 'vuex'
export default {
  data() {
    return {
      title: '活动内容',
      modalLogin: false,
      modalBind: false,
      modalForm: false,
      modalSuccess: false,
      id: this.$route.query.id,
      entity: {},
      listProvince: [],
      listCity: [],
      list4s: [],
      selectedProvince: '',
      selectedCity: '',
      selected4s: '',
    }
  },
  computed: {
    ...mapState([
      'token',
    ])
  },
  watch: {
    selectedProvince(newVal, oldVal) {
      this.listCity = newVal.city;
    },
    selectedCity(newVal, oldVal) {
      this.list4s = newVal.dealer;
    }
  },
  mounted() {
    this.init();
    this.native.grabHandler('activity.online.detail');
  },
  methods: {
    init() {
      var postData = {
        activityId: this.id,
        token: this.token
      };
      this.native.apiHandler('XS-BUS-HDNR', postData, (res) => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          var resultData = response.body.resultData;
          this.entity = resultData;
        }
      })
    },
    collect() {
      this.native.grabHandler('activity.online.detail.collect');
      if (this.token == '') {
        this.modalLogin = true;
        return;
      }
      this.$router.push({ name: 'collect', query: { id: this.id } });
    },
    /**报名，判断领取条件*/
    signUp() {
      this.native.grabHandler('activity.online.detail.signUp');
      if (this.token == '') {
        this.modalLogin = true;
        return;
      }
      var postData = {
        activityId: this.id,
        token: this.token
      };
      this.native.apiHandler('XS-BUS-LQPD', postData, (res) => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          var resultData = response.body.resultData;
          if (resultData.flag) {
            if (this.entity.type == '2') {
              this.submit();
            } else {
              this.init4s();
            }
          } else {
            if (resultData.refuseMsg == 2) {
              this.modalBind = true;
              return;
            }
            this.toast(refuseMsg[resultData.refuseMsg]);
          }
        }
      })
    },
    init4s() {
      var postData = {
        activityId: this.id
      };
      this.native.apiHandler('XS-BUS-HXSD', postData, (res) => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          var resultData = response.body.resultData;
          this.listProvince = resultData;
          this.modalForm = true;
        }
      })
    },
    submit() {
      if (this.entity.type == '1' && this.selected4s == '') {
        this.toast('请选择经销商');
        return;
      }
      var postData = {
        activityId: this.id,
        channel: '1',
        delearId: this.selected4s,
        token: this.token
      };
      this.native.apiHandler('XS-BUS-LQPQ', postData, (res) => {
        let response = this.convert(res);
        this.native.grabHandler('activity.online.detail.submit');
        if (response.body.isSuccessful == true) {
          var resultData = response.body.resultData;
          if (resultData) {
            this.modalForm = false;
            this.modalSuccess = true;
            this.entity.status = 3;
          }
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
@import "line.less";
</style>
