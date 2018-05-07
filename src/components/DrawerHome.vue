<template>
  <v-container fluid fill-height class="wrapper cursordefault">
    
    <div class="logo-wrapper" @click="toggleBlendmode()">
      <img src="../assets/Adelaide Hills Avatar_white.svg" :class="['logo', {'clipped' : mini ? true : false}, 'noselect']" >
    </div>

    <div :class="['overlay-grad', 'noevents']" :style="{'width': 'calc(100% - ' + miniWidth +'px)' }"></div>
    <div class="overlay-mapmini noevents" :style="{'mix-blend-mode' : blendmode ? 'normal':'exclusion', 'filter' : 'hue-rotate('+huerotate+'deg)'}"></div>

    <div class="menu noevents">  
      

      <!-- spacer -->

      <div class="item">
        <terrain-profile v-show="!mini"></terrain-profile>
      </div>

      <div class="item" style="height: 20vh"></div>
      
           <!-- <div class="gridRefInputWrapper"> -->
          <!-- <v-text-field class="allevents gridRefInput" color="white" single-line v-model="gridRef" flat :rules="[rules.gridRef]"></v-text-field> -->
          <!-- </div> -->

        <div class="item">
          <v-tooltip left>
          <v-btn :disabled="sketchfabMode" @click="resetBearing()" slot="activator" icon large :ripple="false" class="white--text menu-btn allevents">
            <v-icon :style="{'transform': 'rotate('+String(360-north)+'deg)'}">navigation</v-icon>
          </v-btn>
          <span>Reset North</span>
        </v-tooltip>
        </div>

      <div class="item">
        <v-tooltip left>
        <v-btn icon large slot="activator" :ripple="false" class="white--text menu-btn" @click="toggleLngLat()">
          <div v-if="currentGridRef">
            <span v-if="currentGridRef.properties.index" >#{{currentGridRef.properties.index}}</span>
            <span v-else>- - -</span>
          </div>
          <div v-else>- - -</div>
        </v-btn>
        <span>Current Grid #</span>
      </v-tooltip>
      </div>

      <div class="item">
        <v-tooltip left>  
        <v-btn v-if="!sketchfabMode" slot="activator" @click="currentGridRef ? toggleLaunch3D() : null" icon large :ripple="false" :class="['white--text', 'menu-btn', 'allevents']">
          <span class="three-d"><img src="../assets/3d.svg" style="width: 55%; top: 2px; position: relative" ></span>
        </v-btn>
      <!--   <span>See in 3D</span>
      </v-tooltip>
    </div>
      <div class="item" v-else>
        <v-tooltip left> -->
        <v-btn v-else icon large :ripple="false" slot="activator" :class="['white--text', 'menu-btn', 'noevents']">
           <v-progress-circular v-if="(!sketchfabLoaded || !gridExtruded) && sketchfabMode"indeterminate color="white" class="noevents"></v-progress-circular>
          <v-icon v-else-if="gridExtruded && sketchfabLoaded && sketchfabMode">done</v-icon>
        </v-btn>
        <span>3D Terrain</span>
      </v-tooltip>
      </div>

        <div class="item">
      <v-tooltip left>      
          <v-btn slot="activator" :disabled="sketchfabMode" @click="enterSoilMode()"  icon large class="white--text menu-btn allevents"><v-icon>layers</v-icon></v-btn>
        <span>Show / Hide layers</span>
      </v-tooltip>
        </div>

      <div class="item">
        <v-tooltip left>  
        <v-btn icon large @click.stop="toggleDialog()" slot="activator" class="white--text menu-btn allevents"><v-icon>help</v-icon></v-btn>
        <span>About terrior</span>
      </v-tooltip>
      </div>

      <div class="item" :style="{'height' : mini ? '60px' : '5px' }">
        <div v-if="_map" class="latlng" :style="{'font-size': remap(menuWidth, 200, 500, 12, 14)+'px', 'left': mini ? '0' : miniWidth+'px', 'width': mini ? miniWidth+'px' : 'calc( 100% - '+miniWidth+'px)'}"><div>{{_map.getCenter().lat.toPrecision(mini ? 5 : 15)}}</div><div>{{_map.getCenter().lng.toPrecision(mini ? 5 : 15)}}</div></div>
      </div>

    </div>
    <transition name="fade">
    <mappy-mini v-show="!mini" v-if="menuWidth && _map" container="minimap" :class="['minimap']" zoom="8" :LngLat="[138.7435885246556, -34.38845881895241]" mapStyle="mapbox://styles/edanweis/cjgq4p70p00122rl16bennnu6" :token="credentials.mapbox.token"></mappy-mini> 
    </transition>

        <!-- <v-layout
          justify-center
          align-center
        >
          <v-flex text-xs-center>
            
          </v-flex>
        </v-layout> -->
      </v-container>
</template>

<script>
import credentials from '../credentials';
import Mappy from './Mappy';
import MappyMini from './MappyMini';
import TerrainProfile from './TerrainProfile';
import Vuex from 'vuex'

