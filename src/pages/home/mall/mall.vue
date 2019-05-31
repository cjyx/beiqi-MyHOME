<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='false'>
      <router-link slot="left" :to="{ name: 'activity'}" v-if="this.$route.query.toMall=='activity'">
        <i class="iconfont icon-left"></i>
      </router-link>
      <router-link slot="left" :to="{ name: 'home'}" v-if="this.$route.query.toMall!='activity'">
        <i class="iconfont icon-left"></i>
      </router-link>
    </head-bar>
    <div class="main-content">
      <div class="btn-tab">
        <button :class="{'active':selected==1}" @click="selected=1,screenBtn=false,showBtn=false">实物商品</button>
        <button :class="{'active':selected==2}" @click="selected=2,screenBtn=false,showBtn=false">代金券</button>
      </div>
      <div class="screen">
          <span @click="screenBtn=true,showBtn=false">
            <!--积分筛选-->
            {{scoreName}}
            <i class="iconfont icon-down-fill" v-if="screenBtn==false"></i>
            <i class="iconfont icon-up-fill" v-if="screenBtn==true"></i>
          </span>
        <span @click="showBtn=true,screenBtn=false">
            <!--排序方式-->
            {{orderName}}
            <i class="iconfont icon-down-fill" v-if="showBtn==false"></i>
            <i class="iconfont icon-up-fill" v-if="showBtn==true"></i>
          </span>
        <mask-bar :maskHeader="3" v-if="screenBtn" @onHide="screenBtn=false">
          <div class="scree-list" v-if="screenBtn" slot="content">
            <ul class="">
              <li v-for="(item,index) in scoreList" :key="index" :class="active==index ? 'change-bg' : ''"
                  @click="scoreBtn(index)">{{item.name}}
              </li>
            </ul>
          </div>
        </mask-bar>
        <mask-bar :maskHeader="3" v-if="showBtn" @onHide="showBtn=false">
          <div class="scree-list" v-if="showBtn" slot="content">
            <ul>
              <li v-for="(item,index) in shopList" :key="index" :class="activeGoods==index ? 'change-bg' : ''"
                  @click="goodsBtn(index)">{{item}}
              </li>
            </ul>
          </div>
        </mask-bar>
      </div>
      <div v-if="selected==1" class="tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :autoFill="false" :bottom-method="goodsLoad" :bottom-all-loaded="goodsAllLoaded"
                     ref="loadmoreGoods" @bottom-status-change="handleBottomChange">
          <ul class="page-loadmore-list group-list">
            <li v-for="(item,index) in goodsList" :key="index">
              <a @click.stop.prevent="detial(item.id,0)">
                <img :src="item.img">
                <div class="content">
                  <div class="goods-list">
                    <h2>{{item.commodityName}}</h2>
                    <!--库存{{item.stock}}-->
                    <!--<p class="gray">官方指导价:{{item.price}}元</p>-->
                  </div>
                  <div class="goods-list">
                    <div>
                      <span v-if="item.needScore==0"><i>现积分:{{item.presendScore}}积分</i></span>
                      <span class="old" v-if="item.needScore==0">原积分:{{item.origScore}}积分</span>
                      <span v-if="item.needScore!=0">所需积分:{{item.needScore}}积分</span>
                    </div>
                    <a @click.stop="joinCar(item.id)">
                      <i class="iconfont icon-cart"></i>
                    </a>
                  </div>
                </div>
              </a>
            </li>
          </ul>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
            <span v-show="bottomStatus === 'loading'">
            <mt-spinner type="snake"></mt-spinner>
          </span>
          </div>
        </mt-loadmore>
        <!--car star-->
        <div class="integral-car" @click.stop="shopCar">
          <i class="iconfont icon-cart-add"></i>
          <span v-show="carNumShow && carNum!=''">{{carNum}}</span>
        </div>
        <!--car end-->
      </div>
      <div v-if="selected==2" class="tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :autoFill="false" :bottom-method="cashLoad" :bottom-all-loaded="cashAllLoaded" ref="loadmoreCash"
                     @bottom-status-change="handleBottomChange">
          <ul class="page-loadmore-list group-list">
            <li v-for="(item,index) in cashList" :key="index">
              <a @click.stop.prevent="detial(item.id,1)">
                <img :src="item.img">
                <div class="content">
                  <p class="cash-coupon">
                    <span>{{item.commodityName}}</span>
                  </p>
                  <div class="goods-list cash-coupon-center">
                    <div>
                      <!--<span><i>{{item.presendScore}}</i>积分</span>-->
                      <!--&lt;!&ndash;类型{{item.couponUseType}}库存{{item.stock}}&ndash;&gt;-->
                      <!--<span class="old" v-if="item.presendScore!=item.origScore">{{item.origScore}}积分</span>-->
                      <span v-if="item.needScore==0"><i>现积分:{{item.presendScore}}积分</i></span>
                      <span class="old" v-if="item.needScore==0">原积分:{{item.origScore}}积分</span>
                      <span v-if="item.needScore!=0">所需积分:{{item.needScore}}积分</span>
                    </div>
                  </div>
                  <p class="cash-coupon-bottom" v-if="item.startDate!=undefined">
                    {{ item.startDate | dateFormat('yyyy-MM-dd')}} 至 {{item.endDate | dateFormat('yyyy-MM-dd')}}
                  </p>
                </div>
                <button class="btn" @click.stop="goToChange(item,item.presendScore,item.couponUseType,item.needScore)">立即兑换</button>
              </a>
            </li>
          </ul>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
            <span v-show="bottomStatus === 'loading'">
              <mt-spinner type="snake"></mt-spinner>
            </span>
          </div>
        </mt-loadmore>
      </div>
      <modal-bar v-if="modalNoScore" :maskHeader="1" :canClose="false" :state="3" @onHide="modalNoScore = false">
        <div slot="modal-main" class="dialog">
          <p>积分不足</p>
          <p>您的积分：{{restScore}}分</p>
          <p>需要积分：{{consume}}分</p>
          <button class="btn next-btn" @click="modalNoScore=false">确定</button>
        </div>
      </modal-bar>

      <modal-bar :maskHeader="2" v-if="modalChange" @onHide="modalChange = false" :state="3">
        <div slot="modal-main">
          <p>消耗积分：
            <span>{{consume}}积分</span>
          <p>确认兑换代金券？</p>
          <div class="modal-btn">
            <a @click="modalChange = false">取消</a>
            <a @click="submit">确定</a>
          </div>
        </div>
      </modal-bar>

      <modal-bar v-if="modalSuccess" :maskHeader="1" :canClose="true" :state="2" @onHide="modalSuccess=false"
                 :content="msg">
      </modal-bar>
    </div>

    <!--登录-->
    <loginPopup v-if="modalLogin" @onHide="modalLogin = false"></loginPopup>

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
        title: '积分商城',
        selected: 1,//切换代金券和实物商品
        wrapperHeight: 0,//下拉高度
        goodsAllLoaded: false,//实物禁止下滑
        cashAllLoaded: false,//代金券禁止下滑
        bottomStatus: '',//下拉状态
        goodsList: [],//实物list
        cashList: [],//代金券list
        scoreList: [//积分筛选
          {name: '所有', from: '', to: ''},
          {name: '0-1000', from: '0', to: '1000'},
          {name: '1000-2000', from: '1000', to: '2000'},
          {name: '2000-3000', from: '2000', to: '3000'},
          {name: '3000-4000', from: '3000', to: '4000'},
          {name: '4000-5000', from: '4000', to: '5000'},
          {name: '5000以上', from: '5000', to: ''},
        ],
        shopList: ['上架时间排序', '积分由低到高', '积分由高到低'],//排序
        scoreName: '积分筛选',
        orderName: '排序方式',
        active: 0,//改变排序背景
        activeGoods: 0,//改变排序背景
        showBtn: false,//筛选列表
        screenBtn: false,//筛选列表
        cashPage: 1,//代金券page
        goodsPage: 1,//实物page
        orderBy: 1,//排序
        activeScore: 0,//判断是不是点的同一个积分
        scoreFrom: '',//积分区间
        scoreTo: '',//积分区间
        carNum: '',//购物车数量
        modalLogin: false,//登录注册弹框
        modalNoScore: false,//积分不足弹框
        restScore: 0,//实物当前积分
        needScore: 0,//实物需要积分
        modalChange: false,//兑换代金券弹框
        clickId: '',//点击代金券id
        modalSuccess: false,//判断库存不足弹框
        msg: '',//库存不足提示信息
        carNumShow:true,
        discount:0,
        consume:0,
        tbload: false,
      }
    },
    computed: {
      ...mapState([
        'token'
      ])
    },
    mounted() {
      this.wrapperHeight = document.documentElement.clientHeight - 44 * 3;
      this.init(0, 1);
      this.init(1, 1);
      if (this.token == '') {
//        this.toast('请您登录使用');
//        this.modalLogin=true;
        this.carNumShow=false;
      } else {
        this.goodsNum();
        this.getScore();
        this.getDiscount();
        this.native.grabHandler('home.mall');
      }
    },
    methods: {
      init(type, page){
        var postData = {
          commodityType: type,
          order: this.orderBy,
          page: page,
          pageSize: 10,
          scoreFrom: this.scoreFrom,
          scoreTo: this.scoreTo,
        };
        this.native.apiHandler('XS-MAL-SPLB', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            if (type == 0) {
              if (response.body.resultData.length > 0) {
                this.goodsList.pushs(response.body.resultData);
              } else {
                this.goodsAllLoaded = true;
                this.toast('加载完毕');
              }
            } else if (type == 1) {
              if (response.body.resultData.length > 0) {
                this.cashList.pushs(response.body.resultData);
              } else {
                this.cashAllLoaded = true;
                this.toast('加载完毕');
              }
            }
          }
        })
      },
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
//      下拉刷新
      cashLoad() {
        this.tbload = true;
        this.cashPage++;
        setTimeout(() => {
          this.init(1, this.cashPage);
          this.$refs.loadmoreCash.onBottomLoaded();
          this.tbload = false;
        }, 1500);
      },
      goodsLoad(){
        this.tbload = true;
        this.goodsPage++;
        setTimeout(() => {
          this.init(0, this.goodsPage);
          this.$refs.loadmoreGoods.onBottomLoaded();
          this.tbload = false;
        }, 1500);
      },
