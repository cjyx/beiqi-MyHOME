<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'></head-bar>
    <div class="main-content">
      <div class="btn-tab">
        <button :class="{'active':selected==1}" @click="selected=1">全部</button>
        <button :class="{'active':selected==2}" @click="selected=2">待确认</button>
        <button :class="{'active':selected==3}" @click="selected=3">待服务</button>
        <button :class="{'active':selected==4}" @click="selected=4">待评价</button>
      </div>
      <!--全部-->
      <div v-show="selected==1" class="tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :autoFill="false" :bottom-method="loadBottomAll" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoadedAll" ref="loadmoreAll" v-if="enmtyOne==false">
          <ul class="page-loadmore-list service-list">
            <li v-for="(item,index) in listAll" :key="index">
              <div v-if="item.type==2" @click="detial('serviceRescue',item.id)">
                <h3>紧急救援</h3>
                <p>拨打时间：{{item.createTime}}</p>
                <p>拨打电话： {{item.rescueTel}}</p>
                <p>救援经销商：{{item.dealerName}}</p>
                <p>救援地址：{{item.rescueAddress}}</p>
                <p><span>订单状态：{{statusArray[item.status]}}</span><a v-if="item.status=='3'" @click.stop="modalCommentShow(item)">评价</a></p>
              </div>
              <div v-if="item.type==1" @click="detial('serviceMaintain',item.id)">
                <h3>到店保养预约</h3>
                <p>提交日期： {{item.createTime}}</p>
                <p>预约日期： {{item.maintTime}}</p>
                <p>车型： {{item.nodels}}</p>
                <p>预约经销商：{{item.dealerName}}</p>
                <p><span>订单状态：{{statusArray[item.status]}}</span><a v-if="item.status=='3'" @click.stop="modalCommentShow(item)">评价</a></p>
              </div>
              <div v-if="item.type==0" @click="detial('serviceTestDrive',item.id)">
                <h3>试乘试驾</h3>
                <p>提交日期： {{item.createTime}}</p>
                <p>预约日期： {{item.maintTime}}</p>
                <p>车型： {{item.nodels}}</p>
                <p>预约经销商：{{item.dealerName}}</p>
                <p><span>订单状态：{{statusArray[item.status]}}</span><a v-if="item.status=='3'" @click.stop="modalCommentShow(item)">评价</a></p>
              </div>
              <div v-if="item.type==3" @click="detial('serviceToDoor',item.id)">
                <h3>上门服务预约</h3>
                <p>提交日期： {{item.createTime}}</p>
                <p>预约日期：  {{item.maintTime}}</p>
                <p>服务内容： {{item.dtdServices}}</p>
                <p>预约经销商：{{item.dealerName}}</p>
                <p><span>订单状态：{{statusArray[item.status]}}</span><a v-if="item.status=='3'" @click.stop="modalCommentShow(item)">评价</a></p>
              </div>
            </li>
          </ul>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
            <span v-show="bottomStatus === 'loading'">
            <mt-spinner type="snake"></mt-spinner>
          </span>
          </div>
        </mt-loadmore>
        <!--空白页-->
        <empty-page v-if="enmtyOne"></empty-page>
      </div>
      <!--待确认-->
      <div v-show="selected==2" class="tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :autoFill="false" :bottom-method="loadBottomConfirm" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoadedConfirm" ref="loadmoreConfirm" v-if="enmtyTwo==false">
          <ul class="page-loadmore-list service-list">
            <li v-for="(item,index) in listConfirm" :key="index">
              <div v-if="item.type==2" @click="detial('serviceRescue',item.id)">
                <h3>紧急救援</h3>
                <p>拨打时间：{{item.createTime}}</p>
                <p>拨打电话：{{item.rescueTel}}</p>
                <p>救援经销商：{{item.dealerName}}</p>
                <p>救援地址：{{item.rescueAddress}}</p>
                <p><span>订单状态：{{statusArray[item.status]}}</span><a v-if="item.status=='3'" @click.stop="modalCommentShow(item)">评价</a></p>
              </div>
              <div v-if="item.type==1" @click="detial('serviceMaintain',item.id)">
                <h3>到店保养预约</h3>
                <p>提交日期： {{item.createTime}}</p>
                <p>预约日期： {{item.maintTime}}</p>
                <p>车型： {{item.nodels}}</p>
                <p>预约经销商：{{item.dealerName}}</p>
                <p><span>订单状态：{{statusArray[item.status]}}</span><a v-if="item.status=='3'" @click.stop="modalCommentShow(item)">评价</a></p>
              </div>
              <div v-if="item.type==0" @click="detial('serviceTestDrive',item.id)">
                <h3>试乘试驾</h3>
                <p>提交日期： {{item.createTime}}</p>
                <p>预约日期： {{item.maintTime}}</p>
                <p>车型： {{item.nodels}}</p>
                <p>预约经销商：{{item.dealerName}}</p>
                <p><span>订单状态：{{statusArray[item.status]}}</span><a v-if="item.status=='3'" @click.stop="modalCommentShow(item)">评价</a></p>
              </div>
              <div v-if="item.type==3" @click="detial('serviceToDoor',item.id)">
                <h3>上门服务预约</h3>
                <p>提交日期： {{item.createTime}}</p>
                <p>预约日期：  {{item.maintTime}}</p>
                <p>服务内容： {{item.dtdServices}}</p>
                <p>预约经销商：{{item.dealerName}}</p>
                <p><span>订单状态：{{statusArray[item.status]}}</span><a v-if="item.status=='3'" @click.stop="modalCommentShow(item)">评价</a></p>
              </div>
            </li>
          </ul>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
            <span v-show="bottomStatus === 'loading'">
            <mt-spinner type="snake"></mt-spinner>
          </span>
          </div>
        </mt-loadmore>
        <!--空白页-->
        <empty-page v-if="enmtyTwo"></empty-page>
      </div>
      <!--待服务-->
      <div v-show="selected==3" class="tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :autoFill="false"  :bottom-method="loadBottomService" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoadedService" ref="loadmoreService" v-if="enmtyThree==false">
          <ul class="page-loadmore-list service-list">
            <li v-for="(item,index) in listService" :key="index">
              <div v-if="item.type==2" @click="detial('serviceRescue',item.id)">
                <h3>紧急救援</h3>
                <p>拨打时间：{{item.createTime}}</p>
                <p>拨打电话： {{item.rescueTel}}</p>
                <p>救援经销商：{{item.dealerName}}</p>
                <p>救援地址：{{item.rescueAddress}}</p>
                <p><span>订单状态：{{statusArray[item.status]}}</span><a v-if="item.status=='3'" @click.stop="modalCommentShow(item)">评价</a></p>
              </div>
              <div v-if="item.type==1" @click="detial('serviceMaintain',item.id)">
                <h3>到店保养预约</h3>
                <p>提交日期： {{item.createTime}}</p>
                <p>预约日期： {{item.maintTime}}</p>
                <p>车型： {{item.nodels}}</p>
                <p>预约经销商：{{item.dealerName}}</p>
                <p><span>订单状态：{{statusArray[item.status]}}</span><a v-if="item.status=='3'" @click.stop="modalCommentShow(item)">评价</a></p>
              </div>
              <div v-if="item.type==0" @click="detial('serviceTestDrive',item.id)">
                <h3>试乘试驾</h3>
                <p>提交日期： {{item.createTime}}</p>
                <p>预约日期： {{item.maintTime}}</p>
                <p>车型： {{item.nodels}}</p>
                <p>预约经销商：{{item.dealerName}}</p>
                <p><span>订单状态：{{statusArray[item.status]}}</span><a v-if="item.status=='3'" @click.stop="modalCommentShow(item)">评价</a></p>
              </div>
              <div v-if="item.type==3" @click="detial('serviceToDoor',item.id)">
                <h3>上门服务预约</h3>
                <p>提交日期： {{item.createTime}}</p>
                <p>预约日期：  {{item.maintTime}}</p>
                <p>服务内容： {{item.dtdServices}}</p>
                <p>预约经销商：{{item.dealerName}}</p>
                <p><span>订单状态：{{statusArray[item.status]}}</span><a v-if="item.status=='3'" @click.stop="modalCommentShow(item)">评价</a></p>
              </div>
            </li>
          </ul>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
            <span v-show="bottomStatus === 'loading'">
            <mt-spinner type="snake"></mt-spinner>
          </span>
          </div>
        </mt-loadmore>
        <!--空白页-->
        <empty-page v-if="enmtyThree"></empty-page>
      </div>
      <!--待评价-->
      <div v-show="selected==4" class="tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :autoFill="false" :bottom-method="loadBottomComment" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoadedComment" ref="loadmoreComment" v-if="enmtyFour==false">
          <ul class="page-loadmore-list service-list">
            <li v-for="(item,index) in listComment" :key="index">
              <div v-if="item.type==2" @click="detial('serviceRescue',item.id)">
                <h3>紧急救援</h3>
                <p>拨打时间：{{item.createTime}}</p>
                <p>拨打电话：{{item.rescueTel}}</p>
                <p>救援经销商：{{item.dealerName}}</p>
                <p>救援地址：{{item.rescueAddress}}</p>
                <p><span>订单状态：{{statusArray[item.status]}}</span><a v-if="item.status=='3'" @click.stop="modalCommentShow(item)">评价</a></p>
              </div>
              <div v-if="item.type==1" @click="detial('serviceMaintain',item.id)">
                <h3>到店保养预约</h3>
                <p>提交日期： {{item.createTime}}</p>
                <p>预约日期： {{item.maintTime}}</p>
                <p>车型： {{item.nodels}}</p>
                <p>预约经销商：{{item.dealerName}}</p>
                <p><span>订单状态：{{statusArray[item.status]}}</span><a v-if="item.status=='3'" @click.stop="modalCommentShow(item)">评价</a></p>
              </div>
              <div v-if="item.type==0" @click="detial('serviceTestDrive',item.id)">
                <h3>试乘试驾</h3>
                <p>提交日期： {{item.createTime}}</p>
                <p>预约日期： {{item.maintTime}}</p>
                <p>车型： {{item.nodels}}</p>
                <p>预约经销商：{{item.dealerName}}</p>
                <p><span>订单状态：{{statusArray[item.status]}}</span><a v-if="item.status=='3'" @click.stop="modalCommentShow(item)">评价</a></p>
              </div>
              <div v-if="item.type==3" @click="detial('serviceToDoor',item.id)">
                <h3>上门服务预约</h3>
                <p>提交日期： {{item.createTime}}</p>
                <p>预约日期：  {{item.maintTime}}</p>
                <p>服务内容： {{item.dtdServices}}</p>
                <p>预约经销商：{{item.dealerName}}</p>
                <p><span>订单状态：{{statusArray[item.status]}}</span><a v-if="item.status=='3'" @click.stop="modalCommentShow(item)">评价</a></p>
              </div>
            </li>
          </ul>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
            <span v-show="bottomStatus === 'loading'">
            <mt-spinner type="snake"></mt-spinner>
          </span>
          </div>
        </mt-loadmore>
        <!--空白页-->
        <empty-page v-if="enmtyFour"></empty-page>
      </div>
    </div>
    <mask-bar :maskHeader="2" v-if="modalComment" @onHide="modalComment=false">
        <div slot="content" class="star" @click.stop="">
          <p class="star-content">
            <i class="iconfont icon-collected" :class="{ 'star-color': star>=1 }" @click.stop="starShow(1)"></i>
            <i class="" class="iconfont icon-collected" :class="{ 'star-color': star>=2 }" @click.stop="starShow(2)"></i>
            <i class="" class="iconfont icon-collected" :class="{ 'star-color': star>=3 }" @click.stop="starShow(3)"></i>
            <i class="" class="iconfont icon-collected" :class="{ 'star-color': star>=4 }" @click.stop="starShow(4)"></i>
            <i class="" class="iconfont icon-collected" :class="{ 'star-color': star>=5 }" @click.stop="starShow(5)"></i>
          </p>
          <p>评价说明</p>
          <p class="explain">
            <span v-for="(item,index) in list" :key="index" @click.stop="changeStatus(item,index)" :class="item.checked==true ? 'bor' :''">{{item.content}}</span>
            <!--<span v-for="(item,index) in maintain" :key="index" @click="changeStatus(item,index)" :class="item.checked==true ? 'bor' :''">{{item.checked}}</span>-->
          </p>
          <input type="text" class="btn next-btn" placeholder="其他想说" v-model="otherContent" v-if="showOhther" @click.stop="">
          <button class="btn next-btn" @click.stop="commentSubmit">提交</button>
        </div>
    </mask-bar>
    <loading-Bar v-if="loading"></loading-Bar>
    <transition name="slide-left">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
  import Vue from 'vue'
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        title: '我的服务',
        selected: 1,//默认选择全部
        statusArray:['订单提交','订单确认','','订单完成','订单完成','订单取消'],
        listAll:[],//全部列表
        listConfirm:[],//待确认列表
        listService:[],//待服务列表
        listComment:[],//待评论列表
        wrapperHeight:0,//下拉高度
        allLoadedAll: false,//禁止下拉
        allLoadedConfirm: false,//禁止下拉
        allLoadedService: false,//禁止下拉
        allLoadedComment: false,//禁止下拉
        loadAllPage:1,//页码
        loaddConfirmPage:1,//页码
        loadedServicePage:1,//页码
        loadedCommentPage:1,//页码
        bottomStatus: '',//
        star:0,//星星状态
        modalComment:false,//评价弹框
        commentType:'',//评价弹框的类型
        list:[],//评价说明
        dealerInfoId:'',//经销商id
        orderId:'',//订单id
        otherContent:'',//其它想说
        showOhther:false,//其它想说显示
        reasonIds:[],//评论id
        enmtyOne:false,
        enmtyTwo:false,
        enmtyThree:false,
        enmtyFour:false,
        loading:false,
      }
    },
    computed: {
      ...mapState([
        'token'
      ])
    },
    mounted(){
      this.native.grabHandler('user.service.1');
      this.selected = this.$route.query.type;
      this.init(1,0);
      this.init(1,1);
      this.init(1,2);
      this.init(1,3);
      this.wrapperHeight = document.documentElement.clientHeight-44*2;
    },
    methods: {
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
      loadBottomAll() {
        this.loadAllPage++;
        setTimeout(() => {
          this.init(this.loadAllPage,0);
          this.$refs.loadmoreAll.onBottomLoaded();
        }, 1500);
      },
      loadBottomConfirm(){
        this.loaddConfirmPage++;
        setTimeout(() => {
          this.init(this.loaddConfirmPage,1);
          this.$refs.loadmoreConfirm.onBottomLoaded();
        }, 1500);
      },
      loadBottomService(){
        this.loadedServicePage++;
        setTimeout(() => {
          this.init(this.loadedServicePage,2);
          this.$refs.loadmoreService.onBottomLoaded();
        }, 1500);
      },
      loadBottomComment(){
        this.loadedCommentPage++;
        setTimeout(() => {
          this.init(this.loadedCommentPage,3);
          this.$refs.loadmoreComment.onBottomLoaded();
        }, 1500);
      },
      starShow(index){
//        console.log(index);
        this.star = index;
        if(this.star==5){
            this.showOhther = false;
        }else {
            this.showOhther = true;
        }
        this.commentList();
      },
//      获取列表
      init(page,status){
        this.loading = true;
        var postData = {
          page: page,
          pageSize: 10,
          status:status,
          token:this.token,
        };
        this.native.apiHandler('XS-MAL-KCWDFWDD', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
              let rowLength = response.body.resultData.rows.length;
              let rowStatus = response.body.resultData.rows;
              if(status==0){
                if (rowLength > 0) {
                  this.loading = false;
                  this.listAll.pushs(response.body.resultData.rows);
                } else {
                  this.loading = false;
                  this.allLoadedAll = true;
                  this.toast('加载完毕');
                }
                if(this.listAll.length>0){
                  this.enmtyOne = false;
                }else {
                  this.enmtyOne = true;
                }
              }else if(status==1){
                if (rowLength > 0) {
                  this.loading = false;
                  this.listConfirm.pushs(response.body.resultData.rows);
                } else {
                  this.loading = false;
                  this.allLoadedConfirm = true;
                  this.toast('加载完毕');
                }
                if(this.listConfirm.length>0){
                  this.enmtyTwo = false;
                }else {
                  this.enmtyTwo = true;
                }
              }else if(status==2){
                if (rowLength > 0) {
                  this.loading = false;
                  this.listService.pushs(response.body.resultData.rows);
                } else {
                  this.loading = false;
                  this.allLoadedService = true;
                  this.toast('加载完毕');
                }
                if(this.listService.length>0){
                  this.enmtyThree = false;
                }else {
                  this.enmtyThree = true;
                }
              }else if(status==3){
                if (rowLength > 0) {
                  this.loading = false;
                  this.listComment.pushs(response.body.resultData.rows);
                } else {
                  this.loading = false;
                  this.allLoadedComment = true;
                  this.toast('加载完毕');
                }
                if(this.listComment.length>0){
                  this.enmtyFour = false;
                }else {
                  this.enmtyFour = true;
                }
              }
          }
        })
      },
