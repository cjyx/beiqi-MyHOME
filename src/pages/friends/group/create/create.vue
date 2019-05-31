<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
        <a @click="init" slot="right">创建</a>
    </head-bar>
    <div class="main-content">
      <div class="create-group">
        <input type="text" placeholder="请输入小组标题" v-model="groupTitle" maxlength="15">
        <div class="eval-content">
          <textarea rows="8" maxlength="200" placeholder="请输入小组简介..." v-model="groupContent"></textarea>
        </div>
        <p class="up-img">
          <img v-if="this.picUrl==''" src="../../../../assets/img/img.png" alt="" @click="upImg">
          <img v-if="this.picUrl!=''" :src="picUrl" alt="" @click="upImg" class="img">
        </p>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        title: '创建小组',
        groupTitle: '',
        groupHeadFigureID: '',
        groupContent:'',
        picUrl:''
      }
    },
    computed: {
      ...mapState([
        'token'
      ])
    },
    mounted(){
      this.native.grabHandler('create.index');
    },
    methods: {
      init(){
          if(this.groupTitle==''){
              this.toast('请输入内容');
          }else if(this.groupDesc==''){
            this.toast('请输入小组简介');
          }else if(this.groupHeadFigureID==''){
              this.toast('请上传图片');
          } else {
            var postData = {
              groupHeadFigureID: this.groupHeadFigureID,
              groupName: this.groupTitle,
              groupDesc: this.groupContent,
              token: this.token
            };
            this.native.apiHandler('XS-BUS-QZCJXZ', postData, (res) => {
              this.native.grabHandler('create.submit');
              let response = this.convert(res);
              if (response.body.isSuccessful == true) {
                if (response.body.resultData == 1) {
                  this.toast('创建成功，请等待审核');
                  this.$router.go(-1);
                }else {
                  this.toast('创建失败');
                }
              }
            })
          }
      },
      upImg(){
        this.native.imgHandler(1, {token: this.token}, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            for (var i = 0, len = resultData.length; i < len; i++) {
              this.groupHeadFigureID = resultData[i].fileId;
              this.picUrl = resultData[i].fileUrl;
            }
          }
        })
      },
    }
  }
</script>
<style lang="less" scoped>
  @import "create.less";
</style>
