<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
      <a @click="redirect('userIntegralRule')" slot="right">积分规则</a>
    </head-bar>
    <div class="main-content">
      <div class="page-loadmore-wrapper tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :autoFill="false" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange"
                     :bottom-all-loaded="allLoaded" ref="loadmore">
          <div class="integral-content">
            <div class="all">
              <h1>{{total}}</h1>
              <h3>积分</h3>
            </div>
            <ul class="list">
              <li v-for="(item,index) in list" :key="item.id">
                <div>
                  <p>{{item.scoreDescript}}</p>
                  <span>{{item.updateTime}}</span>
                </div>
                <span>{{item.scoreType == 0 ? '+' : ''}}{{item.score}}</span>
              </li>
              <!--<li>
                <div>
                  <p>兑换物品</p>
                  <span>2017-05-25 15:32:20</span>
                </div>
                <span>-13</span>
              </li>-->
            </ul>
          </div>
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
        title: '我的积分',
        allLoaded: false,
        bottomStatus: '',
        wrapperHeight: 0,
        page: 1,
        list: [],
        total: 0,
      }
    },
    computed: {
      ...mapState([
        'token', 'realName', 'userImg'
      ])
    },
    mounted(){
      this.wrapperHeight = document.documentElement.clientHeight - 44;
      if (this.token != '') {
        this.loadPage(this.page);
        this.init();
        this.native.grabHandler('user.userIntegral');
      }
    },
    methods: {
      init(){
        var postData = {
          token: this.token
        };
        this.native.apiHandler('XS-MAL-WOJF', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            this.total = resultData.countScore;
          }
        })
      },
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
      loadBottom() {
        setTimeout(() => {
          this.page++;
          this.loadPage(this.page);
          this.$refs.loadmore.onBottomLoaded();
        }, 1500);
      },
      loadPage(page){
        var postData = {
          token: this.token,
          page: this.page,
          pageSize: '10'
        };
        this.native.apiHandler('XS-MAL-JFLB', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            if (resultData.rows.length > 0) {
              this.list.pushs(resultData.rows);
            } else {
              this.allLoaded = true;
              this.toast('加载完毕');
            }
          }
        })
      },
      redirect(path) {
        this.native.grabHandler('user.userIntegral'+path);
        this.$router.push({ name: path, query: {} });
      },
    }
  }
</script>
<style lang="less" scoped>
  @import "integral.less";
</style>
