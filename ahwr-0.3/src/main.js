// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import store from './store'
import Vuex from 'vuex';
Vue.use(Vuex)

import VueFire from 'vuefire'
Vue.use(VueFire)

export const store = new Vuex.Store({
  state: {
    winerySelected: [],
  },
  getters: {
    getWinerySelected: function(state){
      return state.winerySelected
    }
  },
  mutations: {
    addSelectedWinery: function(state, winery){
      state.winerySelected.push(winery)
    } 
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store: store,
  template: '<App/>',
  components: { App }
})