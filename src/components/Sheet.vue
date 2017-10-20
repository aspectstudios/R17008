<template>
<div id="sheet-container" :class="['elevation-5', {'elevation-20' : resizing ? true : false}]" :style='{width: dim.w + "px", minWidth: dim.w + "px"}'>
   <div v-touch:pan="pan" class="resize-handler"></div>
   <div ref="fullwidth" id="fullwidth"></div>
   <div class="arrow noselect"></div>
   <div :class="['icon', 'noselect',{'panleft' : panDirection == 'panleft' ? true : false}]" >keyboard_arrow_right</div>
   <slot></slot>
</div>
</template>

<script>
import Vue from 'vue'
import Vuetify from 'vuetify'
Vue.use(Vuetify)
require('../stylus/main.styl')
var dynamics = require('dynamics.js')
import Vue2Touch from 'vue2-touch'
Vue.use(Vue2Touch)


function valBetween(v, min, max) {
    return (Math.min(max, Math.max(min, v)));
}

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

export default {
  name: 'sheet',
  props: ['startingWidth'], // not working, see below
  created(){
    var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    this.maxSheetWidth -= this.minSheetWidth
    // this.dim.w = this.startingWidth // why dooes this cause problems?
    this.dim.w = parseInt(windowWidth*0.666)
  
  },
  methods: {
    pan(type, callback){
      // console.log(callback)
      var self = this
      if(type == "panstart"){
        this.original_width =this.dim.w
        this.resizing = true
      }
      if(type == "panend"){
        // console.log(callback.velocityX)
        this.resizing = false
        var resize = parseInt(this.dim.w + (callback.distance * (callback.velocityX*0.7)))
        this.maxSheetResize = Math.max(this.dim.w, this.original_width)
        dynamics.animate(this.dim, {
          w: valBetween(resize, this.minSheetWidth, this.$refs.fullwidth.offsetWidth-100)
        }, {
          type: dynamics.spring,
          duration: map_range(Math.abs(callback.velocityX), 0, 6, 1000, 100),
          frequency: 274,
          friction: 516,  
          complete: function(){
        // self.$emit('resized')
        // console.log(callback)
        // console.log(self.maxSheetResize)
        if (callback.deltaX > 0 ){
        // if (callback.deltaX > 0 && self.dim.w > self.maxSheetResize){
          self.$emit('resized')
          this.panDirection = 'panright'
        } else{
          self.$emit('resized') // comment if no resize when panning left (but need another method for recentering element.)
          this.panDirection = 'panleft'
          }
        }
        })
        
      }
      if(type == "panleft"||"panright"){
        // console.log(type)
        this.dim.w = this.original_width + callback.deltaX
        this.panDirection = type
      }
    }
  },
  data () {
    return {
      dim: {w: 600},
      original_width: 200,
      minSheetWidth: 100,
      resizing: false,
      maxSheetResize: 0,
      panDirection: null,
      maxSheetWidth: 1920
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../stylus/main'

#sheet-container{
  position: relative;
  content:"";
  display: inline;
  overflow: visible; // but hidden hides the drop shadow
  height: 100vh;
  // width: auto;
  float:left; 
  transition: box-shadow 0.2s ease-out;
  box-shadow: none !important; 
  max-width: calc(100vw - 100px);
  
}

.arrow{
  position: absolute;
  background-color: #f1f1f1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Material Icons';
  font-size: 30px;
  
  // opacity: 0.55;
  right: -10px;
  width: 50px;
  z-index: 1;
  height: 100%;
  pointer-events: none;
  -webkit-clip-path: polygon(0% 0%, 0% 100%, 0 73%, 0 43vh, 74% 43vh, 74% 57vh, 0 57vh, 0 100%, 100% 100%, 100% 0%);
  clip-path: polygon(0% 0%, 0% 100%, 0 73%, 0 43vh, 74% 43vh, 74% 57vh, 0 57vh, 0 100%, 100% 100%, 100% 0%);
}
  

.noselect{
   user-select: none;
}

.icon{
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Material Icons';
  font-size: 30px;
  color: white;
  right: -5px;
  width: 50px;
  z-index: 1;
  height: 100%;
  pointer-events: none;
  transition: 0.3s all;
}

.icon.panleft{
  transform: rotateZ(180deg);
}

#fullwidth {
  position: absolute;
  display: block;
  width: 100vw;
  pointer-events: none;
  background-color: transparent;
  z-index:-1;
}

.resize-handler{
  position: absolute;
  z-index: 1;
  right: -50px;
  top:0;
  width: 100px;
  height: 100%;
  cursor: ew-resize;  
}

.resize-handler:hover{
  // background-color: rgba(0,0,0,0.2);
}

</style>