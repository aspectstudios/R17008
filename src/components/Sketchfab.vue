<template>
<div class="wrapper" :style="{'pointer-events':sketchfabMode?'all':'none'} ">
	<iframe v-show="sketchfabLoaded" class="api-iframe" ref="api_iframe"
		frameborder="0"
	    :scrolling="scrolling"
	    marginheight="0"
	    marginwidth="0"
	    >
    </iframe>	
    <!-- <div class="debug">
      <label>FOV<input type="number" v-model="FOV" step="1"></input></label>
      <label>pos X<input type="number" v-model="sketchfabNativePos.camera.position.x" step="1"></input></label>
      <label>pos Y<input type="number" v-model="sketchfabNativePos.camera.position.y" step="1"></input></label>
      <label>pos Z<input type="number" v-model="sketchfabNativePos.camera.position.z" step="1"></input></label>

      <label>target X<input type="number" v-model="sketchfabNativePos.camera.target.x" step="1"></input></label>
      <label>target Y<input type="number" v-model="sketchfabNativePos.camera.target.y" step="1"></input></label>
      <label>target Z<input type="number" v-model="sketchfabNativePos.camera.target.z" step="1"></input></label>
      <button name="readCamera" @click="readCamera()">read cam</button>
      <div>sketchfab camera: </div> <pre>{{sketchfabNativePos}}</pre>
    </div> -->

</div>
</template>

<script>
import Vuex from 'vuex'
var sketchfab = require('../sketchfab-viewer-1.2.1.js')

import {mat4} from 'gl-matrix'

