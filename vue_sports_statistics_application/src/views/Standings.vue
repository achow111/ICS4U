<template>
  <div id="nav">
    <!-- <div v-if="gotScores"> -->
      <Table />
    <!-- </div> -->
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from '@/components/Navbar.vue'
import Table from '@/components/Table.vue'

export default {
  name: 'Standings',
  components: {
    Navbar,
    Table
  },
}
</script>

<style scoped>

</style>
