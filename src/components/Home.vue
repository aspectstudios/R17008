<template>
  <div class="wrapper">
  <!-- <v-container fluid fill-height>
        <v-layout
          justify-center
          align-center
        >
          <v-flex text-xs-center>
            <mappy container="map" zoom="9" :LngLat="[138.829631 ,-34.964802]" mapStyle="mapbox://styles/edanweis/cjfacythk27812rqksxeixj87" :token="credentials.mapbox.token"></mappy> 
          </v-flex>
        </v-layout>
      </v-container> -->

      <!-- <mappy :style="{'pointer-events': sketchfabMode ? 'none': 'all'}" container="map" zoom="12" :LngLat="_mapOrigin.coords" mapStyle="mapbox://styles/edanweis/cjgx353bx002q2rqhgukgm8jm" :token="credentials.mapbox.token"></mappy> -->
      <div-panner :disabled="sketchfabMode ? true : false" ></div-panner>

      <!-- <div class="overlay"></div> -->
      <div :class="['overlay3d', {'sketchfabMode': sketchfabLoaded && sketchfabMode ? true : false}]"></div>      


    <transition name='fade'>
      <div v-if="(!sketchfabLoaded && gridExtruded) && sketchfabMode" class="please-wait noselect softlight"  :style="{'width': 'calc( 100vw - ' + menuWidth + 'px)'}" >
        <img style="width: 110px" src="../assets/mountainglass.gif" class="mountainglass">
        <img style="width: 110px" src="../assets/winebase_bl.png" class="winebase">
      </div>
    </transition>

      <sketchfab :style="{'opacity': sketchfabLoaded && sketchfabMode ? 1 : 0, 'transition-delay':  sketchfabLoaded && sketchfabMode ? 0 : 2000}" v-if="currentRegion && sketchfabMode" v-show="sketchfabLoaded"  class="sketchfab-wrapper" :urlid="sketchfabDB[currentRegion]" autospin='0' autostart='1' preload='1' ui_controls='0' ui_infos='0' ui_related='0' transparent='1' scrolling="no"></sketchfab>

      <transition name="slideUp">
      <bottom-sheet class="bottomsheet" v-if="wineriesHere && !sketchfabMode && !soilMode"></bottom-sheet>
      </transition>

      <div class="map-overlay" v-if="!blendmode"></div>

      <!-- <div class="debug"><pre>{{debug}}</pre></div> -->
      <!-- <northstar></northstar> -->


      <!-- <div v-if="_mapCenter" class="mapCenter" :style="{'top': projectedCenter.y+'px', 'left': projectedCenter.x+'px'}"></div> -->
      <!-- <div v-if="_mapCenter" class="mapCenter" :style="{'top': projectedCenter.y+'px', 'left': projectedCenter.x+'px'}"></div> -->
      <!-- <div class="debug"><pre>{{debug}}</pre></div> -->
      </div>
</template>

<script>
import Vue from 'vue'
// import 'viewerjs/dist/viewer.css'
// import Viewer from 'v-viewer'
// import Viewer from "v-viewer/src/component.vue"
// Vue.use(Viewer)
import credentials from '../credentials';
import Mappy from './Mappy';
import Vuex from 'vuex'
import Sketchfab from './Sketchfab'
import BottomSheet from './BottomSheet'
import DivPanner from './DivPanner'
// import {reginons} from '../assets/sketchfab-regions-db.js'
var sketchfabDB = require('../assets/sketchfab-regions-db.js').default.regions

