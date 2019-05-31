/**vuex文件*/
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex)

// 应用初始状态
const state = {
  hotLine: '',
  ad: {},
  lon: '',
  lat: '',
  adCode: '',
  adCity: '',
  adProvince: '',
  deviceId: '',
  token: '',
  user: {},
  username: '',
  realName: '',
  password: '',
  userPhone: '',
  userImg: '',
  isBindCar: false,
  defAddress: {},
  selAddress: {},
  confirmOrder: [],
  express: '',
  feedBack:'',
  defCar:{},
  defDealer:{},
  discountNum:'',
  unaudited:0
}

// 创建 store 实例
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
})
