<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
      <a @click="redirectAdd('dealerAdd')" slot="right">添加经销商</a>
    </head-bar>
    <div class="main-content">
      <ul class="page-loadmore-list caption-group" v-if="modalEmpty==false">
        <li v-for="(item,index) in dealerList" :key="index">
          <div class="name">
            <i class="iconfont icon-line-v"></i>
            <div>
              <h3 @click="maskMakeBtn(item)">{{item.companyName}}</h3>
              <span @click="deleteModal(item,index)">删除</span>
            </div>
          </div>
          <div class="content">
            <div class="address" @click="maskMakeBtn(item)">
              <div v-if="item.serviceAddress!=item.saleAddress">
                <p v-if="item.saleAddress">销售地址：{{item.saleAddress}}</p>
                <p v-if="item.serviceAddress">服务地址：{{item.serviceAddress}}</p>
              </div>
              <p v-if="item.serviceAddress==item.saleAddress">销售/服务地址:{{item.saleAddress}}</p>
            </div>
            <div class="list">
              <div class="option" @click="dealerDefault(item,index)">
                <input type="radio" name="dealer" value="1" v-model="item.status">
                <span></span>
                <label>默认经销商</label>
              </div>
              <a @click="maskHereBtn(item)"><i class="iconfont icon-location"></i> 去这里</a>
              <a @click="maskiPhone(item)"><i class="iconfont icon-phone"></i> 打电话</a>
            </div>
          </div>
        </li>
      </ul>
      <empty-page v-if="modalEmpty"></empty-page>
    </div>
    <!--phone star-->
    <mask-bar :maskHeader="1" v-if="maskPhone" @onHide="emitState"></mask-bar>
    <transition name="fade-up">
      <div class="db-phone" v-if="maskPhone">
        <div>
          <p v-if="current.saleTel" @click="confirmPhone(current.saleTel)">销售热线：{{current.saleTel}}</p>
          <p v-if="current.serviceTel" @click="confirmPhone(current.serviceTel)">服务热线：{{current.serviceTel}}</p>
          <p v-if="current.rescueTel" @click="confirmPhone(current.rescueTel)">救援热线：{{current.rescueTel}}</p>
        </div>
        <button @click="maskHide">取消</button>
      </div>
    </transition>
    <modal-bar v-if="modalPhone" :maskHeader="1" :canClose="true" :state="1" @onHide="modalPhone = false"
               :content="currPhone"
               :cancelText="'取消'" @onCancel="modalPhone=false"
               :okText="'呼叫'" @onOk="callPhone(currPhone)">
    </modal-bar>
    <!--phone end-->
    <!--goHere  star-->
    <mask-bar :maskHeader="1" v-if="maskHere" @onHide="emitState"></mask-bar>
    <transition name="fade-up">
      <div class="db-phone" v-if="maskHere">
        <div>
          <p v-if="current.saleAddress" @click.stop="saleAddress(dealerList)">销售地址</p>
          <p v-if="current.serviceAddress" @click.stop="serviceAddress(dealerList)">服务地址</p>
        </div>
        <button @click="maskHide">取消</button>
      </div>
    </transition>
    <!--goHere  end-->
    <!--make  star-->
    <mask-bar :maskHeader="1" v-if="maskMake" @onHide="emitState"></mask-bar>

    <transition name="fade-up">
      <div class="db-phone" v-if="maskMake">
        <div>
          <p @click="maintain()" v-if="toContent.serviceAddress">保养预约</p>
          <p v-if="toContent.saleAddress" @click="redirect('testDrive')">试乘试驾</p>
        </div>
        <button @click="maskHide">取消</button>
      </div>
    </transition>
    <!--确定删除经销商-->
    <modal-bar :maskHeader="2" v-if="deleteDealer" @onHide="deleteDealer = false" :state="1" :content="'确定删除？'"
               :cancelText="'取消'" @onCancel="deleteDealer = false"
               :okText="'确定'" @onOk="dealerDelete()">
    </modal-bar>
    <!--车主认证-->
    <bindPopup v-if="modalBind" @onHide="modalBind = false" @onCancel="modalBind=false"></bindPopup>
    <!--make  end-->
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
        title: '我的经销商',
        dealerList: [],
        maskPhone: false,
        maskHere: false,
        maskMake: false,
        modalPhone: false,
        modalBind:false,
        modalEmpty:false,
        currPhone: '',
        current: {},
        toContent:{},
        deleteDealer:false,//确定删除经销商
        delItem:{},
        delIndex:0,
      }
    },
    computed: {
      ...mapState([
        'token','carCount','unaudited'
      ])
    },
    mounted(){
      this.native.grabHandler('user.userDealer');
      this.init();
    },
    methods: {
      init(){
        var postData = {
          page: 1,
          pageSize: 50,
          token: this.token
        };
        this.native.apiHandler('XS-VEH-WDCS', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            this.dealerList = response.body.resultData.rows;
            if(this.dealerList.length==0){
              this.modalEmpty=true;
            }
          }
        })
      },
      //热线电话
      maskiPhone(item){
        this.native.grabHandler('user.userDealer.toCall');
        this.maskPhone = true;
        this.current = item;
      },
      confirmPhone(phone){
        this.modalPhone = true;
        this.maskPhone = false;
        this.currPhone = phone;
      },
      callPhone(phone){
        var postData = {
          str: phone,
          type: 1
        }
        this.native.nativeHandler(postData, (res) => {
        })
      },
      //点击去这里显示服务地址和销售地址
      maskHereBtn(item){
        this.native.grabHandler('user.userDealer.tohere');
        this.maskHere = true;
        this.current = item;
      },
      //销售地址
      saleAddress(item){
        this.native.mapHandler(item.saleLng, item.saleLat, item.saleAddress, (res) => {
        })
      },
      //服务地址
      serviceAddress(item){
        this.native.mapHandler(item.serviceLng, item.serviceLat, item.serviceAddress, (res) => {
        })
      },
      //保养预约
      maskMakeBtn(item){
        this.maskMake = true;
        this.toContent = item;
      },
      emitState(state){
        this.maskPhone = false;
        this.maskHere = false;
        this.maskMake = false;
      },
      maskHide(){
        this.maskPhone = false;
        this.maskMake = false;
        this.maskHere = false;
      },
      maintain(){
        this.native.grabHandler('user.userDealer.maintain');
        if (this.carCount ==0) {
          this.modalBind = true;
          this.maskMake=false;
          return;
        }
        if (this.unaudited == 0) {
          this.toast('车辆正在认证中，认证通过可使用此功能');
          return;
        }
        let provincesName = area.getProvinceByCode(this.toContent.provinceCode);
        let cityName;
        let cityCode;
        if(this.toContent.provinceCode==110000 || this.toContent.provinceCode==120000 || this.toContent.provinceCode==500000 || this.toContent.provinceCode==310000){
          cityName = provincesName;
          cityCode = this.toContent.provinceCode;
        }else {
          cityName = area.getCityByCode(this.toContent.cityCode);
          cityCode = this.toContent.cityCode;
        }
        this.$router.push({name: 'maintain', query: {'dealerName':this.toContent.companyName,'dealerId':this.toContent.id,'province':provincesName.name,'city':cityName.name,'cityCode':cityCode}});
      },
      //删除经销商
      dealerDelete(){
        var postData = {
          dealerCode: this.delItem.dealerCode,
          token: this.token
        }
        this.native.apiHandler('XS-VEH-SCCS', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            if (response.body.resultData == 0) {
              this.toast('删除失败');
            } else if (response.body.resultData == 1) {
              this.dealerList.splice(this.delIndex, 1);
              this.toast('删除成功');
            }
            this.deleteDealer = false;
          }
        });
      },
      //设置默认经销商
      dealerDefault(item, index){
        this.native.grabHandler('user.userDealer.default');
        var postData = {
          dealerCode: item.dealerCode,
          status: 1,
          token: this.token
        };
        this.native.apiHandler('XS-VEH-XGMR', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            if (response.body.resultData == 0) {
              this.toast('设置默认经销商失败');
            } else if (response.body.resultData == 1) {
              this.toast('设置默认经销商成功');
            }
          }
        });
      },
      //跳转路径
      redirect(path){
        this.native.grabHandler('user.userDealer.'+path);
        let provincesName = area.getProvinceByCode(this.toContent.provinceCode);
        let cityName;
        let cityCode;
        if(this.toContent.provinceCode==110000 || this.toContent.provinceCode==120000 || this.toContent.provinceCode==500000 || this.toContent.provinceCode==310000){
          cityName = provincesName;
          cityCode = this.toContent.provinceCode;
        }else {
          cityName = area.getCityByCode(this.toContent.cityCode);
          cityCode = this.toContent.cityCode;
        }
        this.$router.push({name: path, query: {'dealerName':this.toContent.companyName,'dealerId':this.toContent.id,'province':provincesName.name,'city':cityName.name,'cityCode':cityCode}});
      },
      deleteModal(item,index){
        this.native.grabHandler('user.userDealer.delete');
        this.deleteDealer = true;
        this.delItem = item;
        this.delIndex = index;
      },
      redirectAdd(path) {
        this.native.grabHandler('user.userDealer'+path);
        this.$router.push({ name: path, query: {} });
      },
    }
  }
</script>
<style lang="less" scoped>
  @import "dealer.less";
</style>