//      排序
      goodsBtn(index){
        this.activeGoods = index;
        this.showBtn = false;
        this.orderName = this.shopList[index];
        if (index + 1 == this.orderBy) {
          return;
        } else {
          this.orderBy = index + 1;
          this.common();
        }
      },
      scoreBtn(index){
        this.native.grabHandler('home.mall.score');
        this.active = index;
        this.screenBtn = false;
        this.scoreName = this.scoreList[index].name;
        this.scoreFrom = this.scoreList[index].from;
        this.scoreTo = this.scoreList[index].to;
        if (this.activeScore == index) {
          return;
        } else {
          this.activeScore = index;
          this.common();
        }
      },
      common(){
        this.goodsAllLoaded = false;
        this.cashAllLoaded = false;
        this.goodsList = [];
        this.cashList = [];
        this.goodsPage = 1;
        this.cashPage = 1;
        this.init(0, 1);
        this.init(1, 1);
      },
//      加入购物车
      joinCar(id){
        this.native.grabHandler('home.mall.joinCar.'+id);
        if (this.token == '') {
          this.modalLogin = true;
        } else {
          var carData = {
            amount: 1,
            commodityId: id,
            token: this.token
          };
          this.native.apiHandler('XS-MAL-GWCJR', carData, (res) => {
            let response = this.convert(res);
            if (response.body.isSuccessful == true) {
              if (response.body.resultData == 1) {
                this.toast('加入购物车成功');
                this.goodsNum();
              } else {
                this.toast('加入购物车失败');
              }
            }
          })
        }
      },
