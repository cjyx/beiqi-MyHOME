<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <div class="experience" id="experience">
        <div class="usable">
          <p>可用经验</p>
          <h1>{{useCount}}</h1>
          <a @click="redirect('experienceRule')" class="btn">如何获取经验</a>
        </div>
      </div>
      <div class="page-loadmore-wrapper tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :autoFill="false" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange"
                     :bottom-all-loaded="allLoaded" ref="loadmore">
          <ul class="list">
            <li v-for="(item,index) in list" :key="item.id">
              <div>
                <p>{{item.descript}}</p>
                <span>{{item.createTime}}</span>
              </div>
              <span v-if="item.type==0">+{{item.count}}</span>
              <span v-else>{{item.count}}</span>
            </li>
          </ul>
        </mt-loadmore>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        title: '我的经验',
        allLoaded: false,
        bottomStatus: '',
        wrapperHeight: 0,
        page:1,
        useCount:0,
        list:[],
      }
    },
    computed: {
      ...mapState([
        'token'
      ])
    },
    mounted(){
      this.native.grabHandler('user.experience');
      this.wrapperHeight = document.documentElement.clientHeight - document.getElementById('experience').offsetHeight-44;
      this.init(this.page);
    },
    methods: {
      init(page){
        var postData = {
          page:page,
          pageSize:10,
          token:this.token,
        };
        this.native.apiHandler('	XS-BUS-WDJY', postData, (res) => {
          let response = this.convert(res);
          if(response.body.isSuccessful == true){
            this.useCount=response.body.resultData.useCount;
            if(response.body.resultData.list.rows.length>0){
              this.list.pushs(response.body.resultData.list.rows);
            }else{
              this.allLoaded = true;
              this.toast('加载完毕');
            }
          }
        })
      },
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
      loadBottom() {
        setTimeout(() => {
          this.allLoaded = true;
          this.page++;
          this.init(this.page);
          this.$refs.loadmore.onBottomLoaded();
        }, 1500);
      },
      redirect(path) {
        this.native.grabHandler('user.experience'+path);
        this.$router.push({ name: path, query: {} });
      },
    }
  }
</script>
<style lang="less" scoped>
@import "experience.less";
</style>
