<template>
  <Navbar :title="this.$route.name"/>
    <router-view/>
</template>

<script>
import Navbar from './components/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar
  },
}
</script>


<style>
@media (max-width: 768px) {
    .hide{
        display: none;
    }
}
</style>