//      跳转详情
      detial(id, type){
        if (this.tbload == true) {
          return false;
        } else {
          this.native.grabHandler('home.mall.detail.'+id);
          if (type == 0) {
            this.$router.push({name: 'goodsDetial', query: {id: id}});
          } else if (type == 1) {
            this.$store.commit('mttSaveDiscount', this.discount);
            this.$router.push({name: 'couponDetial', query: {id: id}});
          }
        }
      },
      shopCar(){
        this.native.grabHandler('home.mall.pushShopCar');
        if (this.token == '') {
          this.modalLogin=true;
        } else {
          this.$router.push({name: 'shopCar'});
        }
      },
//      获取购物车数量
      goodsNum(){
        var numData = {
          token: this.token
        };
        this.native.apiHandler('XS-MAL-GWCSL', numData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            this.carNum = response.body.resultData;
          }
        })
      },
//      去登录注册
      emitLogin(){
        this.$router.push({name: 'login', query: {}});
      },
      emitRegister(){
        this.$router.push({name: 'register', query: {}});
      },
//      代金券兑换
      goToChange(item, score, type,need){
        this.native.grabHandler('home.mall.change.'+item.id);
        if (this.token == '') {
          this.modalLogin = true;
        } else{
            this.bigger(item);
            if(this.consume > this.restScore){
              this.modalNoScore = true;
            }else {
              if (type == 0) {
                this.clickId = item.id;
                this.modalChange = true;
              } else if (type == 1) {
                this.$store.commit('mttSaveDiscount', this.discount);
                this.$router.push({name: 'cashExchange', query: {item: item}});
              }
            }
//            if(need==0){
//                if(this.consume > this.restScore){
//                  this.modalNoScore = true;
//                  this.needScore = score;
//                }else {
//                  if (type == 0) {
//                    this.clickId = item.id;
//                    this.modalChange = true;
//                  } else if (type == 1) {
//                    this.$store.commit('mttSaveDiscount', this.discount);
//                    this.$router.push({name: 'cashExchange', query: {item: item}});
//                  }
//                }
//            }else if(need!=0){
//              if(this.consume > this.restScore){
//                this.modalNoScore = true;
//                this.needScore = need;
//              }else {
//                if (type == 0) {
//                  this.clickId = item.id;
//                  this.modalChange = true;
//                } else if (type == 1) {
//                  this.$store.commit('mttSaveDiscount', this.discount);
//                  this.$router.push({name: 'cashExchange', query: {item: item}});
//                }
//              }
//            }
        }
      },
