<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
      <!--<a slot="left"><i class="iconfont icon-custom-service"></i></a>-->
      <!--<a slot="right">编辑</a>-->
      <a @click="redirect('informationEdit')" slot="right">编辑</a>
    </head-bar>
    <div class="main-content">
      <div class="form-content">
        <div class="form-group">
          <label>
            <img :src="userImg">

          </label>
          <input type="text" value="头像" readonly>
        </div>
        <div class="form-group">
          <label>姓名：</label>
          <input type="text" value="小胖子" v-model="realName" readonly>
        </div>
        <div class="form-group">
          <label>性别：</label>
          <input v-if="user.sex==1||user.sex==''" type="text" value="男" readonly>
          <input v-else type="text" value="女" readonly>
          <!--<input v-else-if="user.sex==''" type="text" value="" readonly>-->
         <!-- <div class="option">
            <input type="radio" name="sex" value="1" v-model="user.sex" disabled>
            <span></span>
            <label>男</label>
          </div>
          <div class="option">

            <input type="radio" name="sex" value="0" v-model="user.sex" disabled>
            <span></span>
            <label>女</label>
          </div>-->
        </div>
        <div class="form-group">
          <label>身份证号：</label>
          <input type="text" v-model="user.idNumber" readonly>
        </div>
        <div class="form-group">
          <label>出生日期：</label>
          <input type="text" v-model="user.birthday" readonly>
        </div>
        <div class="form-group">
          <label>所在城市：</label>
          <input type="text" v-model="cityName" readonly>
        </div>
        <div class="form-group">
          <label>常用地址：</label>
          <input type="text" v-model="user.adress" readonly>
        </div>
        <div class="form-group">
          <label>邮箱：</label>
          <input type="text" v-model="user.email" readonly>
        </div>
        <div class="form-group">
          <label>兴趣爱好：</label>
          <input type="text" v-model="user.interest" readonly>
        </div>
        <div class="form-group">
          <label>汽车之家论坛名：</label>
          <input type="text" v-model="user.autohomeName" readonly>
        </div>
        <div class="form-group">
          <label>越野 E 族论坛名：</label>
          <input type="text" v-model="user.fblifeName" readonly>
        </div>
      </div>
      <div class="form-content form-address">
        <div class="form-group">
          <label>手机号：</label>
          <a @click="redirect('editPhone')">
            <input type="text" v-model="user.mobilePhone" readonly>
          </a>
          <i data-v-3d8e5fa5="" class="iconfont icon-more"></i>
        </div>
        <div class="form-group"><label>收货地址：</label>
          <a  @click="redirect('address')">
            <input type="text" v-model="defAddress.addressDetail" readonly>
          </a>
          <i data-v-3d8e5fa5="" class="iconfont icon-more"></i>
        </div>
      </div>
    </div>
    <transition name="slide-left">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import area from 'src/common/area'
  export default {
    data () {
      return {
        title: '我的信息',
        city: {},
        cityName: '',
      }
    },
    computed: {
      ...mapState([
        'token', 'realName', 'userImg', 'user', 'defAddress'
      ])
    },
    watch: {
      //如果token有变化，重新请求一次
      user(val){
        if (val != '') {
          this.init();
        }
      }
    },
    mounted(){
      this.native.grabHandler('user.information');
      this.init();
      this.initAddress();
    },
    methods: {
      init(){
        this.city = area.getCityByCode(this.user.cityCode);
        if (this.city != null) {
          this.cityName = this.city.pName + '-' + this.city.name;
        }
      },
      initAddress(){
        var postData = {
          token: this.token,
        };
        this.native.apiHandler('XS-VEH-DZMR', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            this.$store.commit('mttSaveDefAddress', resultData);
          }
        })
      },
      redirect(path) {
        this.native.grabHandler('user.information.'+path);
        this.$router.push({ name: path, query: {} });
      },
    }
  }
</script>
<style lang="less" scoped>
  @import "information.less";
</style>
