import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const mappy = {
  strict: false,
  state: {
    loading: false,
    _map: null,
    _mapCenter: null,
    _mapWidth: null,
    _mapmini: null,
    bearing: null,
    mini: false,
    miniWidth: 61,
    menuWidth: null,
    currentGridRef: null,
    features: [],
    offsetCenterLngLat: null,
    offsetCenterPx: null,
    debug: null,
    sketchfab:{
      cameraOrigin: null,
      camera: null
    }
  },
  mutations: {
    
    setCurrentGridRef: function(state, int){
      state.currentGridRef = int
    },
    setLoading: function(state, boolean){
      state.loading = boolean
    },
    setMap: function(state, map){
      state._map = map
    },
    setBearing: function(state, bearing){
      state.bearing = bearing
    },
    setMapMini: function(state, map){
      state._mapmini = map
    },
    setMini: function(state, boolean){
      state.mini = boolean
    },
    setMapCenter: function(state, coords){
      state._mapCenter = coords
    },
    setMapWidth: function(state, width){
      state._mapWidth = width
    },
    setMenuWidth: function(state, width){
      state.menuWidth = width
    },
    setDebug: function(state, debug){
      state.debug = debug
    },
    setOffsetCenterLngLat: function(state, coords){
      state.offsetCenterLngLat = coords
    },
    setOffsetCenterPx: function(state, px){
      state.offsetCenterPx = px
    },
    setSketchfab: function(state, sk){
      state.sketchfab = sk
    },
  },
  getters: {
    _map: state => state._map,
    currentGridRef: state => state.currentGridRef,
    loading: state => state.loading,
    mini: state => state.mini,
    _mapmini: state => state._mapmini,
    _mapCenter: state => state._mapCenter,
    _mapWidth: state => state._mapWidth,
    miniWidth: state => state.miniWidth,
    menuWidth: state => state.menuWidth,
    offsetCenterLngLat: state => state.offsetCenterLngLat,
    offsetCenterPx: state => state.offsetCenterPx,
    bearing: state => state.bearing,
    debug: state => state.debug,
    sketchfab: state => state.sketchfab,

  },
  actions: {

  }
}

export default new Vuex.Store({
  modules: { mappy }
})  