//     获取剩余积分
      getScore(){
        var scoreData = {
          token: this.token
        };
        this.native.apiHandler('	XS-MAL-SYJF', scoreData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            this.restScore = response.body.resultData;
          }
        })
      },
//      兑换通用代金券
      submit(){
        this.native.grabHandler('home.mall.submit');
        var ticketData = {
          id: this.clickId,
          token: this.token
        };
        this.native.apiHandler('XS-MAL-CJDJQDD', ticketData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            if (response.body.resultData.result == 1) {
              this.modalChange = false;
              this.$router.push({name: 'success', query: {type: 'ticket'}});
            } else {
              this.modalChange = false;
              this.modalSuccess = true;
              this.msg = response.body.resultData.msg;
//              this.toast(response.body.resultData.msg);
            }
          }
        })
      },
//      查询用户等级折扣
      getDiscount(){
        var discountData = {
          token: this.token
        };
        this.native.apiHandler('XS-BUS-YHZK', discountData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            this.discount = response.body.resultData.discount;
          }
        })
      },
      //折扣比较
      bigger(item){
        if(this.discount==0||this.discount==undefined){
          if(item.needScore==0){
            this.consume = item.presendScore;
          }else {
            this.consume = item.needScore;
          }
        }else if(this.discount!=0&&this.discount!=undefined){
          if(item.needScore==0){
            if(item.presendScore<=Math.round(item.origScore*this.discount/10)){
              this.consume = item.presendScore;
            }else {
              this.consume = Math.round(item.origScore*this.discount/10);
            }
          }else {
            this.consume = Math.round(item.needScore*this.discount/10);
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../less/article.less";
  @import "mall.less";

  .main-content .integral-car[data-v-24e61833] {
    bottom: 3rem;
  }
</style>
