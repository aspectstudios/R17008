<template>
  <div>
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


      <mappy :style="{'pointer-events': sketchfabMode ? 'none': 'all'}" container="map" zoom="12" :LngLat="_mapOrigin.coords" mapStyle="mapbox://styles/edanweis/cjgx353bx002q2rqhgukgm8jm" :token="credentials.mapbox.token"></mappy>

      <div class="overlay"></div>
      <div :class="['overlay3d', {'sketchfabMode': sketchfabLoaded && sketchfabMode && gridExtruded ? true : false}]"></div>

    <transition name='fade'>
      <div class="please-wait noselect softlight" v-if="(!sketchfabLoaded && gridExtruded) && sketchfabMode" :style="{'width': 'calc( 100vw - ' + menuWidth + 'px)'}" >
        <img src="../assets/mountainglass.gif" class="mountainglass">
        <img src="../assets/winebase_bl.png" class="winebase">
        <p>Please wait</p>
      </div>
    </transition>

      <sketchfab :style="{'opacity': sketchfabLoaded && sketchfabMode && gridExtruded ? 1 : 0, 'transition-delay':  sketchfabLoaded && sketchfabMode && gridExtruded ? 0 : 2000}" v-if="currentGridRef && sketchfabMode" v-show="sketchfabLoaded"  class="sketchfab-wrapper" :urlid="urlid" autospin='0' autostart='1' preload='1' ui_controls='0' ui_infos='0' ui_related='0' transparent='1' scrolling="no"></sketchfab>

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
import credentials from '../credentials';
import Mappy from './Mappy';
import Vuex from 'vuex'
import Sketchfab from './Sketchfab'
import BottomSheet from './BottomSheet'
var sketchfabDB = require('../assets/sketchfab-db.js')

export default {
  name: 'home',
  components: {
    Mappy,
    Sketchfab,
    BottomSheet
  },
  data () {
    return {
      sketchfabDB,
      credentials,
      camera: null
    }
  },
  computed: {
    ...Vuex.mapGetters(['mini', '_mapCenter', '_map', 'debug', 'sketchfab', 'menuWidth', 'sketchfabLoaded', '_mapOrigin', 'currentGridRef', 'sketchfabMode', 'gridExtruded', 'wineriesHere', 'soilMode', 'blendmode']),

    projectedCenter: function(){
       return this._map.project(this._mapCenter)
    },

    urlid: function(){
     return this.sketchfabDB[this.currentGridRef.properties.index]
    }
  },
  mounted(){

    // this.setSketchfabLoaded(false)
  },
  watch:{
    sketchfabLoaded: function(val){
      // console.log('sk loaded?',val)
    },
  },
  methods:{
    ...Vuex.mapMutations(['setSketchfabLoaded']),

    remap(num, in_min, in_max, out_min, out_max) {
        return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
      },

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
