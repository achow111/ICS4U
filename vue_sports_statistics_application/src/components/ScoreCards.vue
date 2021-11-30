<template>
   <div class="container">
      <nav aria-label="Page navigation example" class="pt-4">
         <ul id = "scores-table" class="pagination justify-content-center">
            <li class="page-item"><a class="page-link" v-on:click="changeToFirst()">First</a></li>
            <li class="page-item" id="btn_prev"><a class="page-link" v-on:click="prevPage()">Prev</a></li>
            <li class="page-item" id="btn_next"><a class="page-link" v-on:click="nextPage()">Next</a></li>
            <li class="page-item"><a class="page-link" v-on:click="changeToLast()">Last</a></li>
         </ul>
      </nav>
      <div id="container">

      </div>
   </div>
</template>

<script>
import Teams from '@/assets/teams.json'

export default {
  name: 'ScoreCards',
   components: {
    Teams
   },
  data() {
    return {
      page: 0,
      dates: [],
      games: [],
      options: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    }
  },
  methods: {
    prevPage() {

      if (this.page > 0) {
        this.page--;
        this.changePage(this.page, this.dates);
      }
    },

    nextPage() {

      if (this.page < this.dates.length - 1) {
        this.page++;
        this.changePage(this.page, this.dates);
      }
    },

    changeToFirst(){
      this.page = 0;

      this.changePage(this.page, this.dates);
    },

    changeToLast(){
        this.page = this.dates.length - 1;

        this.changePage(this.page, this.dates);
    },

    changePage(page, dates){
    
    let btn_next = document.getElementById("btn_next");
    let btn_prev = document.getElementById("btn_prev");

    if (page < 0) page = 0;
    if (page > dates.length - 1) page = dates.length - 1;

    this.page = page;
    document.querySelector('#container').innerHTML = '';
    this.displayScores(dates[page]);

    if (page == 0) {
        btn_prev.classList.add('invisible');
    } else {
        btn_prev.classList.remove('invisible');
    }

    if (page == dates.length - 1) {
        btn_next.classList.add('invisible');
    } else {
        btn_next.classList.remove('invisible');
    }
},

getDates(){

    let dates = [];
    let dates2 = [];
    let lastDay = new Date ();

   this.games.forEach(date => {
        let day =  new Date (date.Day);

        if(day.getTime() != lastDay.getTime()){
            dates.push(day);
            lastDay = day;
        }
    })

    dates = dates.sort((a, b) => a - b);

    let previous = new Date ();

    dates.forEach(date => {
        previous = previous.toLocaleDateString("en-US", this.options);

        if(previous != date.toLocaleDateString("en-US", this.options))
            dates2.push(date.toLocaleDateString("en-US", this.options));
        previous = date;
    })

    return dates2;
},

displayScores(date){

        let container = document.querySelector("#container");
        let lastDate = 0;

        let day = new Date(date);
        day = day.toLocaleDateString("en-US", this.options);

       this.games.forEach((game) => {
            let currentDay = new Date(game.Day)
            currentDay = currentDay.toLocaleDateString("en-US", this.options);
            if(day == currentDay){
                let card = document.createElement("div");
                card.classList.add("card", "m-3");

                let body = document.createElement("div");
                body.classList.add("card-body");

                let row = document.createElement("div");
                row.classList.add("row");

                let teams = document.createElement("div");
                teams.classList.add("col", "text-center" ,"my-auto");

                let image1 = document.createElement("img");
                Teams.forEach(team => {
                    if(game.HomeTeamID == team.TeamID)
                        image1.src = team.Img;
                })
                image1.style.width ='75px';
                image1.style.height ='75px';

                let image2 = document.createElement("img");
                Teams.forEach(team => {
                    if(game.AwayTeamID == team.TeamID)
                        image2.src = team.Img;
                })
                image2.style.width ='75px';
                image2.style.height ='75px'; 

                let team1 = document.createElement("h5");
                team1.innerHTML = game.HomeTeam;
                let team2 = document.createElement("h5");
                team2.innerHTML = game.AwayTeam;

                let currentWins = this.getWins(this.games, game.HomeTeamID, game.Day);
                let currentLosses = this.getLosses(this.games, game.HomeTeamID, game.Day);

                let record1 = document.createElement("h8");
                record1.classList.add("mb-5");
                record1.innerHTML = currentWins + "-" + currentLosses;

                currentWins = this.getWins(this.games, game.AwayTeamID, game.Day);
                currentLosses = this.getLosses(this.games, game.AwayTeamID, game.Day);

                let record2 = document.createElement("h8");
                record2.innerHTML = currentWins + "-" + currentLosses;

                let lineBreak = document.createElement("br");
                
                teams.appendChild(image1);
                teams.appendChild(team1);
                teams.appendChild(record1);
                teams.appendChild(lineBreak);
                teams.appendChild(image2);
                teams.appendChild(team2);
                teams.appendChild(record2);

                let scores = document.createElement("div");
                scores.classList.add("col", "text-center" ,"my-auto");

                let score1 = document.createElement("h5");
                score1.classList.add("mb-5");
                score1.innerHTML = game.HomeTeamScore;
                let score2 = document.createElement("h5");
                score2.classList.add("mt-5");
                score2.innerHTML = game.AwayTeamScore;
                scores.appendChild(score1);
                scores.appendChild(score2);

                let status = document.createElement("div");
                status.classList.add("col", "text-center", "my-auto", "border-start", "border-primary");

                let duration = document.createElement("h3");
                duration.innerHTML = game.Status;
                status.appendChild(duration);

                let checkDate = new Date(game.Day);
                checkDate = checkDate.toLocaleDateString("en-US", this.options);

                if(checkDate != lastDate){
                    lastDate = checkDate;
                    let displayDate = document.createElement("h2");
                    displayDate.classList.add("my-3");
                    let abbreviatedDate = new Date (checkDate);
                    displayDate.innerHTML = abbreviatedDate.toLocaleDateString("en-US", this.options);
                    container.appendChild(displayDate);
                }

                row.appendChild(teams);
                row.appendChild(scores);
                row.appendChild(status);
                body.appendChild(row);
                card.appendChild(body);
                container.appendChild(card);
            }
        })
    },
    getWins(scores, ID, date){
    let wins = 0;
    let gameDate = new Date(date);

    scores.forEach(game => {
      let currentDate = new Date(game.Day);
      if(currentDate <= gameDate){
        if(game.Status != "Postponed"){

        if(game.HomeTeamID == ID){
            if(game.HomeTeamScore > game.AwayTeamScore){
                wins++;   
            } 
        } else if (game.AwayTeamID == ID) {
            if(game.HomeTeamScore < game.AwayTeamScore){
                 wins++;
            } 
        }
        }
      }
    })
    
    return wins;
},
getLosses(scores, ID, date){
    let losses = 0;
    let gameDate = new Date(date);

    scores.forEach(game => {
      let currentDate = new Date(game.Day);
      if(currentDate <= gameDate){
        if(game.Status != "Postponed"){

        if(game.HomeTeamID == ID){
            if(game.HomeTeamScore < game.AwayTeamScore){
                losses++;  
            }
        } else if (game.AwayTeamID == ID) {
            if(game.HomeTeamScore > game.AwayTeamScore){
                losses++;
            }
        }
        }
      } 
    })
      return losses;
},
    async fetchGames() {
      const res = await fetch('http://localhost:5000/games')

      const data = await res.json()

      return data
    }
  },
  created(){
    this.fetchGames().then(data => {
      this.games = data;
      this.dates = this.getDates(data);
      this.changePage(this.page, this.dates); 
    });
  
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>