export default {
  name: 'home',
  components: {
    Mappy,
    MappyMini,
    TerrainProfile
  },
  data () {
    return {
      credentials,
      dialog: false,
      huerotate: 0,
      north: null,
      gridRef: null,
      rules: {
               gridRef: (value) => {
                 const pattern = /\d\d\d/
                 return pattern.test(value) || 'Invalid grid reference.'
               }
             },
      items: [
        // {icon: 'layers', tooltip: 'hide/show layers'},
        {icon: 'help', tooltip: 'About', click: ''}
      ]
    }
  },
  mounted(){
  },
  watch: {
    gridRef: function(val){

    },

    bearing: function(val){
      this.north = val
    }
  },
  computed: {
    ...Vuex.mapGetters(['mini', 'loading', 'currentGridRef', 'miniWidth', 'menuWidth', '_map', 'bearing', 'gridExtruded', 'sketchfabLoaded', 'sketchfabMode', 'soilMode', 'blendmode']),
  },
  methods: {
    ...Vuex.mapMutations(['toggleLaunch3D', 'setSoilMode', 'toggleDialog', 'toggleBlendmode']),

    resetBearing(){
      this._map.easeTo({'bearing': 0})
    },

    enterSoilMode(){
      this.setSoilMode(!this.soilMode)
    },

    toggleLngLat(e){

    },

    remap(num, in_min, in_max, out_min, out_max) {
        return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
      },


  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import '../stylus/helpers.styl'

.wrapper{
  background-color: #fa9898;
  padding: 0 !important;  
}


.latlng{
  display: flex;
  color:white;
  align-items: flex-end;
  justify-content: space-around;
  flex-wrap: wrap;
  // padding-left: 12px;
  height: 100%;
  padding-bottom: 13px;
  position: relative;
  // margin-bottom: 4px;
}

.three-d{
  font-family: 'Roboto'
  color: white;
  font-weight: 700;
  font-size: 13px;
}


.tempInput{
  z-index: 99;
  display: block;
  
}

.logo-wrapper{
  position: absolute;
  mix-blend-mode: overlay;
  filter: saturate(33%);
  top: 0;
  left: 0;
  width: 100%;
  height: 400px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 60px 30px 0 30px;
  z-index: 2;
  // transition: rotate 100
}

.logo{
  position: relative;
  margin: 0;
  width: 90%;
  min-width: 45px; 
  max-width: 170px;
}

.logo.clipped{
  // clip-path: inset(0px 0px 5px 0px);
}

.minimap *{
  cursor: default !important;
}

.minimap{
  mix-blend-mode: screen;
  opacity: 1;
  // hide Mapbox logo
  top: 40px;
  -webkit-mask-image: url("../assets/mask.png");
  -webkit-mask-size: cover;
  background-attachment: fixed;
  background-size: cover;
}


.wide{
  // width: 
}


.narrow{
 width: calc(100% - 61px) 
}

.menu{
position: absolute;
display: flex;
flex-direction: column;
bottom: 0;
left:0;
width: 100%;
height: auto;
z-index: 2;
mix-blend-mode: overlay

}

.menu-btn{

}

.cursordefault{
  cursor: default !important;
}
.overlay-mapmini{
  position: absolute;
  pointer-events: none;
  top: 0;
  right: 0 !important;
  height: 100vh;
  width: 100%;
  opacity: 1;
  z-index: 0;
  // background: -moz-linear-gradient(top, rgba(250,152,152,1) 0%, rgba(250,152,152,0) 100%);
  // background: -webkit-linear-gradient(top, rgba(250,152,152,1) 0%,rgba(250,152,152,0) 100%);
  // background: linear-gradient(to bottom, rgba(250,152,152,1) 0%,rgba(250,152,152,0) 100%);
  background: linear-gradient(to bottom, rgba(120,197,131,1) 0%,rgba(250,152,152,0) 100%);
  
}

.item{
  position: relative;
  width: 100%;
  background-color: #624949;
  height: 60px;
  display: flex;
  align-items: center;
  justify-items: center;
  // border-top: 1px solid #C54C4C; 
}

.gridRefInput{
  z-index: 6;
  max-width: 60px;
}

.gridRefInput *{
  color: white;
}

.overlay-grad{
  position: absolute;
  mix-blend-mode: soft-light;
  pointer-events: none;
  bottom: 0;
  right: 0 !important;
  height: 100vh;
  opacity: 0.7;
  background: linear-gradient(to bottom, rgba(56,153,90,0) 0%,#8bcea2 100%);
  // background: -moz-linear-gradient(top, rgba(243,80,81,0) 0%, rgba(243,80,81,1) 98%, rgba(243,80,81,1) 100%);
  // background: -webkit-linear-gradient(top, rgba(243,80,81,0) 0%,rgba(243,80,81,1) 98%,rgba(243,80,81,1) 100%);
  // background: linear-gradient(to bottom, rgba(243,80,81,0) 0%,rgba(243,80,81,1) 98%,rgba(243,80,81,1) 100%);
  
}


</style>
