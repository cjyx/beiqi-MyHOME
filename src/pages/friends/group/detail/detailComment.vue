<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
    </head-bar>
    <div class="main-content">
      <div class="comment-content">
        <textarea name="" id="" cols="30" rows="10" v-model="commentContent" placeholder="请输入评论">
        </textarea>
        <button class="btn next-btn" @click="commentSubmit">提交</button>
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
      }
    },
    computed: {
      ...mapState([
        'token'
      ])
    },
    mounted(){
      this.native.grabHandler('detailComment.index');
    },
    methods: {
      commentSubmit(){
          var postData = {
            articleId: this.$route.query.id,
            commentContent:this.commentContent,
            token:this.token
          };
          this.native.apiHandler('XS-BUS-QZXPL', postData, (res) => {
            this.native.grabHandler('detailComment.submit');
            let response = this.convert(res);
            if (response.body.isSuccessful == true) {
              if(response.body.resultData==1){
                this.toast('提交成功');
                this.$router.go(-1);
              }else if(response.body.resultData==0){
                this.toast('提交失败');
              }
            }
          })
        }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../../less/article.less";
</style>
