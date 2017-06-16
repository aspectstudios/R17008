<template>
  <div id="app" class="app-container">
    <transition-group name="slide" v-if="data">
        
        <div id="info-container" class="information winery" v-for="(winery, key, index) in data" v-if="winery.properties.id == currentSelected.properties.id" :key="key">

        <div class="winery-container">
            <div class="winery-name">{{ winery.properties.name }}<span class="winery-region">{{ winery.properties.region }}</span></div>
            
            <div class="winery-desc">{{ winery.properties.desc }}</div>
            <div class="winery-where"><span class="label">Where</span>{{ winery.properties.where }}<div class="winery-tel"><span class="label">T</span>{{ winery.properties.tel }}</div></div>
            
            <div class="winery-open"><span class="label">Open</span>{{ winery.properties.open }}</div>
            <a target="_blank" :href='"http://"+winery.properties.website' class="winery-website">{{ winery.properties.website }}</a>
        </div>
      </div>

      
      <!-- <div v-else id="info-container" class="information winery" >

        <div class="winery-container">
            <div class="winery-name">Explore</div>
            
            <div class="winery-desc">{{ winery.properties.desc }}</div>
        </div>
      </div> -->
    
    </transition-group>


    <v-container :class="['controls', 'container', {'active':sparklingSwitchVisible}]">
        <v-row>
          <v-col xs12 md12 >
            <v-card class="white elevation-7" style="border-radius: 30px;">
              <v-card-text style="padding-top: 0px !important">
                <v-switch :class='["switch",{"active": sparklingTrail}]' label="Sparkling Trail" primary v-model="sparklingTrail"  @click.native="toggleSparklingSwitch()"/>
              </v-card-text>
            </v-card>
          </v-col>
          </v-row>
          </v-container>

    <sheet ref="sheet" class="sheet" @resized="resizedSheet" startingWidth="800">
    <mapbox ref="map" access-token='pk.eyJ1IjoiZWRhbndlaXMiLCJhIjoiY2lmMTVtdWQ0MDRsOHNkbTV2OXd3cDNwNiJ9.MxWj73wGNEvrPSjsh6TJjw'
    
    :map-options='{
      style: "mapbox://styles/edanweis/cj2iddj93001k2rph61u9lw6f",
      maxBounds: [[138.1381,-35.5400], [139.7050,-34.4558]],
      center: [138.7333, -34.9141],
       zoom: 13,
       hash:true,

    }'

    :navControl='{
      show: true
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

    @map-moveend="mapMoveEnd"

    @map-dataloading="dataLoading"

    >
      
    </mapbox>


    <!-- <v-switch label="Sparkling Wine Trail" v-model="sparklingTrail" /> -->
    <!-- <v-switch value="false" v-model="sparklingTrail" input-value="false" primary light /> -->

    <!-- <div class="switch-label">Sparkling Wine Trail</div> -->
    <!-- <v-card class="white  elevation-1 controls">
     <v-card-text>
      <v-switch class="switch" primary v-model="sparklingTrail" light></v-switch>
      <span class="switch-label">Sparkling Wine Trail</span>
      </v-card-text>
    </v-card> -->


    <div  :class='["circle", {"off": circle.off == true ? true : false}, {"active": circle.o == 1 ? true : false}, {"inactive": circle.o == 0 ? true : false}]' :style='{"transform": "translateX("+circle.x+"px) translateY("+circle.y+"px)", "width": circle.r*2+"px", "height": circle.r*2+"px"}'></div>
    <div  :class='["multiply","circle", {"off": circle.off == true ? true : false}, {"active": circle.o == 1 ? true : false}, {"inactive": circle.o == 0 ? true : false}]' :style='{"transform": "translateX("+circle.x+"px) translateY("+circle.y+"px)", "width": circle.r*2+"px", "height": circle.r*2+"px"}'></div>


    </sheet>
  </div>
</template>

<script>
import Vue from 'vue'
import Vuetify from 'vuetify'
Vue.use(Vuetify)
require('./stylus/main.styl')

