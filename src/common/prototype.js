import {MessageBox, Toast} from 'mint-ui';

export default{
  install(Vue, options)
  {
    /**吐司*/
    Vue.prototype.toast = function (msg) {
      Toast({message: msg, position: 'bottom', duration: 1500});
    }
    /**验证手机号*/
    Vue.prototype.verifyUserName = function (data) {
      if (data.trimNo() == '') {
        this.toast('请输入手机号码');
        return false;
      }
      var reg = /^1\d{10}$/;
      if (!reg.test(data)) {
        this.toast('请输入正确手机号码');
        return false;
      }
      return true;
    }
    /**验证手机号*/
    Vue.prototype.verifyPhone = function (data) {
      if (data.trimNo() == '') {
        this.toast('请输入手机号码');
        return false;
      }
      var reg = /^1\d{10}$/;
      if (!reg.test(data)) {
        this.toast('请输入正确手机号码');
        return false;
      }
      return true;
    }
    /**验证密码*/
    Vue.prototype.verifyPassword = function (data) {
      if (data == '') {
        this.toast('请输入密码');
        return false;
      }
      var reg = /^[0-9a-zA-Z]{6,16}$/;
      if (!reg.test(data)) {
        this.toast('请输入正确的密码');
        return false;
      }
      //正确true,错误false
      return true;
    }
    /**验证密码*/
    Vue.prototype.verifyConfirmPassword = function (data) {
      if (data == '') {
        this.toast('请输入确认密码');
        return false;
      }
      var reg = /^[0-9a-zA-Z]{6,16}$/;
      if (!reg.test(data)) {
        this.toast('请输入正确确认的密码');
        return false;
      }
      //正确true,错误false
      return true;
    }
    /**验证验证码*/
    Vue.prototype.verifyCode = function (data) {
      if (data.trimNo() == '') {
        this.toast('请输入验证码');
        return false;
      }
      var reg = /^\d{6}$/;
      if (!reg.test(data)) {
        this.toast('请输入正确的验证码');
        return false;
      }
      //正确true,错误false
      return true;
    }
    /**验证必须为数字或者字母*/
    Vue.prototype.verifyLetterOrNumber = function (name, data) {
      if (data.trimNo() == '') {
        this.toast('请输入' + name);
        return false;
      }
      var reg = /^[a-zA-Z0-9]+$/;
      if (!reg.test(data)) {
        this.toast(name + '必须为字母或数字');
        return false;
      }
      //正确true,错误false
      return true;
    }
    /**验证车牌号*/
    Vue.prototype.verifyCarNo = function (data) {
      if (data.trimNo() == '') {
        this.toast('请输入车牌号');
        return false;
      }
      var reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
      //正确true,错误false
      if (!reg.test(data)) {
        this.toast('请输入正确的车牌号');
        return false;
      }
      //正确true,错误false
      return true;
    }
    /**验证验证码*/
    Vue.prototype.verifyVin = function (data) {
      if (data.trimNo() == '') {
        this.toast('请输入VIN');
        return false;
      }
      var reg = /^[0-9a-zA-Z]{17}$/;
      if (!reg.test(data)) {
        this.toast('请输入正确的VIN编码');
        return false;
      }
      //正确true,错误false
      return true;
    }
    /**验证身份证号支持15位和18位身份证号 */
    Vue.prototype.verifyIdNumber = function (data) {
      if (data.trimNo() == '') {
        this.toast('请输入身份证号');
        return false;
      }
      var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      //正确true,错误false
      if (!reg.test(data)) {
        this.toast('请输入正确的身份证号');
        return false;
      }
      return true;
    }
    /**验证身份证号支持15位和18位身份证号 */
    Vue.prototype.verifyEmail = function (data) {
      if (data.trimNo() == '') {
        this.toast('请输入邮箱');
        return false;
      }
      var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      //正确true,错误false
      if (!reg.test(data)) {
        this.toast('请输入正确的邮箱');
        return false;
      }
      return true;
    }

    Vue.prototype.add = function (val) {
      return val < 10 ? '0' + val : val;
    }

    Vue.mixin({
      methods: {
        planning() {
          this.toast('该功能还在路上');
        }
      }
    })

    /**验证url*/
    Vue.prototype.parseURL = function (url) {
      var a = document.createElement('a');
      a.href = url;
      return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname, //主机 (域名或IP)
        port: a.port, //端口号
        query: a.search, // 查询参数
        params: (function () {
          var ret = {},
            seg = a.search.replace(/^\?/, '').split('&'),
            len = seg.length,
            i = 0,
            s;
          for (; i < len; i++) {
            if (!seg[i]) {
              continue;
            }
            s = seg[i].split('=');
            ret[s[0]] = s[1];
          }
          return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
        hash: a.hash.replace('#', ''),
        path: a.pathname.replace(/^([^\/])/, '/$1'), //路径
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
        segments: a.pathname.replace(/^\//, '').split('/')
      };
    }
  }
}
