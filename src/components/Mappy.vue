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
      interactions: ['BoxZoomHandler','ScrollZoomHandler','DragPanHandler','DragRotateHandler','KeyboardHandler','DoubleClickZoomHandler','TouchZoomRotateHandler', 'dragRotate'],
      savedCenter: null,
      spinInterval: null,
      toggleLayers: [],
      areFeaturesLoaded: false,
      touching: false,
      interval: null,
      busy: false,
      hide: true,
      grid,
      changedGrid: false,
      updateFilter: true,
      filters: {
        grid: [],
        region: []
      },
      gridProperties: {
        sketchfabBg: null,
        flatHeight: 0,
        flatOpacity: {"base": 1,"stops": [[11, 0], [12.7, 0.3]]},
        flatColor: '#513657',
        flatPitch: null,
        highHeight: 850,
        highOpacity: 1,
        highColor: '#513657',
        highPitch: 0
      }
    
    }},
  mounted(){
  },
  watch: {

    wineries: function(val){
      if(val){
        this.updateWineries(val)
      }
    },

    soilMode: function(val){
        // console.log('detected soil mode change')
        this.toggleSoilMode(val)
    },

    launch3D: function(val){
      if(val){
        this.extrudeGrid([], this.currentGridRef)  
      }
      
    },

    sketchfabMode: function(newVal, oldVal){
      if((newVal === false) && (oldVal === true)){
        this.flattenGrid()
      }
    },
    // _mapCenter: function(val){

      // var gr2 = this._map.queryRenderedFeatures(this._mapCenter, {'layers': ['grid']})

    // },
    currentGridRef: function(newVal, oldVal){
      if(newVal != oldVal){
        this.changedGrid = true

        // setTimeout(function () {
        //   if(this.sketchfabMode){
        //     // this.flattenGrid()  
        //   }
        // }.bind(this), 120)        
      }
    },


  },
  computed: {
    ...Vuex.mapGetters(['currentGridRef', 'mini', 'miniWidth', 'offsetCenterPx', 'offsetCenterLngLat', '_map', 'menuWidth', 'bearing', 'mapbox','_mapOrigin', '_mapCenter', 'sketchfabMode', 'gridExtruded', 'wineries', 'launch3D', 'soilMode']),

  },
  methods: {

    ...Vuex.mapMutations(['setMapCenter', 'setMap', 'setMapWidth', 'setDebug', 'setBearing', 'setmapOriginPx', 'setMapbox', 'setCurrentGridRef', 'setSketchfabMode', 'setGridExtruded', 'setPitch', 'setWineriesHere', 'toggleLaunch3D']),

    remap(num, in_min, in_max, out_min, out_max) {
      return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    },

    updateWineries(features){
      if(this._map.getSource('firebase')){
        this._map.getSource('firebase').setData({
          type: "FeatureCollection",
          "features": features
        })
      }
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
      var self = this
      this.setBearing(0)
      this.setmapOriginPx(map.project(map.getCenter()))
      this.setMapboxCamera(map)
      this.$emit('loaded', map)

      this.interval = setInterval( function(e){
          if(map.areTilesLoaded()){
            self.hide = false
            clearInterval(self.interval) 
          }
      }.bind(this), 100)


      map.addSource('grid', {
        type: 'geojson', 
        data: {
          type: 'FeatureCollection',
          features: this.grid.features
        }
      })

      if (map.getLayer('grid')){
        map.removeLayer('grid')
        map.addLayer({
            "id": "grid",
            "type": "fill",
            "source": "grid",
            "paint": {
              'fill-opacity':0,
            },
            "filter": ["==", "$type", "Polygon"],
        }, 'winery-1j2w4g');
      }

      map.addSource('firebase', {
        type: 'geojson', 
        data: {
          type: 'FeatureCollection',
          features: this.wineries['.value']
        }
      })

      map.addLayer({
          "id": "winery-info",
          "type": "circle",
          "source": "firebase",
          "paint": {
            'circle-opacity': 0.001,
            'circle-radius':1,
          }
      });

      map.addLayer({
          "id": "gridlayer",
          "type": "fill",
          "source": "grid",
          "paint": {
            'fill-opacity':this.gridProperties.flatOpacity,
            'fill-color': '#fff'
            // 'fill-outline-color': '#fff',
            // 'fill-antialias': true,
            // 'fill-translate': [0, 0],
            // 'fill-translate-anchor': 'map',
            // 'fill-opacity-transition': {duration: 400}
          },
          "filter": ["==", "$type", "Polygon"],
      }, 'mapbox-satellite');

      map.addLayer({
          "id": "gridlayer-line",
          "type": "line",
          "source": "grid",
          "paint": {
            'line-color': '#fff',
            'line-opacity': 0.1
          },
          "filter": ["==", "$type", "Polygon"],
      });

      map.addLayer({
            'id': '3d-buildings',
            'source': 'grid',
            'type': 'fill-extrusion',
            'minzoom': 2,
            'paint': {
                'fill-extrusion-color': '#78C583',
                'fill-extrusion-height-transition': {duration: 1200, delay: 300},
                'fill-extrusion-height': 0,
                'fill-extrusion-base': 0,
                'fill-extrusion-opacity': 1
            },
            "filter": ["all", ["==", ["get", "index"], 9999]],
        }, 'mapbox-satellite');

      // console.log('layer id?: ', map.getStyle().layers[map.getStyle().layers.length-1].id)

      map.setFilter('gridlayer', ['==', 'index', 99999]);  
      // map.setFilter('ahwr-regions-solid', ['==', 'id', 99999]);  

      map.on('style.load', function () {
        map.setPaintProperty('3dmask', 'background-opacity-transition', 1200)
       })
      

      // this._map.transform._fov = 0.4
    },
    mapClick(map, e){
      this.filterRegion(e)

      var g = map.queryRenderedFeatures(e.point, { layers: ['gridlayer']})
      if(g.length && !this.sketchfabMode){
        // console.log('extruding grid...')
        this.changedGrid = false
        this.extrudeGrid(g, this.currentGridRef)
      } else {
        if(!g.length && !this.sketchfabMode){
          // console.log('going to ', {lng: e.lngLat.lng, lat:e.lngLat.lat})
          this.offsetflyTo({lng: e.lngLat.lng, lat:e.lngLat.lat})
          // console.log('flattening grid...')
          // this.flattenGrid(e)
          
        }
      }

      // console.log(map.getCenter(), map.project(map.getCenter()))
    },
    extrudeGrid(g, currentGridRef){
      this.setSketchfabMode(true)
      // this.layerToggle(false, ['3dmask', 'gridlayer-line', 'grid', '3d-buildings', 'gridlayer'], '3dmask', 'mapbox-terrain-rgb')

      var g = g.length ? g : [this.currentGridRef]
      this._map.setPaintProperty('gridlayer', 'fill-opacity', 0)
      this._map.setFilter('3d-buildings', ['match', ['to-number', ['get', 'index']], g[0].properties.index, true, false])
      this._map.setPaintProperty('3d-buildings', 'fill-extrusion-height', this.gridProperties.highHeight)
      this._map.setPaintProperty('3d-buildings', 'fill-extrusion-opacity', this.gridProperties.highOpacity)

      setTimeout(function () {
        var bbox = [[currentGridRef.properties.lng_min,currentGridRef.properties.lat_min],[currentGridRef.properties.lng_max,currentGridRef.properties.lat_max]]
        this._map.setPaintProperty('3dmask', 'background-opacity', 0.999)
        this._map.fitBounds(bbox, {padding: {top: 0, bottom:0, left: this.menuWidth, right: 0}})
        // this._map.fitBounds(bbox)
      }.bind(this), 800)

      // setTimeout(function () {
      // }.bind(this), 1300)

      setTimeout(function () {
        this.savedCenter = this._mapCenter
        if(!this.gridExtruded){
          this.zoomTo3D()
          this._map.panBy([this.menuWidth, 0], {'duration': 20000})
          // this.spin()  
          this.setGridExtruded(true)
        } 
        // this._map.easeTo({bearing: this._map.getBearing() + 179, duration: 400, around: {lng: currentGridRef.properties.cen_x, lat:currentGridRef.properties.cen_y}})
      }.bind(this), 1700)



      
    },

    toggleSoilMode(state){
      // console.log('toggling soil to ', state)

      this.layerToggle(!state, ['3dmask', 'winery-1j2w4g', 'grid', 'winery', 'ahwr-regions', 'ahwr-regions-line', 'ahwr-regions-solid', 'winery-info', 'gridlayer-line', 'gridlayer', 'soil', 'soil-labels','ahwr-regions-mouseover', 'region-boundary-dissolved', 'ahwr-regions line behind stroke','3d-buildings','mapbox-satellite'], 'ahwr-regions-solid')      
      
      if(state){
        this._map.setPaintProperty('soil', 'fill-opacity', 0.8)
        this._map.setPaintProperty('soil-labels', 'text-opacity', 1)
      } else{
        this._map.setPaintProperty('soil', 'fill-opacity', 0)
        this._map.setPaintProperty('soil-labels', 'text-opacity', 0)
      }
    },

    disableInteractions(){
      for(let i of this.interactions){
        if(this._map[i]){
            this._map[i].disable()  
        }
      }
    },
    enableInteractions(){
      for(let i of this.interactions){
        if(this._map[i]){
            this._map[i].enable()  
        }
      }
    },
    flattenGrid(e){
      this.setSketchfabMode(false)
      // this.layerToggle(true, [], '3dmask')
      this.toggleLaunch3D(false)
      clearInterval(this.spinInterval)
      this._map.jumpTo({center: this.savedCenter, bearing: 0})
      this._map.setPaintProperty('3d-buildings', 'fill-extrusion-opacity', 0)
      if (e){
        this.offsetflyTo( {lng: e.lngLat.lng, lat:e.lngLat.lat}, {pitch: this.gridProperties.flatPitch, bearing: 0 })
      }

      setTimeout(function () {
          this._map.setPaintProperty('3dmask', 'background-opacity', 0)
          this._map.setPaintProperty('gridlayer', 'fill-opacity', this.gridProperties.flatOpacity )
      }.bind(this), 30)

      setTimeout(function () {
          this._map.setPaintProperty('3d-buildings', 'fill-extrusion-height', this.gridProperties.flatHeight)
          this.setGridExtruded(false)
      }.bind(this), 300)

    },

    layerToggle: _.debounce(function(bool, excludes, under){

      if (this.toggleLayers.length == 0){
        for (let tl of this._map.getStyle().layers.filter( l => !excludes.includes(l.id))){
            this.toggleLayers.push(tl)
        }
      }

      try{
        for(let l of this.toggleLayers){
          if(bool){
            // console.log('adding layer', l.id)
            this._map.addLayer(l, under)
          } else{
            // console.log('removing layer', l.id)
              this._map.removeLayer(l.id)
          }}
      } catch(error){
        console.error(error)
      }
      }, 400),

    spin(){
        this.spinInterval = setInterval(function(){
              this._map.easeTo({bearing: this._map.getBearing()+179, duration: 4000, around: {lng: this.currentGridRef.properties.cen_x, lat:this.currentGridRef.properties.cen_y}})
          
        }.bind(this), 100)
    

    },
    toggleLayerVisibility(layers, state){
      // console.log('setting layers to ', String(state), )
      for(let l of layers){
        this._map.setLayoutProperty(l.id, 'visibility', state)
      }
    },


    mapZoom: _.debounce(function(map){

    //   var z =map.getZoom()
    //   map.flyTo({
    // f     pitch: this.remap(z,6,20,0,80)
    //   })     

    if(!this.sketchfabMode){
      this.gridProperties.flatPitch = this._map.getPitch()
    }
    
    

    }, 600),

    // mapZoom(map){
      
    // },

    zoomTo3D(){
      return this.remap(this.$vuetify.breakpoint.width, 600, 1920, 14.4, 16)
    },
    zoomStart(map){
      if(this.touching){
        var z = map.getZoom()
        map.jumpTo({
          pitch: this.remap(z,9,13,0,30),
          // zoom: z+.5
        })     
        
      }
    },

    getWineriesHere: _.debounce(function(val){
      if(this._map.getZoom() > 13){
        var wh = this._map.queryRenderedFeatures({'layers': ['winery-info']})
        this.setWineriesHere(_.uniqBy(wh, 'properties.id'))
      } else{
        this.setWineriesHere(null)
      }

    }, 1),

    mapMove(map){
      
      this.setBearing(this._map.getBearing())
      
      this.setMapCenter(this._map.getCenter())
      this.setMapboxCamera(map)
      // this.filterRegion()
      this.filterGrid()      
      if(this.offsetCenterLngLat){
        var gr = this._map.queryRenderedFeatures(this._map.project(this.offsetCenterLngLat) , {'layers': ['grid']})
        if(gr.length){
          this.setCurrentGridRef(gr[0])
        }
      }
      this.getWineriesHere()        
      
      
      // console.log(wineriesHere)

      // console.log(gr2[0].properties.index)
      // var pm = this._mapmini.project(this.offsetCenterPx)
      // var gr = this._mapmini.queryRenderedFeatures(pm, {'layers': ['grid']})

      // this.setDebug({currentGridRef: this.currentGridRef.properties.id, sketchfabMode: this.sketchfabMode, changedGrid: this.changedGrid} )   
    },
    mapMoveend(){
      // console.log('moveStart')
      // if(this.changedGrid && this.sketchfabMode){
      //   this.flattenGrid()
      // }
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
    filterRegion(e){
      if(e){
        var e = this._map.queryRenderedFeatures( e.point, { layers: ['ahwr-regions-mouseover'] })
      } else{
        var e = this._map.queryRenderedFeatures(this._map.project(this.offsetCenterLngLat), { layers: ['ahwr-regions-mouseover'] })
      }
      if(e.length){
        //using data expressions as filter produces a rendering glitch with polygons
        // this.filters.region = ['ahwr-regions-solid', ['match', ["to-number", ['get', 'id']], r[0].properties.id, true, false]]
        this.filters.region = ['ahwr-regions-solid', ['==', 'id', e[0].properties.id]]
      } else{
        this.filters.region = ['ahwr-regions-solid', ['has', 'id']]
      }
      this._map.setFilter(...this.filters.region)
    },
    filterGrid(){
      this.filters = {'grid': [], 'region': []}
      if(this.currentGridRef){
        var ag = this.currentGridRef.properties.index

        // console.log(this.currentGridRef.properties)
        this.filters.grid = ['gridlayer', ['match', ['get', 'index'], ag, true, false]] 
        this._map.setFilter(...this.filters.grid)
        
      }

    },
    offsetflyTo(center, options){
      // console.log(options)
      var c = this._map.project(this._map.getCenter())
        var offset = this._map.getCenter().lng - this._map.unproject([c.x-(this.menuWidth/2), c.y]).lng
        var offset2 = this._map.getCenter().lng - this._map.unproject([c.x-(this.menuWidth*6), c.y]).lng

      this._map.flyTo({center: [center.lng+offset, center.lat], around: [center.lng+offset2, center.lat], ...options});
    },
    setMapboxCamera(){
      var mc = this._map.project(this._mapOrigin.coords)
      var mcl = this._map.getCenter()
      var mcoords = {lng: mcl.lng, lat: mcl.lat}

      if(!this.mapbox.cameraOrigin){
        this.setMapbox({val: {pitch: this._map.getPitch(), zoom: this._map.getZoom(), bearing: this._map.getBearing(), coords: this._mapOrigin.coords, position: [mc.x, mc.y], FOV: this._map.transform.fov}, key: 'cameraOrigin' })
      }
      this.setMapbox({val: {pitch: this._map.getPitch(), zoom: this._map.getZoom(), bearing: this._map.getBearing(), coords: mcoords, position: [mc.x, mc.y], FOV: this._map.transform.fov}, key: 'camera' })
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

#map{

}

.hidden{
  opacity: 0;
}

.mapboxgl-canvas{
  /*position: relative !important;*/
}
</style>
