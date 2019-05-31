<template>
  <div>
    <mask-bar :maskHeader="2" @onHide="hide"></mask-bar>
    <div class="share" :class="fadeUp ? 'share-up' : 'share-down'">
      <div>
        <a @click="share(1)">
          <i class="iconfont icon-wechart"></i>
          <span>微信好友</span>
        </a>
        <a @click="share(2)">
          <i class="iconfont icon-friends"></i>
          <span>朋友圈</span>
        </a>
        <a @click="share(4)">
          <i class="iconfont icon-qq"></i>
          <span>QQ好友</span>
        </a>
        <!--<a @click="share(5)">-->
          <!--<i class="iconfont icon-qzone"></i>-->
          <!--<span>QQ空间</span>-->
        <!--</a>-->
      </div>
      <button class="share-btn" @click.self="hide">取消</button>
    </div>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  export default {
    props: ['img', 'title', 'desc', 'url','id','status'],
    data () {
      return {
        fadeUp: true
      }
    },
    computed: {
      ...mapState([
        'token'
      ])
    },
    mounted(){
    },
    methods: {
      hide(){
        this.fadeUp = false;
        clearTimeout(times);
        var times = setTimeout(() => {
          this.$emit('onHide');
        }, 200)
      },
      share(type){
        this.native.grabHandler('user.share.'+type);
        var postData = {
          type:type,
          title: this.title,
          desc: this.desc,
          url: this.url
        };
        this.native.shareHandler(postData, (res) => {
          let response = JSON.parse(res);
          this.$emit('onLink', type);
          if(response.status==1&&this.id&&this.token){
            var shareData = {
              id: this.id,
              channel: type,
              token: this.token,
              status:this.status,
            };
            this.native.apiHandler('XS-BUS-HDHGFXTJ', shareData, (res) => {
              let response = this.convert(res);
              if (response.body.isSuccessful == true) {
                if (response.body.resultData == true) {
//                  this.toast('分享成功');
                } else{
                  this.toast('分享失败');
                }
              }
            })
          }
        })
      },
    }
  }
</script>
<style lang="less" scoped>
  @import "../less/variable.less";

  .share {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    background: @bg-color-base;
    &.share-up {
      transform: translate(0, 0);
      animation: fadeUp 0.3s;
    }
    &.share-down {
      transform: translate(0, 100%);
      animation: fadeDown 0.3s;
    }
    & > div {
      display: flex;
      flex-flow: row nowrap;
      padding: @padding-body*2 0;
      align-items: center;
      a {
        flex: 1;
        display: flex;
        flex-flow: column;
        align-items: center;
        i {
          font-size: @font-size-big*4;
          color: #3eb135;
        }
        &:nth-child(3) {
          i {
            color: #4dafea;
          }
        }
        &:nth-child(4) i {
          color: #eecf3d;
        }
      }
    }
  }

  @keyframes fadeUp {
    0% {
      transform: translate(0, 100%);
    }
    100% {
      transform: translate(0, 0);
      transition: transform .3s;
    }
  }

  @keyframes fadeDown {
    0% {
      transform: translate(0, 0);
      transition: transform .3s;
    }
    100% {
      transform: translate(0, 100%);
    }
  }
</style>
