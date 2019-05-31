<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'></head-bar>
    <div class="main-content">
      <div class="content">
        <h3 class="title">活跃度勋章</h3>
        <ul class="list">
          <li v-for="(item,index) in medals" :key="index" v-if="item.type==1">
            <a @click="redirect('medalDetail',item)">
              <img :src=item.img>
              <p>LV{{item.grade}}</p>
              <span>{{item.name}}</span>
            </a>
          </li>
        </ul>
      </div>
      <div class="content">
        <h3 class="title">贡献勋章</h3>
        <ul class="list">
          <li v-for="(item,index) in medals" :key="index" v-if="item.type==0">
            <a @click="redirect('medalDetail',item)">
              <img :src=item.img>
              <p>LV{{item.grade}}</p>
              <span>{{item.name}}</span>
            </a>
          </li>
        </ul>
      </div>
      <div class="content">
        <h3 class="title">特殊事件勋章</h3>
        <ul class="list">
          <li v-for="(item,index) in medals" :key="index" v-if="item.type==2">
            <a @click="redirect('medalDetail',item)">
              <img :src=item.img>
              <p v-if="item.grade!=''">LV{{item.grade}}</p>
              <p v-else></p>
              <span>{{item.name}}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        title: '勋章墙',
        medals:[]
      }
    },
    computed: {
      ...mapState([
        'token'
      ])
    },
    mounted(){
      this.native.grabHandler('user.medal');
      this.medal()
    },
    methods: {
      medal(){
        var postData = {
          token:this.token
        };
        this.native.apiHandler('	XS-BUS-WDXZ', postData, (res) => {
          let response = this.convert(res);
          if(response.body.isSuccessful == true){
            this.medals = response.body.resultData;
          }
        })
      },
      redirect(path,content) {
        this.native.grabHandler('user.medal.'+path);
        this.$router.push({ name: path, query: {'content':content} });
      },
    }
  }
</script>
<style lang="less" scoped>
@import "medal.less";
</style>
