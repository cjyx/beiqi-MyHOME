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
        selected: '',
        disDealer:true,
      }
    },
    computed: {},
    mounted(){
    },
    props: ['default', 'show', 'cityCode','type'],
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
//        不同功能类型的经销商：1-车辆认证；2-转介绍，试驾； 3-保养，上门
        var postData = {
          type:this.type,
          cityCode: this.cityCode
        };
        this.native.apiHandler('XS-VEH-TSLB', postData, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            if(resultData.length==0){
              this.toast('当前省市暂无经销商');
              this.disDealer=true;
            }else{
              this.$refs['popSheet'].setSlotValues(0, resultData);
              this.disDealer=false;
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
