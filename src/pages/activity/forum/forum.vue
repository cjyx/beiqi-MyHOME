<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'></head-bar>
    <div class="main-content">
      <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :autoFill="false" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange"
                     :bottom-all-loaded="allLoaded" ref="loadmore">
          <div class="detail">
            <div class="import">
              完成汽车之家、越野E族有效论坛帖发布，您将有机会领取<span>200-1000</span>积分
            </div>
            <img src="../../../assets/img/step.png" class="stepImg">
            <div class="text">
              <h4>内容有效帖</h4>
              <p>
                不少于200字；含北汽绅宝或北京（BJ）品牌车型的有效图片（可明确识别车型品牌）不少于5张，配图须与文章内容相关；正文及回复内容须积极向上，对北汽品牌产生正面影响。审核通过可获得200积分奖励。
              </p>
              <h4>精华帖</h4>
              <p>满足内容有效帖标准且被版主加精华，可获得300积分奖励。</p>
              <h4>高质量帖</h4>
              <p>满足内容有效帖标准，且内容观点具有说服力，能有效对舆论产生正面引导，可获得1000积分奖励。</p>
              <span>*2016年9月10日后在论坛发布的帖子才可以赚取积分哦！</span>
            </div>
            <div class="btn-content">
              <button class="testBtn" @click="bind">帐号绑定</button>
              <button class="testBtn" @click="create">论坛发帖</button>
            </div>
          </div>
          <ul class="list">
            <li v-for="(item,index) in list" :key="item.id">
              <div>
                <h3>{{item.title}}</h3>
                <span v-if="item.status==0">待审批</span>
                <span v-if="item.status==1">已通过</span>
                <span v-if="item.status==-1">已拒绝</span>
              </div>
              <div>
                <p>发帖时间：{{ item.bbsDate | dateFormat('yyyy-MM-dd')}}</p>
                <a v-if="item.status==-1" @click="detail(item)">查看</a>
                <span v-if="item.status==1">+{{item.integral}}积分</span>
              </div>
            </li>
            <!-- <li>
               <div>
                 <h3>5月出游车辆性能</h3>
                 <span>未审核</span>
               </div>
               <div>
                 <p>发帖时间：2017-05-06</p>
                 <a>查看</a>
               </div>
             </li>-->
          </ul>
        </mt-loadmore>
      </div>
    </div>
    <!--账号绑定-->
    <modal-bar :maskHeader="2" v-if="modalForm" @onHide="modalForm=false">
      <div class="form-content modal-content forum-content" slot="modal-main">
        <h2>至少绑定一个论坛用户名</h2>
        <div class="form-group">
          <!--<label>汽车之家&nbsp;&nbsp;<br/>用户名：</label>-->
          <img src="../../../assets/img/icon_01.png" alt="">
          <input type="text" placeholder="请输入用户名" v-model="form.autohomeName" :disabled="user.autohomeName!=''">
        </div>
        <div class="form-group">
          <!--<label>越野 E 族&nbsp;&nbsp;<br/>用户名：</label>-->
          <img src="../../../assets/img/icon_02.png" alt="">
          <input type="text" placeholder="请输入用户名" v-model="form.fblifeName" :disabled="user.fblifeName!=''">
        </div>
        <button class="btn next-btn" @click="submit">绑定账号</button>
      </div>
    </modal-bar>

    <modal-bar :maskHeader="2" v-if="modalBindAccount" @onHide="modalBindAccount = false" :state="1"
               :content="'请先绑定论坛账号再进行帖子提交'"
               :cancelText="'取消'" @onCancel="modalBindAccount=false"
               :okText="'确定'" @onOk="emitBindAccount">
    </modal-bar>
    <modal-bar v-if="modalReason" :maskHeader="1" :canClose="true" :state="2" @onHide="modalReason = false"
               :content="currentItem.refuseReason">
    </modal-bar>
    <loading-Bar v-if="loading"></loading-Bar>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        title: '论坛发帖',
        allLoaded: false,
        bottomStatus: '',
        wrapperHeight: 0,
        modalBindAccount: false,
        modalReason: false,
        modalForm: false,
        currentItem: {},
        page: 1,
        list: [],
        form: {},
        loading:false,
      }
    },
    computed: {
      ...mapState([
        'token', 'user'
      ])
    },
    mounted(){
      this.form = JSON.parse(JSON.stringify(this.user));
      // alert(JSON.stringify(this.user));
      this.loadPage();
      this.native.grabHandler('activity.forum');
      this.wrapperHeight = document.documentElement.clientHeight - 45;
    },
    methods: {
      emitBindAccount(){
        this.modalBindAccount = false;
        this.modalForm = true;
      },
      loadPage(){
        this.loading = true;
        var postData = {
          token: this.token,
          page: this.page,
          pageSize: 10
        };
        this.native.apiHandler('XS-BBS-LTLB', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            if (resultData.rows.length > 0) {
              this.loading = false;
              this.list.pushs(resultData.rows);
            } else {
              this.loading = false;
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
          this.page++;
          this.loadPage();
          this.$refs.loadmore.onBottomLoaded();
        }, 1500);
      },
      detail(item){
        this.native.grabHandler('activity.forum.detail.'+item.id);
        this.currentItem = item;
        this.modalReason = true;
      },
      create(){
        this.native.grabHandler('activity.forum.create');
        if (this.user.autohomeName == '' && this.user.fblifeName == '') {
          this.modalForm = true;
        } else {
          this.$router.push({name: 'forumPost', params: {}});
        }
      },
      bind(){
        this.native.grabHandler('activity.forum.bind');
        if (this.user.autohomeName == '' || this.user.fblifeName == '') {
          this.modalForm = true;
        } else {
          this.toast('你已绑定论坛账号');
        }
      },
      submit(){
        var count = 0;
        if (this.form.autohomeName.trimNo() == '') {
          count++;
        }
        if (this.form.fblifeName.trimNo() == '') {
          count++;
        }
        if (count == 2) {
          this.toast('请至少绑定一个论坛账号');
          return;
        }
        this.form.token = this.token;
        this.native.apiHandler('XS-BBS-LTZHBD', this.form, (res) => {
          let response = this.convert(res);
          this.native.grabHandler('activity.forum.bind.submit');
          if (response.body.isSuccessful == true) {
            if(response.body.resultData==0){
              this.toast('绑定成功');
//              保存用戶信息到vuex
              this.$store.commit('mttSaveUserInfo', this.form);
              this.modalForm = false;
            }else if(response.body.resultData==1){
              this.toast('汽车之家用户名已存在');
              return;
            }else if(response.body.resultData==2){
              this.toast('越野e族用户名已存在');
              return;
            }else if(response.body.resultData==3){
              this.toast('用户名已存在');
              return;
            }
          }
        })
      }
//      this.$router.push({name: 'forumPost', params: {}});
    }
  }
</script>
<style lang="less" scoped>
  @import "forum.less";
</style>
