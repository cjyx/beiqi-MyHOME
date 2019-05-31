<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <div class="page-loadmore-wrapper tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :autoFill="false" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange"
                     :bottom-all-loaded="allLoaded" ref="loadmore">
          <ul class="page-loadmore-list group-list">
            <li v-for="(item,index) in list" :key="item.id">
              <div class="scan" v-if="item.type==2">
                <h3>紧急救援</h3>
                <p>拨打时间：{{item.createTime}}</p>
                <p>拨打电话： {{item.rescueTel}}</p>
                <p>救援经销商：{{item.dealerName}}</p>
                <p>救援地址：{{item.rescueAddress}}</p>
                <p>
                  <span>订单状态：{{statusArray[item.status]}}</span>
                  <a @click="sign(item,index)">签到</a>
                </p>
              </div>
              <div class="scan" v-if="item.type==1">
                <h3>到店保养预约</h3>
                <p>提交日期： {{item.createTime}}</p>
                <p>预约日期： {{item.maintTime}}</p>
                <p>车型： {{item.nodels}}</p>
                <p>预约经销商：{{item.dealerName}}</p>
                <p>
                  <span>订单状态：{{statusArray[item.status]}}</span>
                  <a @click="sign(item,index)">签到</a>
                </p>
              </div>
              <div class="scan" v-if="item.type==0">
                <h3>试乘试驾</h3>
                <p>提交日期： {{item.createTime}}</p>
                <p>预约日期： {{item.maintTime}}</p>
                <p>车型： {{item.nodels}}</p>
                <p>预约经销商：{{item.dealerName}}</p>
                <p>
                  <span>订单状态：{{statusArray[item.status]}}</span>
                  <a @click="sign(item,index)">签到</a>
                </p>
              </div>
              <div class="scan" v-if="item.type==3">
                <h3>上门服务预约</h3>
                <p>提交日期： {{item.createTime}}</p>
                <p>预约日期：  {{item.maintTime}}</p>
                <p>服务内容： {{item.dtdServices}}</p>
                <p>预约经销商：{{item.dealerName}}</p>
                <p>
                  <span>订单状态：{{statusArray[item.status]}}</span>
                  <a @click="sign(item,index)">签到</a>
                </p>
              </div>
            </li>
          </ul>
        </mt-loadmore>
      </div>
    </div>

    <modal-bar v-if="modalSuccess" :maskHeader="1" :canClose="false" :state="1" @onHide="cancel"
               :content="'签到成功，是否进行评价？'"
               :cancelText="'取消'" @onCancel="cancel"
               :okText="'确定'" @onOk="service">
    </modal-bar>

    <transition name="slide-left">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    data() {
      return {
        title: '我的服务（签到）',
        statusArray: ['待确认', '待服务', '', '待评价', '订单完成', '已取消'],
        modalSuccess: false,
        list: [],
        allLoaded: false,
        bottomStatus: '',
        wrapperHeight: 0,
        page: 1,
        current:0,
      };
    },
    computed: {
      ...mapState([
        'token',
      ])
    },
    mounted() {
      this.wrapperHeight = document.documentElement.clientHeight - 44;
//      this.code = this.$route.query.code;
      this.loadPage(this.page);
      this.native.grabHandler('activity.scan');
    },
    methods: {
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
      loadBottom() {
        setTimeout(() => {
          this.page++;
          this.loadPage(this.page);
          this.$refs.loadmore.onBottomLoaded();
        }, 1500);
      },
      loadPage(page){
        var postData = {
          token: this.token,
          dealerCode:'',
//          dealerCode: this.code,//,  'C0101'
          page:page,
          pageSize: 10,
        };
        this.native.apiHandler('XS-BUS-SMQDLB', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            if (resultData.rows.length > 0) {
              this.list.pushs(resultData.rows);
            } else {
              this.allLoaded = true;
              this.toast('加载完毕');
            }
          }
        })
      },
      sign(item, index){
        this.native.grabHandler('activity.scan.sign.'+item.type);
//        this.list.splice(index, 1);
//        this.modalSuccess = true;
         var postData = {
           id: item.id,
         };
        this.native.apiHandler('XS-BUS-SMQD', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            if (resultData) {
              this.current=index;
              this.modalSuccess = true;
            }
          }
        })
      },
      service(){
        this.list.splice(this.current,1);
        this.$router.push({name: 'service', query: {type: 4}});
      },
      cancel(){
        this.modalSuccess=false;
        location.reload();
      }
    },
  }
</script>
<style lang="less" scoped>
  @import "scan.less";
</style>