//      获取评价列表
      commentList(){
        var commentData = {
          orderType:this.commentType,
          star:this.star,
        };
        this.native.apiHandler('XS-MAL-HQPJNR', commentData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            this.list = [];
            this.list.pushs(response.body.resultData);
          }
        })
      },
//      提交评价
      commentSubmit(){
        this.native.grabHandler('user.service.submit.'+this.orderId);
        if(this.reasonIds.length==0){
              this.toast('请选择评价理由');
          }else if(this.star==1 || this.star==2 || this.star==3 || this.star==4 || this.star==5){
            var submitData = {
              content:this.otherContent,
              detailCode:this.orderId,
              orderId:this.orderId,
              orderType:this.commentType,
              reasonIds:this.reasonIds,
              star:this.star,
              token:this.token,
            };
            this.native.apiHandler('XS-MAL-BCDDPJ', submitData, (res) => {
              let response = this.convert(res);
              if (response.body.isSuccessful == true) {
                if(response.body.resultData == true){
                  this.toast('提价评价成功');
                  this.modalComment = false;
                  this.loadAllPage=1;this.loaddConfirmPage=1;this.loadedServicePage=1;this.loadedCommentPage=1;
                  this.listAll=[];this.listConfirm=[];this.listService=[];this.listComment=[];
                  this.init(1,0);
                  this.init(1,1);
                  this.init(1,2);
                  this.init(1,3);
                }
              }
            })
          }else{
              this.toast('请选择评价理由');
          }
      },
//      评价弹框显示
      modalCommentShow(item){
          this.otherContent = '';
          this.list = [];
          this.star = 0;
          this.showOhther = false;
          this.modalComment = true;
          this.commentType = item.type;
          this.dealerInfoId = item.dealerInfoId;
          this.orderId = item.id;
      },
//      改变评论列表状态
      changeStatus(item,index){
        if (typeof item.checked == 'undefined') {
          Vue.set(item, "checked", true);
        } else {
          item.checked = !item.checked;
        };
        this.reasonIds = [];
        this.list.forEach((item,index) => {
          if(item.checked==true){
            this.reasonIds.push(item.id);
          }
        });
      },
      detial(name,id){
        this.native.grabHandler('user.service.'+name+'.'+id);
        this.$router.push({name: name, query: {id: id}});
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "service.less";
</style>
