<template>
    <div class="app">
        <head-bar :head-title="title" :head-back='true'></head-bar>
        <div class="main-content form-intro">
            <img :src="'./static/forum/autohome.png'" alt="" />
            <!--<img :src="'./static/forum/fblife.jpg'" alt="" />-->
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            title: '帖子链接获取步骤',
            qcImg: '',
            yyImg: '',
        }
    },
    mounted() {
      this.native.grabHandler('activity.forum.intro');
    },
    methods: {

    }
}
</script>
<style lang="less" scoped>
@import "forum.less";
</style>
