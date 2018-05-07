<template>
	<transition-group name="fade" v-dragscroll :class="['wrapper', {'hidden' : hide ? true : false}]" :style="{'width': 'calc( 100vw - '+(this.menuWidth || this.miniWidth)+'px)'}">
			<div id="info-container" class="information winery noselect" :style="{'width': remap($vuetify.breakpoint.width, 300, 1920, 600, 900)+'px', 'zoom': remap($vuetify.breakpoint.width, 300, 1920, 0.6, 0.8), 'opacity' : hide ? 0 : 1 }" v-for="(winery, key, index) in wineriesHere" :key="key">
				<div class="winery-container">
					<div class="winery-name">{{ winery.properties.name }}<span class="winery-region">{{ winery.properties.region }}</span></div>

					<div class="winery-desc">{{ winery.properties.desc }}</div>
					<div><span class="label">Where</span>{{ winery.properties.where }}<div class="winery-tel select"><span class="label">T</span>{{ winery.properties.tel }}</div></div>

					<div class="winery-open"><span class="label">Open</span>{{ winery.properties.open }}</div>
					<a target="_blank" :href='"http://"+winery.properties.website' class="winery-website">{{ winery.properties.website }}</a>
				</div>
			</div>
		  <!-- <v-btn :key="'button'" v-show="wineriesHere" class="elevation-0 close-button" fab outline small color="white white--text" @click="buttonHandler()"><v-icon>keyboard_arrow_down</v-icon></v-btn> -->
			<!-- <div class="spacer"></div> -->
		</transition-group>
</template>

<script>
import Vuex from 'vuex'
import _ from 'lodash'
import { dragscroll } from 'vue-dragscroll'

export default {

  name: 'bottomSheet',
  props: [''],
  directives: {
     'dragscroll': dragscroll
   },
  components: {},
  data () {
    return {
    	hide: false
    }
  },
  created(){
  },
  computed:{
	...Vuex.mapGetters(['wineriesHere', 'wineries', 'menuWidth', 'miniWidth', '_map', 'sketchfabMode']),

  },
  watch:{


  	wineriesHere: function(val){
  	  if(val.length == 0 || this._map.getZoom() < 13 ){
  	    this.hide = true
  	  } else {
  	  	this.hide = false
  	  }
  	}

  },
  methods:{
	...Vuex.mapMutations([]), 
	...Vuex.mapActions([]), 

	remap(num, in_min, in_max, out_min, out_max) {
      return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    },
	


  },
}
</script>

<style lang="stylus" scoped>
@import '../stylus/helpers.styl'


.fade-enter-active, .fade-leave-active {
  transition: opacity 245ms cubic-bezier(.64,.02,.14,.94);
}
.fade-enter, .fade-leave-to {
  opacity: 0 !important;
}

.transition-group{
	position: relative;

	display: flex;
	// justify-content: flex-start;
	// align-items: flex-start;
	// flex-wrap: nowrap;
}

.wrapper{
	position: absolute;
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	left: 0;
	bottom: 0;
	max-height: 50vh;
	min-height: 30vh;
	// height: 400px;
	background-color: #38995a;
	font-family: 'Roboto';
	font-weight: 400; 
	background: linear-gradient(to bottom,rgba(255,255,255,0)0%, rgba(30,67,43,0.8) 70%);
	mix-blend-mode: hard-light !important;
	color: #dfefe5;
	overflow-x: auto;
	overflow-y: hidden;
	z-index:1;
	flex-wrap: nowrap;
	-webkit-overflow-scrolling: touch;
	padding-bottom: 50px; 
  	pointer-events: all !important;
  	padding-top: 50px;
  	transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.grab-bing {
  cursor : -webkit-grab;
  cursor : -moz-grab;
  cursor : -o-grab;
  cursor : grab;
}
 
 
.grab-bing:active {
  cursor : -webkit-grabbing;
  cursor : -moz-grabbing;
  cursor : -o-grabbing;
  cursor : grabbing;
}

.wrapper.hidden{
	transform: translateY(400px);
	pointer-events: none !important;
}

.close-button{
	position: absolute;
	right: 0;
	top: -100px;
}

.wrapper::-webkit-scrollbar { 
  	display: auto !important; 
  	z-index: 10;  	
}
// Simple
.wrapper::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.wrapper::-webkit-scrollbar-track {
  border-radius: 10px;
  background: rgba(255,255,255,0.1);
}
.wrapper::-webkit-scrollbar-thumb{
  border-radius: 10px;
  background: rgba(255,255,255,0.2);
}
.wrapper::-webkit-scrollbar-thumb:hover{
	background: rgba(255,255,255,0.4);
}
.wrapper::-webkit-scrollbar-thumb:active{
	background: rgba(255,255,255,.9);
}

// .card{
// 	display: flex;
// 	justify-content: center;
// 	align-items: center;
// 	width: 100px;
// 	height: 100px;
// 	background-color: black
// 	color: #dfefe5;
// }

.info-container{
  // flex: 0 0 auto; 
  min-width: 300px;
  display: block;
  position: relative;
  transition: height 145ms ease-in-out
}

.spacer{
  flex: 0 0 auto; 
  position: relative;
  pointer-events: none;
}

.winery-container{
display: block;
position: relative;
text-align: left;
padding: 1em 0;
border-top: dotted #dfefe5 1px;
border-bottom: dotted #dfefe5 1px;
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
  color: white;
}

.winery-name{
  font-size: calc(10px + 1.5vw);
  font-family: 'Raleway';
  text-transform: uppercase;
  font-weight: 700;
  line-height: 1;
  
}

.winery-desc{
  /*float: right;*/
  // font-size: 1.2rem;
  	font-family: 'Roboto'
  	font-weight: 300;
  line-height: 1.35em;
}

.winery-website{
  color: #dfefe5 !important;
  display: inline-block;
  font-weight: 700;
  margin-top: 1em !important;
  text-decoration: none;
  color: unset;
  border-bottom: dotted transparent 1px;
}

.winery-website:hover{
  border-bottom: dotted #fff 1px;
}

.winery-region{
display: inline;
font-size: calc(10px + 0.6vw);
padding-left: 0.5em;
text-transform: uppercase;
font-weight: 400;
}


.information{
  position: relative;
  margin: 0 5vw;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  align-content: space-between;
  transition: opacity 145ms cubic-bezier(.64,.02,.14,.94);
  // padding-right: 5vw;
  // padding-left: 5vw;
}


*::selection{
  color: #253127
  background-color: rgba(187, 238, 187, 0.8)
}

</style>