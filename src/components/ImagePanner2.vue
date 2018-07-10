<template>
<div class="wrapper">
	<div ref="cont">
		<pre>
			MIN_SCALE: {{MIN_SCALE}}
			MAX_SCALE: {{MAX_SCALE}}
			imgWidth: {{imgWidth}}
			imgHeight: {{imgHeight}}
			curWidth: {{curWidth}}
			curHeight: {{curHeight}}
			viewportWidth: {{viewportWidth}}
			viewportHeight: {{viewportHeight}}
			scale: {{scale}}
			lastScale: {{lastScale}}
			container: {{container}}
			img: {{img}}
			x: {{x}}
			lastX: {{lastX}}
			y: {{y}}
			lastY: {{lastY}}
			pinchCenter: {{pinchCenter}}
		</pre>
		<v-touch class="element" ref="element"
		@pinch="pinchHandler"
		@pinchend="pinchendHandler"
		@doubletap="doubletapHandler"
		@pan="panHandler"
		@panend="panendHandler"

		v-bind:enabled="{ pinch: true, doubletap: true, pan: true}"

		v-bind:pan-options="{ direction: 'all' }"
		
		:style="style"
			>

			<!-- <img src="../assets/static_map_1920.jpg" class="image" :style="transforms" ref="element" /> -->

		</v-touch>
<!-- 		<div class="start" :style="{'left' : offsetX+'px', 'top': offsetY+'px'}"></div>
		<div class="end" :style="{'left' : panOffsetX+'px', 'top': panOffsetY+'px'}"></div>
		<div class="start" :style="{'left' : pinchCentreX+'px', 'top': pinchCentreY+'px'}"></div> -->
	</div>
</div>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'
var VueTouch = require('vue-touch')
Vue.use(VueTouch, {name: 'v-touch'})

