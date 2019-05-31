import Vue from 'vue'
Vue.filter('date', function (val) {
  if (val == '' || val == undefined) {
    return '';
  }
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfMonth = day * 15;

  var timestamp = Date.parse(val.replace(/-/gi, '/'));
  var old = new Date(timestamp);
  var now = new Date();
  var diff = now.getTime() - timestamp;
  if (diff < 0) {
    return '刚刚';
  }

  var diffMonth = diff / halfMonth;
  var diffDay = diff / day;
  var diffHour = diff / hour;
  var diffMinute = diff / minute;

  function add(val) {
    return val < 10 ? '0' + val : val;
  }

  var result = '刚刚';
  if (now.getFullYear() > old.getFullYear()) {
    result = old.getFullYear() + '年' + add(old.getMonth() + 1) + '月' + add(old.getDate()) + '日';
  }
  else if (diffMonth >= 1) {
    result = add(old.getMonth() + 1) + '月' + add(old.getDate()) + '日';
  }
  else if (diffDay >= 1) {
    result = parseInt(diffDay) + '天前';
  }
  else if (diffHour >= 1) {
    result = parseInt(diffHour) + '小时前';
  }
  else if (diffMinute >= 1) {
    result = '刚刚';
  }
  return result;

})



Vue.filter('dateFormat', function (val,format) {
  if (val == '' || val == undefined) {
    return '';
  }
  var timestamp = Date.parse(val.replace(/-/gi, '/'));
  var date=new Date(timestamp);
  return date.format(format);
})



Vue.filter('phone', function (value) {   //全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面
  if (value == '') {
    return '';
  }
  value = value.substr(0, 3) + "****" + value.substr(7);
  return value;
});
/*xinghao*/
Vue.filter('star', function (value) {
  value = value.substr(0, 1) + "****";
  return value;
});
// 小组名
Vue.filter('group', function (value) {
  if(value.length<=4){
    value = value.substr(0, 4);
  }else {
    value = value.substr(0, 4) + "***";
  }
  return value;
});
