import { MessageBox, Toast,Indicator } from 'mint-ui';

export default {
  install(Vue, options) {
    /**转换后台返回数据*/
    Vue.prototype.convert = function(res) {
      Indicator.close();
      try {
        // alert('返回' + res);
        let response = JSON.parse(res);
        if (response.status.toString() != '1') {
          let obj = response.apiData.obj;
          // Toast({message: response.apiData.str + '(' + obj.header.code + '）', position: 'bottom'});
          Toast({ message: response.apiData.str, position: 'bottom' });
          return '';
        }
        let result = ''; //返回的数据
        if (response.apiData.hasOwnProperty('obj')) {
          let obj = response.apiData.obj;
          result = obj;
          //如果接口返回错误，统一弹出错误信息
          if (obj.hasOwnProperty('body')) {
            let body = obj.body;
            let apiCode = obj.header.code;
            if (body.isSuccessful == false) {
              let codeOut = ['C11-VEH-WXDL'];
              if (codeOut.indexOf(apiCode) < 0) {
                //特殊接口不需要弹错误信息
                // Toast({message: body.errorMsg + '(' + obj.header.code + ')', position: 'bottom'});
                if (body.errorMsg) {
                  Toast({ message: body.errorMsg, position: 'bottom' });
                }
              }
              if (body.errorCode == 'tokenFailure') {
                localStorage.token = '';
                this.$router.push({ name: 'logout', params: {} });
              }
            } else {
              if (apiCode == 'C11-SMS-FSDX') {
                Toast({ message: '短信发送成功', position: 'bottom' });
              }
            }
          }
        } else if (response.apiData.hasOwnProperty('arr')) {
          let arr = response.apiData.arr;
          var dbEntity = {};
          for (var i = 0, len = arr.length; i < len; i++) {
            var item = arr[i];
            dbEntity[item.key] = item.value == 'null' ? '' : item.value;
          }
          result = dbEntity;
        }
        return result;
      } catch (e) {
        // alert(e.message);
      }
    };
  }
};
