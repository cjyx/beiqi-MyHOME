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
  import area from '../common/area'
  export default{
    name: 'asideBar',
    data(){
      return {
        popShow: false,
        slotsArray: [{flex: 1, values: [], textAlign: 'center'}, {flex: 1, values: [], textAlign: 'center'}],
        selectProvince: '',
        selectCity: '',
      }
    },
    computed: {},
    mounted(){
      this.init();
    },
    props: ['show'],
    watch: {
      show(val){
        this.popShow = true;
      },
    },
    methods: {
      init() {
        var list = area.getAllProvinceName();
        this.$refs['popSheet'].setSlotValues(0, list);
      },
      onPopChange(picker, values){
        var list = area.getAllCityNameByPName(values[0]);
        picker.setSlotValues(1, list);
        this.selectProvince = values[0];
        this.selectCity = values[1];
      },
      onOk(){
        var city = area.getCityByName(this.selectCity);
        this.popShow = false;
        console.log(city);
        this.$emit('onOk', city);
      },
      onCancel(){
        this.popShow = false;
      }
    }
  }
</script>
<style scoped>

</style>
