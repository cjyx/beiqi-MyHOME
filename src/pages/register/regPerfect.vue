<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='false'>
      <router-link :to="{ name: 'home'}" slot="right">关闭</router-link>
    </head-bar>
    <div class="main-content">
      <div class="form-content">
        <div class="form-group">
          <label class="required">性别：</label>
          <div class="option">
            <input type="radio" name="sex" value="1" v-model="form.sex" checked="checked">
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
          <label>汽车之家论坛名：</label>
          <input type="text" value="" placeholder="请输入论坛名" v-model="form.autohomeName" maxlength="20">
        </div>
        <div class="form-group">
          <label>越野 E 族论坛名：</label>
          <input type="text" value="" placeholder="请输入论坛名" v-model="form.fblifeName" maxlength="20">
        </div>
        <div class="form-group">
          <label>兴趣爱好：</label>
          <input type="text" placeholder="请输入您的兴趣爱好"  v-model="hobby">
          <!--<div class="like">-->
            <!--<div class="option square">-->
              <!--<input type="checkbox" name="hobby" value="跑步" v-model="hobby">-->
              <!--<span></span>-->
              <!--<label>跑步</label>-->
            <!--</div>-->
            <!--<div class="option square">-->
              <!--<input type="checkbox" name="hobby" value="跳舞" v-model="hobby">-->
              <!--<span></span>-->
              <!--<label>跳舞</label>-->
            <!--</div>-->
            <!--<div class="option square">-->
              <!--<input type="checkbox" name="hobby" value="篮球" v-model="hobby">-->
              <!--<span></span>-->
              <!--<label>篮球</label>-->
            <!--</div>-->
            <!--<div class="option square">-->
              <!--<input type="checkbox" name="hobby" value="上网" v-model="hobby">-->
              <!--<span></span>-->
              <!--<label>上网</label>-->
            <!--</div>-->
            <!--<div class="option square">-->
              <!--<input type="checkbox" name="hobby" value="电影" v-model="hobby">-->
              <!--<span></span>-->
              <!--<label>电影</label>-->
            <!--</div>-->
          <!--</div>-->
        </div>
        <button class="btn next-btn" @click="submit">保存</button>
      </div>
    </div>
    <!--所在城市-->
    <pcity-popup :show="popCity" :default="cityName" @onOk="emitCity"></pcity-popup>
    <!--出生日期-->
    <mt-datetime-picker ref="birth" type="date" v-model="pickerValue" :startDate="new Date('1950')"
                        @confirm="handleChange"></mt-datetime-picker>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import area from 'src/common/area'
  export default {
    data () {
      return {
        title: '补全信息',
        cityName: '',
        pickerValue: new Date(),
        popCity: false,
        birthday: '',
        city: {},
        hobby: '',
        form: {},
      }
    },
    computed: {
      ...mapState([
        'token', 'user'
      ])
    },
    mounted(){
      this.native.grabHandler('register.regPerfect');
      this.form = this.user;
      this.init();
    },
    methods: {
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
        if (this.token == '') {
          return;
        }
        this.birthday = this.user.birthday;
        if (this.user.cityCode != '') {
          this.city = area.getCityByCode(this.user.cityCode);
          if (this.city != null) {
            this.cityName = this.city.pName + '-' + this.city.name;
          }
        }
//        if (this.user.interest != '') {
//          this.hobby = this.user.interest.split(',');
//        }
      },
      /**提交修改信息*/
      submit(){
        if (this.cityName != '') {
          this.form.cityCode = this.city.code;
          this.form.provinceCode = this.city.pCode;
        }
        this.form.birthday = this.birthday;
        this.form.interest = this.hobby;
        this.form.token = this.token;
        this.native.apiHandler('XS-VEH-YHXG', this.form, (res) => {
          this.native.grabHandler('register.regPerfect.submit');
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            if (resultData==0) {
              this.$router.push({name: 'home', query: {}});
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
  @import "register.less";
</style>
