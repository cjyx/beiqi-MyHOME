<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
      <a slot="right" @click="edit()" v-if="!editState">编辑</a>
      <a slot="right" @click="editSuccess()" v-if="editState">完成</a>
    </head-bar>
    <div class="main-content">
      <ul class="group-list">
        <li v-for="(item,index) in list" :key="index">
          <div class="option" @click="selectedProduct(item)"  v-if="item.stock>=item.amount&&editState==false">
            <input type="checkbox" :value="index" v-model="check">
            <span></span>
          </div>
          <div class="option" @click="selectedProduct(item)"  v-if="editState==true">
            <input type="checkbox" :value="index" v-model="check">
            <span></span>
          </div>
          <div class="info">
            <a>
              <img :src="item.img">
              <div class="content">
                <div class="goods-list">
                  <h2>{{item.commodityName}}</h2>
                  <p>
                    <span @click.stop.prevent="changePrice(item,-1)">-</span>
                    <i>{{item.amount}}</i>
                    <span @click.stop.prevent="changePrice(item,1)">+</span>
                  </p>
                </div>
                <div class="goods-list">
                  <div>
                    <!--<span><i>{{item.presendScore}}</i>积分</span>-->
                    <!--<span class="old">{{item.origScore}}积分</span>-->
                    <span v-if="item.needScore==0"><i>现积分:{{item.presendScore}}积分</i></span>
                    <span class="old" v-if="item.needScore==0">原积分:{{item.origScore}}积分</span>
                    <span v-if="item.needScore!=0">所需积分:{{item.needScore}}积分</span>
                  </div>
                  <!--<span>市{{item.stock}}场指导价:{{item.price}}元</span>-->
                  <span v-if="item.stock<item.amount" class="stockNo">库存不足，剩余{{item.stock}}件</span>
                </div>
              </div>
            </a>
          </div>
        </li>
      </ul>
    </div>
    <div class="bottom-btn">
      <div>
        <div class="option">
          <input type="checkbox" name="" v-model="checkAll" @click="checkedAll()">
          <span></span>
          <label>全选</label>
        </div>
        <div class="right" v-if="!editState">
          <p>合计：
            <span class="line" v-if="(discount==0&&integralAll!=integralAllNow)||(discount==undefined&&integralAll!=integralAllNow)
              || discount!=0&&discount!=undefined&&Math.round(integralAll*discount/10)>=Math.round(integralAllDiscount)&&integralAll!=Math.round(integralAllDiscount)
              || discount!=0&&discount!=undefined&&Math.round(integralAll*discount/10)<Math.round(integralAllDiscount)&&integralAll!=Math.round(integralAll*discount/10)">{{integralAll}}</span>
            <span v-else>{{integralAll}}</span>
            <!--<span v-if="discount==0||discount==undefined">{{integralAll}}</span>-->
            积分</p>
          <!--<p v-if="discount!=0&&discount!=undefined">会员{{discount}}折:{{Math.round(integralAll*discount/10)}}积分</p>-->
          <p v-if="discount!=0&&discount!=undefined&&Math.round(integralAll*discount/10)>=Math.round(integralAllDiscount)&&integralAll!=Math.round(integralAllDiscount)">折扣价:{{Math.round(integralAllDiscount)}}积分</p>
          <p v-if="discount!=0&&discount!=undefined&&Math.round(integralAll*discount/10)<Math.round(integralAllDiscount)&&integralAll!=Math.round(integralAll*discount/10)">折扣价:{{Math.round(integralAll*discount/10)}}积分</p>
          <p v-if="(discount==0&&integralAll!=integralAllNow)||(discount==undefined&&integralAll!=integralAllNow)">折扣价:{{integralAllNow}}积分</p>
          <p>当前积分：{{score}}积分</p>
        </div>
      </div>
      <button class="btn next-btn" v-if="!editState" @click="submit">提交订单</button>
      <button class="btn next-btn" v-if="editState" @click="modalDelete = true">删除</button>
    </div>
    <modal-bar :maskHeader="2" v-if="modalDelete" @onHide="modalDelete = false" :state="1" :content="'确认删除？'"
               :cancelText="'取消'" @onCancel="modalDelete = false"
               :okText="'确定'" @onOk="deleteItem">
    </modal-bar>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import Vue from 'vue'
  export default {
    data () {
      return {
        title: '购物车',
        editState: false,//编辑完成状态
        checkAll: false,//全选
        list: [],//购物车列表
        check: [],//选中的商品
        integralAll: 0,//合计原价积分
        integralAllNow:0,//合计现价积分
        integralAllDiscount:0,//现价加上所需积分乘折扣
        currentId: [],   //所有選中的
        score: '',//剩余积分
        listItem: [],//所以选中商品信息
        modalDelete:false,//刪除弹框
        flag:true,
        discount:'',//折扣
        discountLast:0,
      }
    },
    computed: {
      ...mapState([
        'token'
      ])
    },
    watch: {//深度 watcher
      'check': {
        handler: function (val, oldVal) {
          if (this.check.length === 0) {
            this.checkAll = false;
          } else {
            if (this.check.length === this.list.length) {
              this.checkAll = true;
            } else {
              this.checkAll = false;
            }
          }
        },
        deep: true
      }
    },
    mounted(){
      this.init();
      this.getDiscount();
      this.getScore();
      this.initAddress();
      this.native.grabHandler('home.mall.shopCar');
    },
    methods: {
      initAddress(){
        var postData = {
          token: this.token,
        };
        this.native.apiHandler('XS-VEH-DZMR', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            this.$store.commit('mttSaveSelAddress', resultData);
          }
        })
      },
      edit(){
        this.editState = true;
        this.common();
        this.native.grabHandler('home.mall.shopCar.edit');
      },
      editSuccess(){
        this.editState = false;
        this.common();
      },
      common(){
        this.checkAll = false;
        this.check = [];
        this.currentId = [];
        this.listItem = [];
        this.list.forEach((item, index) => {
          this.list[index].checked = false;
        });
        this.integralAll = 0;
        this.integralAllNow = 0;
        this.integralAllDiscount = 0;
      },
