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



      <mappy  container="map" zoom="9" :LngLat="[138.829631 ,-34.964802]" mapStyle="mapbox://styles/edanweis/cjg354nvaisvf2srv8vcv3yin" :token="credentials.mapbox.token"></mappy>

      <sketchfab v-show="sketchfabLoaded" urlid="6d24cec1439841ae8b8231ae973995ae" autospin='0' autostart='1' preload='1' ui_controls='0' ui_infos='0' ui_related='0' transparent='1' scrolling="yes"></sketchfab>
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

export default {
  name: 'home',
  components: {
    Mappy,
    Sketchfab
  },
  data () {
    return {
      credentials,
      camera: null
    }
  },
  computed: {
    ...Vuex.mapGetters(['mini', '_mapCenter', '_map', 'debug', 'sketchfab', 'sketchfabLoaded']),

    projectedCenter: function(){
       return this._map.project(this._mapCenter)
    }
  },
  mounted(){

    // this.setSketchfabLoaded(false)
  },
  watch:{
    sketchfabLoaded: function(val){
      console.log('sk loaded?',val)
    }
  },
  methods:{
    ...Vuex.mapMutations(['setSketchfabLoaded'])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

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
</style>
