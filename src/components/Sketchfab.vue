<template>
<div class="wrapper">
	<iframe class="api-iframe" ref="api_iframe" @mousedown="mouseDown"
		frameborder="0"
	    scrolling="no"
	    marginheight="0"
	    marginwidth="0"
	    >
    </iframe>	
    
    <div class="debug">
      <!-- <p>sketchfab: <pre>{{sketchfab}}</pre></p> -->
      <!-- <p>mapbox: <pre>{{mapbox}}</pre></p> -->
      <input type="checkbox" name="fb" label="follow" v-model="followMapbox"></input>
      <label>zoom multi<input type="number" v-model="zoomMultiplier" step="0.001"></input></label>
      <label>pan multi<input type="number" v-model="panMultiplier" step="0.001"></input></label>
      <label>FOV<input type="number" v-model="FOV" step="1"></input></label>
      <label>offset X<input type="number" v-model="offsetX" step="0.001"></input></label>
      <label>offset Y<input type="number" v-model="offsetY" step="0.001"></input></label>

      <div v-if="mapboxOrigin"  v-html="'<strong>mapboxOrigin:</strong> '+String(parseInt(mapboxOrigin[0]))+' '+String(parseInt(mapboxOrigin[1]))"></div>
      <div v-if="sketchfabOrigin" v-html="'<strong>sketchfabOrigin:</strong> '+String(parseInt(sketchfabOrigin[0]))+' '+String(parseInt(sketchfabOrigin[1]))"></div>
      <div v-if="sketchfabCurrentPos" v-html="'<strong>sketchfabCurrent:</strong> '+String(sketchfabCurrentPos)"></div>
      <div v-if="mapboxCurrentPos" v-html="'<strong>mapboxCurrentPos:</strong> '+String(mapboxCurrentPos)"></div>
      <p>position/eye</p>
      <label>x<input type="number" v-model="cam.source.x" step="1"></input></label>
      <label>y<input type="number" v-model="cam.source.y" step="1"></input></label>
      <label>z<input type="number" v-model="cam.source.z" step="1"></input></label>
      <p>target</p>
      <label>x<input type="number" v-model="cam.target.x" step="1"></input></label>
      <label>y<input type="number" v-model="cam.target.y" step="1"></input></label>
      <label>z<input type="number" v-model="cam.target.z" step="1"></input></label>
    </div>
</div>
</template>

<script>
import Vuex from 'vuex'
var sketchfab = require('../sketchfab-viewer-1.1.0.js')

