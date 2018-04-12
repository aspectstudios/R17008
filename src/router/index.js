import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import DrawerHome from '@/components/DrawerHome'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      components:{
      	default: Home,
      	drawer: DrawerHome
      } 
    }
  ]
})