export default {

  name: 'ImagePanner',
  props: [''],
  components: {},
  data () {
    return {
    	container: null,
    	element: null,
    	MIN_SCALE: 1,
    	MAX_SCALE: 64,
    	imgWidth: null,
    	imgHeight: null,
    	curWidth: null,
    	curHeight: null,
    	viewportWidth: null,
    	viewportHeight: null,
    	scale: null,
    	lastScale: null,
    	img: null,
    	x: 0,
    	lastX: 0,
    	y: 0,
    	lastY: 0,
    	pinchCenter: null,
		style: {
			marginLeft:null,
			marginTop:null,
			width: null,
			height: null
		}
    }
  },
  created(){

  },
  mounted(){
	// this.disableImgEventHandlers();
  	// this.img = this.$refs.element.$el;
	// this.container = this.$refs.container.$el
	this.imgWidth = this.$refs.element.$el.clientWidth;
	this.imgHeight = this.$refs.element.$el.clientHeight;
	this.viewportWidth = this.$vuetify.breakpoint.width;
	this.viewportHeight = this.$vuetify.breakpoint.height
	this.scale = this.viewportWidth/this.imgWidth;
	this.lastScale = this.scale;
	this.curWidth = this.imgWidth*this.scale;
	this.curHeight = this.imgHeight*this.scale;
	
	console.log(
		// this.img,
		// this.container,
		this.imgWidth,
		this.imgHeight,
		this.viewportWidth,
		this.scale,
		this.lastScale,
		this.viewportHeight,
		this.curWidth,
		this.curHeight
	)

  },
  computed:{
	...Vuex.mapGetters([]),

  },
  watch:{


  },
  methods:{
	...Vuex.mapMutations([]),
	...Vuex.mapActions([]),

	onTap(){
		console.log('tap')
	},
	absolutePosition() {
	    var x = 0,
	      y = 0;
	    // while (this.$ref.cont.$el !== null) {
	      x += this.$refs.cont.$el.offsetLeft;
	      y += this.$refs.cont.$el.offsetTop;
	      this.$refs.cont.$el = this.$refs.cont.$el.offsetParent;
	    // }
	    return { x: x, y: y };
	  },
	restrictScale(scale) {
        if (scale < this.MIN_SCALE) {
          scale = this.MIN_SCALE;
        } else if (scale > this.MAX_SCALE) {
          scale = this.MAX_SCALE;
        }
        return scale;
      },
    restrictRawPos(pos, viewportDim, imgDim) {
	    if (pos < viewportDim/this.scale - imgDim) { // too far left/up?
	      pos = viewportDim/this.scale - imgDim;
	    } else if (pos > 0) { // too far right/down?
	      pos = 0;
	    }
	    return pos;
	  },
	updateLastPos(deltaX, deltaY) {
		this.lastX = this.x;
		this.lastY = this.y;
	},
	translate(deltaX, deltaY) {
       var newX = this.restrictRawPos(this.lastX + deltaX/this.scale,
                                 Math.min(this.viewportWidth, this.curWidth), this.imgWidth);
       this.x = newX;
       this.style.marginLeft = Math.ceil(newX*this.scale) + 'px';
       var newY = this.restrictRawPos(this.lastY + this.deltaY/this.scale,
                                 Math.min(this.viewportHeight, this.curHeight), this.imgHeight);
       this.y = newY;
       this.style.marginTop = Math.ceil(newY*this.scale) + 'px';
     },
    zoom(scaleBy) {
        this.scale = this.restrictScale(this.lastScale*scaleBy);
        this.curWidth = this.imgWidth*this.scale;
        this.curHeight = this.imgHeight*this.scale;
        this.style.width = Math.ceil(this.curWidth) + 'px';
        this.style.height = Math.ceil(this.curHeight) + 'px';
        // Adjust margins to make sure that we aren't out of bounds
        this.translate(0, 0);
      },
    rawCenter(e) {
       var pos = this.absolutePosition()
       // We need to account for the scroll position
       var scrollLeft = window.pageXOffset ? window.pageXOffset : document.body.scrollLeft;
       var scrollTop = window.pageYOffset ? window.pageYOffset : document.body.scrollTop;
       var zoomX = -this.x + (e.center.x - pos.x + scrollLeft)/this.scale;
       var zoomY = -this.y + (e.center.y - pos.y + scrollTop)/this.scale;
       return { x: zoomX, y: zoomY };
     },
    updateLastScale() {
            this.lastScale = this.scale;
       },
    zoomAround(scaleBy, rawZoomX, rawZoomY, doNotUpdateLast) {
           // Zoom
           this.zoom(scaleBy);
           // New raw center of viewport
           var rawCenterX = -this.x + Math.min(this.viewportWidth, this.curWidth)/2/this.scale;
           var rawCenterY = -this.y + Math.min(this.viewportHeight, this.curHeight)/2/this.scale;
           // Delta
           var deltaX = (rawCenterX - rawZoomX)*this.scale;
           var deltaY = (rawCenterY - rawZoomY)*this.scale;
           // Translate back to zoom center
           this.translate(deltaX, deltaY);
           if (!doNotUpdateLast) {
             this.updateLastScale();
             this.updateLastPos();
           }
    },
    zoomCenter(scaleBy) {
          // Center of viewport
          var zoomX = -this.x + Math.min(this.viewportWidth, this.curWidth)/2/this.scale;
          var zoomY = -this.y + Math.min(this.viewportHeight, this.curHeight)/2/this.scale;
          this.zoomAround(scaleBy, zoomX, zoomY);
    },
    zoomIn() {
      	this.zoomCenter(2);
    },
    zoomOut() {
    	this.zoomCenter(1/2);
	},
	pinchHandler(e){
		if (this.pinchCenter === null) {
		this.pinchCenter = this.rawCenter(e);
		var offsetX = this.pinchCenter.x*this.scale - (-this.x*this.scale + Math.min(this.viewportWidth, this.curWidth)/2);
		var offsetY = this.pinchCenter.y*this.scale - (-this.y*this.scale + Math.min(this.viewportHeight, this.curHeight)/2);
		this.pinchCenterOffset = { x: offsetX, y: offsetY };
		}
		var newScale = this.restrictScale(this.scale*e.scale);
		var zoomX = this.pinchCenter.x*newScale - this.pinchCenterOffset.x;
		var zoomY = this.pinchCenter.y*newScale - this.pinchCenterOffset.y;
		var zoomCenter = { x: zoomX/newScale, y: zoomY/newScale };
		this.zoomAround(e.scale, zoomCenter.x, zoomCenter.y, true);
	},

	pinchendHandler: function(e){
		  this.updateLastScale()
          this.updateLastPos()
          this.pinchCenter = null
		
	},
	doubletapHandler(e){
		var c = this.rawCenter(e);
		this.zoomAround(2, c.x, c.y);
	},

	panHandler(e){
		 this.translate(e.deltaX, e.deltaY);
	},

	panendHandler(e){
		this.updateLastPos();
	}

  },
}
</script>

<style lang="stylus" scoped>
@import '../stylus/main'

.wrapper{
	position: absolute;
	left: 0;
	top: 0;
	// z-index: 99;
	width: 100vw;
	height: 100vh;
	background-color: white;
}

.image{
	width: 1920px;
	height: 1115px;
}

.element{
	position: absolute;
	width: 200px;
	height: 200px;
	left: 0px;
	top: 0px;
	background-color: red;
	mix-blend-mode: multiply;
}

.start{
	position: absolute;
	width: 10px;
	height: 10px;
	background-color: blue;
	border-radius: 50%;
	z-index: 2;
}
.end{
	position: absolute;
	width: 10px;
	height: 10px;
	background-color: green;
	border-radius: 50%;
	z-index: 3;
}
</style>