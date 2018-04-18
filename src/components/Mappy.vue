<template>

  <mapbox ref="map" :id="container" :class="['map', {'hidden':hide}]" :access-token="token"
    :map-options='{
      style: mapStyle,
      center: this.LngLat,
      zoom: this.zoom,
      attributionControl: false,
      container: this.container,
      maxBounds: [[138.171198, -35.838219], [140.040362, -34.210264]]
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
    @map-dblclick='mapDblclick'
    @map-zoomstart='zoomStart'
    >
  </mapbox>
  
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'

import Mapbox from 'mapbox-gl-vue';
import store from '../store.js' 
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
      areFeaturesLoaded: false,
      touching: false,
      interval: null,
      hide: true,
      grid,
      changedGrid: false,
      updateFilter: true,
      filters: {
        grid: [],
        region: []
      },
      sketchfabModeActive: false,
      gridProperties: {
        sketchfabBg: null,
        flatHeight: 0,
        flatOpacity: {"base": 1,"stops": [[11, 0], [12.7, 0.3]]},
        flatColor: '#513657',
        flatPitch: null,
        highHeight: 300,
        highOpacity: 1,
        highColor: '#513657',
        highPitch: 60
      }
    
    }},
  mounted(){
  },
  watch: {
    features: function(val){
      if(val && !this.areFeaturesLoaded){
        // this.addMarkers(val)
      }
    },

    currentGridRef: function(newVal, oldVal){
      if(newVal != oldVal){
        this.changedGrid = true
        // setTimeout(function () {
        //   if(this.sketchfabModeActive){
        //     // this.flattenGrid()  
        //   }
        // }.bind(this), 120)        
      }
    },


  },
  computed: {
    ...Vuex.mapGetters(['currentGridRef', 'mini', 'miniWidth', 'offsetCenterPx', 'offsetCenterLngLat', '_map', 'menuWidth', 'bearing'])
  },
  methods: {

    ...Vuex.mapMutations(['setMapCenter', 'setMap', 'setMapWidth', 'setDebug', 'setBearing']),

    remap(num, in_min, in_max, out_min, out_max) {
      return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    },

    addMarkers(features){
      var self = this
      const makerContent = Vue.extend(Marker, {
        paramAttributes: ['feature']
      })
      features.forEach(function(feature, index) {
        var parent = document.createElement('div');
            parent.classList.add("mapboxgl-marker");
        var child = document.createElement('div')
            child.setAttribute("feature", feature)
            child.classList.add("marker");
        parent.appendChild(child);
         const marker = new mapboxgl.Marker(parent)
         .setLngLat(feature.geometry.coordinates)
         .addTo(self._map)
        new makerContent({
          store: store,
          // dataFeature: feature,
          // paramAttributes: feature
          // propsData: {
          //   zoom: self.zoom,
          //   feature: feature, 
          //   fbKey: feature['.key'],
          //   index: index,
          // }
        }).$mount(child); 
      })
      this.areFeaturesLoaded = true
    },

    mapInit(map){
          // save map to component's data
          this.setMap(map)
    },
    mapLoad(map){
      this.$emit('loaded', map)
      this.setBearing(map.getBearing())
      var self = this
      this.interval = setInterval( function(e){
          if(map.areTilesLoaded()){
            self.hide = false
            clearInterval(this.interval) 
          }
      }.bind(this), 100)

      this.gridProperties.sketchfabBg = this._map.getPaintProperty('sketchfab-bg', 'background-opacity')
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
            'fill-opacity':this.gridProperties.flatOpacity,
            'fill-color': '#E11212',
            // 'fill-outline-color': '#fff',
            // 'fill-antialias': true,
            // 'fill-translate': [0, 0],
            // 'fill-translate-anchor': 'map',
            // 'fill-opacity-transition': {duration: 400}
          },
          "filter": ["==", "$type", "Polygon"],
      });

      map.addLayer({
            'id': '3d-buildings',
            'source': 'grid',
            // 'source-layer': 'building',
            // 'filter': ['==', 'extrude', 'true'],
            // 'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 2,
            'paint': {
                'fill-extrusion-color': '#513657',
                'fill-extrusion-height-transition': {duration: 600},
                'fill-extrusion-height': 0,
                'fill-extrusion-base': 0,
                'fill-extrusion-opacity': 1
            },
            "filter": ["all", ["==", ["get", "index"], 9999]],
        }, 'ahwr-regions');

      // console.log('layer id?: ', map.getStyle().layers[map.getStyle().layers.length-1].id)

      map.setFilter('gridlayer', ['==', 'index', 99999]);  
      map.setFilter('ahwr-regions-solid', ['==', 'id', 99999]);  



      // this._map.transform._fov = 0.4
    },
    mapClick(map, e){
      console.log(e)
      var g = map.queryRenderedFeatures(e.point, { layers: ['gridlayer']})
      if(g.length && !this.sketchfabModeActive){
        console.log('extruding grid...')
        this.changedGrid = false
        this.extrudeGrid(g)
      } else {
        if(!g.length || this.sketchfabModeActive){
          console.log('flattening grid...')
          this.flattenGrid()
          map.flyTo({center: e.lngLat});
        }
      }

      // console.log(map.getCenter(), map.project(map.getCenter()))
    },
    extrudeGrid(g){
      var g = g.length ? g : [this.currentGridRef]
      this._map.setPaintProperty('gridlayer', 'fill-opacity', 0)
      // this.toggleLayers(['labels'], 'none')
      this._map.setFilter('3d-buildings', ['match', ['to-number', ['get', 'index']], g[0].properties.index, true, false])
      this._map.setPaintProperty('3d-buildings', 'fill-extrusion-height', this.gridProperties.highHeight)
      this._map.setPaintProperty('3d-buildings', 'fill-extrusion-opacity', this.gridProperties.highOpacity)
      setTimeout(function () {
        this.sketchfabModeActive = true
        this._map.setPaintProperty('sketchfab-bg', 'background-opacity', 0.999)
        this._map.easeTo({pitch: this.gridProperties.highPitch, bearing: this.bearing })
      }.bind(this), 120)

      
    },
    flattenGrid(){
      this.sketchfabModeActive = false
      this._map.setPaintProperty('sketchfab-bg', 'background-opacity', 0)
      // this.toggleLayers(['labels'], 'visible')
      this._map.setPaintProperty('3d-buildings', 'fill-extrusion-height', this.gridProperties.flatHeight)
      this._map.setPaintProperty('3d-buildings', 'fill-extrusion-opacity', 0)
      this._map.easeTo({pitch: this.gridProperties.flatPitch, bearing: this.bearing })

      setTimeout(function () {
          this._map.setPaintProperty('gridlayer', 'fill-opacity', this.gridProperties.flatOpacity )
      }.bind(this), 30)
            
    },


    toggleLayers(layers, state){
      // console.log('setting layers to ', String(state), )
      for(let l of layers){
        this._map.setLayoutProperty(l, 'visibility', state)
      }
    },


    mapZoom: _.debounce(function(map){

    //   var z =map.getZoom()
    //   map.flyTo({
    // f     pitch: this.remap(z,6,20,0,80)
    //   })     

    if(!this.sketchfabModeActive){
      this.gridProperties.flatPitch = this._map.getPitch()
    }
    
    

    }, 200),

    // mapZoom(map){
      
    // },
    zoomStart(map){
      if(this.touching){
        var z = map.getZoom()
        map.jumpTo({
          pitch: this.remap(z,9,13,0,80),
          // zoom: z+.5
        })     
        
      }
    },

    mapMove(map){
      this.setMapCenter(this._map.getCenter())
      this.filterRegion()
      this.filterGrid()      
      this.setDebug({currentGridRef: this.currentGridRef.properties.id, sketchfabModeActive: this.sketchfabModeActive, changedGrid: this.changedGrid} )   
    },
    mapMoveend(){
      console.log('moveStart')
      if(this.changedGrid && this.sketchfabModeActive){
        this.flattenGrid()
      }
    },
    mapMovestart(){
    },
    mapStyleloading(){

    },
    mapTouchend(){
      this.touching = false
    },
    mapTouchstart(){
      this.touching = true
    },
    mapDblclick(){

    },
    filterRegion(){
      var r = this._map.queryRenderedFeatures(this._map.project(this.offsetCenterLngLat), { layers: ['ahwr-regions-mouseover'] })
      if(r.length){
        //using data expressions as filter produces a rendering glitch with polygons
        // this.filters.region = ['ahwr-regions-solid', ['match', ["to-number", ['get', 'id']], r[0].properties.id, true, false]]
        this.filters.region = ['ahwr-regions-solid', ['==', 'id', r[0].properties.id]]
        this._map.setFilter(...this.filters.region)
      }
    },
    filterGrid(){
      this.filters = {'grid': [], 'region': []}
      if(this.currentGridRef){
        var ag = this.currentGridRef.properties.index
        // console.log(ag)
        this.filters.grid = ['gridlayer', ['match', ['get', 'index'], ag, true, false]] 
        this._map.setFilter(...this.filters.grid)
        
      }

    }
  }
}
</script>

<style>

/*Map style should have same name as container*/
.map{
  height: 100vh;
  width: 100vw;
  transition: all 245ms cubic-bezier(0.0, 0.0, 0.2, 1);
}

.hidden{
  opacity: 0;
}

.mapboxgl-canvas{
  position: relative !important;
}
</style>
