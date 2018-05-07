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
import _ from 'lodash'
var grid = require('../assets/grid.json')

export default {
  name: 'Mappy',
  props: ['LngLat', 'mapStyle', 'container', 'mapStyle', 'features', 'token', 'zoom'],
  components:{
    Mapbox
  },
  data () {
    return {
      grid,
      areFeaturesLoaded: false,
      hide: true,
      interval: null,
      filters: {
        grid: null,
        region: null
      }
    }},
  mounted(){
    // console.log('got width?', this.menuWidth)
  },
  watch: {
    _mapCenter: function(m){   
      // console.log('map is moving')
      this.updateMapMini()
      this.filterRegion()
      this.fadeGrid()
      // console.log(this.currentGridRef)
      this.filters.grid ? this._mapmini.setFilter(...this.filters.grid) : null
      this.filters.region ? this._mapmini.setFilter(...this.filters.region) : null
      
    },

    currentGridRef: function(newVal, oldVal){
      this.filters.grid = ['gridlayer', ['==', 'index', newVal.properties.index]]
    },

  },
  computed:{
    ...Vuex.mapGetters(['_mapmini', '_mapCenter', '_map', 'miniWidth', 'mini', 'currentGridRef', '_mapWidth', 'menuWidth', 'offsetCenterLngLat', 'offsetCenterPx']),

    offsetCenterPx: function(val){
      var ocp = this._map.unproject([((this.$vuetify.breakpoint.width-this.menuWidth)/2), (this.$vuetify.breakpoint.height/2)])
      this.setOffsetCenterLngLat(ocp)
      return ocp
    },

  },
  methods: {
    ...Vuex.mapMutations(['setMapMini', 'setCurrentGridRef', 'setDebug', 'setOffsetCenterLngLat', 'setOffsetCenterPx']),
    
    remap(num, in_min, in_max, out_min, out_max) {
      return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    },

    changeLayer(){
      // if(this._map.getLayer('3d-buildings')){
      //   this._map.removeLayer('3d-buildings')  
      // }

      // this._map.addLayer({
      //       'id': '3d-buildings',
      //       'source': 'grid',
      //       'type': 'fill-extrusion',
      //       'minzoom': 2,
      //       'paint': {
      //           'fill-extrusion-color': '#fff',
      //           'fill-extrusion-height': 500,

      //           'fill-extrusion-base': 0,
      //           'fill-extrusion-opacity': 1
      //       },
      //       "filter": ["all", ["==", ["get", "id"], this.currentGridRef.properties.index]],
      //   }, 'gridlayer');
    },

    fadeGrid(){

      this._mapmini.setPaintProperty('gridlayer', 'fill-opacity', this.remap(this._map.getZoom(), 10.5, 12, 0, 0.9))

    },

    filterRegion(){
      var r = this._mapmini.queryRenderedFeatures(this._mapmini.project(this.offsetCenterPx), { layers: ['ahwr-regions-mouseover'] })
      if(r.length){
        this.filters.region = ['ahwr-regions-line', ['match', ['to-number', ['get', 'id']], r[0].properties.id, true, false]] //

        // this.filters.region = ['ahwr-regions-line', ['==', 'id', r[0].properties.id]]
        
        // this._mapmini.setFilter(...this.filters.region);
        // console.log(this._mapmini.getLayer('ahwr-regions-line'))
        // this._mapmini.setFilter(['ahwr-regions-line', ['match', ['get', 'id'], r[0].properties.id, true, false]])
      }
    },

    updateMapMini(){
      var pm = this._mapmini.project(this.offsetCenterPx)
      // var gr = this._mapmini.queryRenderedFeatures(pm, {'layers': ['grid']})
      // if(gr.length){
      //   this.setCurrentGridRef(gr[0])
      //   this.filters.grid = ['gridlayer', ['==', 'index', gr[0].properties.index]]
      // }
      this.setZoomCenter()
      this.setOffsetCenterPx(pm)
      
    },

    setZoomCenter(){
      // set zoom as ratio from large map
      let z = this.remap(this._map.getZoom(), 8, 12.7, this.remap(this.$vuetify.breakpoint.width,300,1920,8,8.5), this.remap(this.$vuetify.breakpoint.width,300,1920,8.5,9))

        this._mapmini.setZoom(z)

        // this._mapmini.setPaintProperty('grid', 'fill-opacity', this.remap(z, this.remap(this.$vuetify.breakpoint.width,300,1920,8,8.5), this.remap(this.$vuetify.breakpoint.width,300,1920,8.5,9), 0.9, 0 ))        
      
      // lower map to be at bottom of window, depending on window height.
      var v_offset = [this.offsetCenterPx.lng, this.offsetCenterPx.lat + this.remap(this.$vuetify.breakpoint.height, 200, 1080, 0, 0.35)]
      // set center of mapmini
        this._mapmini.setCenter(v_offset)
    },

    mapInit(map){
      // save map to component's data
      this.setMapMini(map)
    },
    mapLoad(map){
      var self = this
      this.interval = setInterval( function(e){
          if(this._mapmini.areTilesLoaded()){
            self.hide = false
            self.updateMapMini()
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
            'fill-opacity': {
                "base": 1,
                "stops": [
                  [0, 0],
                  [8.65, 0],
                  [8.75, 1]
                ]
              },
            'fill-color': '#fff',
            'fill-outline-color': '#fa5f5f'
            
            // 'fill-translate': [0, 0],
            // 'fill-translate-anchor': 'map',
            // 'fill-opacity-transition': {duration: 0}
          },
          "filter": ["==", "$type", "Polygon"],
      });

      // this._mapmini.setFilter('gridlayer', ['==', 'index', 99999]);  

      

      // this._mapmini.transform._fov = 0.4
    },
    mapClick(map, e){
      // console.log(e)
       var grid = _.pickBy(this._mapmini.queryRenderedFeatures(e.lngLat), e=>{
        return e.layer.id == "gridlayer"
       })
       // console.log('mini map click grid', grid)
       if(grid){
        this._map.flyTo({center: [e.lngLat.lng, e.lngLat.lat] });
        // this.offsetflyTo({lng: grid[0].properties.cen_x, lat:grid[0].properties.cen_y})
       }
       // var p = this._mapmini.queryRenderedFeatures(e.lngLat)
       // console.log('query',this._mapmini.queryRenderedFeatures(e.lngLat))
       // console.log('grid', grid)
       // this._map.flyTo({center: this._mapmini.unproject([e.point.x-61, e.point.y]) });
    },

    offsetflyTo(center, options){
      // console.log(options)
      var c = this._map.project(this._map.getCenter())
        var offset = this._map.getCenter().lng - this._map.unproject([c.x-(this.menuWidth/2), c.y]).lng
        var offset2 = this._map.getCenter().lng - this._map.unproject([c.x-(this.menuWidth*6), c.y]).lng

      this._map.flyTo({center: [center.lng+offset, center.lat], pitch: 0, around: [center.lng+offset2, center.lat], ...options});
    },

    mapZoom(map){
        map.setBearing(0)


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
  width: 100%;
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
