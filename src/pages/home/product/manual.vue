<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <div class="btn-tab">
        <p :class="{'tab_active':selected==index}" @click="change(index,item.id)" v-for="(item,index) in listLeft" :key="index">
          <img :src="item.grayPic" alt="" v-if="selected!=index">
          <img :src="item.highlightPic" alt="" v-if="selected==index"><br />
          {{item.notebookName}}
        </p>
        <!--<p :class="{'tab_active':selected==1}" @click="selected=1">-->
          <!--<img src="../../../assets/img/user-head.png" alt=""><br />-->
          <!--品牌资讯-->
        <!--</p>-->
        <!--<p :class="{'tab_active':selected==2}" @click="selected=2">-->
          <!--<img src="../../../assets/img/user-head.png" alt=""><br />-->
          <!--爱车知识-->
        <!--</p>-->
        <!--<p :class="{'tab_active':selected==3}" @click="selected=3">-->
          <!--<img src="../../../assets/img/user-head.png" alt=""><br />-->
          <!--休闲娱乐-->
        <!--</p>-->
      </div>
      <div class="tab">
       <ul class="tab_right">
         <li v-for="(item,index) in listRight" :key="index">
           <img :src="item.thumbnail" alt="" @click="detial(item.content)"><br/>
           {{item.carMannulName}}
         </li>
         <!--<li>-->
           <!--<img src="../../../assets/img/user-head.png" alt="" @click="detial"><br/>-->
           <!--爱车知识-->
         <!--</li>-->
       </ul>
      </div>
      <!--<div v-if="selected==2" class="tab">-->
        <!--22-->
      <!--</div>-->
      <!--<div v-if="selected==3" class="tab">-->
        <!--33-->
      <!--</div>-->
      <transition name="slide-left">
        <router-view class="child-view"></router-view>
      </transition>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        title: '车型手册',
        list:[],
        selected:0,
        listLeft:[],
        listRight:[],
        id:''
      }
    },
    mounted(){
      this.native.grabHandler('home.product.productDetail.manual');
      this.init();
    },
    methods: {
      detial(content){
          this.native.grabHandler('home.product.manualDetial');
         this.$router.push({name:'manualDetial',query:{content:content}});
      },
      init(){
        this.native.apiHandler('XS-NET-PZSCLB', {}, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            this.listLeft.pushs(response.body.resultData);
            this.change(0,this.listLeft[0].id);
          }
        })
      },
      getDetial(){
        var postData={
          carId:this.$route.query.carTypeId,
          id:this.id,
        };
        this.native.apiHandler('XS-NET-CXSCLB', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            this.listRight = response.body.resultData;
          }
        })
      },
      change(index,id){
          this.native.grabHandler('home.product.changeManual.'+id);
          this.selected=index;
          this.id = id;
          this.getDetial();
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "manual.less";
</style>