export default {

  name: 'sketchfab',
  props: ['urlid', 'autospin','autostart','preload','ui_controls','ui_infos','ui_related', 'scrolling'],
  components: {},
  data () {
    return {
      client: null,
      loadInterval: null,
      sketchfabconsole: null,
      camera: null,
      FOV: 36,
    	_api: null,
    	_client: null,
      sketchfabNativePos: {
        camera: {
          position: {x: null, y: null, z: null},
          target: {x: null, y: null, z: null},
      },
    }
    }
  },
  beforeDestroy(){
    // this.toggleLaunch3D()
  },
  mounted(){

    // init viewer for the first time.
    console.log('initating viewer with ID: ', this.urlid)
    this.initViewer(this.urlid)


  },
  computed:{
	...Vuex.mapGetters(['_map', 'sketchfab', '_mapCenter', 'sketchfabLoaded', '_mapOrigin', 'mapbox', 'currentGridRef', 'sketchfabMode', 'gridExtruded', 'qualityTexture', 'getExaggeration']),


  },
  watch:{
    //watch when the urlid changes.
    // urlid: function(val){
    //   // this.client = null
    //   this.initViewer(val)
    // },
    
    // sketchfabNativePos: {
    //   handler: function(val){
    //     console.log('camera change')
    //     var self = this;

    //     this._api.lookat(
    //       [self.sketchfabNativePos.camera.position.x, 
    //       self.sketchfabNativePos.camera.position.y,
    //       self.sketchfabNativePos.camera.position.z],

    //       [self.sketchfabNativePos.camera.target.x, 
    //       self.sketchfabNativePos.camera.target.y, 
    //       self.sketchfabNativePos.camera.target.z])
        
    //   },
    // deep:true
    // },

    getExaggeration: function(val){
      var self = this
      this._api.getMatrix( 406, function( err, matrices ) {
            if(!err){
              var scaledMatrix = mat4.create();
              console.log('matrices', matrices)
              // var scale = Number(leftValue);
              mat4.fromScaling(scaledMatrix, [1,Math.max(0.1,val*0.02), 1]);
              self._api.setMatrix( 406, scaledMatrix );
            }
      });

    },

    qualityTexture: function(newVal, oldVal){
      if(newVal != oldVal){
          this.changeQuality(newVal)
      } 
    },

    camera: {
      handler: function(val){
          var self = this;
          self.sketchfabNativePos.camera.position.x = val.position[0] 
          self.sketchfabNativePos.camera.position.y = val.position[1]
          self.sketchfabNativePos.camera.position.z = val.position[2]
          self.sketchfabNativePos.camera.target.x = val.target[0]  
          self.sketchfabNativePos.camera.target.y = val.target[1]  
          self.sketchfabNativePos.camera.target.z = val.target[2]
        },
    deep:true
    },


    FOV: function(val){
      this._api.setFov(val)
      // this._map.transform.fov = val
    },
    
  },
  methods:{
	...Vuex.mapMutations(['setSketchfab', 'setSketchfabLoaded']), 
	...Vuex.mapActions([]), 

  initViewer(id){
      var self = this
      this.client = new sketchfab.Sketchfab( this.$refs.api_iframe )
      this.client.init( id, {
         success: function onSuccess( api ){  
          self._api = api
             // self._api.load()
             api.setTextureQuality( self.qualityTexture)
             self._api.start()

             // api.getMatrix( 407, function( err, matrices ) {
             //       if(!err){console.log(matrices)}
             // });

             self._api.addEventListener( 'viewerready', function() {
                 // console.log( 'Viewer is ready' )
                 // self.getMapboxOrigin()
                 // self.getSketchfabCamera()
                 self.readyHandler()

             } )
         },
         error: function onError() {
             // console.log( 'Viewer error' )
         },
         autospin: 0.1,
         autostart: self.autostart,
         preload: self.preload,
         ui_controls: self.ui_controls,
         ui_infos: self.ui_infos,
         ui_related: self.ui_related,
         transparent: '0',
         camera: '0',
         // autospin:0.01,
         scrollwheel: '1',
         ui_hint: 0,
         ui_inspector: 0,
         ui_vr: 0,

      } )
  },

  remap(num, in_min, in_max, out_min, out_max) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  },

  changeQuality(q){
    var self = this
        this._api.setTextureQuality( self.q, function(){
          console.log('Texture quality set to ' + self.q);
      })
  },

  readyHandler(){
    var self = this
    
    // this._api.getMatrix(408, function(err, matrices){
    //     if(!err){console.log(matrices)}
    // })

    // this._api.getNodeMap( function ( err, nodes ) {
    //   if ( !err ) {
    //       var index;
    //       console.log('nodemap: ', nodes)
    //       for (var key in Object.keys(nodes)){
    //           index = Object.keys(nodes)[key];
    //           if ((nodes[index].type == "MatrixTransform")&&(typeof nodes[index].name !== "undefined")){
    //               matrixTransformName = nodes[index].name;
    //               geometries[matrixTransformName] = {id: index};

    //           }
    //       }
    //   }
    // }),



    // this._api.hide(408) 
    // this._api.hide(436)

    

    this._api.getCameraLookAt( function( err, camera ){
      // camera.position[0] =this.remap(this.$vuetify.breakpoint.width, 300, 1920, 79306, 31765)
      // camera.position[1] =this.remap(this.$vuetify.breakpoint.width, 300, 1920, -541748, -247959)
      // camera.position[2] =this.remap(this.$vuetify.breakpoint.width, 300, 1920, 328844, 119595)

      // camera.target[0] =this.remap(this.$vuetify.breakpoint.width, 300, 1920, 72432, 30986)
      // camera.target[1] =this.remap(this.$vuetify.breakpoint.width, 300, 1920, -37468, -33688)
      // camera.target[2] =this.remap(this.$vuetify.breakpoint.width, 300, 1920, 13404, 21577)

      camera.position[0] = 16336
      camera.position[1] = -5366
      camera.position[2] = 238583
      camera.target[0] = 16368
      camera.target[1] = -2261
      camera.target[2] = 40901

      self._api.lookat(camera.position,camera.target, 0)
      self.camera = camera
    })

    this._api.getMaterialList( function( err, materials ) {
      var terrain = materials.find(e => e.name == String(self.currentGridRef.properties.index)+'terrain')
      var wall = materials.find(e => e.name == String(self.currentGridRef.properties.index)+'wall')
        // console.log('terrain', terrain);
        // console.log('wall', wall);
      terrain.channels.AlbedoPBR.enable = true
      terrain.channels.DiffusePBR.enable = false
      terrain.channels.Displacement.enable = false
      terrain.channels.EmitColor.enable = false
      terrain.channels.GlossinessPBR.factor = 0.862337655732126
      terrain.channels.GlossinessPBR.texture = {
        internalFormat: "LUMINANCE",
        magFilter: "LINEAR",
        minFilter: "LINEAR_MIPMAP_LINEAR",
        texCoordUnit: 0,
        textureTarget: "TEXTURE_2D",
        uid: terrain.channels.SpecularColor.texture.uid,
        wrapS: "REPEAT",
        wrapT: "REPEAT"
      }

      terrain.channels.MetalnessPBR.enable = true
      terrain.channels.MetalnessPBR.factor = 1
      terrain.channels.MetalnessPBR.texture = {
         internalFormat: "LUMINANCE",
         magFilter: "LINEAR",
         minFilter: "LINEAR_MIPMAP_LINEAR",
         texCoordUnit: 0,
         textureTarget: "TEXTURE_2D",
         uid: terrain.channels.SpecularColor.texture.uid,
         wrapS: "REPEAT",
         wrapT: "REPEAT"
      }

      terrain.channels.Opacity.enable = false
      terrain.channels.SpecularColor.factor = 0.25
      terrain.channels.SpecularF0.enable = true
      terrain.channels.SpecularPBR.enable = false

      wall.channels.AlbedoPBR.enable = true
      wall.channels.DiffusePBR.enable = false
      wall.channels.Displacement.enable = false
      wall.channels.GlossinessPBR.factor = 0.2017
      wall.channels.MetalnessPBR.enable = true
      wall.channels.MetalnessPBR.factor = 0.05
      wall.channels.Opacity.enable = true
      wall.channels.Opacity.enable = true
      wall.channels.Opacity.factor = 0

      wall.channels.SpecularF0.enable = true
      wall.channels.SpecularF0.factor = 0.77142
      terrain.channels.SpecularPBR.enable = false

        self.updateMaterial(terrain)
        self.updateMaterial(wall)
    } );



    this._api.getPostProcessing(function(settings) {
        console.log(settings)
        settings.colorBalanceEnable = true
        settings.colorBalanceHigh =  [
                        -0.08888891008165145,
                        -0.055555576748318125,
                        0.0777777778
                    ]
        settings.colorBalanceLow = [0,0,-0.006]
        settings.colorBalanceMid = [0.1111110899183485,0.09999997880723743,-2.1192762544863797e-8]
        settings.grainEnable = true
        settings.grainFactor = 0.15
        settings.sharpenEnable = true
        settings.shapenFactor = 0.15802467252001406
        settings.toneMappingEnable = true
        settings.toneMappingBrightness = -0.0222222434149848
        settings.toneMappingContrast =  -5.419253939640231e-9
        settings.toneMappingExposure = 0.7888888676961263
        settings.saturation = 0.9666666667

        self._api.setPostProcessing(settings, function(){
          console.log('post processing updated!')
        })
    } );


    this.setSketchfabLoaded(true)

  },

  readCamera(){
    var self = this
    this._api.getCameraLookAt( function( err, camera ){
        self.camera = camera
    })    
  },

  updateMaterial(materialToUpdate){
    var self = this;
    // var materialToUpdate
    this._api.setMaterial( materialToUpdate, function() {
        console.log( 'Material updated' );
    });

  }

  },
}
</script>

<style lang="stylus" scoped>
@import '../stylus/main'

.api-iframe{
	width: 100vw;
	height: 100vh;
  left: 0;
  top: 0;
  position: absolute;
	// pointer-events: none;  
}
.wrapper{
	display:flex;
	justify-content: center;
	align-items: center;
	/*position: relative;*/
	height: 100vh;
  z-index: 3;
  left: 0;
  top: 0;
  position: absolute;
  /*background-color: rgba(245,215,195,0.6);*/
	/*pointer-events: none;*/
}
.debug{
  font-size: 10px;
  pointer-events: all;
  // display: flex;
  display:none;
  flex-direction: column;
  width: 30vw;
  height: 100vh;
  background-color: rgba(85, 51, 85, 0.2);
  position: absolute;
  right: 0px;
  top: 30px;
  color: white;
}
</style>