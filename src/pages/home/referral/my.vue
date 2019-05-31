<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <div class="btn-tab">
        <button :class="{'active':selected==1}" @click="selected=1">我要推荐</button>
        <button :class="{'active':selected==0}" @click="selected=0">我已推荐</button>
      </div>
      <div v-show="selected==1" class="tabs-1" ref="wrapper1" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :autoFill="false" :bottom-method="introduceLoad" :bottom-all-loaded="introduceAllLoaded"
                     ref="introduceMore" v-if="introduceEmpty==false">
          <ul class="myReferral" v-for="(item,index) in introduceList" :key="index">
            <li>
              <div class="content">
                <div class="bottom">
                  <p>推荐时间:{{item.createTime}}</p>
                  <p>
                    {{reviewStatus[item.ReviewStatus]}}
                    <span v-if="item.ReviewStatus==1 && item.ReviewResult==1 && item.purchaseStatus==0"> - 未购车</span>
                    <span v-if="item.ReviewStatus==1 && item.ReviewResult==1 && item.purchaseStatus==1"> - 已购车</span>
                  </p>
                </div>
                <div class="myDetail">
                  <p><b>{{item.name}}</b>{{item.mobile}}</p>
                  <p v-if="item.ReviewStatus==1">下发经销商名称：{{item.dealerName}}</p>
                  <p v-if="item.ReviewStatus==0">填写经销商名称：{{item.dealerName}}</p>
                  <p>意向车型：{{item.carName}}</p>
                  <p>购车预算：{{budgetMessage[item.budget]}}</p>
                </div>
                <div class="bottom bor" v-show="item.ReviewStatus==1">
                  <span v-if="item.purchaseStatus==1&&item.effectiveCar==1">+{{item.score}}积分</span>
                  <button class="goods-button" v-if="item.ReviewStatus==1 && item.ReviewResult!=1" @click="lookUp(item)">查看</button>
                </div>
              </div>
            </li>
          </ul>
        </mt-loadmore>
        <!--空白页-->
        <empty-page v-if="introduceEmpty"></empty-page>
      </div>
      <div v-show="selected==0" class="tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :autoFill="false" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" v-if="modalEmpty==false">
          <ul class="myReferral" v-for="(item,index) in list" :key="index">
            <li>
              <div class="content">
                <div class="bottom title">
                  <p>推荐时间:{{item.createTime}}</p>
                  <span>{{status[item.status]}}</span>
                </div>
                <div class="myDetail">
                  <p><b>{{item.introduceTo}}</b>{{item.mobile}}</p>
                  <p>意向车型：{{item.brandCarType}}</p>
                  <p>VIN码：{{item.vin}}</p>
                </div>
                <div class="bottom bor" v-show="item.status!=0">
                  <button class="goods-button" v-if="item.status==2" @click="unAgreelook(item)">查看</button>
                  <span v-if="item.status==1">+{{item.score}}积分</span>
                </div>
              </div>
            </li>
          </ul>
        </mt-loadmore>
        <!--空白页-->
        <empty-page v-if="modalEmpty"></empty-page>
      </div>
    </div>
    <modal-bar v-if="modalSuccess" :maskHeader="1" :canClose="true" :state="2" @onHide="modalSuccess=false"
               :content="PromptText">
    </modal-bar>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        title: '我的推荐',
        modalSuccess: false,
        PromptText: '失败原因',
        allLoaded: false,
        introduceAllLoaded: false,
        wrapperHeight: 0,
        page: 1,
        introducePage: 1,
        list: [],
        introduceList: [],
        selected: 1,
        status:['待审核', '已通过','已拒绝'],
        reviewStatus: ['待回访', '已回访'],
        reviewMessage: ['未回访', '可下发', '意向购车人无购车意向', '意向购车人电话无法接通', '意向购车人电话号码空号错号'],
        budgetMessage: ['5-10万', '10-15万', '15-20万', '20万以上'],
        introduceEmpty:false,
        modalEmpty:false,
      }
    },
    computed: {
      ...mapState([
        'token'
      ])
    },
    mounted(){
      this.native.grabHandler('home.referralTo.myReferral');
      this.wrapperHeight = document.documentElement.clientHeight - 44 * 2;
      this.init(this.page);
      this.introduceInit(this.introducePage);
    },
    methods: {
      /*我已推荐**/
      init(page){
        var postData = {
          page: page,
          pageSize: 10,
          token: this.token
        };
        this.native.apiHandler('XS-BUS-WYZJSLB', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            if (resultData.length > 0) {
              this.list.pushs(resultData);
            } else if(this.list.length==0){
              this.modalEmpty=true;
              return;
            } else {
              this.toast('加载完成');
              this.allLoaded = true;
            }

          }
        })
      },
      /*我要推荐**/
      introduceInit(page){
        var introduceData = {
          page: page,
          pageSize: 10,
          token: this.token
        };
        this.native.apiHandler('XS-JS-ZWYZJSLB', introduceData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            if (resultData.rows.length > 0) {
              this.introduceList.pushs(resultData.rows);
            } else if(this.introduceList.length==0){
              this.introduceEmpty=true;
              return;
            } else {
              this.toast('加载完成');
              this.introduceAllLoaded = true;
            }
          }
        })
      },
      loadBottom() {
        this.page++;
        setTimeout(() => {
          this.init(this.page);
          this.$refs.loadmore.onBottomLoaded();
        }, 1500);
      },
      introduceLoad() {
        this.introducePage++;
        setTimeout(() => {
          this.introduceInit(this.introducePage);
          this.$refs.introduceMore.onBottomLoaded();
        }, 1500);
      },
      unAgreelook(item){
        this.native.grabHandler('home.referralTo.myReferral.unAgreelook');
        this.modalSuccess = true;
        this.PromptText=item.failedReason;
      },
      lookUp(item){
        this.native.grabHandler('home.referralTo.myReferral.lookUp');
        this.modalSuccess = true;
        this.PromptText=this.reviewMessage[item.ReviewResult];
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "referral.less";

  .main-content {
    background: @bg-color-base;
  }
</style>
