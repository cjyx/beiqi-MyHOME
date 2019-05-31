<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
      <!--<router-link :to="{ name: 'information', params: { id: 123 }}" slot="right">取消</router-link>-->
    </head-bar>
    <div class="main-content">
      <div class="form-content">
        <div class="form-group">
          <label>
            <img v-if="this.form.picUrl=='' && this.form.sex==1" src="../../../assets/img/man.png" @click="upUserImg">
            <img v-else-if="this.form.picUrl=='' && this.form.sex==0" src="../../../assets/img/woman.png" @click="upUserImg">
            <!--<img v-else-if="this.form.picUrl=='' && this.form.sex==''" src="../../../assets/img/user-head.png" @click="upUserImg">-->
            <img v-if="this.form.picUrl!=''" :src="this.form.picUrl" @click="upUserImg">
          </label>
          <input type="text" value="头像" readonly>
        </div>
        <div class="form-group">
          <label class="required">姓名：</label>
          <input type="text" placeholder="请输入姓名" maxlength="20" v-model="form.name">
        </div>
        <div class="form-group">
          <label class="required">性别：</label>
          <div class="option">
            <input type="radio" name="sex" value="1" v-model="form.sex">
            <span></span>
            <label>男</label>
          </div>
          <div class="option">
            <input type="radio" name="sex" value="0" v-model="form.sex">
            <span></span>
            <label>女</label>
          </div>
        </div>
        <div class="form-group">
          <label>身份证号：</label>
          <input type="text" placeholder="请输入身份证号" maxlength="18" v-model="form.idNumber">
        </div>
        <div class="form-group">
          <label>出生日期：</label>
          <input type="text" placeholder="请选择出生日期" v-model="birthday" @click="open('birth')" readonly>
          <i class="iconfont icon-right"></i>
        </div>
        <div class="form-group">
          <label>所在城市：</label>
          <input type="text" placeholder="请选择所在城市" v-model="cityName" @click="popCity=!popCity" readonly>
          <i class="iconfont icon-right"></i>
        </div>
        <div class="form-group">
          <label>常用地址：</label>
          <input type="text" placeholder="请输入常用地址" v-model="form.adress">
        </div>
        <div class="form-group">
          <label>邮箱：</label>
          <input type="text" placeholder="请输入邮箱" maxlength="24" v-model="form.email">
        </div>
        <div class="form-group">
          <label>兴趣爱好：</label>
          <input type="text" placeholder="请输入您的兴趣爱好"  v-model="form.interest">
        </div>
        <div class="form-group">
          <label>汽车之家论坛名：</label>
          <input type="text" value="" placeholder="请输入论坛名" v-model="form.autohomeName"
                 :disabled="forumH">
        </div>
        <div class="form-group">
          <label>越野 E 族论坛名：</label>
          <input type="text" value="" placeholder="请输入论坛名" v-model="form.fblifeName" :disabled="forumE">
        </div>
        <button class="btn next-btn" @click="submit">提交</button>
      </div>
      <!--所在城市-->
      <pcity-popup :show="popCity" :default="cityName" @onOk="emitCity"></pcity-popup>
      <!--出生日期-->
      <mt-datetime-picker ref="birth" type="date" v-model="pickerValue" :startDate="new Date('1950')"
                          @confirm="handleChange"></mt-datetime-picker>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import area from 'src/common/area'
  export default {
    data () {
      return {
        title: '我的信息',
        pickerValue: new Date(),
        popCity: false,
        popCarType: false,
        province:'',
        city: {},
        cityName: '',
        birthday: '',
//        hobby: [],
        forumH: false,
        forumE: false,
        form: {},
      }
    },
    computed: {
      ...mapState([
        'token', 'user'
      ])
    },
    mounted(){
      this.native.grabHandler('user.information.informationEdit');
      this.form = JSON.parse(JSON.stringify(this.user));
      if(this.form.sex==''){
          this.form.sex = '1';
      }
      this.init();
    },
    methods: {
      emitCode(code){
      },
      emitCity(data){
        this.city = data;
        this.cityName = data.pName + '-' + data.name;
      },
      open(picker) {
        this.$refs[picker].open();
      },
      handleChange(value) {
        this.birthday = (new Date(value)).format('yyyy/MM/dd');
      },
      /**获取用户信息*/
      init(){
        this.birthday = this.user.birthday;
        if (this.user.cityCode != '') {
          this.city = area.getCityByCode(this.user.cityCode);
          this.cityName = this.city.pName + '-' + this.city.name;
        }
//        if (this.user.interest != '') {
//          this.hobby = this.user.interest.split(',');
//        }
        if (this.user.autohomeName != '') {
          this.forumH = true;
        }
        if (this.user.fblifeName != '') {
          this.forumE = true;
        }
      },
      upUserImg(){
        this.native.imgHandler(0, {token: this.token}, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            for (var i = 0, len = resultData.length; i < len; i++) {
              this.form.headId = resultData[i].fileId;
              this.form.picUrl = resultData[i].fileUrl;
            }
          }
        })
      },
      /**提交修改信息*/
      submit(){
        if (this.form.name.trimNo() == '') {
          this.toast('请输入姓名');
          return;
        }
        if (this.form.idNumber.trimNo() != '') {
          if (!this.verifyIdNumber(this.form.idNumber)) {
            return;
          }
        }
        if (this.form.email.trimNo() != '') {
          if (!this.verifyEmail(this.form.email)) {
            return;
          }
        }

        if (this.cityName != '') {
          this.form.cityCode = this.city.code;
          this.form.provinceCode = this.city.pCode;
        }
        this.form.birthday = this.birthday;
//        this.form.interest = this.hobby.join(',');
        this.form.token = this.token;
        this.native.apiHandler('XS-VEH-YHXG', this.form, (res) => {
          this.native.grabHandler('user.information.informationEdit.submit');
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            if (resultData==0) {
              //保存用戶信息到vuex
              this.$store.commit('mttSaveUserInfo', this.form);
              this.$router.go(-1);
            }else if(resultData==1){
              this.toast('汽车之家用户名已存在');
              return;
            }else if(resultData==2){
              this.toast('越野e族用户名已存在');
              return;
            }else if(resultData==3){
              this.toast('论坛用户名已存在');
              return;
            }
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "information.less";
</style>
