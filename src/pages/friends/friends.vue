<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='false' :head-logo='false'>
      <!--<a slot="left"><i class="iconfont icon-custom-service"></i></a>-->
        <a @click="redirect('groupSearch')" slot="right">
         <i class="iconfont icon-search"></i>
        </a>
    </head-bar>
    <nav-bar :selected="3"></nav-bar>
    <div class="main-content">
      <div class="frs-menu">
        <a @click="redirect('groupCreate')">
        创建小组
        </a>|
        <!--<a>我的小组</a>-->
        <a @click="redirect('myGroup')">
        我的小组
        </a>|
        <a @click="redirect('myArticle')">
        我发布的
        </a>
      </div>
      <div class="hot-list">
        <div class="hot-hd">
          <h4>热门推荐</h4>
          <a @click="redirect('hotList')">
            查看更多<i class="iconfont icon-more"></i>
          </a>
        </div>
        <ul class="hot-bd">
          <li v-for="(item,index) in friendList" :key="index">
            <a @click="redirectDetail('detialArticle',item.articleId)">
              <img v-if="item.articleHeadFigureURL==''" :src="defImg">
              <img v-if="item.articleHeadFigureURL!=''" :src=item.articleHeadFigureURL>
              <div class="content">
                <h4>{{item.articleTitle}}</h4>
               <div class="desc">
                 <span>作者：{{item.articleAuthor}}</span>
                 <span>小组：{{item.articleGroup}}</span>
               </div>
              </div>
            </a>
          </li>
        </ul>
        <div class="no-data" v-if="friendList.length==0">暂无小组信息</div>
      </div>
      <div class="hot-list">
        <div class="hot-hd">
          <h4>小组</h4>
          <span>
            <a @click="redirect('friendsGroup')">
            <!--<a>-->
              查看更多<i class="iconfont icon-more"></i>
            <!--</a>-->
            </a>
          </span>
        </div>
        <ul class="hot-group">
          <li v-for="(item,index) in groupList" :key="index">
            <a @click="redirectDetail('detailGroup',item.groupId)">
              <img :src="item.groupHeadFigureURL" alt="">
              <h4>{{item.groupName | group}}</h4>
              <i class="iconfont icon-liked" v-if="item.isFollow==1"></i>
            </a>
          </li>
        </ul>
        <div class="no-data" v-if="groupList.length==0">暂无小组信息</div>
      </div>
    </div>

    <transition name="slide-left">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        title: '圈子',
        friendList:[],
        groupList:[],
        defImg: require('../../assets/img/user-head.png'),
      }
    },
    computed: {
      ...mapState([
        'token'
      ])
    },
    mounted(){
      this.init();
      this.group();
      this.native.grabHandler('friends.index');
    },
    methods: {
        init(){
          /*热门推荐*/
          var postData = {
            page:1,
            pageSize:2,
            requestSource:1,
            token:this.token
          };
          this.native.apiHandler('XS-BUS-QZWZ', postData, (res) => {
            let response = this.convert(res);
            if(response.body.isSuccessful == true){
              this.friendList = response.body.resultData.rows;
            }
          })
        },
//      小组
      group(){
        var groupData = {
          page:1,
          pageSize:6,
          requestSource:1,
          token:this.token
        };
        this.native.apiHandler('XS-BUS-QZXZ', groupData, (res) => {
          let response = this.convert(res);
          if(response.body.isSuccessful == true){
            this.groupList=response.body.resultData.rows;
          }
        })
      },
//      路由跳转
      redirect(path){
        this.$router.push({ name: path });
        this.native.grabHandler('friends.'+path);
      },
      redirectDetail(path,itemId){
        this.$router.push({
          name: path ,
          query: {id: itemId}
        });
        this.native.grabHandler('friends.'+path+'.'+itemId);
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "friends.less";
</style>