import Mapbox from 'mapbox-gl-vue'
var dynamics = require('dynamics.js')
import Sheet from './components/Sheet'
var geodist = require('geodist')
var _=require('lodash')
var db = require('./firebase-db.js')
var dataRef = db.db.ref('data')



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
      fake: false,
      dataReady: false,
      mapReady: false,
      data: [],
      map: null,
      sparklingTrailLayer: null,
      sparklingTrail: false,
      currentSelected: [],
      sparklingSwitchVisible: false,
      randomNum: 2,
      moveCircleActive: true,
      circle:{
        x: 0,
        y: 0,
        o: 0,
        r: 50,
        off: true
      }
    }
  },
watch: {
      dataReady: function (dataReady) {
        console.log('dataReady?', dataReady)
        if(dataReady && this.mapReady){
          this.loadData()
        }
      },
      mapReady: function (mapReady) {
        console.log('mapReady?', mapReady)
        if(this.dataReady && mapReady){
          this.loadData()
        }
      }
    },
  mounted(){
    var self = this
    console.log('Fetching Firebase data...')
    dataRef.once('value').then(function(snapshot) {
      console.log(String(snapshot.val().length), "wineries successfully downloaded from firebase" )
      let data = []
      for (var i = snapshot.val().length - 1; i >= 0; i--) {
        self.data.push(snapshot.val()[i])
        data.push(snapshot.val()[i])
      }
      return data
    }).then(function(data){
        self.dataReady = true
        // self.loadData(data)
        // self.moveCircle()
    })
  },
  methods:{
    
    // ...mapMutations([
    //   'addSelectedWinery'
    //   ]),
    resizedSheet: function(){
      // triggers the map.resize() event of mapbox, because we can't (?) select the DOM map element, unless using #ref="blah"?
      window.dispatchEvent(new Event('resize'));
    },

    toggleSparklingSwitch(e){
      var f = []
      for (var i = this.data.length - 1; i >= 0; i--) {
        if (this.data[i].properties.trails.includes("sparkling")){
          f.push(this.data[i].properties.id)
        }
      }
      //prepend the first two filter commands to array
      f.unshift("in", "id")

      this.sparklingSwitchVisible = true//!this.sparklingSwitchVisible
      this.circle.o = 0;
      if (this.sparklingTrail){
        this.map.setFilter('wineries', f)
        this.map.setFilter('triangles', f)
        this.map.setFilter('triangles-appointment', f)
      } else{
        this.map.setFilter('wineries', null);
        this.map.setFilter('triangles', null);  
        this.map.setFilter('triangles-appointment', null);  
      }
    },
    getRandomNum(){
      var r = Math.floor(Math.random()*(140-7+1)+7);
      this.randomNum = r
      return r
    },
    mapResized(){
      // console.log('resized')
    },


    mapClicked(map, e) {
      
      const features = map.queryRenderedFeatures(e.point, {
          layers: ['triangles', 'wineries', 'triangles-appointment']
      })      

      var self = this
      console.log(features)
      if (features[0]){
       map.flyTo({
        center: (features[0].geometry.coordinates|| [138.7454,-34.9191]),
        zoom: self.flytoZoom(self.map),
        // bearing: self.easeBearing(map),
      });
      this.randomNum = this.getRandomNum()
    }
  
    },

    easeBearing(map){
      if(map.getBearing() > 0){
        return -5
      } else {
        return 5
      }
    },

    flytoZoom(map){
      // var z =[-0.5, 0.5]
      return this.map.getZoom() + 0.5 // z[Math.floor(Math.random()*z.length)];

    },
    mapMouseMoved(map, e) {
      if(map.isSourceLoaded('winery-label')){
        const features = map.queryRenderedFeatures(e.point, {
            layers: ['wineries', 'triangles', 'triangles-appointment']
        });
        map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
      }
    },

    mapMoveStart(e, map){
      this.circle.o = 0;
      this.sparklingSwitchVisible = false
    },

    mapMoveEnd(e){
      this.circle.o = 1;
      var self = this;
      // setTimeout(function() {this.moveCircle(self.e)}, 500);
      // console.log(this.currentSelected)
      this.moveCircleActive = false;
      this.currentSelected = this.nearest
      // console.log(this.currentSelected)
      this.randomNum = this.getRandomNum()

      this.moveCircle(e)
      this.zoomCircle(e)
    },

    mapMoving(e){
        this.moveCircle(e)  
      if(this.moveCircleActive){
      }
      // console.log('moving')
      
    },
    mapLoaded(e){
      this.map = e
      this.mapReady = true
      var self = this
      // var r = []
      // console.log(this.data)     
    },

    dataLoading(e, map){
      // console.log(e, map)
    },

    loadData(){
      console.log('loading data...')
      // console.log(_.filter(this.data, (o) => o.properties.appointment == false))
      
      this.map.addSource('winery-label', {
          'type': 'geojson',
          'data': {
            'type': 'FeatureCollection',
            'features': this.data
          }
      })

      this.map.addSource('winery-label-triangle', {
          'type': 'geojson',
          'data': {
            'type': 'FeatureCollection',
            'features': _.filter(this.data, (o) => o.properties.appointment == false) // this.data
          }
      })

      this.map.addSource('winery-label-appointment', {
          'type': 'geojson',
          'data': {
            'type': 'FeatureCollection',
            'features': _.filter(this.data, (o) => o.properties.appointment == true)
          }
      })


      this.map.addLayer({
        "id": "triangles",
        "type": "symbol",
        "source": "winery-label-triangle",
        "filter": [
            "==",
            "$type",
            "Point"
        ],
        "layout": {
            "text-size": {
                "base": 1,
                "stops": [
                    [
                        8,
                        14
                    ],
                    [
                        14,
                        15
                    ]
                ]
            },
            "text-font": [
                "Knockout 29 Junior Liteweight"
            ],
            "visibility": "visible",
            "icon-size": {
                "base": 0.8,
                "stops": [
                    [
                        8,
                        0.1
                    ],
                    [
                        15,
                        1.1
                    ]
                ]
            },
            "text-offset": [
                0,
                -0.2
            ],
            "icon-image": "triangle-filled",
            "icon-allow-overlap": true
        },
        "paint": {
            "text-color": "hsl(0, 0%, 100%)",
            "icon-opacity": 0.8
        }
      })

      this.map.addLayer({
        "id": "triangles-appointment",
        "type": "symbol",
        "source": "winery-label-appointment",
        "filter": [
            "==",
            "$type",
            "Point"
        ],
        "layout": {
            "text-size": {
                "base": 1,
                "stops": [
                    [
                        8,
                        14
                    ],
                    [
                        14,
                        15
                    ]
                ]
            },
            "text-font": [
                "Knockout 29 Junior Liteweight"
            ],
            "visibility": "visible",
            "icon-size": {
                "base": 0.8,
                "stops": [
                    [
                        8,
                        0.1
                    ],
                    [
                        15,
                        1.1
                    ]
                ]
            },
            "text-offset": [
                0,
                -0.2
            ],
            "icon-image": "triangle-outline",
            "icon-allow-overlap": true
        },
        "paint": {
            "text-color": "hsl(39, 20%, 100%)",
            "icon-opacity": 1
        }
      })


      this.map.addLayer({
        "id": "wineries",
        "type": "symbol",
        "source": "winery-label",
        "filter": [
            "==",
            "$type",
            "Point"
        ],
        "layout": {
            "text-line-height": 1,
            "text-size": {
                "base": 1.3,
                "stops": [
                    [
                        4,
                        6
                    ],
                    [
                        14,
                        23
                    ]
                ]
            },
            "text-allow-overlap": true,
            "text-font": [
                "Roboto Medium",
                "Arial Unicode MS Regular"
            ],
            "text-justify": "left",
            "visibility": "visible",
            "text-offset": [
                1,
                0.1
            ],
            "text-anchor": "left",
            "text-field": "{label}",
            "text-max-width": 15
        },
        "paint": {
            "text-color": "#65132C"
        }
      })



      console.log('data loaded')
      this.zoomCircle(this.map)
      this.moveCircle(this.map)
      var elem = this.$refs.map.$el; // Element to fire on
      

      // var evt = new MouseEvent("click", {
      //   bubbles: true,
      //   cancelable: true,
      //   view: window
      // });
      // console.log(elem)
      // elem.querySelector("canvas").addEventListener('click', function(){
      //   console.log('clicekd!')
      // })

      // elem.dispatchEvent(evt);
      // elem.querySelector("canvas").click({X:0, clientY:0}); // Fire event
    },


    zoomCircle: function(e){
      if (this.map.getZoom() < 9){
        this.circle.r = 0  
      } else{
        this.circle.r = map_range(this.map.getZoom(), 15, 9, 50, 15 )  
      }
    },
    mapZooming(e){
      this.zoomCircle(e)
    },

    moveCircle: function(e){

      // var e = e ? e : this.map
      if(e.isSourceLoaded('winery-label')){
        // console.log('source is loaded')
        var features = e.queryRenderedFeatures({ layers: ['triangles', 'triangles-appointment']})
        // console.log(features.length)
        if(features.length > 0){
          this.circle.off = false
          var f = _.uniqBy(features, 'properties.id');
          var nearest = null
          var centerLat = e.getCenter().lat
          var centerLng = e.getCenter().lng
          var dist = 999999999999
          for (var i = f.length - 1; i >= 0; i--) {
              var newDist = geodist([centerLat, centerLng], [f[i].geometry.coordinates[1], f[i].geometry.coordinates[0]], {format: false, unit: 'meters'})
              
              if(!nearest){
                nearest = f[i]
              }
              if( newDist < dist){
                nearest = f[i]
                dist = newDist
              }
          }
          
          var nearest_screen_coordinates = e.project([nearest.geometry.coordinates[0], nearest.geometry.coordinates[1]])

        var nx = parseInt(nearest_screen_coordinates.x - this.circle.r*1.02)
        var ny = parseInt(nearest_screen_coordinates.y - this.circle.r*1.02)

        this.circle.x = nx
        this.circle.y = ny
        if(this.moveCircleActive){
          console.log('moving circle')
          this.circle.o = 1;  
        }

        if(nearest !== this.currentSelected){
          this.nearest = nearest
        }
        } else{
          // console.log("circle be gone")
          this.circle.o = 0;
          this.currentSelected = null
          this.circle.off = true
        }

        
      } else{
        this.circle.off = true
      }
    }
  }
}

