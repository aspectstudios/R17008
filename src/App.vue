<template>
   <v-app id="inspire" v-resize="resizeHandler">
  <!-- <fullscreen :fullscreen.sync="fullscreen" @change="fullscreenChange"> -->
    <div class="footer-logo noevents noselect" ref="myApp">terroir</div>
    <v-navigation-drawer :mini-variant.sync="mini" :width="menuWidth" :mini-variant-width="miniWidth" hide-overlay fixed permanent stateless touchless right app class="elevation-14 overflowhidden cursordefault navigationDrawer">
      <router-view name="drawer"></router-view>
      <!-- <div class="close-button"><v-icon>close</v-icon></div> -->
    </v-navigation-drawer>
    
    <v-toolbar fixed app dense flat style="z-index: 99 !important" class="transparent">
        <div class="northarrow cursordefault noevents noselect" v-if="!sketchfabMode">
      <!-- <v-tooltip bottom> -->
          <!-- <v-icon class="white--text">navigation</v-icon> -->
          <img src="static/icons/baseline-navigation-24px.svg" style="width: 24px;" />
          <div class="northlabel white--text">North</div>
        <!-- <span>North</span> -->
        <!-- </v-tooltip> -->
        </div>


      <v-spacer></v-spacer>
      <v-tooltip left>
        
        <v-btn v-show="sketchfabMode" slot="activator" class="elevation-0 close-button" fab outline small color="black black--text" @click="buttonHandler()">
          <!-- <v-icon>arrow_forward</v-icon> -->
          <img src="static/icons/baseline-arrow_forward-24px.svg" style="width:24px;" />

        </v-btn>

        <span>Back to 2D Map</span>
      </v-tooltip>

      <!-- <v-btn icon @click="mini =!mini" class="white--text menu-icon">
      <v-icon class="white--text" v-text="mini ? 'menu' : 'close'"></v-icon>
      </v-btn> -->


      <transition name="fadeIn">
      <!-- <v-toolbar-side-icon v-if="mini" class="white--text menu-icon" @click.stop="mini = !mini"></v-toolbar-side-icon> -->
      <v-btn icon class="menu-icon" v-if="mini" @click.stop="mini = !mini">
        <img src="static/icons/baseline-menu-24px.svg" style="width: 24px; height: 24px;" />
      </v-btn>

      <v-btn v-else icon @click.native.stop="mini =!mini"   class="white--text menu-icon" >
        <img src="static/icons/baseline-close-24px.svg" style="width: 24px; height: 24px;" />
      </v-btn>
      
      </transition> 
    </v-toolbar>

    <v-content>

      <div class="soilegend"  v-dragscroll :style="{'right': menuWidth+'px', opacity: soilMode ? 1:0}">
        <div v-for="s in soils">
          <div class="soil-square" :style="{'background-color':s.color}"></div>
          <div class="soil-label noselect defaultcursor" v-text="s.name"></div>
        </div>
      </div>
      <!-- <v-alert v-if="staging" :style="{'pointer-events': 'all', 'z-index': '99 !important', 'top':'-7px', 'width':'calc( 100%  - '+this.menuwidth+'px )', 'right': this.menuWidth+'px', 'text-align': 'right' }" :value="true" type="warning" class="black--text" dismissible>
      Warning: You are on our testing website! - please visit <a href="https://ahwr-3d.surge.sh">ahwr-3d.surge.sh</a>
    </v-alert> -->
      <router-view></router-view>
      <v-dialog v-model="dialog" max-width="500px" class="elevation-0">
             <v-card class="elevation-0">
               <v-card-text>
                 <img src="./assets/terroir.svg" class="terroir-logo">
                 <div class="body">By Urban&amp;Public</div><br/>
                 <div class="body">Map imagery: Google, DigitalGlobe.</div>
               </v-card-text>
             </v-card>
           </v-dialog>

            <!-- <v-tooltip left> -->
             <!-- <transition name="fade-slide-left">
             <div v-if="sketchfabMode" class="slider-wrapper">
              <img src="static/icons/baseline-filter_hdr-24px.svg" style="width: 24px; height: 24px; display: inline !important;" />
             <div class="slider-caption" >Vertical terrain exaggeration</div>
             <div class="slider">
                <v-slider  color="white" v-show="true" v-model="exaggeration" ></v-slider>
             </div>
             </div>
           </transition> -->
               <!-- </v-tooltip> -->

    </v-content>
    
    <v-footer app style="z-index: 2 !important" class="noevents">
    </v-footer>
    <v-snackbar v-model="snackbar" absolute style="z-index: 6 !important" bottom :timeout="0">
      Using a notebook or desktop computer?&nbsp;<a target="_parent" href="https://ahwr-3d.surge.sh" style="color:#71b6ff; margin-left: 10px;">Get a better experience</a>
      <v-btn color="white" flat @click="snackbar = false" icon>
        <img src="static/icons/baseline-close-24px.svg" style="width: 24px" />
      </v-btn>
    </v-snackbar>
    <v-snackbar error v-model="staging" absolute style="z-index: 99 !important" top :timeout="0">
      Warning: You are on our testing website! - please visit <a href="https://ahwr-3d.surge.sh">&nbsp;ahwr-3d.surge.sh</a>
      <v-btn color="white" flat @click="snackbarstaging = false" icon><v-icon>close</v-icon></v-btn>
    </v-snackbar>