export default {

  name: 'sketchfab',
  props: ['urlid','autospin','autostart','preload','ui_controls','ui_infos','ui_related'],
  components: {},
  data () {
    return {
      camera: null,
      cam: {
        source: {
        x: -.95,
        y: 6.6,
        z: 124.8
      },
      target: {
        x: -1.05,
        y: -6.7,
        z: 1
      }
      },
      offsetX: 6.2,
      offsetY: 1.3,
      FOV: 20,
    	_api: null,
    	_client: null,
      panMultiplier: 0.064,
      zoomMultiplier: 17.3,
      mapboxOrigin: null,
      sketchfabOrigin: null,
      sketchfabCurrentPos: null,
      sketchfabNativePos: null,
      mapboxCurrentPos: null,
      followMapbox: true,
      sk:null,
      skOrigin: null,
    }
  },
  mounted(){
  	var self = this
  	var client = new sketchfab.Sketchfab( this.$refs.api_iframe )


  	client.init( this.urlid, {
  	   success: function onSuccess( api ){	
  	   	self._api = api
           self._api.load()
  	       self._api.start()
  	       self._api.addEventListener( 'viewerready', function() {
  	           console.log( 'Viewer is ready' )
               // self.getSketchfabCamera()
               // self.getMapboxOrigin()
  	       } )
  	   },
  	   error: function onError() {
  	       console.log( 'Viewer error' )
  	   },
  	   autospin: self.autospin,
  	   autostart: self.autostart,
  	   preload: self.preload,
  	   ui_controls: self.ui_controls,
  	   ui_infos: self.ui_infos,
  	   ui_related: self.ui_related,
  	   transparent: '1',
  	   camera: '0',
  	   scrollwheel: '0',
  	} )

    

  },
  computed:{
	...Vuex.mapGetters(['_map', 'sketchfab', '_mapCenter']),

  },
  watch:{

    cam: {
      handler: function(val){
      var lookat = [[
          val.source.x,
          val.source.y,
          val.source.z
          ],[
          val.target.x,
          val.target.y,
          val.target.z
          ]]
        // console.log('setting camera')
        this._api.setCameraLookAt(lookat[0], lookat[1], 0.01)        
      },
    deep:true
    },

    FOV: function(val){
      this._api.setFov(val)
    },
  	_mapCenter: function(val){
      var self = this
      var projected = this._map.project(val)
      this.camera = {position: Object.values(this.cam.position), target: Object.values(this.cam.target)}
      var val = {position: [projected.x, projected.y], target: this.cam.target }
      console.log(this.camera, val)

      
      if(!this.mapboxOrigin){
        this.getMapboxOrigin()
      }
      this.getSketchfabCamera()
      this.getSketchfabCameraNative()
      
      this._api.getCameraLookAt( function( err, camera ){
        self.sk = self.camera
      })
      console.log(this.camera.position)
      if(!self.sketchfabOrigin){
        // console.log(this.camera.position.map(e=>{return e}))
        self.skOrigin = [this.camera.position.map(e=>{return parseInt(e)}), this.camera.target.map(e=>{return parseInt(e)})]
      }

      this.setSketchfab({
        cameraOrigin: this.skOrigin,
        camera: this.sk
      })
      
      this.mapboxCurrentPos = [parseInt(val.position.x)-(window.innerWidth/2), parseInt(val.position.y)-(window.innerHeight/2)]

      if(this.sketchfabNativePos){
        var lookat = [[
            (self.mapboxCurrentPos[0]*-self.panMultiplier)-this.offsetX,
            (self.mapboxCurrentPos[1]*self.panMultiplier-2)-this.offsetY,
            // self.sketchfabNativePos.position[2]
            self._map.getZoom() * self.zoomMultiplier
            ],[
            (self.mapboxCurrentPos[0]*-self.panMultiplier)-this.offsetX,
            (self.mapboxCurrentPos[1]*self.panMultiplier)-this.offsetY,
            self.sketchfabNativePos.target[2]
            ]]
          // console.log(lookat)
        if(this.followMapbox){
          // console.log(self.sketchfabNativePos)
          // console.log(lookat)
          this._api.setCameraLookAt(lookat[0], lookat[1], 0)      
        }
      }
  	 
     console.log(this._map.getZoom())

     }
    
  },
  methods:{
	...Vuex.mapMutations(['setSketchfab']), 
	...Vuex.mapActions([]), 

  dragging(e){
    console.log(e)
  },

  getSketchfabCamera(){
    var self = this
    var cp = this._api.getCameraLookAt( function( err, camera ){
        self.sketchfabCurrentPos = [this.camera.position.map(e=>{return parseInt(e)}), camera.target.map(e=>{return parseInt(e)})]

        if(!self.sketchfabOrigin){
          self.sketchfabOrigin = [this.camera.position.map(e=>{return parseInt(e)}), camera.target.map(e=>{return parseInt(e)})]
        }
    } )
  },

  getSketchfabCameraNative(){
    var self = this
    this._api.getCameraLookAt( function( err, camera ){
      // console.log(camera)
      self.sketchfabNativePos = camera
        // return camera
    } )

  },

  getMapboxOrigin(){  
      console.log('have camera?', this.camera)  
      this.mapboxOrigin = [parseInt(this.camera.position.x)-(window.innerWidth/2),parseInt(this.camera.position.y)-(window.innerHeight/2)]
  },

	mouseDown: function(val){
		console.log('down', val)
	}

  },
}
</script>

<style lang="css" scoped>
.api-iframe{
	width: 100vw;
	height: 100vh;
	/*pointer-events: none;  */
	/*height: 100vh;*/
}
.wrapper{
	display:flex;
	justify-content: center;
	align-items: center;
	position: relative;
	z-index: 1;
	height: 100vh;
  /*background-color: rgba(245,215,195,0.6);*/
	pointer-events: none;
}

.debug{
  pointer-events: all;
  display: flex;
  flex-direction: column;
  width: 30vw;
  height: 100vh;
  background-color: rgba(255,255,255,0.8);
  position: absolute;
  right: 0px;
  top: 30px;
  /*z-index: 1 !important;*/
  /*position: relative;*/

}
</style>