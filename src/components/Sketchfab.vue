<template>
<div class="wrapper" :style="{'pointer-events':sketchfabMode?'all':'none'} ">
	<iframe v-show="sketchfabLoaded" class="api-iframe" ref="api_iframe"
		frameborder="0"
	    :scrolling="scrolling"
	    marginheight="0"
	    marginwidth="0"
	    >
    </iframe>	
</div>
</template>

<script>
import Vuex from 'vuex'
var sketchfab = require('../sketchfab-viewer-1.2.1.js')
// import {mat4} from 'gl-matrix'

export default {

  name: 'sketchfab',
  props: ['urlid', 'autospin','autostart','preload','ui_controls','ui_infos','ui_related', 'scrolling'],
  components: {},
  data () {
    return {
      client: null,
    	_api: null
    }
  },
  mounted(){
    // init viewer for the first time.
    // console.log('initating viewer with ID: ', this.urlid)
    this.initViewer(this.urlid)

  },
  computed:{
	...Vuex.mapGetters(['sketchfab', 'sketchfabLoaded', 'sketchfabMode', 'getExaggeration']),


  },
  watch:{
    // getExaggeration: function(val){
    //   var self = this
    //   this._api.getMatrix( 406, function( err, matrices ) {
    //         if(!err){
    //           var scaledMatrix = mat4.create();
    //           mat4.fromScaling(scaledMatrix, [1,1,Math.max(0.1,val*0.02)]);
    //           self._api.setMatrix( 406, scaledMatrix );
    //         }
    //   })
    // },


  },
  methods:{
	...Vuex.mapMutations(['setSketchfab', 'setSketchfabLoaded']), 
	...Vuex.mapActions([]), 

  initViewer(id){
      var self = this
      // console.log(this.$refs.api_iframe)
      this.client = new sketchfab.Sketchfab( this.$refs.api_iframe )
      this.client.init( id, {
         success: function onSuccess( api ){  
          self._api = api
             self._api.start()
             // api.getMatrix( 407, function( err, matrices ) {
             //       if(!err){console.log(matrices)}
             // });

             self._api.addEventListener( 'viewerready', function() {
                 self.readyHandler()
             } )
         },
         error: function onError() {
             console.log( 'Viewer error' )
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

  

  readyHandler(){
    var self = this
    this.setSketchfabLoaded(true)
    // console.log('readyHandler')
  }
}
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