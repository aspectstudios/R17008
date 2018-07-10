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


      <!-- <mappy :style="{'pointer-events': sketchfabMode ? 'none': 'all'}" container="map" zoom="12" :LngLat="_mapOrigin.coords" mapStyle="mapbox://styles/edanweis/cjgx353bx002q2rqhgukgm8jm" :token="credentials.mapbox.token"></mappy> -->
      <div-panner></div-panner>

      <!-- <div class="overlay"></div> -->
      <div :class="['overlay3d', {'sketchfabMode': sketchfabLoaded && sketchfabMode && gridExtruded ? true : false}]"></div>
         
      <!--  <viewer :options="viewerOptions" :images="[]" @inited="inited" @zoom="zoomHandler()" @onDragStart="clickHandler('asdf')" class="viewer" ref="myViewer">
            <template slot-scope="scope">
              <img src="../assets/static_map_1920.jpg" alt="" usemap="#map" ref="image" key="1"  />
              <map name="map">
                  <area @click="clickHandler('test')" shape="poly" coords="756, 683, 775, 683, 779, 653, 800, 657, 797, 604, 812, 606, 821, 549, 748, 557, 748, 577, 732, 592, 724, 584, 699, 634, 716, 642, 716, 652, 745, 659" />
                  <area shape="poly" coords="756, 745, 760, 695, 744, 658, 718, 653, 717, 643, 686, 650, 665, 648, 659, 640, 646, 641, 637, 651, 598, 663, 611, 673, 620, 732, 654, 739, 716, 744" />
                  <area shape="poly" coords="660, 825, 644, 816, 632, 786, 657, 764, 652, 737, 717, 745, 700, 815, 684, 812, 665, 810" />
                  <area shape="poly" coords="430, 930, 430, 969, 459, 1003, 496, 1006, 518, 988, 532, 961, 582, 924, 583, 917, 619, 891, 645, 817, 634, 787, 656, 766, 652, 741, 618, 733, 604, 752, 583, 747, 582, 731, 547, 724, 537, 773" />
                  <area shape="poly" coords="523, 516, 545, 521, 563, 545, 599, 567, 584, 631, 568, 647, 474, 660, 480, 647, 522, 628" />
                  <area shape="poly" coords="608, 395, 589, 411, 588, 438, 574, 440, 575, 461, 593, 468, 576, 485, 562, 545, 597, 568, 622, 569, 637, 544, 627, 514, 643, 497, 675, 503, 682, 483, 715, 477, 731, 456, 733, 432, 727, 407, 717, 403, 711, 415, 693, 409, 699, 398, 688, 401, 688, 418, 664, 425, 661, 432, 653, 432, 617, 416" />
                  <area shape="poly" coords="749, 557, 821, 550, 821, 537, 801, 516, 838, 483, 858, 392, 840, 386, 784, 411, 774, 408, 752, 415, 743, 435, 734, 435, 734, 457, 717, 477, 683, 485, 676, 503, 644, 499, 627, 517, 633, 546, 620, 567, 596, 567, 585, 635, 569, 646, 473, 661, 462, 680, 476, 698, 527, 696, 545, 724, 582, 736, 583, 747, 603, 751, 621, 732, 612, 672, 601, 664, 639, 648, 645, 641, 660, 641, 665, 648, 688, 650, 715, 644, 703, 633, 725, 582, 738, 590, 749, 576" />
                  <area shape="poly" coords="721, 149, 616, 273, 611, 396, 621, 417, 653, 431, 661, 433, 667, 425, 687, 419, 691, 404, 699, 401, 699, 409, 714, 408, 720, 404, 727, 409, 733, 435, 743, 435, 752, 415, 776, 408, 784, 413, 843, 387, 857, 395, 921, 351, 941, 344, 942, 315, 964, 291, 943, 271, 967, 232, 947, 203, 940, 202, 932, 164, 847, 163, 827, 154, 801, 172, 795, 163, 789, 176, 743, 158" />
              </map>
            </template>
          </viewer> -->

        <!-- <div class="images" ref="viewer" @click="clickHandler('test')"> -->
          <!-- <img src="../assets/static_map_1920.jpg" key="1"> -->

        <!-- </div> -->


      


    <transition name='fade'>
      <div v-if="(!sketchfabLoaded && gridExtruded) && sketchfabMode" class="please-wait noselect softlight"  :style="{'width': 'calc( 100vw - ' + menuWidth + 'px)'}" >
        <img style="width: 110px" src="../assets/mountainglass.gif" class="mountainglass">
        <img style="width: 110px" src="../assets/winebase_bl.png" class="winebase">
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
var sketchfabDB = require('../assets/sketchfab-db.js')

export default {
  name: 'home',
  components: {
    Mappy,
    Sketchfab,
    BottomSheet,
    // Viewer, 
    DivPanner
  },
  data () {
    return {
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
    ...Vuex.mapGetters(['mini', '_mapCenter', '_map', 'debug', 'sketchfab', 'menuWidth', 'sketchfabLoaded', '_mapOrigin', 'currentGridRef', 'sketchfabMode', 'gridExtruded', 'wineriesHere', 'soilMode', 'blendmode']),

    projectedCenter: function(){
       return this._map.project(this._mapCenter)
    },

    urlid: function(){
     return this.sketchfabDB[this.currentGridRef.properties.index]
    }
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

    
  },
  methods:{
    ...Vuex.mapMutations(['setSketchfabLoaded']),

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
