<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
      <a slot="right" @click="articelSubmit">
        发布
      </a>
    </head-bar>
    <div class="main-content">
      <div class="form-content form-create">
        <div class="form-group">
          <label class="required">标题：</label>
          <input type="text" placeholder="请输入标题" v-model="articleTitle">
        </div>
        <!--<div class="form-group">-->
          <!--<label>头图：</label>-->
          <!--<div class="headImg">-->
            <!--<img :src="headimg" :id="headimgId">-->
          <!--</div>-->
        <!--</div>-->
        <div class="form-group">
          <textarea rows="8" placeholder="请输入内容" v-model="textContent"></textarea>
          <!--<vue-editor v-model="content"></vue-editor>-->
        </div>
        <ul class="upload-img">
          <li v-for="(item,index) in arrImg" :key="index">
            <img :src="item.src">
            <i class="iconfont icon-close" @click="deleteImg(index)"></i>
          </li>
        </ul>
      </div>
      <button class="btn next-btn" @click="uploadImg" v-if="imgNumber<9">上传图片</button>
      <!--<button class="btn next-btn" @click="articelSubmit">提交</button>-->
    </div>
  </div>
</template>
<script>
import { VueEditor } from 'vue2-editor';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      title: '发布文章',
      textContent: '',
      arrImg: [],
      contentImg: '',
      showModuleName: false,
      articleTitle: '',
      imgNumber: 0
    };
  },
  components: {
    VueEditor
  },
  computed: {
    ...mapState(['token'])
  },
  mounted() {
    this.native.grabHandler('articleCreate.index');
  },
  methods: {
    uploadImg() {
      this.native.imgHandler(9, { token: this.token }, res => {
        let response = this.convert(res);
        if (response.body.isSuccessful == true) {
          var resultData = response.body.resultData;
          this.imgNumber += response.body.resultData.length;
          if (this.imgNumber > 9) {
            this.toast('数量不能超过九张');
            this.imgNumber = this.arrImg.length;
          } else {
            for (var i = 0, len = resultData.length; i < len; i++) {
              var img = resultData[i];
              this.arrImg.push({ id: img.fileId, src: img.fileUrl });
            }
          }
        }
      });
    },
    /*删除图片**/
    deleteImg(index) {
      this.arrImg.splice(index, 1);
      this.imgNumber = this.arrImg.length;
    },
    articelSubmit() {
      if (this.articleTitle == '') {
        this.toast('标题不能为空');
        return false;
      } else {
        this.contentImg = '';
        var img = '';
        var headImg = '';
        this.arrImg.forEach((item, index) => {
          if (index == 0) {
            headImg = item.id;
          }
          img +=
            '<img hidefocus="true" ref="imgs" src="' +
            item.src +
            '" width="80" height="60">';
        });
        this.contentImg += img;
        let contentAll = this.textContent+'<br />'+ this.contentImg;
        var postData = {
          articleContent: contentAll,
          articleHeadFigureID: headImg,
          articleTitle: this.articleTitle,
          groupId: this.$route.query.id,
          token: this.token
        };
        this.native.apiHandler('XS-BUS-QZFBWZ', postData, res => {
          this.native.grabHandler('articleCreate.submit');
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            if (response.body.resultData == 1) {
              this.toast('发布成功');
              this.$router.go(-1);
            } else if (response.body.resultData == 0) {
              this.toast('发布失败');
            }
          }
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import 'create.less';
</style>
