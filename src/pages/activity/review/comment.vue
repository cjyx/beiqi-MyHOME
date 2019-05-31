<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <div class="comment-content">
        <h3 class="comment-title">{{detialTitle}}</h3>
        <textarea name="" id="" cols="30" rows="10" placeholder="请输入评论" v-model="commentContent">
        </textarea>
        <button class="btn next-btn" @click="submit">提交</button>
        <div class="comment-list-title">
          <p></p>
          <span>评论</span>
          <p></p>
        </div>
        <ul>
          <li class="comment-list-bottom" v-for="(item,index) in commentData" :key="index">
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
        commentData:[],
//        imgIcon:require('../../../assets/img/icon_01.jpg'),
        detialTitle:this.$route.query.detialTitle
      }
    },
    computed: {
      ...mapState([
        'token'
      ])
    },
    mounted(){
      this.commentList();
      this.native.grabHandler('activity.review.comment');
    },
    methods: {
        submit(){
          if(this.commentContent==''){
            this.toast('评论内容不能为空');
            return false;
          }else {
            var detailData = {
              id: this.$route.query.id,
              content: this.commentContent,
              token: this.token,
            };
            this.native.apiHandler('	XS-BUS-HDHGPL', detailData, (res) => {
              let response = this.convert(res);
              this.native.grabHandler('activity.review.comment.submit');
              if (response.body.isSuccessful == true) {
                if (response.body.resultData == true) {
                  this.toast('提交成功');
                  this.$router.go(-1);
                }
              }
            })
          }
        },
      commentList(){
        var commentData = {
          id:this.$route.query.id,
          token:this.token,
        };
        this.native.apiHandler('XS-BUS-HGWDPLLB', commentData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
              this.commentData.pushs(response.body.resultData);
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .main-content{background: #fff}
</style>
