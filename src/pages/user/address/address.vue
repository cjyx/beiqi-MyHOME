<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
      <a @click="redirect('addressAdd')" slot="right">添加</a>
    </head-bar>
    <div class="main-content">
      <div class="address-content">
        <div class="address-group" v-for="(item,index) in list" :key="item.id" v-if="modalEmpty==false">
          <div class="user" @click="selected(item)">
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
              <label>默认地址</label>
            </div>
            <div class="btn">
              <a @click="redirect('addressEdit',item.id,item.province+'-'+item.city)">编辑 </a>
              <a @click="deleteAddress(item,index)">删除</a>
            </div>
          </div>
        </div>
      </div>
      <!--空白页-->
      <empty-page v-if="modalEmpty"></empty-page>
    </div>
    <mask-bar :maskHeader="2" v-if="modalDel" @onHide="modalDel = false"></mask-bar>
    <mask-bar :maskHeader="2" v-if="modalDef" @onHide="modalDef = false"></mask-bar>
    <modal-bar v-if="modalDel" @onHide="modalDel = false" :state="1" :content="'是否删除该地址'"
               :cancelText="'取消'" @onCancel="modalDel = false"
               :okText="'确定'" @onOk="emitDelOk">
    </modal-bar>
    <modal-bar v-if="modalDef" @onHide="modalDef = false" :state="1" :content="'是否设置该地址为默认地址'"
               :cancelText="'取消'" @onCancel="modalDef = false"
               :okText="'确定'" @onOk="emitDefOk">
    </modal-bar>
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
        modalDel: false,
        modalDef: false,
        from: this.$route.query.type,//來源（order:選擇地址）
        currItem: {},
        currIndex: 0,
        list: [],
        modalEmpty:false
      }
    },
    computed: {
      ...mapState([
        'token', 'selAddress'
      ])
    },
    mounted(){
      this.native.grabHandler('user.information.address');
      this.init();
    },
    methods: {
//    删除地址
      emitDelOk(){
        var postData = {
          id: this.currItem.id,
          token: this.token,
        };
        this.native.apiHandler('XS-VEH-DZSC', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            if (resultData) {
              if (this.selAddress.id == this.currItem.id) {
                this.$store.commit('mttSaveSelAddress', {});
              }
              this.list.splice(this.currIndex, 1);
              this.modalDel = false;
              this.toast('删除地址成功');
            }
          }
        })
      },
      emitDefOk(){

      },
      selected(item){
        if (this.from == 'order') {
          this.$store.commit('mttSaveSelAddress', item);
//              this.$router.push({name:'order'});
          this.$router.go(-1);
        }
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
      /**删除用户地址信息*/
      deleteAddress(item, index){
        this.native.grabHandler('user.information.address.delete');
        this.modalDel = true;
        this.currItem = item;
        this.currIndex = index;
      },
      /**设置用户默认地址*/
      defAddress(item){
        this.native.grabHandler('user.information.address.default');
        var postData = {
          id: item.id,
          token: this.token,
          status: '1'
        };
        this.native.apiHandler('XS-VEH-MRDZ', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            if (resultData) {
              this.$store.commit('mttSaveDefAddress', item);
              this.toast('设置默认地址成功');
            }
          }
        })
      },
      redirect(path,id,cityName) {
        this.native.grabHandler('user.information.address.'+path);
        this.$router.push({ name: path, query: {id:id,cityName:cityName}});
      },
    }
  }
</script>
<style lang="less" scoped>
  @import "address.less";
</style>