<!-- </fullscreen> -->
  </v-app>
</template>

<script>  
import Vue from 'vue'
import Vuex from 'vuex'
import { dragscroll } from 'vue-dragscroll'
// import fullscreen from 'vue-fullscreen'
// Vue.use(fullscreen)


export default {
   directives: {
     'dragscroll': dragscroll
   },
  name: 'app',
  data (){ 
    return {
      snackbar: true,
      snackbarstaging: true,
      mini: null, 
      exaggeration: 1,
      soils:[
        {code: 'K1', name: 'Acidic gradational loam on rock', color: "#498c80"},
        {code: 'K2', name: 'Acidic loam over clay on rock', color: "#71b469"},
        {code: 'K4', name: 'Acidic sandy loam over brown or grey clay on r', color: "#bad91c"},
        {code: 'F2', name: 'Sandy loam over poorly structured brown or dar', color: "#764a28"},
        {code: 'L1', name: 'Shallow soil on rock', color: "#e73236"},
        {code: 'K3', name: 'Acidic sandy loam over red clay on rock', color: "#98cd4d"},
        {code: 'K5', name: 'Acidic gradational sandy loam on rock', color: "#dde406"},
        {code: 'J2', name: 'Ironstone soil', color: "#ffc902"},
        {code: 'G3', name: 'Thick sand over clay', color: "#fdec00"},
        {code: 'G5', name: 'Sand over acidic clay', color: "#e1de68"},
        {code: 'G4', name: 'Sand over poorly structured clay', color: "#fdd083"},
        {code: 'F1', name: 'Loam over brown or dark clay', color: "#b18d67"},
        {code: 'M2', name: 'Deep friable gradational clay loam', color: "#67ca31"},
        {code: 'C2', name: 'Gradational loam on rock', color: "#fd75fc"},
        {code: 'M1', name: 'Deep sandy loam', color: "#00be03"},
        {code: 'I2', name: 'Wet highly leached sand', color: "#d7d8d0"},
        {code: 'N1', name: 'Peat', color: "#80feff"},
        {code: 'H3', name: 'Bleached siliceous sand', color: "#fffe9b"},
        {code: 'E1', name: 'Black cracking clay', color: "#323432"}
      ],
    }
  },
  computed:{
    ...Vuex.mapGetters(['miniWidth', 'menuWidth', 'sketchfabMode', 'dialog', 'getExaggeration', 'sketchfabMode', 'soilMode', 'fullscreen']),

    staging: function(){
      var s = window.location.href.indexOf('staging') > -1 ? true : false
      console.log(s)
      if(s && this.snackbarstaging){
        return true
      } else{
        return false
      }
      
    }

  },
  created(){
    
    // if(modernizr.inputtypes.date) {
    //    console.log('inputtypes dates check!..')
    // }

    var self = this
    this.setMenuWidth(this.getMenuWidth())
    window.addEventListener(
        "touchmove",
        function(event) {
            if (event.scale !== 1) {
                event.preventDefault();
            }
        },
        { passive: false }
    );
    
  },
  watch: {
    mini: function(val){
      this.setMini(val)
      this.setMenuWidth(this.getMenuWidth())
    },

    exaggeration: function(val){
      // console.log(val*0.03)
      this.setExaggeration(val)
    }
  },

  methods: {
    ...Vuex.mapMutations(['setMini', 'setMenuWidth', 'setMapWidth', 'setSketchfabMode', 'setExaggeration']),

    fullscreenChange(){
      console.log('change')
    },

    getMenuWidth: function(){
      if(this.mini){
        return this.miniWidth
      } else{
        return this.remap(this.$vuetify.breakpoint.width,300,1920,200,500)  
      }
      
    },

    buttonHandler(){
      this.setSketchfabMode(!this.sketchfabMode)
      
    },

    remap(num, in_min, in_max, out_min, out_max) {
      return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    },
    // resizeHandler(){
    resizeHandler(){
      
      setTimeout(function () {
        this.setMenuWidth(this.getMenuWidth())
      }.bind(this), 300)
      setTimeout(function () {
        if(this._map && this._mapmini){
          this._map.resize()
          this._mapmini.resize()
        }
      }.bind(this), 1000)


      var bp = this.$vuetify.breakpoint.name
      // console.log(this.$vuetify.breakpoint)
      if(bp =='xs'){
        // this.mini = false;
      } else if(bp =='sm'){
        // this.mini = false;
      } else if(bp =='md'){
        // this.mini = false;
      } else if(bp =='lg'){
        // this.mini = false;
      } else if(bp =='xl'){
        // this.mini = false;
      }
    }
  // }

  }
}
</script>

