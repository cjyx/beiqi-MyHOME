<template>
    <div class="app">
        <head-bar :head-title="title" :head-back='true'>
        </head-bar>
        <div class="main-content aty-collect">
          <div class="form-content">
            <div class="eval-content" v-if="needWord">
              <textarea class="words" rows="6" placeholder="请输入征集信息..."  v-model="form.words"></textarea>
            </div>
            <ul v-if="needImg">
              <!-- v-if="needImg"-->
              <li v-for="(item,index) in form.imgs" :key="index">
                <img :src="item.src" alt="">
                <i class="iconfont icon-close" @click="delImg(item,index)"></i>
              </li>
              <li>
                <i class="iconfont icon-choose" @click="upImg"></i>
              </li>
            </ul>
          </div>
          <button class="btn next-btn" @click="submit">提交</button>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            title: '征集信息',
            id: this.$route.query.id,
            needImg: true,
            needWord: true,
            form: {
                imgs: [],
                words: ''
            }
        };
    },
    computed: {
        ...mapState([
            'token',
        ])
    },
    mounted() {
        this.init();
      this.native.grabHandler('activity.line.collect');
    },
    methods: {
        init() {
            var postData = {
                activityId: this.id
            };
            this.native.apiHandler('XS-BUS-ZJCS', postData, (res) => {
                let response = this.convert(res);
                if (response.body.isSuccessful == true) {
                    var resultData = response.body.resultData;
                    this.needImg = resultData.imgs;
                    this.needWord = resultData.words;
                }
            })
        },
        delImg(item, index) {
            this.native.grabHandler('activity.line.collect.delImg.'+item.id);
            this.form.imgs.splice(index, 1);
        },
        upImg() {
          this.native.grabHandler('activity.line.collect.upImg');
            if (this.form.imgs.length >= 9) {
                this.toast('图片最多可添加9张');
                return;
            }
            this.native.imgHandler(1, { token: this.token }, (res) => {
                // alert(res)
                let response = this.convert(res);
                if (response.body.isSuccessful == true) {
                    var resultData = response.body.resultData;
                    for (var i = 0, len = resultData.length; i < len; i++) {
                        this.form.imgs.push({ imgId: resultData[i].fileId, src: resultData[i].fileUrl });
                    }
                }
            })
        },
        submit() {
            var postData = {
                words: this.form.words,
                imgs:this.form.imgs,
                activityId: this.id,
                token: this.token
            };
            if (this.needWord && this.form.words == '') {
                this.toast('请输入内容');
                return;
            }
            if (this.needImg && this.form.imgs.length == 0) {
                this.toast('请选择上传图片');
                return;
            }
            this.native.apiHandler('XS-BUS-ZJXZ', postData, (res) => {
                let response = this.convert(res);
                this.native.grabHandler('activity.line.collect.submit');
                if (response.body.isSuccessful == true) {
                    var resultData = response.body.resultData;
                    if (resultData) {
                        this.toast('提交成功，感谢您的参与，谢谢');
                        this.$router.go(-1);
                    }
                }
            })
        }
    },

}
</script>
<style lang="less" scoped>
@import "line.less";
</style>