</script>
<style lang="stylus">

body, html{
  margin: 0;
  height: 100%;
  overflow: hidden;
}

.noselect{
   user-select: none;
}

.app-container{
  background-color: #f1f1f1;
  display: flex;
  flex-direction: row-reverse;
  /*must have to stop jumping when clicking*/
  justify-content: flex-end; 
  /*dont align items center to avoid vertical jumping*/
  /*align-items: center;*/
  /*flex-wrap: wrap;*/
}

#app {
  font-family: 'Raleway', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.sheet{
  position: relative;
  float: left;
  display: inline;
  /*width: 80%;*/
  background-color: #c6cad2;
}

.mapboxgl-control-container{
  position: relative;
  left: -40px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.mapboxgl-control-container button{
  margin-bottom: 0 !important;
}



.circle{
  position: absolute;
  display: block;
  /*border: 2px dotted white;*/
  border-radius: 50%;
  background-color: rgba(255,255,255,0.6);
  mix-blend-mode: overlay;
  z-index: 0;
  /*transition: 1s ease-in-out;*/
  /*transition-property: transform;*/
  /*transition-delay: 300ms;*/
  transition: transform 0.1s ease-out, background-color 0.1s ease-out, opacity 0.2s ease-out, box-shadow 0.1s ease-out;
  left: 0;
  top: 0;

  box-shadow: 0px 0px 60px 0px rgba(0,0,0,0.3);

  /*box-sizing: content-box;*/
  /*mix-blend-mode: overlay;*/
  /*background-clip: border-box;*/
  pointer-events: none;

}

.mulitply.off, .circle.off{
  /*opacity: 0 !important;*/
  display: none;
}

.multiply{
  /*box-shadow: 0px 0px 20px 0px #000;*/
  /*opacity: 0 !important;*/
}

.circle.active{
  /*transition: opacity 1s ease-out;*/
  /*transition: opacity 0;*/
  /*transform: scale(2);*/

  opacity: 1;
  /*transition-delay: 400;*/
}

.inactive{
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.25) !important;
  transition: opacity 0;
  background-color: rgba(255,255,255,0.3);  

  /*transform-origin: unset !important;
  transform: scale(2) !important;*/
  /*opacity: 0.2;*/
  /*transition-delay: 300;*/
}

