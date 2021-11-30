<template>
  <header id="main-header" class="bg text-white p-4 mb-3" style="background-color: #01579b;">
      <div class="container d-inline">
        <img class="d-inline" src="http://loodibee.com/wp-content/uploads/nba-logo-transparent-480x480.png" style="width:100px;">
        <h1 class="d-inline align-middle" id="header-title">{{title}}</h1> 
      </div>
        <nav class="navbar navbar-expand-lg bg navbar-dark pt-3 pb-0 px-0" style="background-color: #01579b;">
            <div class="container">

               <button
                  class="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navmenu"
               >
                  <span class="navbar-toggler-icon"></span>
               </button>

               <div class="collapse navbar-collapse" id="navmenu">
                  <ul class="navbar-nav">
                     <li class="nav-item px-2">
                     <router-link to="/standings" :scores_data="scoresString">Standings</router-link> 
                     </li>
                     <li class="nav-item px-2">
                     <router-link to="/scores">Scores</router-link> 
                     </li>
                     <li class="nav-item px-2">
                     <router-link to="/submit_scores">Submit Scores</router-link> 
                     </li> 
                  </ul>
               </div>
            </div>
        </nav> 
   </header>
</template>

<script>

export default {
  name: 'Navbar',
  props: {
    title: String
   },
   components: {
   },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 a{
   color: white;
   font-size: 18px;
   text-decoration: none;
} 

a:hover {
  color: #c8102e;
}

@media (max-width: 992px) {
    li{
      padding-top: 10px;
    }
}
</style>
