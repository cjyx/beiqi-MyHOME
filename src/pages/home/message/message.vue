<!--<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <ul class="page-loadmore-list group-list">
        <li v-for="item in list">
          <router-link :to="{name: 'messageList', params: {  }}">
            <i :class=item.icon></i>
            <div class="content">
              <p>
                {{ item.name }}
                <span>10:00</span>
              </p>
              <div class="info">
                <span>您的预约保养订单已确认，请注意按时...</span>
              </div>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
    <transition name="slide-left">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        title: '我的消息',
        list:[
            {icon:'iconfont icon-msg-order',name:'服务订单'},
            {icon:'iconfont icon-msg-car',name:'车辆管理'},
            {icon:'iconfont icon-msg-warn',name:'关怀提醒'},
            {icon:'iconfont icon-msg-integral',name:'积分/票券'}
            ],
      }
    },
    mounted(){
    },
    methods: {}
  }
</script>
<style lang="less" scoped>
  @import "message.less";
  .main-content{
    background: @bg-color-white;
  }
</style>-->


<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='false'>
       <router-link slot="left" :to="{name:'home',query:{}}">
        <i class="iconfont icon-left"></i>
      </router-link>
    </head-bar>
    <div class="main-content">
      <div class="page-loadmore-wrapper tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }" v-if="modalEmpty==false">
        <mt-loadmore :autoFill="false" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange"
                     :bottom-all-loaded="allLoaded" ref="loadmore">
          <ul class="page-loadmore-list">
            <li @click="detail(item,index)" class="message-item" v-for="(item,index) in list" :key="index">
              <span>{{item.sendTime}}</span>
              <div>
                <div>
                  <h3>{{item.title}}</h3>
                  <p v-html="item.content"></p>
                </div>
                <!--<i class="iconfont icon-right"></i>-->
              </div>
            </li>
          </ul>
        </mt-loadmore>
      </div>
      <!--空白页-->
      <empty-page v-if="modalEmpty"></empty-page>
    </div>
    <!--生日选择日期-->
    <modal-bar v-if="birthdayOption" :maskHeader="1" :canClose="true" :state="5" @onHide="birthdayOption = false"
               :cancelText="'取消'" @onCancel="birthdayOption=false"
               :okText="'下一步'" @onOk="nextBirthday()">
      <div slot="modal-data">
        <div class="add-birthday">
          <p>出生日期：</p>
          <input type="text" placeholder="请选择出生日期" v-model="birthday" @click="open('birth')" readonly>
        </div>
      </div>
    </modal-bar>
    <!--出生日期-->
    <mt-datetime-picker ref="birth" type="date" v-model="pickerValue" :startDate="new Date('1950')"
                        @confirm="handleChange"></mt-datetime-picker>

    <transition name="slide-left">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      title: '我的消息',
      allLoaded: false,
      bottomStatus: '',
      wrapperHeight: 0,
      page: 1,
      list: [],
      modalEmpty: false,
      birthdayOption:false,
      birthday: '',
      id:''
    };
  },
  computed: {
    ...mapState(['token','user'])
  },
  mounted() {
    this.native.grabHandler('home.message');
    this.wrapperHeight = document.documentElement.clientHeight - 44;
    this.loadPage();
    if(this.user.birthday){
      this.birthday = new Date(this.user.birthday).format('yyyy-MM-dd');
    }
  },
  methods: {
    open(picker) {
      this.$refs[picker].open();
    },
    handleChange(value) {
      this.birthday = (new Date(value)).format('yyyy-MM-dd');
    },
    handleBottomChange(status) {
      this.bottomStatus = status;
    },
    loadBottom() {
      setTimeout(() => {
        this.page++;
        this.loadPage();
        this.$refs.loadmore.onBottomLoaded();
      }, 1500);
    },
    loadPage() {
      var postData = {
        token: localStorage.token,
        page: this.page,
        pageSize: '10'
      };
      this.native.apiHandler('XS-BUS-YHXX', postData, res => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          var resultData = response.body.resultData;
          if (resultData.rows.length > 0) {
            this.list.pushs(resultData.rows);
          } else if (this.list.length == 0) {
            this.modalEmpty = true;
            return;
          } else {
            this.allLoaded = true;
            this.toast('加载完毕');
          }
        }
      });
    },
    detail(item) {
      this.native.grabHandler('home.message.detial');
//        4代表积分商城6代表生日7代表专属车标
      if (item.linkUrl) {
        var postData = {
          obj: { title: item.title, url: item.linkUrl },
          type: 4
        };
        this.native.nativeHandler(postData, res => {});
      }else if(item.type==4){
        this.$router.push({ name: 'userIntegral'});
      }else if(item.type==6){
          this.isSetAddress(0,6,item.paramId);
      }else if(item.type==7){
          this.isSetAddress(1,7,item.paramId);
      }
    },
    isSetAddress(orderType,type,orderId){
      var postData = {
        token: localStorage.token,
        orderType:orderType,
        orderId:orderId,
      };
      this.native.apiHandler('	XS-MALL-SFSZDZ', postData, res => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          if(response.body.resultData==true){
              this.toast('信息已提交成功，请耐心等待');
          }else {
            if(type==6){
              this.isSetBirthday(orderId);
            }else if(type==7){
              this.$router.push({ name: 'gift',query:{orderType:1,orderId:orderId}});
            }
          }
        }
      });
    },
    isSetBirthday(orderId){
      var postData = {
        token: localStorage.token,
      };
      this.native.apiHandler('XS-MALL-SFSZGSR', postData, res => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          if(response.body.resultData){
            this.birthdayOption = false;
            this.$router.push({ name: 'gift',query:{orderType:0,orderId:orderId}});
          }else {
            this.birthdayOption = true;
            this.id = orderId;
          }
        }
      });
    },
    nextBirthday(){
      if (this.birthday.trimNo() == '') {
        this.toast('请选择出生日期');
        return;
      }
      var postData = {
        token: localStorage.token,
        birthday: this.birthday
      };
      this.native.apiHandler('	XS-MALL-SZSR', postData, res => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          this.birthdayOption = false;
          this.$router.push({ name: 'gift',query:{orderType:0,orderId:this.id}});
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import 'message.less';
</style>
