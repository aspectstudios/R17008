<template>
<div class="wrapper" v-scroll="handleScroll">
  <v-touch class="element" ref="element"
    @pinch="pinchHandler"
    @pinchstart="pinchstartHandler"
    @pinchend="pinchendHandler"
    
    @panmove="panmoveHandler"
    @panstart="panstartHandler"
    @panend="panendHandler"

    
    
    v-on:doubletap="doubletapHandler"
    

    v-bind:enabled=" disabled ? false : { pinch: true, pan: true}"
    v-bind:pan-options="{ direction: 'all', pointers: 0}"
    
    :style="style">
    
    <img src="static/soil.gif" class="soil" :style="{'opacity': soilMode ? 1 : 0}" />
    <img src="static/winery-dots.gif" class="annotations" :style="{'opacity': soilMode ? 1 : 0}" />
    <img src="static/annotations.gif" class="annotations" :style="{'opacity': soilMode ? 1 : 0}" />

    <img class="image" src="../assets/static_map.gif" @click="disabled ? null : backgroundClick()"  alt=""  ref="image" key="1"  :usemap="disabled ? '' : '#map'" />
    <img  v-for="i in images" :src="'../static/overlays/cropped/'+i.name+'.gif'" class="region" :style="{left: i.x+'px', top: i.y+'px', opacity: ((currentRegion == i.name) || (currentRegion == 'blank') )? 1 : 0.4}"/>
    
   <map name="map">
    <area shape="poly" @click="clickHandler('kuitpo')" coords="1252, 2755, 1386, 2822, 1409, 2805, 1412, 2768, 1432, 2762, 1439, 2787, 1504, 2801, 1512, 2842, 1498, 2881, 1467, 2891, 1468, 2951, 1487, 2973, 1435, 3145, 1165, 3392, 1120, 3408, 1029, 3367, 985, 3310, 994, 3232, 1094, 3092, 1180, 2915, 1209, 2920, 1222, 2900, 1207, 2880, 1225, 2852, 1245, 2864" />
    <area shape="poly" @click="clickHandler('macclesfield')" coords="1609, 2969, 1624, 2939, 1620, 2920, 1644, 2809, 1602, 2812, 1590, 2787, 1516, 2786, 1504, 2800, 1513, 2841, 1497, 2878, 1468, 2893, 1469, 2951, 1529, 2981, 1545, 2944" />
    <area shape="poly" @click="clickHandler('bugle')" coords="1745, 2798, 1747, 2681, 1717, 2603, 1678, 2597, 1650, 2567, 1592, 2589, 1586, 2573, 1534, 2584, 1521, 2556, 1473, 2575, 1382, 2617, 1400, 2625, 1418, 2665, 1433, 2763, 1441, 2788, 1509, 2799, 1518, 2786, 1591, 2787, 1605, 2812, 1644, 2809, 1666, 2796" />
    <area shape="poly" @click="clickHandler('nairne')" coords="1892, 2347, 1821, 2363, 1727, 2367, 1736, 2412, 1702, 2447, 1684, 2424, 1645, 2456, 1622, 2546, 1647, 2568, 1677, 2598, 1718, 2606, 1750, 2683, 1752, 2657, 1788, 2657, 1802, 2594, 1845, 2600, 1857, 2545, 1835, 2471, 1879, 2481" />
    <area shape="poly"@click="clickHandler('longwood')"  coords="1207, 2267, 1262, 2281, 1295, 2337, 1377, 2391, 1354, 2434, 1368, 2453, 1354, 2536, 1312, 2578, 1092, 2603, 1116, 2556, 1206, 2536" />
    <area shape="poly" @click="clickHandler('piccadilly')" coords="1297, 2335, 1377, 2391, 1437, 2376, 1442, 2352, 1465, 2345, 1454, 2322, 1434, 2273, 1457, 2272, 1458, 2242, 1488, 2228, 1510, 2167, 1452, 2182, 1460, 2154, 1416, 2149, 1369, 2182, 1357, 2182, 1336, 2194" />
    <area shape="poly" @click="clickHandler('basket')" coords="1410, 1998, 1374, 2029, 1359, 2022, 1356, 2084, 1320, 2087, 1318, 2144, 1373, 2161, 1358, 2182, 1370, 2182, 1420, 2150, 1462, 2157, 1454, 2181, 1513, 2170, 1529, 2120, 1529, 2080, 1493, 2061, 1458, 2064, 1421, 2032" />
    <area shape="poly" @click="clickHandler('lenswood')" coords="1513, 2171, 1530, 2121, 1530, 2080, 1534, 2059, 1597, 2048, 1584, 2028, 1603, 2010, 1620, 2028, 1667, 2015, 1696, 2087, 1691, 2149, 1654, 2180, 1572, 2200, 1564, 2242, 1488, 2229" />
    <area shape="poly" @click="clickHandler('onkaparinga')" coords="1856, 2275, 1935, 2191, 1936, 2149, 1955, 2117, 1980, 1995, 1942, 1970, 1810, 2037, 1790, 2023, 1733, 2040, 1696, 2087, 1692, 2150, 1657, 2181, 1574, 2200, 1561, 2243, 1490, 2229, 1457, 2243, 1458, 2273, 1435, 2275, 1455, 2325, 1464, 2345, 1444, 2353, 1438, 2379, 1376, 2393, 1356, 2435, 1368, 2455, 1356, 2538, 1312, 2576, 1092, 2604, 1064, 2645, 1094, 2682, 1152, 2697, 1212, 2677, 1221, 2721, 1248, 2727, 1254, 2755, 1389, 2821, 1412, 2806, 1433, 2764, 1419, 2663, 1400, 2625, 1386, 2617, 1473, 2575, 1522, 2559, 1535, 2584, 1589, 2576, 1595, 2590, 1648, 2567, 1626, 2544, 1648, 2457, 1685, 2426, 1702, 2448, 1738, 2412, 1730, 2368, 1824, 2362, 1892, 2349, 1897, 2325, 1872, 2299" />
    <area shape="poly" @click="clickHandler('northern')" coords="1664, 1420, 1422, 1708, 1418, 1764, 1405, 1792, 1415, 1804, 1412, 2000, 1422, 2033, 1461, 2065, 1495, 2063, 1530, 2083, 1536, 2061, 1596, 2048, 1587, 2028, 1605, 2011, 1620, 2027, 1668, 2017, 1698, 2088, 1737, 2040, 1792, 2026, 1812, 2037, 1946, 1971, 1981, 1995, 2170, 1873, 2169, 1805, 2220, 1748, 2172, 1707, 2238, 1617, 2190, 1551, 2169, 1543, 2155, 1462, 1948, 1460, 1915, 1436, 1813, 1479" />
