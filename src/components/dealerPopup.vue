<template>
  <mt-popup v-model="popShow" position="bottom" class="mint-popup" :modal="true" :closeOnClickModal="true">
    <div class="picker-toolbar">
      <span class="mint-datetime-action mint-datetime-cancel" @click="onCancel">取消</span>
      <span class="mint-datetime-action mint-datetime-confirm" @click="onOk">确定</span>
    </div>
    <div class="dealer">
    <div class="nav">
      <a @click="onProvince">省</a>
      <a @click="onCity" v-if="showCity">市</a>
      <a @click="onDealer" v-if="showDealer">经销商</a>
    </div>
    <ul v-if="selectProvince" class="group">
      <li v-for="(item,index) in province" @click="changeProvince(item,index)" :class="index==current ? 'active' : ''">{{item}}</li>
    </ul>
    <ul v-if="selectCity" class="group">
      <li v-for="(item,index)  in city" @click="changeCity(item,index)" :class="index==currentCity ? 'active' : ''">{{item}}</li>
    </ul>
    <ul v-if="selectDealer" class="group">
      <li v-for="(item,index)  in dealer" @click="changeDealer(item,index)" :class="index==currentDealer ? 'active' : ''">{{item}}</li>
    </ul>
    </div>
  </mt-popup>
</template>
<script>
  import {mapState} from 'vuex'
  import area from 'src/common/area'
  export default{
    props:['state','show'],
    data(){
      return {
        popShow:false,
        province:[],
        city:[],
        dealer:['广州经销商', '深圳经销商', '珠海经销商', '汕头经销商', '韶关经销商', '佛山经销商', '江门经销商', '湛江经销商', '茂名经销商','鞍山经销商', '抚顺经销商', '本溪经销商', '丹东经销商'],
        showCity:false,
        showDealer:false,
        selectProvince:true,
        selectCity:false,
        selectDealer:false,
        current:0,
        currentCity:0,
        currentDealer:0,
        dealerVal:''
      }
    },
    watch: {
      show(val){
        this.popShow = true;

      },
    },
    mounted(){
      this.province=area.getAllProvinceName();
    },
    methods:{
      onProvince(){
        this.selectProvince=true;
        this.selectCity=false;
        this.selectDealer=false;
      },
      onCity(){
        this.selectProvince=false;
        this.selectCity=true;
        this.selectDealer=false;
      },
      onDealer(){
        this.selectProvince=false;
        this.selectCity=false;
        this.selectDealer=true;
      },
      changeProvince(name,index){
        console.log(name);
        this.city=area.getAllCityNameByPName(name);
        this.current=index;
        this.showCity=true;
        this.showDealer=false;
        this.selectProvince=false;
        this.selectCity=true;
      },
      changeCity(name,index){
        console.log(name);
        this.currentCity=index;
        this.showDealer=true;
        this.selectDealer=true;
        this.selectCity=false;
      },
      changeDealer(name,index){
        console.log(name);
        this.currentDealer=index;
        this.dealerVal=name
      },
      onOk(){
        this.popShow = false;
        this.$emit("onOk",this.dealerVal)
      },
      onCancel(){
        this.popShow = false;
      }
    }
  }
</script>
<style lang="less">
  .dealer{
    .nav{
      display: flex;
      align-items: center;
      border-bottom: solid 1px #eaeaea;
      a{
        flex: 1;
        text-align: center;
        padding: 0.2rem 0;
        color: #1b8afd;
      }
    }
    .group{
      height: 3rem;
      overflow-y: scroll;
      flex-flow: row;
      li{
        height: 36px;
        line-height: 36px;
        display: flex;
        justify-content: center;
        width: 100%;
        &.active{
          color: #1b8afd;
        }
      }
    }
  }
</style>
