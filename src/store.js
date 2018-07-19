import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const mappy = {
  strict: false,
  state: {
    launch3D: false,
    loading: false,
    mini: false,
    miniWidth: 61,
    menuWidth: null,
    currentRegion: 'blank',
    features: [],
    soilMode: false,
    sketchfabLoaded: false,
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

    setCurrentRegion: function(state, region){
      // console.log('setting region', region)
      state.currentRegion = region
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
    setMenuWidth: function(state, width){
      state.menuWidth = width
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
    setSketchfabLoaded: function(state, bool){
      state.sketchfabLoaded = bool 
    },
    setMini: function(state, boolean){
      state.mini = boolean
    },
    toggleLaunch3D: function(state, bool){
      console.log('toggling?...', bool)
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
    dialog: state => state.dialog,
    getExaggeration: state => state.exaggeration,
    qualityTexture: state => state.qualityTexture,
    blendmode: state => state.blendmode,
    currentRegion: state => state.currentRegion,
    loading: state => state.loading,
    mini: state => state.mini,
    miniWidth: state => state.miniWidth,
    menuWidth: state => state.menuWidth,
    debug: state => state.debug,
    soilMode: state => state.soilMode,
    sketchfab: state => state.sketchfab,
    sketchfabLoaded: state => state.sketchfabLoaded,
    sketchfabMode: state => state.sketchfabMode,
    launch3D: state => state.launch3D,
  }
}

export default new Vuex.Store({
  modules: { mappy }
})  