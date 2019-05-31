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
        selected: '',
      }
    },
    computed: {},
    mounted(){
      this.init();
    },
    props: ['default', 'show', 'list'],
    watch: {
      show(val){
        this.popShow = true;
      },
    },
    methods: {
      init() {
//        var list = ['绅宝CC', '绅宝D60', '绅宝D70', '绅宝D80', '绅宝X65', '绅宝X55', '绅宝X25', '绅宝D20 CROSS', '绅宝X35', '绅宝D50', '绅宝D20'];
        this.$refs['popSheet'].setSlotValues(0, this.list);
      },
      onPopChange(picker, values){
        this.selected = values[0];
      },
      onOk(){
        this.popShow = false;
        console.log(this.selected);
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
