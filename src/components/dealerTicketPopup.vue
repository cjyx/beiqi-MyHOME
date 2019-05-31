<template>
  <mt-popup v-model="popShow" position="bottom" class="mint-popup" :modal="true" :closeOnClickModal="true">
    <div class="picker-toolbar">
      <span class="mint-datetime-action mint-datetime-cancel" @click="onCancel">取消</span>
      <span class="mint-datetime-action mint-datetime-confirm" @click="onOk">确定</span>
    </div>
    <mt-picker ref="popSheet" :slots="slotsArray" :valueKey="'companyName'" @change="onPopChange" :visible-item-count="5"
               :show-toolbar="false"></mt-picker>
  </mt-popup>
</template>
<script>
  import {mapState} from 'vuex'
  export default{
    name: 'asideBar',
    data(){
      return {
        popShow: false,
        slotsArray: [
          {
            flex: 1,
            values: [],
            textAlign: 'center'
          }],
//        list: [],
        selected: '',
        disDealer:false,
      }
    },
    computed: {
      ...mapState([
        'token'
      ])
    },
    mounted(){
    },
    props: ['default', 'show', 'cityCode','cashId'],
    watch: {
      show(val){
        this.popShow = true;
      },
      cityCode(val){
        if(val!=''){
          this.init();
        }
      },
    },
    methods: {
      init() {
        var postData = {
          cityCode: this.cityCode,
          commodityId:this.cashId,
          token: this.token
        };
        this.native.apiHandler('XS-MAL-DJQJXS', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            if(resultData.length==0){
              this.toast('当前省市暂无经销商');
              this.disDealer=true;
            }else{
              this.disDealer=false;
              this.$refs['popSheet'].setSlotValues(0, resultData);
            }
            this.$emit('onDisDealer',this.disDealer)
          }
        })
      },
      onPopChange(picker, values){
        this.selected = values[0];
      },
      onOk(){
        this.popShow = false;
        this.$emit('onOk', this.selected);
      },
      onCancel(){
        this.popShow = false;
      }
    }
  }
</script>
<style scoped>

</style>
