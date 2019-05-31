<template>
</template>

<script>
  export default {
    data() {
      return {}
    },
    computed: {},
    mounted(){
      this.native.grabHandler('user.set.signOut');
      this.init();
    },
    methods: {
      /**退出登录*/
      init(){
        var db = {token: '', username: '', password: ''};
        this.native.dbHandler(0, db, (res) => {
          this.$store.commit('mttSaveToken', '');
          this.$router.push({name: 'login', params: {}});
        })
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