//      如何让Vue 监听一个不存在的变量 单选操作
      selectedProduct(item) {
        this.native.grabHandler('home.mall.shopCar.selectedProduct.'+item.id);
        if (typeof item.checked == 'undefined') {
          Vue.set(item, "checked", true);
        } else {
          item.checked = !item.checked;
        }
        this.caleTotalPrice();
        this.pushId();
      },
      pushId(){
        this.currentId = [];
        this.listItem = [];
        this.list.forEach((item, index) => {
          if (item.checked) {
            this.currentId.push(item.id);
            this.listItem.push(item);
          }
        })
      },
//      计算选中的总积分
      caleTotalPrice(){
        this.integralAll = 0;
        this.integralAllNow = 0;
        this.integralAllDiscount = 0;
        this.list.forEach((item, index) => {
          if (item.checked) {
              if(item.needScore==0){
                this.integralAll += item.origScore * item.amount;
                this.integralAllNow += item.presendScore * item.amount;
                this.integralAllDiscount += item.presendScore * item.amount;
              }else {
                this.integralAll += item.needScore * item.amount;
                this.integralAllNow += item.needScore * item.amount;
                this.integralAllDiscount += item.needScore * item.amount*this.discount/10;
              }
          }
        });
      },
//      点击加、减
      changePrice(item, way){
        this.native.grabHandler('home.mall.shopCar.changePrice.'+item.id)
        if (way > 0) {
          item.amount++;
        } else {
          if (item.amount <= 1) {
            return false;
          }
          item.amount--;
        }
        this.caleTotalPrice();
        this.changeNum(item.amount, item.id);
      },