.mapboxgl-ctrl-bottom-right{
  right: 40px !important;
}


.multiply{
  mix-blend-mode: multiply;
  box-shadow: 0px 0px 16px 0px rgba(0,0,0,0.5);
  z-index: 0;
}

.big{
  mix-blend-mode: normal;
  box-shadow: 0px 0px 556px 300px rgba(0,0,0,0.2);
  overflow: hidden;
  z-index: 0;
}



.information{
  position: relative;
  z-index: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  align-content: space-between;
  padding-right: 5vw;
  padding-left: 5vw;
  background-color: #f1f1f1;

}


*::selection{
  color: rgba(0,0,0,0.8);
  background-color: rgba(0,0,0,0.1);

}

.winery-container{
display: block;
position: relative;
text-align: left;
padding: 1em 0;
border-top: dotted #5AAB6A 1px;
border-bottom: dotted #5AAB6A 1px;
/*background-color: red;*/
}

.winery-container > div{
  position: relative;
  display: block;
  float: left;
  width: 100%;
  margin: 0.3em 0;
}

.winery-container .label{
  font-weight: 700;
  user-select: none;
  cursor: default;
  padding-right: 0.4em;
  display: inline-block;


}

.winery-name{
  font-size: calc(10px + 1.5vw);
  /*font-family: 'Roboto';*/
  text-transform: uppercase;
  font-weight: 700;
  
}

