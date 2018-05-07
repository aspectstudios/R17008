<template>
   <v-app id="inspire" v-resize="resizeHandler">
    <v-navigation-drawer :mini-variant.sync="mini" :width="menuWidth" :mini-variant-width="miniWidth" hide-overlay fixed permanent stateless touchless right app class="elevation-14 overflowhidden cursordefault navigationDrawer">
      <router-view name="drawer"></router-view>
      <!-- <div class="close-button"><v-icon>close</v-icon></div> -->
    </v-navigation-drawer>
    
    <v-toolbar fixed app dense flat absolute style="z-index: 99 !important" class="transparent">
      <v-spacer></v-spacer>
      <v-tooltip left>
        <v-btn v-show="sketchfabMode" slot="activator" class="elevation-0 close-button" fab outline small color="white white--text" @click="buttonHandler()"><v-icon>arrow_forward</v-icon></v-btn>
        <span>Back to 2D Map</span>
      </v-tooltip>

      <transition name="fadeIn">
      <v-toolbar-side-icon v-if="mini" class="white--text menu-icon mapboxBG" @click.stop="mini = !mini"></v-toolbar-side-icon>
      <v-btn icon @click.native.stop="mini =!mini" class="menu-icon mapboxBG" v-else>
      <v-icon class="white--text">close</v-icon>
      </v-btn>
      </transition>
    </v-toolbar>

    <v-content>
      <router-view></router-view>
      <v-dialog v-model="dialog" max-width="500px">
             <v-card>
               <v-card-text>
                 <img src="./assets/terroir.svg" class="terroir-logo">
                 <div class="body">By Urban&amp;Public</div>
               </v-card-text>
             </v-card>
           </v-dialog>
      
    </v-content>
    <v-footer app style="z-index: 2 !important">
      <img src="./assets/up_logo.svg" class="logo noevents cursordefault noselect"/><span class="white--text pl-2 noevents cursordefault noselect">terroir 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
import _ from 'lodash'
import Vuex from 'vuex'
import {db} from './firebase-db.js'
const credentials = require('./credentials.js')


export default {
  name: 'app',
  data (){ 
    return {
      token: credentials.mapbox.token,
      mini: null
    }
  },
  computed:{
    ...Vuex.mapGetters(['miniWidth', 'menuWidth', 'sketchfabMode', 'wineries', '_map', '_mapmini', 'dialog']),

  },
  created(){
    var self = this
    this.setMenuWidth(this.getMenuWidth())

    var data = db.ref('data')
    this.$store.dispatch('setDataRef', data )
    .then(response => {
      console.log(this.wineries)
    })


    // console.log('set menuwidth:', this.menuWidth)
  },
  watch: {
    mini: function(val){
      this.setMini(val)
      this.setMenuWidth(this.getMenuWidth())
      // console.log('set menuwidth:', this.menuWidth)
    },
  },
  methods: {
    ...Vuex.mapMutations(['setMini', 'setMenuWidth', 'setMapWidth', 'setSketchfabMode']),

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
    resizeHandler: _.debounce(function(){
      setTimeout(function () {
        this.setMenuWidth(this.getMenuWidth())
        this.setMapWidth(this.$vuetify.breakpoint.width - this.getMenuWidth())
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
        this.mini = false;
      } else if(bp =='sm'){
        this.mini = false;
      } else if(bp =='md'){
        this.mini = false;
      } else if(bp =='lg'){
        this.mini = false;
      } else if(bp =='xl'){
        this.mini = false;
      }
    }, 100),
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
  width: 100%
  padding: 60px;
}

.body{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  
}

.menu-icon{
  position: absolute;
  right: 0px;
  top: 0px;
  margin-right: 12px !important;
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


.footer{
  background: transparent !important;
}
.logo{
  margin-left: 100px
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

</style>
