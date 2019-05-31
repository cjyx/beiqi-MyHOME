<template>
  <transition name="slide-left">
    <router-view></router-view>
  </transition>
</template>

<script>
import './common/array.js'
export default {
  name: 'app',
  mounted() {
    this.init()

    try {
      this.native.callHandler(res => {
        var response = JSON.parse(res)
        if (response.apiCode == 'APP_SkipPage') {
          if (response.apiData.type == '0') {
            this.$router.push({ name: 'message', query: {} })
          }
        }
      })
    } catch (e) {}
  },
  methods: {
    init() {
      if (localStorage.token && localStorage.token != '') {
        this.$store.commit('mttSaveToken', localStorage.token)
      }
      var db = { deviceId: '' }
      this.native.dbHandler(3, db, res => {
        var response = this.convert(res)
        this.$store.commit('mttSaveDeviceId', response.deviceId)
        //  this.$store.commit('mttSaveToken', response.token);
      })
    }
  }
}
</script>

<style lang="less">
@import 'less/default.less';
</style>