export default {
  name: 'home',
  components: {
    Mappy,
    Sketchfab,
    BottomSheet,
    // Viewer, 
    DivPanner,
    
  },
  data () {
    return {
    	urlid: null,
    	viewer: false,
    	imageData: null,
	    viewerOptions: {
		    inline: true,
		    minZoomRatio: 1,
		    initialViewIndex: 1,
		    button: false,
		    navbar: false,
		    title: false,
		    toolbar: false,
		    tooltip: false,
		    movable: true,
		    zoomable: true,
		    rotatable: true,
		    scalable: true,
		    transition: false,
		    fullscreen: false,
		    keyboard: false,
		    url: "data-source"
	},
   	  sketchfabDB,
      credentials,
      camera: null
    }
  },
  computed: {
    ...Vuex.mapGetters(['mini', '_mapCenter', '_map', 'debug', 'sketchfab', 'menuWidth', 'sketchfabLoaded', '_mapOrigin', 'currentRegion', 'sketchfabMode', 'gridExtruded', 'wineriesHere', 'soilMode', 'blendmode', 'launch3D']),

    projectedCenter: function(){
       return this._map.project(this._mapCenter)
    },

  },
  mounted(){
  	// this.$refs.viewer.$viewer.show() //$el.querySelector('.images').$viewer
  	// viewer.show()
    // this.setSketchfabLoaded(false)
    // this.viewer = this.$el.querySelector('.images').$viewer

    // console.log('viewer: ', this.$refs.viewer.	)
  },
  watch:{
    sketchfabLoaded: function(val){
      // console.log('sk loaded?',val)
    },

    launch3D: function(val){
    	if(val){
    		this.setSketchfabMode(true)
    	} 
    },
    
  },
  methods:{
    ...Vuex.mapMutations(['setSketchfabLoaded', 'setSketchfabMode']),

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>


.mountainglass{
	position: relative;
	width: auto;
	pointer-events: none;
}

.static-image{
	/*position: relative;*/
	/*margin: 0 auto;*/
    /*margin: auto;*/
    /*height: 100vh;*/
    /*top: 0;
    left: 0;
    right: 0;
    bottom: 0;*/
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1920px;
    height: 1115px;
    margin-top: -556px; /* Half the height */
    margin-left: -540px; /* Half the width */
}

.wrapper{
	background-color: #38985b;
}

.softlight{
	mix-blend-mode: soft-light;
	filter: brightness(1.5);

}
.slideUp-enter-active, .slideUp-leave-active {
  transition: all 245ms cubic-bezier(.64,.02,.14,.94);
}
.slideUp-enter, .slideUp-leave-to {
  transform: translateY(400px) !important;
  opacity: 1
}

.fade-enter-active, .fade-leave-active {
  transition: all 4845ms cubic-bezier(.23,.49,.32,1.07);
}
.fade-enter, .fade-leave-to {
  transform: translateY(200px) !important;
  opacity: 0
}

.map-overlay{
  pointer-events: none;
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: #a82dae;
  mix-blend-mode: soft-light;
  z-index: 4;
}


.bottomsheet{
  opacity: 1;
}

.mapCenter{
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
  margin-left: -2px;
  margin-top: -2px;
  z-index: 5;
}

.debug{
  background-color: white;
  position: absolute;
  top: 0;
  left: 0;
  padding: 40px;
  z-index: 2;
  color: black;
}

.overlay{
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 3;
  /*background-color: rgba(255,155,130, 0.3);*/
  pointer-events: none;
  mix-blend-mode: overlay;
  background: linear-gradient(to bottom, rgba(56,153,90,0) 0%, rgba(48, 33, 99, 0.54) 100%);

}

.sketchfab-wrapper{
  transition: opacity 500ms ease-in-out;
  /*transition-delay: 1500ms;*/

}

.overlay3d{
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2;
  opacity: 0;
  pointer-events: none;
  background-color: #38995A;
  transition: opacity 1500ms cubic-bezier(.64,.02,.14,.94);
}

.overlay3d.sketchfabMode{
  opacity: 0.8 !important;
}

.please-wait{
  position: absolute;
  left: 0;
  top: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: column;
  font-family: Raleway;
  /*font-weight: 400;*/
  font-size: 24px;
  color: #dfefe5;
  transition: all 145ms cubic-bezier(.64,.02,.14,.94);
  z-index: 7;
}


</style>
