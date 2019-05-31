import { Indicator } from 'mint-ui';
import { javaApi } from './fetch';

/**
 * 函数描述：js调用webview事件
 *
 * jsBridge.callHandler(method, data, callBack(response));
 * @param method {string} 方法名
 * @param data {Object} 参数
 * @return {Object} 回调
 */

/**
 * 函数描述：webView调用JS事件
 *
 * jsBridge.registerHandler(method, callBack(response));
 * @param method {string} 方法名
 * @return {Object} 回调
 */
let browser = {
  versions: (function() {
    var u = navigator.userAgent,
      app = navigator.appVersion;
    return {
      //移动终端浏览器版本信息
      trident: u.indexOf('Trident') > -1, //IE内核
      presto: u.indexOf('Presto') > -1, //opera内核
      webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
      iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, //是否iPad
      webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
    };
  })(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase()
};

// let apiHost = 'http://192.168.18.180:8080/xs-app-gateway/app/api';
// let apiHost = 'https://114.113.237.105/xs-app-gateway/app/api';
// let apiUpload = 'https://114.113.237.105/xs-app-gateway/app/fileUpload';
// let apiHost = 'https://test.auto-link.com.cn/xs-app-gateway/app/api';
// let apiUpload = 'https://test.auto-link.com.cn/xs-app-gateway/app/fileUpload';
let apiHost = 'https://dev.auto-link.com.cn/xs-app-gateway/app/api';
let apiUpload = 'https://dev.auto-link.com.cn/xs-app-gateway/app/fileUpload';
// let apiHost = 'https://prod.auto-link.com.cn/xs-app-gateway/app/api';
// let apiUpload = 'https://prod.auto-link.com.cn/xs-app-gateway/app/fileUpload';
// let apiHost = 'https://demo.auto-link.com.cn/xs-app-gateway/app/api';
// let apiUpload = 'https://demo.auto-link.com.cn/xs-app-gateway/app/fileUpload';

let JsBridge = {
  init: function(callback) {
    var u = navigator.userAgent;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (browser.versions.android) {
      (function() {
        if (window.WebViewJavascriptBridge) {
          return;
        }

        var messagingIframe;

        var sendMessageQueue = [];
        var receiveMessageQueue = [];
        var messageHandlers = {};

        var CUSTOM_PROTOCOL_SCHEME = 'yy';
        var QUEUE_HAS_MESSAGE = '__QUEUE_MESSAGE__/';

        var responseCallbacks = {};
        var uniqueId = 1;

        function _createQueueReadyIframe(doc) {
          messagingIframe = doc.createElement('iframe');
          messagingIframe.style.display = 'none';
          doc.documentElement.appendChild(messagingIframe);
        }

        //set default messageHandler
        function init(messageHandler) {
          if (WebViewJavascriptBridge._messageHandler) {
            throw new Error('WebViewJavascriptBridge.init called twice');
          }
          WebViewJavascriptBridge._messageHandler = messageHandler;
          var receivedMessages = receiveMessageQueue;
          receiveMessageQueue = null;
          for (var i = 0; i < receivedMessages.length; i++) {
            _dispatchMessageFromNative(receivedMessages[i]);
          }
        }

        function send(data, responseCallback) {
          _doSend(
            {
              data: data
            },
            responseCallback
          );
        }

        function registerHandler(handlerName, handler) {
          messageHandlers[handlerName] = handler;
        }

        function callHandler(handlerName, data, responseCallback) {
          _doSend(
            {
              handlerName: handlerName,
              data: data
            },
            responseCallback
          );
        }

        //sendMessage add message, 触发native处理 sendMessage
        function _doSend(message, responseCallback) {
          if (responseCallback) {
            var callbackId = 'cb_' + uniqueId++ + '_' + new Date().getTime();
            responseCallbacks[callbackId] = responseCallback;
            message.callbackId = callbackId;
          }

          sendMessageQueue.push(message);
          messagingIframe.src =
            CUSTOM_PROTOCOL_SCHEME + '://' + QUEUE_HAS_MESSAGE;
        }

        // 提供给native调用,该函数作用:获取sendMessageQueue返回给native,由于android不能直接获取返回的内容,所以使用url shouldOverrideUrlLoading 的方式返回内容
        function _fetchQueue() {
          var messageQueueString = JSON.stringify(sendMessageQueue);
          sendMessageQueue = [];
          //android can't read directly the return data, so we can reload iframe src to communicate with java
          messagingIframe.src =
            CUSTOM_PROTOCOL_SCHEME +
            '://return/_fetchQueue/' +
            encodeURIComponent(messageQueueString);
        }

        //提供给native使用,
        function _dispatchMessageFromNative(messageJSON) {
          setTimeout(function() {
            var message = JSON.parse(messageJSON);
            var responseCallback;
            //java call finished, now need to call js callback function
            if (message.responseId) {
              responseCallback = responseCallbacks[message.responseId];
              if (!responseCallback) {
                return;
              }
              responseCallback(message.responseData);
              delete responseCallbacks[message.responseId];
            } else {
              //直接发送
              if (message.callbackId) {
                var callbackResponseId = message.callbackId;
                responseCallback = function(responseData) {
                  _doSend({
                    responseId: callbackResponseId,
                    responseData: responseData
                  });
                };
              }

              var handler = WebViewJavascriptBridge._messageHandler;
              if (message.handlerName) {
                handler = messageHandlers[message.handlerName];
              }
              //查找指定handler
              try {
                handler(message.data, responseCallback);
              } catch (exception) {
                if (typeof console != 'undefined') {
                  console.log(
                    'WebViewJavascriptBridge: WARNING: javascript handler threw.',
                    message,
                    exception
                  );
                }
              }
            }
          });
        }

        //提供给native调用,receiveMessageQueue 在会在页面加载完后赋值为null,所以
        function _handleMessageFromNative(messageJSON) {
          console.log(messageJSON);
          if (receiveMessageQueue && receiveMessageQueue.length > 0) {
            receiveMessageQueue.push(messageJSON);
          } else {
            _dispatchMessageFromNative(messageJSON);
          }
        }

        var WebViewJavascriptBridge = (window.WebViewJavascriptBridge = {
          init: init,
          send: send,
          registerHandler: registerHandler,
          callHandler: callHandler,
          _fetchQueue: _fetchQueue,
          _handleMessageFromNative: _handleMessageFromNative
        });

        var doc = document;
        _createQueueReadyIframe(doc);
        var readyEvent = doc.createEvent('Events');
        readyEvent.initEvent('WebViewJavascriptBridgeReady');
        readyEvent.bridge = WebViewJavascriptBridge;
        doc.dispatchEvent(readyEvent);
      })();

      if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge);
      } else {
        document.addEventListener(
          'WebViewJavascriptBridgeReady',
          function() {
            callback(WebViewJavascriptBridge);
          },
          false
        );
      }
    } else {
      if (window.WebViewJavascriptBridge) {
        return callback(WebViewJavascriptBridge);
      }
      if (window.WVJBCallbacks) {
        return window.WVJBCallbacks.push(callback);
      }
      window.WVJBCallbacks = [callback];
      var WVJBIframe = document.createElement('iframe');
      WVJBIframe.style.display = 'none';
      WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
      document.documentElement.appendChild(WVJBIframe);
      setTimeout(function() {
        document.documentElement.removeChild(WVJBIframe);
      }, 0);
    }
  },

  first: function() {
    var u = navigator.userAgent;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (!isiOS) {
      var _this = this;
      _this.init(function(bridge) {
        bridge.init(function(message, responseCallback) {
          responseCallback(data);
        });
      });
    }
  },

  callHandler: function(fun) {
    this.init(bridge => {
      bridge.registerHandler('iOSCallJS', fun);
    });
  },
  nativeHandler: function(data, fun) {
    this.init(bridge => {
      var postData = { apiCode: 'APP_HardWare', apiData: data, status: 1 };
      let json = JSON.stringify(postData);
      // alert(json);
      bridge.callHandler('JSCalliOS', json, fun);
    });
  },
  /**后台Java数据接口请求
   * 请求参数data举例：
   * 调用方式：this.native.apiHandler(data, (res) => { })
   * */
  apiHandler: function(code, data, fun) {
    // var javaData={
    //       header: {
    //           code: code
    //       },
    //       body: data
    //   };
    // javaApi(javaData,(res)=>{
    //     console.log(res);
    // })

    Indicator.open({
      text: 'loading...',
      spinnerType: 'fading-circle'
    });
    this.init(bridge => {
      var postData = {
        apiCode: 'APP_NetWork',
        apiUrl: apiHost,
        apiData: {
          obj: {
            header: {
              code: code
            },
            body: data
          },
          str: 'api',
          type: 0
        },
        status: 1
      };
      let json = JSON.stringify(postData);
      // alert('请求' + json);
      bridge.callHandler('JSCalliOS', json, fun);
    });
  },
  /**后台Java数据接口请求
   * 请求参数obj：RAP上的接口
   * 请求参数arr：文件[name:'']
   * 调用方式：this.native.apiHandler(data, (res) => { })
   * */
  upHandler: function(obj, arr, fun) {
    var _this = this;
    _this.init(function(bridge) {
      var apiData = {
        obj: obj,
        arr: arr,
        str: 'fileUpload', //fileUpload XS-FIE-WJSC
        type: 1
      };
      var postData = {
        apiCode: 'APP_NetWork',
        apiUrl: apiHost,
        apiData: apiData,
        status: 1
      };
      let json = JSON.stringify(postData);
      // alert('请求' + json);imageMaxCount,imageCount
      bridge.callHandler('JSCalliOS', json, fun);
    });
  },
  imgHandler: function(count, obj, fun) {
    var _this = this;
    _this.init(bridge => {
      var postData = {
        apiCode: 'APP_HardWare',
        apiData: { obj: { imageMaxCount: count }, type: 0 },
        status: 1
      };
      let json = JSON.stringify(postData);
      bridge.callHandler('JSCalliOS', json, res => {
        let response = JSON.parse(res);
        let apiData = response.apiData;
        var files = [];
        for (var i = 0, len = apiData.arr.length; i < len; i++) {
          if (apiData.arr[i].key == '') {
            return;
          }
          files.push({ key: 'filename', value: apiData.arr[i].key });
        }
        _this.init(bridge => {
          var apiData = { obj: obj, arr: files, str: 'fileUpload', type: 1 };
          // fileUpload  str: 'XS-FIE-WJSC'
          var postData = {
            apiCode: 'APP_NetWork',
            apiUrl: apiUpload,
            apiData: apiData,
            status: 1
          };
          let json = JSON.stringify(postData);
          // alert(json);
          bridge.callHandler('JSCalliOS', json, fun);
        });
      });
    });
  },

  /**数据库请求
   * 请求参数type：0保存、1修改、2删除、3查询
   * 请求参数data举例：{token: '', username: '', password: ''};
   * 调用方式：this.native.dbHandler(0, db, (res) => { })
   * */
  dbHandler: function(type, data, fun) {
    var _this = this;
    var arr = [];
    //将对象转换为后台需要的对象数组
    for (var key in data) {
      //只遍历对象自身的属性，而不包含继承于原型链上的属性。
      if (data.hasOwnProperty(key) === true) {
        arr.push({
          classType: 'String',
          type: type,
          key: key,
          value: data[key]
        });
      }
    }
    this.init(bridge => {
      var postData = { apiCode: 'APP_DB', apiData: { arr: arr }, status: 1 };
      let json = JSON.stringify(postData);
      // alert(json);
      bridge.callHandler('JSCalliOS', json, fun);
    });
  },
  /**相机请求
   * 调用方式：this.native.dbHandler(0, db, (res) => { })
   * */
  caremaHandler: function(count, fun) {
    this.init(bridge => {
      var postData = {
        apiCode: 'APP_HardWare',
        apiData: { obj: { imageMaxCount: count }, type: 0 },
        status: 1
      };
      let json = JSON.stringify(postData);
      // alert(json);
      bridge.callHandler('JSCalliOS', json, fun);
    });
  },
  /**定位请求
   * lon：经度
   * lat：纬度
   * 调用方式：this.native.gpsHandler(lon, lat, (res) => { })
   * */
  gpsHandler: function(lon, lat, fun) {
    this.init(bridge => {
      var postData = {
        apiCode: 'APP_HardWare',
        apiData: { type: 2 },
        status: 1
      };
      if (lat != '' && lon != '') {
        postData = {
          apiCode: 'APP_HardWare',
          apiData: {
            type: 6,
            obj: {
              longitude: lon,
              latitude: lat
            }
          },
          status: 1
        };
      }
      let json = JSON.stringify(postData);
      // alert(json);
      bridge.callHandler('JSCalliOS', json, fun);
    });
  },
  /**定位请求
   * lon：经度
   * lat：纬度
   * 调用方式：this.native.gpsHandler(lon, lat, (res) => { })
   * */
  mapHandler: function(lon, lat, address, fun) {
    this.init(bridge => {
      var apiData = {
        obj: {
          formattedAddress: address,
          latitude: lat,
          longitude: lon
        },
        type: 1
      };
      var postData = {
        apiCode: 'APP_ThirdPart',
        apiData: apiData,
        status: 1
      };
      let json = JSON.stringify(postData);
      // alert('请求' + json);
      bridge.callHandler('JSCalliOS', json, fun);
    });
  },
  /**分享功能
   *  0:新浪;, 1,:微信聊天 ;2:微信朋友圈;,4:QQ聊天页面 ;5:qq空间;13:短信;
   * 调用方式：this.native.shareHandler({type:0,title:'分享标题'，desc:'分享内容介绍',url:'http://a.com/1.html'}, (res) => { })
   * */
  shareHandler: function(data, fun) {
    this.init(bridge => {
      var apiData = {
        obj: {
          platformType: data.type,
          shareDescr: data.desc,
          shareTitle: data.title,
          shareURL: data.url
        },
        type: 2
      };
      var postData = {
        apiCode: 'APP_ThirdPart',
        apiData: apiData,
        status: 1
      };
      let json = JSON.stringify(postData);
      // alert('请求' + json);
      bridge.callHandler('JSCalliOS', json, fun);
    });
  },
  grabHandler: function(code) {
    try {
      var curr = parseURL(window.location.href);
      var file = curr.hash
        .substr(0, curr.hash.indexOf('?'))
        .replace('/', '')
        .replace('/', '.');
      var nowDate = new Date().format('yyyyMMddhhmmss');
      console.log(file);
      // alert(file)
      this.init(bridge => {
        var postData = {
          apiCode: 'APP_Message',
          apiData: {
            type: 2,
            object: {
              time: nowDate,
              srcurl: file,
              desurl: '',
              code: code
            }
          }
        };
        let json = JSON.stringify(postData);
        // alert('请求' + json);
        bridge.callHandler('JSCalliOS', json);
      });
    } catch (e) {
      console.log(e.message);
    }
  }
};

Date.prototype.format = function(fmt) {
  //author: meizz
  var o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
  return fmt;
};

function parseURL(url) {
  var a = document.createElement('a');
  a.href = url;
  return {
    source: url,
    protocol: a.protocol.replace(':', ''),
    host: a.hostname, //主机 (域名或IP)
    port: a.port, //端口号
    query: a.search, // 查询参数
    params: (function() {
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

JsBridge.first();

export { JsBridge, browser };
