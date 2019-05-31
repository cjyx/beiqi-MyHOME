<template>
  <mt-popup v-model="popShow" position="bottom" class="mint-popup" :modal="true" :closeOnClickModal="true">
    <div class="picker-toolbar">
      <span class="mint-datetime-action mint-datetime-cancel" @click="onCancel">取消</span>
      <span class="mint-datetime-action mint-datetime-confirm" @click="onOk">确定</span>
    </div>
    <mt-picker ref="popSheet" :slots="slotsArray" @change="onPopChange" :visible-item-count="5"
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
        typeList: [],
        selected: '',
      }
    },
    computed: {},
    mounted(){
      this.init();
    },
    props: [ 'show','type'],
    watch: {
      show(val){
        this.popShow = true;
      },
    },
    methods: {
      init() {
        this.native.apiHandler('XS-VEH-BDCX', {type:this.type}, (res) => {
          let response = this.convert(res);
          if (response.body.isSuccessful == true) {
            var resultData = response.body.resultData;
            this.typeList = resultData;
            var typeArray = [];
            resultData.forEach((item, index) => {
              typeArray.push(item.brandCarType);
            })
            this.$refs['popSheet'].setSlotValues(0, typeArray);
          }
        })
      },
      onPopChange(picker, values){
        this.selected = values[0];
      },
      onOk(){
        var entity = {};
        this.typeList.forEach((item, index) => {
          if (item.brandCarType == this.selected) {
            entity = item;
          }
        })
        this.popShow = false;
        this.$emit('onOk', entity);
      },
      onCancel(){
        this.popShow = false;
      }
    }
  }
</script>
<style scoped>

</style>
