<template>
  <div id="nav">
    <ScoreCards />
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from '@/components/Navbar.vue'
import ScoreCards from '@/components/ScoreCards.vue'

export default {
  name: 'Scores',
  components: {
    Navbar,
    ScoreCards
  }
}
</script>