import Vue from 'vue'
import Vuex from 'vuex'
// import getters from './getters'
// import actions from './actions'
// import mutations from './mutations'

Vue.use(Vuex)

const mutations = {
  showMQPanel (state, v) {
    console.log(state.userInfo, state.user)
    if (_MEIQIA) {
      if (v && !state.mqPanelShow) {
        _MEIQIA('metadata', {
          comment: state.userInfo.nickName, // 备注
          name: state.userInfo.realName, // 名字
          tel: state.userInfo.phone // 电话
        });
        _MEIQIA('showPanel')
        state.mqPanelShow = true
      } else {
        _MEIQIA('hidePanel')
        state.mqPanelShow = false
      }
    }
  }
}

const state = {
  className: 'black',
  mqPanelShow: false,
  userInfo: { // 用户信息
  },
  user: {},
  bankInfo: {
    bankNo: ''
  },
  hide: false,
  select: '/home', // 菜单选择
  token: 'USER62CCF5221CD752269D47681374DD0916',
  settingForm: { // 产品配置
    futuresDisplay: false,
    indexDisplay: false,
    kcStockDisplay: false,
    stockDisplay: false
  }
}

export default new Vuex.Store({
  state,
  actions: {},
  mutations,
  getters: {}
})
