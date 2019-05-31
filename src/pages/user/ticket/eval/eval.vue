<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'></head-bar>
    <div class="main-content">
      <ul class="group-list">
        <li>
          <a>
            <img :src="goods.img">
            <div class="content">
              <div class="goods-list">
                <h2>{{goods.commodityName}}</h2>
              </div>
              <div class="goods-list">
                <p class="gray">数量：{{goods.amount}}</p>
              </div>
            </div>
          </a>
        </li>
      </ul>
      <div class="eval-content">
        <textarea rows="5" v-model="content" maxlength="150" placeholder="点击此处填写评论，请注意内容健康向上，北京汽车保留删除不当言论的权利，同时追回相应经验..."></textarea>
      </div>

      <div class="upload-img">
        <ul class="eval-img" ref="evalImg">
          <li v-for="(item,index) in imgList" :key="index">
            <img :src="item.fileUrl">
            <i class="iconfont icon-close" @click="deleteImg(index)"></i>
          </li>
          <li class="addImg" v-if="imgNumber<9" @click="uploadImg"><img src="../../../../assets/img/img.png"></li>
        </ul>
      </div>
    </div>
    <div class="submit-btn">
      <button class="btn next-btn" @click="submit">提交评论</button>
    </div>
    <modal-bar v-if="modalForm" :maskHeader="1" :canClose="false">
      <div  slot="modal-main">
        <p>提交成功，请耐心等待审核</p>
        <button class="btn next-btn" @click="modalSubmit">确定</button>
      </div>

    </modal-bar>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        title: '我的票券',
        content:'',
        goods:this.$route.query.info,
        imgId:[],
        imgList:[],
        imgNumber:0,
        modalForm:false,
      }
    },
    computed: {
      ...mapState([
        'token'
      ])
    },
    mounted(){
      this.native.grabHandler('user.ticket.eval');
    },
    methods: {
      /*上传图片**/
      uploadImg(){
        this.native.imgHandler(2, {token: this.token}, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            this.imgNumber+=response.body.resultData.length;
            if(this.imgNumber>9){
              this.toast('数量不能超过九张');
              this.imgNumber=this.imgList.length;
              this.imgList.pushs();
            }else{
              this.imgList.pushs(response.body.resultData);
            }
          }
        })
      },
      /*删除图片**/
      deleteImg(index){
        this.imgList.splice(index,1);
        this.imgNumber=this.imgList.length;
      },
      /*提交评论**/
      submit(){
        this.imgId=[];
        this.imgList.forEach((item) => {
          this.imgId.push(item.fileId)
        })
        if(this.content!='' || this.imgId.length!=0){
          var postData = {
            content: this.content,
            imgs:this.imgId,
            orderId: this.goods.id,
            token: this.token,
          };
          this.native.apiHandler('	XS-MAL-SPPJ', postData , (res) => {
            this.native.grabHandler('user.ticket.eval.submit');
            let response = this.convert(res);
            if (response.body.isSuccessful == true) {
              if(response.body.resultData.result == 0){
                this.toast(response.body.resultData.msg)
              }else if(response.body.resultData.result == 1){
                this.modalForm=true;
              }
            }
          })
        }else{
          this.toast('评论内容不能为空');
        }
      },
      modalSubmit(){
        this.modalForm=false;
        this.$router.go(-1);
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "eval.less";
</style>
