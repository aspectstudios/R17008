<template>
<div class="wrapper">

</div>
</template>

<script>
import Vuex from 'vuex'

export default {

  name: 'NorthStar',
  props: [''],
  components: {},
  data () {
    return {

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

  },
}
</script>

<style lang="stylus" scoped>
@import '../stylus/main'

.wrapper{
  
}

</style>