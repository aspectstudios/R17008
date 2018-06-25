import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import _ from 'lodash'

import {firebaseMutations} from 'vuexfire'
var VuexFire = require('vuexfire')

const mappy = {
  strict: false,
  state: {
    wineries: null,
    wineriesHere: null,
    launch3D: false,
    loading: false,
    _map: null,
    _mapCenter: null,
    _mapOrigin: {coords: [138.826675 ,-34.960495], px: null},
    _mapCamera: null,
    _mapWidth: null,
    _mapmini: null,
    mapbox: {camera: null, cameraOrigin: null},
    bearing: 0,
    pitch: 0,
    mini: false,
    miniWidth: 61,
    menuWidth: null,
    currentGridRef: null,
    features: [],
    offsetCenterLngLat: null,
    offsetCenterPx: null,
    debug: null,
    soilMode: false,
    sketchfabLoaded: false,
    gridExtruded: false,
    exaggeration: 0,
    sketchfabMode: false,
    dialog: false,
    blendmode: true,
    qualityTexture: 'hd',
    sketchfab:{
      cameraOrigin: null,
      camera: null
    }
  },
  mutations: {
    ...firebaseMutations,    

    setCurrentGridRef: function(state, int){
      state.currentGridRef = int
    },
    setExaggeration: function(state, num){
      state.exaggeration = num
    },
    setQualitytexture: function(state, quality){
      state.qualityTexture = quality
    },
    toggleDialog: function(state){
      state.dialog = !state.dialog
    },
    toggleBlendmode: function(state){
      state.blendmode = !state.blendmode
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
    setPitch: function(state, pitch){
      state.pitch = pitch
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
    setMapCamera: function(state, obj){
      state.mapCamera[obj.key] = obj.val
    },
    setmapOriginPx: function(state, point){
      state._mapOrigin.px = point
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
    setSketchfab: function(state, obj){
      state.sketchfab[obj.key] = obj.val
    },
    setSketchfabMode: function(state, bool){
      state.sketchfabMode = bool
    },
    setSoilMode: function(state, bool){
      state.soilMode = bool
    },
    setMapbox: function(state, obj){
      state.mapbox[obj.key] = obj.val
    },
    setSketchfabLoaded: function(state, bool){
      state.sketchfabLoaded = bool 
    },
    setGridExtruded: function(state, bool){
      state.gridExtruded = bool 
    },
    setWineriesHere: function(state, arr){
      state.wineriesHere = arr
    },
    toggleLaunch3D: function(state, bool){
      if(bool == true){
          state.launch3D = true 
          return
      }
      if(bool == false){
          state.launch3D = false
          return
      }  
      if(!state.sketchfabMode){
        state.launch3D = true 
      } else{
        state.launch3D = false
      }
    
    },
  },
  getters: {
    _map: state => state._map,
    dialog: state => state.dialog,
    getExaggeration: state => state.exaggeration,
    qualityTexture: state => state.qualityTexture,
    blendmode: state => state.blendmode,
    wineries: state => state.wineries,
    wineriesHere: state => state.wineriesHere,
    currentGridRef: state => state.currentGridRef,
    loading: state => state.loading,
    mini: state => state.mini,
    _mapmini: state => state._mapmini,
    _mapCenter: state => state._mapCenter,
    _mapCamera: state => state._mapCamera,
    _mapOrigin: state => state._mapOrigin,
    _mapWidth: state => state._mapWidth,
    miniWidth: state => state.miniWidth,
    menuWidth: state => state.menuWidth,
    offsetCenterLngLat: state => state.offsetCenterLngLat,
    offsetCenterPx: state => state.offsetCenterPx,
    bearing: state => state.bearing,
    pitch: state => state.pitch,
    debug: state => state.debug,
    soilMode: state => state.soilMode,
    sketchfab: state => state.sketchfab,
    mapbox: state => state.mapbox,
    sketchfabLoaded: state => state.sketchfabLoaded,
    sketchfabMode: state => state.sketchfabMode,
    gridExtruded: state => state.gridExtruded,
    launch3D: state => state.launch3D,


  },
  actions: {

    setDataRef: VuexFire.firebaseAction(({ bindFirebaseRef }, ref) => {
      return new Promise((resolve, reject) => {
        bindFirebaseRef('wineries', ref, {readyCallback: function(){        
          resolve()
        }})
      })      
    })

  }
}

export default new Vuex.Store({
  modules: { mappy }
})  