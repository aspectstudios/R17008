<template>

  <div id="app">
  <sheet ref="sheet" class="sheet" @resized="resizedSheet" startingWidth="800">
    <mapbox access-token='pk.eyJ1IjoiZWRhbndlaXMiLCJhIjoiY2lmMTVtdWQ0MDRsOHNkbTV2OXd3cDNwNiJ9.MxWj73wGNEvrPSjsh6TJjw'
    
    :map-options='{
      style: "mapbox://styles/edanweis/cj2iddj93001k2rph61u9lw6f",
      center: [138.7333, -34.9141],
       zoom: 13,
       hash:true,

    }'

    :navControl='{
      show: false
      }'
    
    :geolocate-control='{
      show: false, 
      position: "top-left"
    }'
    
    @map-resize='mapResized'

    @map-movestart='mapMoveStart'

    @map-move='mapMoving'

    @map-click="mapClicked"

    @map-mousemove="mapMouseMoved"

    @map-load="mapLoaded"

    @map-zoom="mapZooming"

    >
      
    </mapbox>
    <div  :class='["circle", {"active": circle.o > 0 ? true : false}, {"inactive": circle.o < 1 ? true : false}]' :style='{"transform": "translateX("+circle.x+"px) translateY("+circle.y+"px)", "width": circle.r*2+"px", "height": circle.r*2+"px"}'></div>
    </sheet>
    <div id="info-container" class="info">
      {{winery.name}}
    </div>
  </div>
</template>

<script>
import Mapbox from 'mapbox-gl-vue'
import Vue from 'vue'
import { mapMutations, mapGetters } from 'vuex'
import Vuetify from 'vuetify'
Vue.use(Vuetify)
import Sheet from './components/Sheet'
var dynamics = require('dynamics.js')

var geodist = require('geodist')
var _=require('lodash')

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}


function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}


export default {
  name: 'app',
  components: {
    Mapbox,
    Sheet
  },
  data () {
    return {
      currentSelected: [],
      winery: {
        name: null
      },
      circle:{
        x: 0,
        y: 0,
        o: 0,
        r: 50
      }
    }
  },
  computed:{
    
    ...mapGetters([
      'getWinerySelected',
      ])

  },
  methods:{
    
    ...mapMutations([
      'addSelectedWinery'
      ]),
    resizedSheet: function(){
      // triggers the map.resize() event of mapbox, because we can't (?) select the DOM map element, unless using #ref="blah"?
      window.dispatchEvent(new Event('resize'));


      // console.log('resizing map')
    },
    mapResized(){
      // console.log('resized')

    },
    mapClicked(map, e) {
      // console.log(  geodist({lat: 41.85, lon: -87.65}, {lat: 33.7489, lon: -84.3881}))

        const features = map.queryRenderedFeatures(e.point, {
            layers: ['winery label', 'winery triangle']
        });
        

        if (features[0]){
         map.flyTo({
          center: features[0].geometry.coordinates,
          zoom: 15, 
          bearing: 0,
          pitch: 0
        });
        // console.log(features[0].properties.name)
        this.addSelectedWinery(features[0].properties.name)
        this.currentSelected = [features[0].properties.name, features[0].geometry.coordinates]
      }

    },
    mapMouseMoved(map, e) {
      // console.log(map, e)
        const features = map.queryRenderedFeatures(e.point, {
            layers: ['winery label', 'winery triangle']
        });
        map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
    },

    mapMoveStart(e){
      console.log("movestart")
      this.circle.o = 0;
    },

    mapMoving(e){
      this.moveCircle(e, map)     
    },

    mapLoaded(e){
      this.moveCircle(e)
    },

    mapZooming(e){
      console.log(e.getZoom())
      if (e.getZoom() < 9){
        this.circle.r = 0  
      } else{
        this.circle.r = map_range(e.getZoom(), 15, 9, 50, 15 )  
      }
      
    },

    moveCircle: function(e){
      // var centerMapX = parseInt(e.project(e.getCenter()).x)
      // var centerMapy = parseInt(e.project(e.getCenter()).y)
      // console.log(e.getCenter()) // get center
      var features = e.queryRenderedFeatures({ layers: ['winery triangle'] });
      var w = []
      for (var i = features.length - 1; i >= 0; i--) {
        w.push({name: features[i].properties.name, 'coordinates': features[i].geometry.coordinates, 'screen_coordinates': e.project([features[i].geometry.coordinates[0], features[i].geometry.coordinates[1]]) }) 
      }
      var wineries = _.uniqBy(w, 'name');
      var results = []
      for (var i = wineries.length - 1; i >= 0; i--) {
        results.push({'winery': wineries[i].name, 'coordinates': wineries[i].coordinates, 'screen_coordinates': wineries[i].screen_coordinates, 'distance': geodist([e.getCenter().lat, e.getCenter().lng], [wineries[i].coordinates[1], wineries[i].coordinates[0]], {format: false, unit: 'meters'} )})
      }
      if (results[0]){
        results = _.sortBy(results, 'distance');
        var nx = parseInt(results[0].screen_coordinates.x - this.circle.r*1.2)
        var ny = parseInt(results[0].screen_coordinates.y - this.circle.r*1.2)
        this.circle.x = nx
        this.circle.y = ny
        this.circle.o = 1;
      } else{
        this.circle.o = 0;
        // no idea why this doesn't work (goes crazy).
        // this.circle.x = centerMapx; 
        // this.circle.y = centerMapy;
      }
    }
  }
}


</script>

<style>
body, html{
  margin: 0;
  height: 100%;
}

#app {
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  /*color: #2c3e50;*/
  /*padding-top: 0px;*/

}


.info{
  position: absolute;
  z-index: -1;
  right: 0px;
  top: 0;
  width: 100vw;
  height: 100vh;
  /*background-color: red;*/
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 5%;
}

.circle{
  position: absolute;
  display: block;
  border: 2px dotted white;
  border-radius: 50%;
  background-color: rgba(255,255,255,0.5);
  mix-blend-mode: overlay;
  z-index: 2;
  transition: 0.06s ease-in-out;
  transition-property: transform;
  left: 0;
  top: 0;

  box-shadow: 0px 0px 46px 0px #474747;

  /*box-sizing: content-box;*/
  /*mix-blend-mode: overlay;*/
  /*background-clip: border-box;*/
  pointer-events: none;
}

.circle.active{
  opacity: 0.7;
  /*transition: opacity 1s ease-out;*/
  /*transition-delay: 400;*/
}

.circle.inactive{
  opacity: 0;
  /*transition: opacity 0.2s ease-out;*/
  /*transition-delay: 1000;*/
}
</style>