<style lang="stylus">
@import './stylus/main'
@import './stylus/helpers'

body, html {
  margin: 0;
  overflow: hidden !important;
}



#app {
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.terroir-logo{
  font-family: 'CircularStdBold';
  width: 100%
  padding: 60px;
}

.body{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

body, document, html{
  overflow: hidden !important
}

@font-face {
    font-family: 'CircularStdBold';
    src: url('./assets/fonts/CircularStdBold.eot');
    src: url('./assets/fonts/CircularStdBold.eot') format('embedded-opentype'),
         url('./assets/fonts/CircularStdBold.woff2') format('woff2'),
         url('./assets/fonts/CircularStdBold.woff') format('woff'),
         url('./assets/fonts/CircularStdBold.ttf') format('truetype'),
}


.footer-logo{
  font-family: 'CircularStdBold';
  font-size: 5vw;
  color: #153a29;  
  position: absolute;
  bottom: 26px;
  left: 10px;
  opacity: 1;
  z-index: 99;
  
}

.menu-icon{
  position: absolute !important;
  right: 0px;
  top: 0px;
  margin-right: 12px !important;
  // width: 36px;
  
}
main {
  padding: 0px !important;
  // change this when mapbox background style changes.
  // background-color: #513657;
    background-color: #38995A;
}

// change this when mapbox background style changes.
.mapboxBG{
  // color: #513657 !important
    color: #38995A !important
}
header {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #35495E;
  color: #ffffff;
}

.navigation-drawer{
  padding-bottom: 0 !important;
  overflow: hidden !important;
  // background-color: #fa9898;
  background-color: #78C583
  z-index: 6;
  // width: 30vw !important;
  // min-width: 200px !important;
  // max-width: 500px !important;
}
header span {
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
}



.v-footer{
  background: transparent !important;
}
.logo{
  margin-left: 100px;
  width: 20px;
}

.navigationDrawer{
  content: "";
}

.close-button{
  margin: 60px;
  top: 60px;
}

// .navigationDrawer::after{
//   position: relative;
//   width: 100px;
//   height: 100vh;
//   background-color: black;
//   left: 0px;
  
// }

.slider-wrapper{
  position: absolute;
  top:53px;
  left: 35px;
  z-index:99 !important;
}

.slider-wrapper i{
  color:white !important;
}

.slider{
  transform: scale(1.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  // position: absolute;
  margin-top: 12px;
  width: 169px;
  height: auto;
  // top: 34px;
  z-index: 99 !important;
  // border-radius: 4px;
  // padding: 10px;
  color: white;
}

.slider-caption{
  color: white;
  line-height: 0.9em;
  display: inline;
  top: -6px;
  position: relative;
}

.northarrow{
  position: absolute;
  left: 25px;
  top: 25px;
  font-size: 30px;
  z-index: 2;
}
.northlabel{
  font-size: 10px;
  color: white;
}
.v-dialog, v-card{
  box-shadow: none !important;
}

.soilegend{
  position: absolute;
  overflow-y: scroll;
  bottom: 0;
  width: 50px;
  height: 100vh;
  
  display: flex;
  align-items: center;
  // flex-wrap: wrap;
  align-content: flex-start;
  flex-direction: column;
  z-index: 2
}

.soil-square{
  width: 20 px;
  height: 20px;
  border-radius: 2px;
  margin-bottom: 4px;
  
}

.soil-label{
  color: black;
  font-size: 8px;
  text-align: left;
  margin-bottom: 16px;
  line-height:8px;
}


.soilegend::-webkit-scrollbar { 
    display: auto !important; 
    z-index: 10;    
}
// Simple
.soilegend::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.soilegend::-webkit-scrollbar-track {
  border-radius: 10px;
  background: rgba(255,255,255,0.1);
}
.soilegend::-webkit-scrollbar-thumb{
  border-radius: 10px;
  background: rgba(255,255,255,0.2);
}
.soilegend::-webkit-scrollbar-thumb:hover{
  background: rgba(255,255,255,0.4);
}
.soilegend::-webkit-scrollbar-thumb:active{
  background: rgba(255,255,255,.9);
}

</style>
