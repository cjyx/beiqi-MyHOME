<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <ul class="club-content">
        <li>
          <h3>{{clubList.name}}</h3>
          <p class="sign">
            <span>车友会规模：{{clubList.total}}</span>
            <button class="btn-red" v-if="dateContent.auditType==0">审核中</button>
            <button class="btn-red" v-if="dateContent.auditType==1" @click="exitClub">退出车友会</button>
          </p>
          <p>成立时间：{{clubList.createTime}}</p>
          <p>经销商名称：{{clubList.dealerName}}</p>
          <p>所属省市：{{clubList.province}}-{{clubList.city}}</p>
          <!--<p>会长姓名：{{clubList.preside ntName}}</p>-->
          <!--<p>会长手机号：{{clubList.presidentTel}}</p>-->
          <!--<p>副会长姓名：{{clubList.chairmanName}}</p>-->
          <!--<p>副会长手机号：{{clubList.chairmanTel}}</p>-->
        </li>
      </ul>
      <div class="club-title">
        <i class="iconfont icon-line-v"></i>
        <div>
          <h3>车友会介绍</h3>
        </div>
      </div>
      <div class="describe" v-html="clubList.content"></div>
    </div>

    <loginPopup v-if="modalLogin" @onHide="modalLogin = false"></loginPopup>

    <modal-bar :maskHeader="2" v-if="modalShow" @onHide="modalShow = false" :state="1" :content="'确定退出车友会？'"
               :cancelText="'取消'" @onCancel="modalShow = false"
               :okText="'确认'" @onOk="emitConfirm"></modal-bar>

    <transition name="slide-left">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        title: '车友会',
        clubList:{},
        activeList:[],
        modalLogin:false,
        modalShow:false,
        dateContent:this.$route.query.type
      }
    },
    computed: {
      ...mapState([
        'token'
      ])
    },
    mounted() {
      this.init();
      this.native.grabHandler('home.club.joinClub');
    },
    methods: {
      /*车友会详情**/
      init(){
        var postData = {
          id: this.$route.query.id,
        };
        this.native.apiHandler('XS-BUS-VCXQ', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            this.clubList = response.body.resultData;
          }
        });
      },
      /*退出车友会**/
      exitClub(){
        this.native.grabHandler('home.club.exitClub');
        this.modalShow=true;
      },
      emitConfirm(){
        var postData = {
          id: this.$route.query.id,
          token: this.token
        };
        this.native.apiHandler('XS-BUS-THSQ', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            if(response.body.resultData==true){
              this.toast("退出成功")
              this.$router.go(-1);
            }else{
              this.toast("退出失败 ")
            }
          }
        });
      },
    }
  }
</script>
<style lang="less" scoped>
@import "club.less";
</style>
