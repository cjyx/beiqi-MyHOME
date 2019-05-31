<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
        <a @click="redirect('groupCreate')" slot="right">
          <i class="iconfont icon-add"></i>
        </a>
    </head-bar>
    <div class="main-content">
      <div class="page-loadmore-wrapper tabs-1" ref="wrapper" :style="{ height: wrapperHeight + 'px' }" v-if="modalEmpty==false">
        <mt-loadmore :autoFill="false" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
          <ul class="page-loadmore-list group-list">
            <li v-for="(item,index) in list" :key="index">
              <a @click="detial(item.groupId)">
                <img v-lazy="item.groupHeadFigureURL">
                <div class="content">
                  <h3>{{ item.groupName }}</h3>
                  <div class="info">
                    <span>{{item.followNumber}}人关注</span>
                    <span>{{item.createName}}</span>
                  </div>
                </div>
                <!--<button class="btn" v-if="item.isFollow==-1">关注</button>-->
                <button class="btn" v-if="item.isFollow==1" @click.stop="follow(item.groupId,index)">取消关注</button>
                <button class="btn" v-if="item.isFollow==0" @click.stop="deleteGroupMoadl(item.groupId,index)">刪除</button>
              </a>
            </li>
          </ul>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
            <span v-show="bottomStatus === 'loading'">
              <mt-spinner type="snake"></mt-spinner>
            </span>
          </div>
        </mt-loadmore>
      </div>
      <!--空白页-->
      <empty-page v-if="modalEmpty"></empty-page>
    </div>
    <transition name="slide-left">
      <router-view class="child-view"></router-view>
    </transition>
    <modal-bar :maskHeader="2" v-if="modalChange" @onHide="modalChange = false" :state="1" :content="'确认删除？'"
               :cancelText="'取消'" @onCancel="modalChange = false"
               :okText="'确定'" @onOk="deleteGroup">
    </modal-bar>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    data() {
      return {
        title:'我的小组',
        list: [],
        allLoaded: false,
        bottomStatus: '',
        wrapperHeight: 0,
        tbload: false,
        loadPage: 1,
        modalEmpty:false,
        modalChange:false,
        groupId:'',
        groupIdIndex:0,
      };
    },
    computed: {
      ...mapState([
        'token'
      ])
    },
    mounted(){
      this.native.grabHandler('my.index');
    },
    methods: {
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
      loadBottom() {
        this.tbload = true;
        this.loadPage++;
        let that = this;
        setTimeout(() => {
          this.init(this.loadPage);
          this.$refs.loadmore.onBottomLoaded();
          this.tbload = false;
        }, 1500);
      },
      init(page){
        var postData = {
          page:page,
          pageSize:10,
          requestSource:3,
          token:this.token
        };
        this.native.apiHandler('XS-BUS-QZXZ', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            if(response.body.resultData.rows.length>0) {
              this.list.pushs(response.body.resultData.rows);
            } else if(this.list.length==0){
              this.modalEmpty=true;
              return;
            } else {
              this.allLoaded = true;
              this.toast('加载完成');
            }
          }
        })
      },
//      路由跳转
      redirect(path){
        this.$router.push({ name: path });
        this.native.grabHandler('my.'+path)
      },
//      跳转详情
      detial(groupId){
        if (this.tbload == true) {
          return false;
        } else {
          this.$router.push({name: 'detailGroup', query: {id:groupId}});
          this.native.grabHandler('my.detailGroup.'+groupId)
        }
      },
//      删除小组
      deleteGroup(){
        var deleteData = {
          groupId:this.groupId,
          token:this.token
        };
        this.native.apiHandler('XS-BUS-QZSCXZ', deleteData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
              this.modalChange = false;
            if(response.body.resultData==1) {
              this.toast('删除成功');
              this.list.splice(this.groupIdIndex,1);
            }else {
              this.toast('删除失败');
            }
          }
        })
      },
//      取消关注
      follow(groupId,index){
        this.native.grabHandler('my.unFollow'+groupId)
        var followData = {
          isFollow:-1,
          groupId:groupId,
          token:this.token
        };
        this.native.apiHandler('XS-BUS-QZGZ', followData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            if(response.body.resultData.status==1){
              this.toast('取消关注成功');
              this.list.splice(index,1);
            }else {
              this.toast('取消关注失败');
            }
          }
        })
      },
//      删除
      deleteGroupMoadl(groupId,groupIdIndex){
        this.native.grabHandler('my.delete'+groupId)
        this.modalChange = true ;
        this.groupId = groupId;
        this.groupIdIndex = groupIdIndex;
      }

    },
    mounted() {
      this.wrapperHeight = document.documentElement.clientHeight-44;
      this.init(1);
    }
  }
</script>
<style lang="less" scoped>
</style>

