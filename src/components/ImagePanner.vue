<template>
<div class="wrapper">
	<div ref="container">
		<pre>
			maxScale: {{maxScale}}
			screenWidth: {{screenWidth}}
			screenHeight: {{screenHeight}}
			containerWidth: {{containerWidth}}
			containerHeight: {{containerHeight}}
			elementHeight: {{elementHeight}}
			elementWidth: {{elementWidth}}
			currentScale: {{currentScale}}
			offsetX: {{offsetX}}
			offsetY: {{offsetY}}
			panOffsetX: {{panOffsetX}}
			panOffsetY: {{panOffsetY}}
			pinchCentreX: {{pinchCentreX}}
			pinchCentreY: {{pinchCentreY}}
		</pre>
		<v-touch class="element" ref="element"
			@panstart="panstartHandler"
			@panmove="panmoveHandler"
			@panend="panendHandler"
			
			@tap="onTap"

			@pinch="pinchHandler"
			@pinchstart="pinchstartHandler"
			@pinchend="pinchendHandler"


			v-bind:enabled="{ pinch: true, tap: true, pan: true}"

			v-bind:pan-options="{ direction: 'all' }"
			
			:style="transforms"
			>

			<!-- <img src="../assets/static_map_1920.jpg" class="image" :style="transforms" ref="element" /> -->

		</v-touch>
		<div class="start" :style="{'left' : offsetX+'px', 'top': offsetY+'px'}"></div>
		<div class="end" :style="{'left' : panOffsetX+'px', 'top': panOffsetY+'px'}"></div>
		<div class="start" :style="{'left' : pinchCentreX+'px', 'top': pinchCentreY+'px'}"></div>
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
    	maxScale: 5,
    	screenWidth: this.$vuetify.breakpoint.width,
    	screenHeight: this.$vuetify.breakpoint.height,
    	containerWidth: 500,
    	containerHeight: 500,
    	elementHeight: null,
    	elementWidth: null,
		currentScale: 1,
		offsetX: 0,
		offsetY: 0,
		panOffsetX: 0,
		panOffsetY: 0,
		pinchCentreX: 0,
		pinchCentreY: 0,
		transforms: {}
    }
  },
  created(){

  },
  mounted(){
  	console.log(this.$refs.element)
  	this.elementHeight = this.$refs.element.$el.clientHeight
  	this.elementWidth = this.$refs.element.$el.clientWidth
  	
  	// this.containerHeight = this.$refs.container.$el.clientHeight
  	// this.containerWidth = this.$refs.container.$el.clientWidth

  	console.log(this.elementHeight,this.elementWidth,this.containerHeight,this.containerWidth)
  },
  computed:{
	...Vuex.mapGetters([]),

  },
  watch:{

  	transforms: function(val){
  		console.log(JSON.stringify(val))
  	}

  },
  methods:{
	...Vuex.mapMutations([]),
	...Vuex.mapActions([]),

	onTap(){
		console.log('tap')
	},
	pinchstartHandler(e){
		// record starting offset at beginning of pinch operation
		    // this.panOffsetX = this.offsetX;
		    // this.panOffsetY = this.offsetY;  
		    // record the original centre point of the pinch, relative to the element
		    // e.center seems to return values relative to screen, so use screen dimensions.                
		    this.pinchCentreX = Math.round((e.center.x  ) / this.currentScale);
		    this.pinchCentreY = Math.round((e.center.y ) / this.currentScale);

		    // console.log('e.center.x ', e.center.x, 'panOffsetX ', this.panOffsetX, 'screenWidth ', this.screenWidth, 'currentScale', this.currentScale)
	},

	pinchHandler(e){
		// don't allow scales less than 1, or greater than maxScale
		// e.scale is relative to the start of the current pinch operation, not the last event

		var self = this
		let scale = Math.min(this.maxScale, Math.max(1, this.currentScale * e.scale));
		
		this.offsetX = this.panOffsetX + Math.round((this.pinchCentreX * (1 - e.scale)));
		this.offsetY = this.panOffsetY + Math.round((this.pinchCentreY * (1 - e.scale))); 

		console.log('offsetY', this.offsetX, 'offsetY', this.offsetY, 'e.scale ', e.scale )

		// allow for dragging (i.e. panning) while pinching
		this.offsetX += e.deltaX;
		this.offsetY += e.deltaY;

		// constrain edges
		let overlapX = Math.max(0, Math.round(((this.elementWidth * scale) - this.containerWidth) / 2));
		let overlapY = Math.max(0, Math.round(((this.elementHeight * scale) - this.containerHeight) / 2));
		// this.offsetX = Math.max(-overlapX, Math.min(overlapX, this.offsetX));
		// this.offsetY = Math.max(-overlapY, Math.min(overlapY, this.offsetY));              
		
		// console.log('scale', scale, 'offsetX', this.offsetX, 'overlapX', overlapX)
		// order of transforms is important
		this.transforms = {
		    transform: 'translate(' + this.offsetX + 'px,' + this.offsetY + 'px) scale(' + scale + ')', 'transform-origin': this.pinchCentreX+'px '+this.pinchCentreY+'px'
		};
		// this.$refs.element.style.transform = transforms.join(' ');
	},

	pinchendHandler: function(e){
		// update current scale ready for next pinch or pan operation
		this.currentScale = Math.min(this.maxScale, Math.max(1, this.currentScale * e.scale));
		
	},
	panstartHandler(e){
		// console.log(e)
		this.panOffsetX = this.offsetX;
		this.panOffsetY = this.offsetY;

	},

	panmoveHandler(e){
		var overlapX = Math.max(0, Math.round(Math.abs(((this.elementWidth * this.currentScale) - this.containerWidth))));
		var overlapY = Math.max(0, Math.round(Math.abs(((this.elementHeight * this.currentScale) - this.containerHeight))));

		this.panOffsetX = Math.max(-overlapX, Math.min(overlapX, this.offsetX + e.deltaX));
		this.panOffsetY = Math.max(-overlapY, Math.min(overlapY, this.offsetY + e.deltaY));

		// order of transforms is important    
		this.transforms = {
		    transform: 'translate(' + this.panOffsetX + 'px,' + this.panOffsetY + 'px) scale(' + this.currentScale + ')'
		};

		// this.$refs.element.style.transform = transforms.join(' ');
	},

	panendHandler(e){
		// Record final position here to take account of constraint calculations in 
		// panmove handler; magnitude of e.deltaX may have been limited.
		this.offsetX = this.panOffsetX;
		this.offsetY = this.panOffsetY;
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