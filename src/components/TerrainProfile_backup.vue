<template>
<transition name="fade">
	<div v-if="currentGridRef" ref="profile" class="wrapper">
		<img class="elevation" :style="{opacity: opacity}" :src="require('../assets/elevations/'+file+'.svg')" />
	</div>
</transition>
</template>

<script>
import Vuex from 'vuex'
import anime from 'animejs'
const _ = require('lodash')

export default {

  name: 'TerrainProfile',
  props: [''],
  components: {},
  data () {
    return {
    	file: null,
    	height: 100,
    	opacity: 1,
    }
  },
  mounted(){
  	

  },
  computed:{
	...Vuex.mapGetters(['_map', 'currentGridRef']),

  },
  watch:{
  	currentGridRef: function(newVal, oldVal){
  		if(newVal !== oldVal){
	  		var n = Math.round(this.remap(this.currentGridRef.properties.ymax, -4121788.2354200003, -4211362.8779417016, 1, 50))
	  		this.file = _.padStart(String(n), 3, '0')  		
  		}
  	},
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
@import '../stylus/main'
@import '../stylus/helpers'

.elevation{
  max-height: 100px;
width: 159%;
position: relative;
left: -34px;
top: -126px;
transition: all 90ms ease-in-out;
}

</style>