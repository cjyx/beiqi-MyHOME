import {
  mttSaveUser,
  mttSaveUserInfo,
  mttSavePhone,
  mttSavePassword,
  mttSaveToken,
  mttSaveDeviceId,
  mttSaveOpenId,
  mttSaveIsBindCar,
  mttSaveGps,
  mttSaveDefAddress,
  mttSaveSelAddress,
  mttSaveConfirmOrder,
  mttSaveHotLine,
  mttSaveExpress,
  mttSaveFeedBack,
  mttSaveCarCount,
  mttSaveDefCar,
  mttSaveDefDealer,
  mttSaveDiscount,
  mttSaveUnaudited
} from './mutation-types.js'

export default {
  [mttSaveToken](state, token) {
    state.token = token;
  },
  [mttSaveGps](state, ad) {
    state.ad = ad;
    state.lon = ad.longitude;
    state.lat = ad.latitude;
    state.adCode = ad.adCode;
    state.adDistrict = ad.district;
    state.adProvince = ad.province;
    state.adStreet = ad.streetName;
    state.adCity = ad.city;
  },
  [mttSaveUser](state, { username, password, deviceId }) {
    state.username = username;
    state.password = password;
    state.deviceId = deviceId;
  },
  [mttSaveUserInfo](state, data) {
    state.user = data;
    state.realName = data.name;
    if (data.picUrl != '') {
      state.userImg = data.picUrl;
    } else {
      if (data.sex == '0') {
        // state.userImg = require('./static/userimg/woman.png')
        state.userImg = './static/userimg/woman.png';
      } else{
        // state.userImg = require('./static/userimg/man.png')
        state.userImg = './static/userimg/man.png';
      }
      // else {
      //   state.userImg = require('../assets/img/user-head.png')
      // }
    }
    state.userPhone = data.mobilePhone;
  },
  [mttSaveDefAddress](state, data) {
    state.defAddress = data;
  },
  [mttSaveSelAddress](state, data) {
    state.selAddress = data;
  },
  [mttSaveConfirmOrder](state, data) {
    state.confirmOrder = data;
  },
  [mttSavePhone](state, phone) {
    state.userPhone = phone;
  },
  [mttSavePassword](state, password) {
    state.password = password;
  },
  [mttSaveDeviceId](state, deviceId) {
    state.deviceId = deviceId;
  },
  [mttSaveIsBindCar](state, isBindCar) {
    state.isBindCar = isBindCar;
  },
  [mttSaveHotLine](state, data) {
    state.hotLine = data;
  },
  [mttSaveExpress](state, data) {
    state.express = data;
  },
  [mttSaveFeedBack](state, data) {
    state.feedBack = data;
  },
  [mttSaveCarCount](state, data) {
    state.carCount = data;
  },
  [mttSaveDefCar](state, data) {
    state.defCar = data;
  },
  [mttSaveDefDealer](state, data) {
    state.defDealer = data;
  },
  [mttSaveDiscount](state, data) {
    state.discountNum = data;
  },
  [mttSaveUnaudited](state, data){
    state.unaudited = data;
  }
}
