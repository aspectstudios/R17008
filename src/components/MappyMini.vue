<template>

  <transition name="fade">
  <mapbox :id="container" :class="['mapmini',{'hidden' : hide }]" :style="{'width': menuWidth+'px', 'left': miniWidth+'px'}" :access-token="token" 
    :map-options='{
      style: mapStyle,
      center: this.LngLat,
      maxZoom: 13,
      minZoom: 8,
      attributionControl: false,
      zoom: this.zoom,
      container: this.container
    }'
    :navControl='{show: false}'
    @map-init='mapInit'
    @map-click='mapClick'
    @map-zoom='mapZoom'
    @map-move='mapMove'
    @map-moveend='mapMoveend'
    @map-movestart='mapMovestart'
    @map-load='mapLoad'
    @map-styledataloading='mapStyleloading'
    @map-touchend='mapTouchend'
    @map-touchstart='mapTouchstart'
    @map-dblclick='mapDblclick'>
  </mapbox>
  </transition>
</template>

<script>
import Vue from 'vue'
import Mapbox from 'mapbox-gl-vue';
import store from '../store.js' 
import Vuex from 'vuex'
var grid = require('../assets/grid.json')

export default {
  name: 'Mappy',
  props: ['disabled', 'LngLat', 'mapStyle', 'container', 'mapStyle', 'features', 'token', 'zoom'],
  components:{
    Mapbox
  },
  data () {
    return {
      grid,
      areFeaturesLoaded: false,
      hide: true,
      interval: null,
    }},
  mounted(){
    this.setZoomCenter()
  },
  watch: {
    features: function(val){
      if(val && !this.areFeaturesLoaded){
        // this.addMarkers(val)
      }
    },
    _mapCenter: function(m){        

        this.setZoomCenter()
        var px = [((this.$vuetify.breakpoint.width-this.menuWidth)/2), (this.$vuetify.breakpoint.height/2)]
        var p = this._map.unproject(px)
        var pm = this._mapmini.project(p)
        this.setOffsetCenter(pm)
        this.setCurrentGridRef(this._mapmini.queryRenderedFeatures(pm))
        this.setCurrentGridRef(this.currentGridRef ? this.currentGridRef[0] : [])
        if(this.currentGridRef){
          var ag = this.currentGridRef.properties.index
          this._mapmini.setFilter()
          this._mapmini.setFilter('gridlayer', ['==', 'index', ag]);  
        }    
    }
  },
  computed:{
    ...Vuex.mapGetters(['_mapmini', '_mapCenter', '_map', 'miniWidth', 'mini', 'currentGridRef', '_mapWidth', 'menuWidth', 'offsetCenter']),

    

  },
  methods: {
    ...Vuex.mapMutations(['setMapMini', 'setCurrentGridRef', 'setDebug', 'setOffsetCenter']),
    
    remap(num, in_min, in_max, out_min, out_max) {
      return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    },

    setZoomCenter(){
      // set zoom as ratio from large map
        this._mapmini.setZoom(this.remap(this._map.getZoom(), 8, 12.7, this.remap(this.$vuetify.breakpoint.width,300,1920,8,8.5), this.remap(this.$vuetify.breakpoint.width,300,1920,8.5,9)))
      // set center of 
        this._mapmini.setCenter(this.miniOffset())
    },

    miniOffset: function(){
      var px = [((this.$vuetify.breakpoint.width-this.menuWidth-this.miniWidth)/2), (this.$vuetify.breakpoint.height/2)]
      var p = this._map.unproject(px)
      // console.log(px, p)
      return[p.lng, p.lat + this.remap(this.$vuetify.breakpoint.height, 200, 1080, 0, 0.5)]
    },

    mapInit(map){
      // save map to component's data
      this.setMapMini(map)
      if(this.disabled ){
        for(let d of this.disabled){
            if(this._mapmini[d]){
                this._mapmini[d].disable()  
            }
          }
      }
    },
    mapLoad(map){
      var self = this
      this.interval = setInterval( function(e){
          if(this._mapmini.areTilesLoaded()){
            self.hide = false
            clearInterval(this.interval) 
          }
      }.bind(this), 100)

      // Mapbox does not have a replace source method (?), so we remove and add a source
      // if(map.getSource('grid')){
      //   map.removeSource('grid')
      // }
      map.addSource('grid', {
        type: 'geojson', 
        data: {
          type: 'FeatureCollection',
          features: this.grid.features
        }
      })

      map.addLayer({
          "id": "gridlayer",
          "type": "fill",
          "source": "grid",
          "paint": {
            // 'fill-antialias': true,
            'fill-opacity': 0.7,
            'fill-color': '#fff',
            
            // 'fill-translate': [0, 0],
            // 'fill-translate-anchor': 'map',
            // 'fill-opacity-transition': {duration: 0}
          },
          "filter": ["==", "$type", "Polygon"],
      });

      this._mapmini.setFilter('gridlayer', ['==', 'index', 99999]);  

      
      // this._mapmini.transform._fov = 0.4
    },
    mapClick(){

    },
    mapZoom(){

    },
    mapMove(map){
      // console.log(self._map)
      // map.setZoom()
    },
    mapMoveend(){

    },
    mapMovestart(){

    },
    mapStyleloading(e){

      // console.log('styleloaded', e)

    },
    mapTouchend(){

    },
    mapTouchstart(){

    },
    mapDblclick(){

    },

  }
}
</script>

<style>

/*Map style should have same name as container*/
.mapmini{
  cursor: default !important;
  height: 100vh;
  position: absolute;
  transition: all 245ms cubic-bezier(0.0, 0.0, 0.2, 1);
}

.mapboxgl-canvas{
  position: absolute !important;
  outline: none;
   -webkit-tap-highlight-color: rgba(255, 255, 255, 0); /* mobile webkit */
}

.hidden{
  opacity: 0 !important;
}


</style>
