<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <div class="comment-content">
        <h3 class="comment-title">{{detialTitle}}</h3>
        <textarea name="" id="" cols="30" rows="10" placeholder="请输入评论" v-model="commentContent">
        </textarea>
        <button class="btn next-btn" @click="init">提交</button>
        <div class="comment-list-title">
          <p></p>
          <span>评论</span>
          <p></p>
        </div>
        <ul>
          <li class="comment-list-bottom" v-for="item in list">
            <img v-if="item.imgUrl==''" src="../../../assets/img/man.png" alt="">
            <img v-if="item.imgUrl!=''" :src="item.imgUrl" alt="">
            <div>
              <p>{{item.name}}</p>
              <p class="comment-content-bottom">{{item.content}}</p>
              <p class="delete">
                <span>{{item.createTime | date}}</span>
                <!--<span class="comment-delete">删除</span>-->
              </p>
            </div>
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
        title: '评论',
        commentContent:'',
        list:[],
        id:'',
//        imgIcon:require('../../../assets/img/icon_01.jpg'),
        detialTitle:''
      }
    },
    computed: {
      ...mapState([
        'token'
      ])
    },
    mounted(){
      this.native.grabHandler('home.news.detail.comment');
      this.id = this.$route.query.id;
      this.detialTitle = this.$route.query.detialTitle;
      this.commentList();
    },
    methods: {
        init(){
          if(this.commentContent==''){
            this.toast('评论内容不能为空');
            return false;
          }else{
            var detailData = {
              id:this.id,
              content:this.commentContent,
              token:this.token,
            };
            this.native.apiHandler('XS-BUS-ZXPL', detailData, (res) => {
              this.native.grabHandler('home.news.detail.comment.submit');
              let response = this.convert(res);
              if (response.body.isSuccessful == true) {
                if(response.body.resultData == true){
                  this.toast('提交成功');
                  this.$router.go(-1);
                }
              }
            })
          }
        },
      commentList(){
        var commentData = {
          id:this.id,
          token:this.token,
        };
        this.native.apiHandler('XS-BUS-WDPLLB', commentData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
              this.list.pushs(response.body.resultData);
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../less/article.less";
</style>
