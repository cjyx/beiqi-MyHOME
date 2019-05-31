<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <ul class="dashboard-content">
        <li v-for="item in list">
          <a @click="redirect('dashboardDetail',item.id,item.name)">
            <img :src=item.img alt="">
          </a>
        </li>
      </ul>
    </div>
    <transition name="slide-left">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        title: '仪表盘',
        list: [
          {img: require('../../../../assets/dashboardIcon/1.png'), name: '远光灯指示灯', id: 1},
          {img: require('../../../../assets/dashboardIcon/2.png'), name: '近光灯指示灯', id: 2},
          {img: require('../../../../assets/dashboardIcon/3.png'), name: '驻车制动警告灯', id: 3},
          {img: require('../../../../assets/dashboardIcon/4.png'), name: '位置灯指示灯', id: 4},
          {img: require('../../../../assets/dashboardIcon/5.png'), name: '左转向指示灯', id: 5},
          {img: require('../../../../assets/dashboardIcon/6.png'), name: '机油压力低警告灯', id: 6},
          {img: require('../../../../assets/dashboardIcon/7.png'), name: '防抱死刹车警告灯', id: 7},
          {img: require('../../../../assets/dashboardIcon/8.png'), name: '发动机故障警告灯', id: 8},
          {img: require('../../../../assets/dashboardIcon/9.png'), name: '充电系统故障警告灯', id: 9},
          {img: require('../../../../assets/dashboardIcon/10.png'), name: '制动液位低 / 制动系统故障警告灯', id: 10},
          {img: require('../../../../assets/dashboardIcon/11.png'), name: '右转向指示灯', id: 11},
          {img: require('../../../../assets/dashboardIcon/12.png'), name: '电动助力转向系统警告灯', id: 12},
          {img: require('../../../../assets/dashboardIcon/13.png'), name: 'ESP OFF 指示灯', id: 13},
          {img: require('../../../../assets/dashboardIcon/14.png'), name: 'ESP 指示灯', id: 14},
          {img: require('../../../../assets/dashboardIcon/15.png'), name: '启停系统不工作 / 故障警告灯', id: 15},
          {img: require('../../../../assets/dashboardIcon/16.png'), name: '启停系统工作指示灯', id: 16},
          {img: require('../../../../assets/dashboardIcon/17.png'), name: '燃油不足警告灯', id: 17},
          {img: require('../../../../assets/dashboardIcon/18.png'), name: '发动机防盗指示灯', id: 18},
          {img: require('../../../../assets/dashboardIcon/19.png'), name: '副驾安全带未系警告灯', id: 19},
          {img: require('../../../../assets/dashboardIcon/20.png'), name: '车身防盗指示灯', id: 20},
          {img: require('../../../../assets/dashboardIcon/21.png'), name: '胎压警报 /TPMS 系统故障警告灯', id: 21},
          {img: require('../../../../assets/dashboardIcon/22.png'), name: '安全气囊故障警告灯', id: 22},
          {img: require('../../../../assets/dashboardIcon/23.png'), name: '巡航指示灯', id: 23},
          {img: require('../../../../assets/dashboardIcon/24.png'), name: '门开指示灯', id: 24},
          {img: require('../../../../assets/dashboardIcon/25.png'), name: '变速箱故障警告灯', id: 25},
          {img: require('../../../../assets/dashboardIcon/26.png'), name: '后雾灯指示灯', id: 26},
          {img: require('../../../../assets/dashboardIcon/27.png'), name: '前雾灯指示灯', id: 27},
          {img: require('../../../../assets/dashboardIcon/28.png'), name: '主驾安全带未系警告灯', id: 28},
          {img: require('../../../../assets/dashboardIcon/29.png'), name: '冷却液温度高警告灯', id: 29},
        ]
      }
    },
    mounted(){
      this.native.grabHandler('home.news.dashboard.0');
    },
    methods: {
      redirect(path,id,name) {
        this.native.grabHandler('home.news.dashboardDetail.'+id);
        this.$router.push({ name: path, query: {id:id,name:name} });
      },
    }
  }
</script>
<style lang="less" scoped>
  @import "dashboard.less";
</style>