//      改变数量
      changeNum(amount, id){
        var numData = {
          amount: amount,
          id: id,
          token: this.token
        };
        this.native.apiHandler('XS-MAL-GWCXGSL', numData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            if (response.body.resultData == 1) {
//              this.toast('修改数量成功');
            } else {
              this.toast('修改数量失败');
            }
          }
        })
      },
//      全选
      checkedAll(){
        this.native.grabHandler('home.mall.shopCar.checkAll');
        this.integralAll = 0;
        this.integralAllNow = 0;
        this.integralAllDiscount = 0;
        this.currentId = [];
        this.listItem = [];
        if (this.checkAll == false) {
          this.check = [];
          this.list.forEach((item, index) => {
            Vue.set(item, "checked", false);
          });
        } else {
          this.check = [];
          this.list.forEach((item, index) => {
            this.check.push(index);
            if(item.stock<item.amount&&this.editState==false){
              Vue.set(item, "checked", false);
            }else {
              Vue.set(item, "checked", true);
            }
            if (item.checked) {
//              this.integralAll += item.presendScore * item.amount;
              if(item.needScore==0){
                this.integralAll += item.origScore * item.amount;
                this.integralAllNow += item.presendScore * item.amount;
                this.integralAllDiscount += item.presendScore * item.amount;
              }else {
                this.integralAll += item.needScore * item.amount;
                this.integralAllNow += item.needScore * item.amount;
                this.integralAllDiscount += item.needScore * item.amount*this.discount/10;
              }
              this.currentId.push(item.id);
              this.listItem.push(item);
            }
          });
        }
      },
//      删除
      deleteItem(){
        if (this.currentId == '') {
          this.toast('请选择删除商品');
        } else {
          this.native.grabHandler('home.mall.shopCar.delete');
          var deleteData = {
            ids: this.currentId,
            token: this.token
          };
          this.native.apiHandler('XS-MAL-GWCYC', deleteData, (res) => {
            let response = this.convert(res);
            if (response.body.isSuccessful == true) {
              this.check.reverse().forEach((item) => {
                this.list.splice(item, 1);
              });
              this.checkedAll();
              this.editState = false;
              this.checkAll = false;
              this.modalDelete = false;
              this.toast('删除成功');
            }
          });
        }
      },
//      初始化加载列表
      init(){
        var postData = {
          pageSize: -1,
          token: this.token
        };
        this.native.apiHandler('XS-MAL-GWCLB', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            this.list.pushs(response.body.resultData);
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
//      获取剩余积分
      getScore(){
        var scoreData = {
          token: this.token
        };
        this.native.apiHandler('	XS-MAL-SYJF', scoreData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            this.score = response.body.resultData;
          }
        })
      },
//      提交订单
      submit(){

        if(this.discount==0||this.discount==undefined){
          this.discountLast = this.integralAllNow;
        }else if(this.discount!=0&&this.discount!=undefined&&Math.round(this.integralAll*this.discount/10)>=Math.round(this.integralAllDiscount)){
          this.discountLast = Math.round(this.integralAllDiscount);
        }else if(this.discount!=0&&this.discount!=undefined&&Math.round(this.integralAll*this.discount/10)<Math.round(this.integralAllDiscount)){
          this.discountLast = Math.round(this.integralAll*this.discount/10);
        }
        if (this.currentId == "") {
          this.toast('请选择商品');
        }else if(this.discountLast>this.score){
          this.toast('您剩余积分不足');
        }else {
            for(let i=0;i<this.listItem.length;i++){
                if(this.listItem[i].stock<this.listItem[i].amount){
                  this.toast(this.listItem[i].commodityName+'库存不足');
                  this.flag=false;
                  return;
                }else {
                  this.flag=true;
                }
            }
            if(this.flag==true){
              this.native.grabHandler('home.mall.shopCar.submit');
                this.$store.commit('mttSaveConfirmOrder', this.listItem);
                this.$store.commit('mttSaveDiscount', this.discount);
                this.$router.push({name: 'order', query: {discount:this.discount}});
            }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "shopCar.less";
</style>
