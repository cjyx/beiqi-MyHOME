<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
      <router-link :to="{ name: 'address'}" slot="right">管理</router-link>
    </head-bar>
    <div class="main-content">
      <div class="address-content">
        <div class="address-group" v-for="(item,index) in list" :key="item.id" v-if="modalEmpty==false">
          <div class="user">
            <!--<router-link :to="{ name: 'addressEdit', query: { id: item.id }}">-->
            <div class="name">
              <h3>{{item.name}}<span>{{item.tagName}}</span></h3>
              <span>{{item.tel | phone}}</span>
            </div>
            <p>{{item.province}}{{item.city}} {{item.addressDetail}}</p>
            <!--</router-link>-->
          </div>
          <div class="list">
            <div class="option">
              <input type="radio" name="defAddress" value="1" v-model="item.status" @click="defAddress(item)">
              <span></span>
              <label>收货地址</label>
            </div>
          </div>
        </div>
      </div>
      <!--空白页-->
      <empty-page v-if="modalEmpty"></empty-page>
      <div class="gift-btn">
        <button class="btn next-btn" @click="submit">确定</button>
      </div>
      <modal-bar v-if="modalSuccess" :maskHeader="1" :canClose="false" :state="2" @onHide="modalSuccess = true" :content="'感谢您提交信息，工作人员将为您奉上精美礼品，敬请期待。'" :cancelText="'取消'" @onCancel="$router.push({name:'home'})" :okText="'确定'" @onOk="$router.push({name:'service',query: {type: 1}})">
        <router-link :to="{ name: 'message'}" slot="modal-main">
          <button class="btn next-btn success-btn">完成</button>
        </router-link>
      </modal-bar>
    </div>
    <transition name="slide-left">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        title: '收货地址',
        from: this.$route.query.type,//來源（order:選擇地址）
        currItem: {},
        currIndex: 0,
        list: [],
        modalEmpty:false,
        modalSuccess:false,
        address:{}
      }
    },
    computed: {
      ...mapState([
        'token', 'selAddress'
      ])
    },
    mounted(){
      this.native.grabHandler('home.message.gift');
      this.init();
    },
    methods: {
      emitDefOk(){

      },
      /**加载用户地址信息*/
      init(){
        var postData = {
          token: this.token,
        };
        this.native.apiHandler('XS-VEH-CYDZ', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            this.list = response.body.resultData;;
            if(this.list.length==0){
              this.modalEmpty=true;
            }
          }
        })
      },
      /**设置用户默认地址*/
      defAddress(item){
        this.native.grabHandler('home.message.gift.default');
        this.address = item;
      },
      submit(){
        this.native.grabHandler('home.message.gift.submit');
        var postData = {
          addressId: this.address.id,
          token: this.token,
          orderType: this.$route.query.orderType,
          orderId:this.$route.query.orderId,
        };
        this.native.apiHandler('	XS-MALL-SZSRCBDD', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
              this.modalSuccess = true;
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../user/address/address.less";
  @import "gift.less";
</style>