</map>
  </v-touch>
</div>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'
import vuescroll from 'vue-scroll'
Vue.use(vuescroll, {throttle: 600})
var VueTouch = require('vue-touch')
VueTouch.registerCustomEvent('doubletap', {
  type: 'tap',
  taps: 2
})
Vue.use(VueTouch, {name: 'v-touch'})
var withinviewport = require('withinviewport');
var imageMapResize = require('image-map-resizer');


export default {

  name: 'DivPanner',
  props: ['disabled'],
  components: {},
  data () {
    return {
      tapped: false,
      images: [
	  	{name: 'kuitpo', x: 415, y:1149 },
	  	{name: 'macclesfield', x: 613, y:1168 },
	  	{name: 'bugle', x:580 , y:1072 },
	  	{name: 'nairne', x: 679, y:983 },
	  	{name: 'longwood', x: 460, y:951 },
	  	{name: 'piccadilly', x:543 , y:900 },
	  	{name: 'basket', x:554 , y:843 },
	  	{name: 'lenswood', x:623 , y:842 },
	  	{name: 'onkaparinga', x:447 , y:824 },
	  	{name: 'northern', x: 587, y:595 }
	  	],
	  selected: null,
      inBoundsTop: true,
      inBoundsLeft: true,
      inBoundsBottom: true,
      inBoundsRight: true,
      originXY: {x: 0,y:0},
      x: -300,
      y: -500,
      offsetX: -300,
      offsetY: -500,
      pinchX: 0,
      pinchY:0,
      pinchXoffset: 0,
      pinchYoffset:0,
      scale: 1,
      maxScale:5,
      minScale:1,
      oldScale: 1,
      opacity: 1,
      originScale: null
    }
  },
  mounted(){
  	imageMapResize()
  },
  computed:{
  	...Vuex.mapGetters(['menuWidth', 'currentRegion', 'soilMode']),

    style: function(val){
      return {transform: 'translate('+ this.x +'px, '+this.y+'px) scale('+ this.scale +')', 'transform-origin': 'center center'}
    }
  },
  watch:{

	style: function(val){
		var self = this
		this.inBoundsTop = withinviewport(self.$refs.image, {sides: 'top'})
		this.inBoundsLeft = withinviewport(self.$refs.image, {sides: 'left'})
		this.inBoundsBottom = withinviewport(self.$refs.image, {sides: 'bottom'})
		this.inBoundsRight = withinviewport(self.$refs.image, {sides: 'right', right: this.menuWidth})
	},

  },
  methods:{
  	...Vuex.mapMutations(['setCurrentRegion', 'setSoilMode', 'setSketchfabMode', 'toggleLaunch3D']),

  backgroundClick(){
  	this.setCurrentRegion('blank')
  },

  handleScroll(e){
  	console.log(e)
  },	
  
  setXY(){
    this.x = this.offsetX
    this.y = this.offsetY
  },
  setOffset(){
    this.offsetX = this.x
    this.offsetY = this.y
  },
  panstartHandler(e){
    if(!this.inBoundsTop && !this.inBoundsBottom && !this.inBoundsRight && !this.inBoundsLeft ){
    	this.originXY = {x: this.x, y: this.y}
    }
    this.setXY()
  },
  panmoveHandler(e){
    
    this.y = this.offsetY+e.deltaY
    this.x = this.offsetX+e.deltaX
  },
  panendHandler(e){
    if(this.inBoundsTop || this.inBoundsBottom){
    	this.y = this.originXY.y
    } else{
    	this.offsetY = this.y
    }
    if(this.inBoundsLeft || this.inBoundsRight){
    	this.x = this.originXY.x
    } else{
    	this.offsetX = this.x	
    }

    this.setOffset()
  },

  pinchstartHandler(e){
  	if(!this.inBoundsTop && !this.inBoundsBottom && !this.inBoundsRight && !this.inBoundsLeft ){
    	this.originXY = {x: this.x, y: this.y}
    }
  	    
  },
  pinchHandler(e){
    this.scale = Math.min(this.maxScale, Math.max(this.minScale, this.oldScale * e.scale))
    
    this.x = this.offsetX+ (e.deltaX)
    this.y = this.offsetY+ (e.deltaY)
    
    this.pinchX = Math.round(e.center.x)
    this.pinchY = Math.round(e.center.y)
    this.pinchXoffset = Math.round(e.center.x - this.offsetX)
    this.pinchYoffset = Math.round(e.center.y - this.offsetY)

    
  },
  pinchendHandler(e){
    this.oldScale = Math.min(this.maxScale, Math.max(this.minScale, this.oldScale * e.scale))
    this.pinchXoffset = 0
    this.pinchYoffset = 0

    this.setXY()

    if(this.inBoundsTop || this.inBoundsBottom){
    	this.y = this.originXY.y
    } else{
    	this.offsetY = this.y
    }
    if(this.inBoundsLeft || this.inBoundsRight){
    	this.x = this.originXY.x
    } else{
    	this.offsetX = this.x	
    }

  },
  doubletapHandler(e){
    // var s = this.scale * 1.5
    console.log('doublel tapped')
  	// this.scale = Math.min(s, this.maxScale)
  	// this.oldScale = Math.min(s, this.maxScale)
    
  },
  tapHandler(e){
  	// console.log(e)
  },

  clickHandler(name){
    if((this.tapped == name) && (this.currentRegion)){
        this.setSketchfabMode(true)
        this.toggleLaunch3D(true)
    } else{
    	this.setSoilMode(false)
    	this.setCurrentRegion(name)
      this.tapped = name
    }
    
  }

  },
}
</script>

<style lang="css">

.wrapper{
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: #38985b;
}

.element{
  transition: translate 145ms cubic-bezier(.64,.02,.14,.94);
  background-color: rgba(0,0,0,0.2);
  pointer-events: none;
}
.image{
	pointer-events: all;
	width: 1920px;
}

.region{
	transition: opacity 245ms ease-out;
	position: absolute;
	/*width: 1920px;*/
	transform: scale(0.41939);
	opacity: 1;
	transform-origin: top left;
}

.soil{
	transition: opacity 245ms ease-out;
	position: absolute;
	/*width: 1920px;*/
	transform: scale(0.1155);
	transform-origin: top left;
	left: 416px;
	top: 596px;
	z-index: 1;
}

.annotations{
	transition: opacity 245ms ease-out;
	position: absolute;
	left: 0;
	top: 0;
	width: 1920px;
	pointer-events: none;
	z-index: 2;

}
</style>