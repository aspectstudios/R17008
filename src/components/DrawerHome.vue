<template>
  <v-container fluid fill-height class="wrapper cursordefault">
    
    <div class="logo-wrapper">
      <img src="../assets/Adelaide_Hills_Wine.svg" :class="['logo', {'clipped' : mini ? true : false}]" >
    </div>

    <div :class="['overlay-grad', 'noevents']" :style="{'width': 'calc(100% - ' + miniWidth +'px)' }"></div>
    <div class="overlay-mapmini noevents"></div>

    <terrain-profile></terrain-profile>
    <div class="menu noevents">  
      <div class="item">
      </div>
      <div class="item">
           <!-- <div class="gridRefInputWrapper"> -->
          <!-- <v-text-field class="allevents gridRefInput" color="white" single-line v-model="gridRef" flat :rules="[rules.gridRef]"></v-text-field> -->
          <!-- </div> -->
        <v-btn icon large :ripple="false" class="white--text menu-btn noevents">
          <div v-if="currentGridRef">
            <span v-if="currentGridRef.properties.index" >#{{currentGridRef.properties.index}}</span>
            <span v-else>- - -</span>
          </div>
        </v-btn>
      </div>

      <div class="item">
        <v-btn icon large :ripple="false" class="white--text menu-btn noevents">
          <v-icon v-if="!loading">done</v-icon>
           <v-progress-circular v-else indeterminate color="white"></v-progress-circular>
        </v-btn>
      </div>
      
      <div v-for="item in items" class="item">
        <v-btn icon large class="white--text menu-btn allevents"><v-icon>{{item.icon}}</v-icon></v-btn>
      </div>

    </div>
    <transition name="fade">
    <mappy-mini :disabled="['dragPan', 'dragRotate', 'Keyboard']" v-show="!mini" v-if="menuWidth" container="minimap" :class="['minimap']" zoom="8" :LngLat="[138.7435885246556, -34.38845881895241]" mapStyle="mapbox://styles/edanweis/cjg1u9fq858tt2rmekjscx5qa" :token="credentials.mapbox.token"></mappy-mini> 
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
      gridRef: null,
      rules: {
               gridRef: (value) => {
                 const pattern = /\d\d\d/
                 return pattern.test(value) || 'Invalid grid reference.'
               }
             },
      items: [
        {icon: 'layers', tooltip: 'hide/show layers'},
        {icon: 'help', tooltip: 'Click for help'},
      ]
    }
  },
  mounted(){
  },
  watch: {
    gridRef: function(val){

    }
  },
  computed: {
    ...Vuex.mapGetters(['mini', 'loading', 'currentGridRef', 'miniWidth', 'menuWidth']),

  },
  methods: {
    ...Vuex.mapGetters(['setCurrentGridRef']),



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

.tempInput{
  z-index: 99;
  display: block;
  
}

.logo-wrapper{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 400px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 60px 30px 0 30px;
  z-index: 2;
}

.logo{
  position: relative;
  margin: 0;
  width: 90%;
  min-width: 45px; 
  max-width: 200px;
}

.logo.clipped{
  clip-path: inset(0px 0px 5px 0px);
}

.minimap *{
  cursor: default !important;
}

.minimap{
  mix-blend-mode: screen;
  opacity: 1;
  // hide Mapbox logo
  top: 40px;
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

.overlay-mapmini{
  position: absolute;
  pointer-events: none;
  top: 0;
  right: 0 !important;
  height: 100vh;
  width: 100%;
  opacity: 1;
  z-index: 1;
  background: -moz-linear-gradient(top, rgba(250,152,152,1) 0%, rgba(250,152,152,0) 100%);
  background: -webkit-linear-gradient(top, rgba(250,152,152,1) 0%,rgba(250,152,152,0) 100%);
  background: linear-gradient(to bottom, rgba(250,152,152,1) 0%,rgba(250,152,152,0) 100%);
  
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
  background: -moz-linear-gradient(top, rgba(243,80,81,0) 0%, rgba(243,80,81,1) 98%, rgba(243,80,81,1) 100%);
  background: -webkit-linear-gradient(top, rgba(243,80,81,0) 0%,rgba(243,80,81,1) 98%,rgba(243,80,81,1) 100%);
  background: linear-gradient(to bottom, rgba(243,80,81,0) 0%,rgba(243,80,81,1) 98%,rgba(243,80,81,1) 100%);
  
}


</style>
