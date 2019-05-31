<template>
  <button value="" @click="getCode" :disabled="btnDisabled">{{btnText}}</button>
</template>
<script>
  import {mapState} from 'vuex'
  export default{
    name: 'asideBar',
    data(){
      return {
        times: 60,
        btnText: this.text,
        btnDisabled: false,
      }
    },
    computed: {},
    mounted(){
    },
    props: ['text', 'phone','type'],
    watch: {},
    methods: {
      getCode() {
        if (!this.verifyPhone(this.phone)) {
          return;
        } else {
          var postData = {
            mobile: this.phone,
            type: this.type.toString(),
            ostype: this.browser.versions.android ? '1' : '0',
          };
          this.native.apiHandler('XS-SMS-FSDX', postData, (res) => {
            let response = this.convert(res);
            if (response.body.isSuccessful == true) {
              this.countDown();
              this.btnDisabled = true;
              let name = response.body.resultData.customerName;
              if(name==undefined||name==''){
                name = ''
              }
              this.$emit('onOk', name);
            }
          })

        }
      },
      /**倒计时方法*/
      countDown() {
        window.time = setInterval(() => {
          this.times--;
          this.btnText = (this.times) + 's';
          this.btnDisabled = true;
          if (this.times <= 0) {
            clearInterval(window.time);
            this.btnText = '发送验证码';
            this.times = 60;
            this.btnDisabled = false;
          }
        }, 1000);
      }
    }
  }
</script>
<style scoped>

</style>
