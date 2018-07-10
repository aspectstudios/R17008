<template>
<div class="wrapper">
	<v-touch class="element" ref="element"
		@pinch="pinchHandler"
		@pinchstart="pinchstartHandler"
		@pinchend="pinchendHandler"
		
		@pan="panHandler"
		@panstart="panstartHandler"
		@panend="panendHandler"
		
		@doubletap="doubletapHandler"
		@tap="tapHandler"

		v-bind:enabled="{ pinch: true, doubletap: true, pan: true, tap: true}"
		v-bind:pan-options="{ direction: 'all' }"
		:style="style">

	</v-touch>
</div>
</template>

<script>
import Vuex from 'vuex'
import Vue from 'vue'
var VueTouch = require('vue-touch')
Vue.use(VueTouch, {name: 'v-touch'})

export default {

  name: 'DivPanner',
  props: [''],
  components: {},
  data () {
    return {
    	style:null,
    	x: null,
    	y: null,
    }
  },
  created(){

  },
  computed:{
	...Vuex.mapGetters([]),

  },
  watch:{

  },
  methods:{
	...Vuex.mapMutations([]), 
	...Vuex.mapActions([]), 

	pinchHandler(e){
		//console.log(e)
		this.style = {transform: 'translate('+ e.center.x +'px, '+e.center.y+')'}
	},
	pinchstartHandler(e){
		//console.log(e)
	},
	pinchendHandler(e){
		//console.log(e)
	},
	panHandler(e){
		//console.log(e)
	},
	panstartHandler(e){
		//console.log(e)
	},
	panendHandler(e){
		//console.log(e)
	},
	doubletapHandler(e){
		//console.log(e)
	},
	tapHandler(e){
		//console.log(e)
	},

  },
}
</script>

<style lang="stylus" scoped>
@import '../stylus/main'

.wrapper{
	position: absolute;
	left: 0;
	top: 0;
	width: 100vw;
	height: 100vh;
	background-color: white;
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