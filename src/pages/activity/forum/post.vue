<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'></head-bar>
    <div class="main-content">
      <div class="form-content post-content">
        <div class="form-group">
          <label class="required">发帖论坛：</label>
          <input type="text" placeholder="请选择发帖论坛" v-model="form.bbsName" @click="popName=!popName" readonly>
          <i class="iconfont icon-right"></i>
        </div>
        <!--<div class="form-group">-->
          <!--<div class="option">-->
            <!--<input type="radio" name="type" value="1" checked v-model="form.bbsType">-->
            <!--<span></span>-->
            <!--<label>内容有效帖</label>-->
          <!--</div>-->
          <!--<div class="option">-->
            <!--<input type="radio" name="type" value="2" v-model="form.bbsType">-->
            <!--<span></span>-->
            <!--<label>精华帖</label>-->
          <!--</div>-->
          <!--&lt;!&ndash; <div class="option">-->
                <!--<input type="radio" name="type" value="3" v-model="form.bbsType">-->
                <!--<span></span>-->
                <!--<label>高质量帖</label>-->
              <!--</div> &ndash;&gt;-->
        <!--</div>-->
        <div class="form-group">
          <label class="required">帖子标题：</label>
          <input type="text" placeholder="请输入帖子标题" v-model="form.bbsTitle">
        </div>
        <div class="form-group">
          <label class="required">帖子所属版：</label>
          <input type="text" placeholder="请输入帖子所属版" v-model="form.bbsVersion">
        </div>
        <div class="form-group">
          <label class="required">发帖时间：</label>
          <input type="text" placeholder="请选择发帖时间" v-model="form.bbsDate" @click="open('time')" readonly>
          <i class="iconfont icon-right"></i>
        </div>
        <div class="form-group">
          <label class="required">帖子链接：</label>
          <input type="text" placeholder="请输入帖子链接" v-model="form.bbsLink">
          <i class="iconfont icon-what" @click="$router.push({name:'forumIntro'})"></i>
        </div>
        <div class="form-group">
          <label class="required">帖子类型：</label>
          <input type="text" placeholder="请选择帖子类型" v-model="form.bbsClassify" @click="popType=!popType" readonly>
          <i class="iconfont icon-right"></i>
        </div>
        <button class="btn next-btn" @click="submit" :disabled="sub">提交信息</button>
      </div>
    </div>
    <!--发帖论坛-->
    <type-popup :show="popName" :default="name" :list="nameList" @onOk="emitName"></type-popup>
    <!--发帖时间-->
    <mt-datetime-picker ref="time" type="date" v-model="pickerValue" :startDate="new Date('2016-09-10')" @confirm="handleChange"></mt-datetime-picker>
    <!--帖子类型-->
    <type-popup :show="popType" :default="type" :list="typeList" @onOk="emitType"></type-popup>

    <transition name="slide-left">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      title: '论坛发帖',
      name: '',
      time: '',
      type: '',
      popName: false,
      popType: false,
      nameList: [],
      typeList: ['车主口碑', '新车作业', '车友看车', '车辆养护', '改装美容', '酷车实拍', '车友活动', '自驾游记', '休闲生活', '大话车展', '车主故事', '知识分享'],
      pickerValue: new Date(),
      form: {
        bbsName: '',
//        bbsType: 1,
        bbsTitle: '',
        bbsVersion: '',
        bbsDate: '',
        bbsLink: '',
        bbsClassify: ''
      },
      sub:false,
    }
  },
  computed: {
    ...mapState([
      'token', 'user'
    ])
  },
  mounted() {
    if (this.user.autohomeName != '') {
      this.nameList.push('汽车之家');
    }
    if (this.user.fblifeName != '') {
      this.nameList.push('越野E族');
    }
    this.native.grabHandler('activity.forum.post');
  },
  methods: {
    emitName(data) {
      this.form.bbsName = data;
    },
    emitType(data) {
      this.form.bbsClassify = data;
    },
    open(picker) {
      this.$refs[picker].open();
    },
    handleChange(value) {
      var datetime = (new Date(value)).format('yyyy-MM-dd');
      this.form.bbsDate = datetime;
    },
    submit() {
      if (this.form.bbsName.trimNo() == '') {
        this.toast('请选择发帖论坛');
        return;
      }
      if (this.form.bbsTitle.trimNo() == '') {
        this.toast('请输入帖子标题');
        return;
      }
      if (this.form.bbsVersion.trimNo() == '') {
        this.toast('请输入帖子所属版');
        return;
      }
      if (this.form.bbsDate.trimNo() == '') {
        this.toast('请选择发帖时间');
        return;
      }
      if (this.form.bbsLink.trimNo() == '') {
        this.toast('请输入帖子链接');
        return;
      }
      if (this.form.bbsClassify.trimNo() == '') {
        this.toast('请选择帖子类型');
        return;
      }
      this.sub = true;
      this.form.token = this.token;
      this.native.apiHandler('XS-BBS-XZLT', this.form, (res) => {
        let response = this.convert(res);
        this.native.grabHandler('activity.forum.post.submit');
        if (response.body.isSuccessful == true) {
          this.sub = false;
          var resultData = response.body.resultData;
          if (resultData == true) {
            this.toast('帖子提交成功，请耐心等待审核');
            this.$router.go(-1);
          } else {
            this.toast('帖子链接已存在');
            return;
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "forum.less";
</style>