.winery-region{
display: inline;
font-size: calc(10px + 0.6vw);
color: rgba(0,0,0,0.75);
padding-left: 0.5em;
text-transform: uppercase;
font-weight: 400;
}


.winery-desc{
  /*float: right;*/
  line-height: 1.35em;
}

.winery-where{
  
}

.winery-tel{
  width: auto !important;
  display: inline;
  padding-left: 0.6em;
  white-space: nowrap;
  /*float: right;*/
}

.winery-open{
  margin-top: 0 !important;
}

.winery-website{
  color: #61ad69 !important;
  display: inline-block;
  font-weight: 700;
  margin-top: 1em !important;
  text-decoration: none;
  color: unset;
  border-bottom: dotted transparent 1px;

}

.winery-website:hover{
  border-bottom: dotted #5AAB6A 1px;
}

.info-container{
  display: block;
  position: relative;

}


.images{
  display: block;
  width: 100%;
}

.winery-img{
  width: 100% !important;
  margin: 5vh 0;
  max-height: 33vh;
  height: 10vh;
}

.winery-img-bg{
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  margin: 5vh 0;
  height: 30vh;
  max-height: 25vh;

}

.controls{
  position: absolute !important;
  z-index: 1;
  left: -200px;
  top: 0;
  min-width: 290px;
  zoom: 0.8;  
  transition: all 345ms cubic-bezier(0.0, 0.0, 0.2, 1);
}

.controls.active {
  left: -17px !important;
  transition: all 230ms cubic-bezier(0.0, 0.0, 0.2, 1);
}

.switch {

  height: 10px;
  left: 0px;
  top: 7px;
  
}

.switch.active *{
  color: #cb5a4d !important;
}

.switch label{
  user-select: none;
}

.switch label:after{
  content:"local_bar";
  position: relative;
  font-family:'Material Icons';
  font-size: 1.6em;
  line-height: 18px;
  top: 7px;
  padding-left: 30px;
  /*color: rgba(0,0,0,0.56);*/
  /*text-overflow: visible;*/
}

.switch-label{
  /*float: right;*/
}

/*/////////////////*/

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-enter-active {
  
  /*mine*/
  /*transition: all 355ms cubic-bezier(.29,.09,.17,1);*/

  /*google*/
  transition: all 355ms cubic-bezier(0.0, 0.0, 0.2, 1);
  transition-delay: .3s;
}
.slide-leave-active {
  /*mine*/
  /*transition: all 235ms cubic-bezier(0.19, 1, 0.22, 1);*/
  /*google*/
  transition: all 235ms cubic-bezier(0.4, 0.0, 1, 1);
}
.slide-enter, .slide-leave-to
/* .slide-fade-leave-active for <2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}


</style>
