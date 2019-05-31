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

export default {
  data() {
    return {
      popShow: false,
      slotsArray: [
        { flex: 1, values: [], textAlign: 'center' },
        { flex: 1, values: ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'], textAlign: 'center' }
      ],
      selectDate: '',
      selectTime: ''
    };
  },
  computed: {},
  mounted() {
    var dates = [];
    var current = new Date();
    for (var i = 2; i <= 30; i++) {
      var date = new Date(current.setDate(current.getDate() + 1));
      dates.push(date.format('yyyy-MM-dd'));
    }
    this.$refs['popSheet'].setSlotValues(0, dates);
  },
  props: ['show'],
  watch: {
    show(val) {
      this.popShow = true;
    }
  },
  methods: {
    onPopChange(picker, values) {
      this.selectDate = values[0];
      this.selectTime = values[1];
    },
    onOk() {
      this.popShow = false;
      this.$emit('onOk', this.selectDate +' '+this.selectTime);
    },
    onCancel() {
      this.popShow = false;
    }
  }
};
</script>
<style scoped>

</style>
