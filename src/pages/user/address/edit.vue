<template>
  <div class="app">
    <head-bar :head-title="title" :head-back='true'>
      <a slot="right" @click="submit">保存</a>
    </head-bar>
    <div class="main-content">
      <div class="form-content">
        <div class="form-group">
          <label class="required">联系人：</label>
          <input type="text" maxlength="20" v-model="form.name">
        </div>
        <div class="form-group">
          <label class="required">联系电话：</label>
          <input type="text" placeholder="请输入联系电话" maxlength="11" v-model="form.tel">
        </div>
        <div class="form-group">
          <label class="required">所在省市：</label>
          <input type="text" placeholder="请选择所在省市" v-model="cityName" @click="popCity=!popCity" readonly>
          <i class="iconfont icon-right"></i>
        </div>
        <div class="form-group">
          <textarea rows="6" placeholder="请输入详细信息" maxlength="128" v-model="form.addressDetail"></textarea>
        </div>
        <div class="form-group">
          <label class="required">标签：</label>
          <div class="like">
            <div class="option square" v-for="(item,index) in tagList" :key="index">
              <input type="radio" name="tag" :value=item.tagId v-model="form.tagId">
              <span></span>
              <label>{{item.tagName}}</label>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label >默认地址：</label>
          <!--<mt-switch v-model="form.status"></mt-switch>-->
          <div class="option square">
            <input type="radio" name="status" value="1"  v-model="form.status">
            <span></span>
            <label>是</label>
          </div>
          <div class="option square">
            <input type="radio" name="status" value="0"  v-model="form.status">
            <span></span>
            <label>否</label>
          </div>
        </div>
      </div>
    </div>
    <!--所在城市-->
    <pcity-popup :show="popCity" @onOk="emitCity"></pcity-popup>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        title: '修改地址',
        value: true,
        id: this.$route.query.id,
        cityName:this.$route.query.cityName,
        popCity: false,
        tagList:[],
        form: {
          id: '',
          name: '',
          status: 0,
          tel: '',
          addressDetail: '',
          tagId:'',
          province:'',
          city:''
        }
      }
    },
    computed: {
      ...mapState([
        'token'
      ])
    },
    mounted(){
      this.native.grabHandler('user.information.address.addressEdit');
      this.init();
      this.tag();
    },
    methods: {
      init(){
        var postData = {
          id: this.id,
          token: this.token,
        };
        this.native.apiHandler('XS-VEH-DZMR', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            this.form = resultData;
          }
        })
      },
      //标签列表
      tag(){
        this.native.apiHandler('XS-VEH-BQLB', {}, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            this.tagList=response.body.resultData;
          }
        })
      },
//      所在省市
      emitCity(data){
        this.form.province = data.pName;
        this.form.city = data.name;
        this.cityName = data.pName + '-' + data.name;
      },
      submit()
      {
        if (this.form.name.trimNo() == '') {
          this.toast('请输入姓名');
          return;
        }
        if (!this.verifyPhone(this.form.tel)) {
          return;
        }
        if (this.cityName.trimNo() == '') {
          this.toast('请选择所在省市');
          return;
        }
        if (this.form.addressDetail.trimNo() == '') {
          this.toast('请输入详细信息');
          return;
        }
        if (this.form.tagId.trimNo() == '') {
          this.toast('请选择标签');
          return;
        }
        this.form.token = this.token;
//        this.form.status = this.form.status ? '1' : '0';

        this.native.apiHandler('XS-VEH-DZBJ', this.form, (res) => {
          this.native.grabHandler('user.information.address.addressEdit.submit');
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            if (resultData) {
              //保存用戶信息到vuex
              if (this.form.status == '1') {
                this.$store.commit('mttSaveDefAddress', this.form);
              }
              this.toast('修改成功');
              this.$router.go(-1);
            }
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "address.less";
</style>
