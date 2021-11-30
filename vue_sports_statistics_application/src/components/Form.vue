<template>
  <div id="nav">
    <div class="container">
      <form @submit="onSubmit" class="p-3" id="score-form">
          <div class="row">
            <div class="col">
        <h1 class="text-center">Home</h1>
        <label for="team-name" class="py-2">
            Team Name: 
        </label>
        <select class="form-select teams" v-model="hometeam" aria-label="Default select example">
          <option disabled value="">Please select one</option>
        </select>
        <label for="team-score" class="py-2">
            Score: 
        </label>
        <input type="number" v-model="homescore" class="form-control m-1"/>
    </div>
    <div class="col text-center my-auto">
      <h1>VS</h1>
    </div>
    <div class="col">
        <h1 class="text-center">Away</h1>
        <label for="team-name" class="py-2">
            Team Name: 
        </label>
        <select class="form-select teams" v-model="awayteam" aria-label="Default select example">
          <option disabled value="">Please select one</option>
        </select>
        <label for="team-score" class="py-2">
            Score: 
        </label>
        <input type="number" v-model="awayscore" class="form-control m-1"/>
    </div>
          </div>
          <div style="margin: 0% 30%; margin-top: 50px"> 
              <label for="date" class="py-2 d-block text-center">
                  Date: 
              </label>
              <input type="date" v-model="date" class="form-control m-1" id="date" />

              <label for="team-name" class="py-2 d-block text-center">
                  Duration: 
              </label>
              <select class="form-select" v-model="duration" aria-label="Default select example" id="duration">
                <option disabled value="">Please select one</option>
                  <option value="Final">Regulation</option>
                  <option value="F/OT">Overtime</option>
                  <option value="F/2OT">2 Overtime</option>
                  <option value="F/3OT">3 Overtime</option>
                  <option value="F/4OT">4 Overtime</option>
                  <option value="Postponed">Postponed</option>
              </select>
              <div class="text-center m-3">
                  <input class="btn btn-primary btn-lg ms-auto" type="submit" value="Submit">
              </div>
              <div class="text-center" id="err-msg" style="color: red"></div>
          </div>
      </form>
    </div>
  </div>
</template>

<script>
import Teams from '@/assets/teams.json'

export default {
  name: 'Form',
  components: {
    Teams
  },
  data(){
    return {
      hometeam: '',
      awayteam: '',
      homescore: '',
      awayscore: '',
      date: '',
      duration: ''
    }
  },
  props: {
    },
    methods: {
    fillTeams(teams){
      document.querySelectorAll(".teams").forEach(list => {
        teams.forEach((team) => {
          let option = document.createElement("option");
          option.value = team.TeamID;
          option.text = team.City + ' ' + team.Name;
          list.appendChild(option);
        })  
      });
    },
    onSubmit(e){
      e.preventDefault();

      let errMsg = document.getElementById("err-msg");

       errMsg.innerHTML = ' ';

       if(!this.hometeam){
         errMsg.appendChild(document.createTextNode("*Please select a Home Team"));
    } else if(!this.awayteam){
        errMsg.appendChild(document.createTextNode("*Please select an Away Team"));
    } else if(!this.homescore || this.homescore < 0){
        errMsg.appendChild(document.createTextNode("*Please select a valid Home Score"));
    } else if(!this.awayscore || this.awayscore < 0){
        errMsg.appendChild(document.createTextNode("*Please select a valid Away Score"));
    } else if(!this.date){
        errMsg.appendChild(document.createTextNode("*Please select a valid Day"));
    } else if (!this.duration) {
        errMsg.appendChild(document.createTextNode("*Please select a valid Duration"));
    } else if (this.hometeam == this.awayteam) {
        errMsg.appendChild(document.createTextNode("*Home and Away teams cannot be the same"));
    } else if (this.homescore == this.awayscore) {
        errMsg.appendChild(document.createTextNode("*Home and Away scores cannot be the same"));
    } else {

        const newGame = {
          HomeTeamID: this.hometeam,
          AwayTeamID: this.awayteam,
          HomeTeamScore: this.homescore,
          AwayTeamScore: this.awayscore,
          Status: this.duration
        }

        Teams.forEach(team => {
            if(team.TeamID == newGame.HomeTeamID)
                newGame.HomeTeam = team.Key;

            if(team.TeamID == newGame.AwayTeamID)
                newGame.AwayTeam = team.Key;
        })
        
        let tempDate = new Date (this.date);
        newGame.Day = tempDate.setDate(tempDate.getDate() + 1);

        this.addGame(newGame);

        this.hometeam = '';
        this.awayteam = '';
        this.homescore = '';
        this.awayscore = '';
        this.date = '';
        this.duration = '';
    }
    },
    async addGame(game){
      console.log(game);
      const res = await fetch('http://localhost:5000/games', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
         body: JSON.stringify(game),
      })
    }
  },
  mounted(){
      this.fillTeams(Teams);
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>