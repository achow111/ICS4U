<template>

   <div class="container">

      <div id="main" class="card card-body">

         <h2 class="title">National Basketball Association</h2> 

         <table class="table table-striped">
            <thead>
               <h5 class = "p-4" id = "division-title"></h5>
               <tr>
                  <th scope="col"></th>
                  <th scope="col">Team</th>
                  <th scope="col">W</th>
                  <th scope="col">L</th>
                  <th scope="col">Pct</th>
                  <th scope="col">GB</th> 
                  <th scope="col" class="hide">Conf</th>
                  <th scope="col" class="hide">Div</th>
                  <th scope="col" class="hide">Home</th>
                  <th scope="col" class="hide">Away</th>
                  <th scope="col" class="hide">L10</th>
                  <th scope="col">Streak</th>
               </tr>
            </thead>
            <tbody id="rows">
            </tbody>
         </table>

          <h5 class="text-center">Eastern Conference</h5>

         <nav aria-label="Page navigation example" class="pt-4">
            <ul id = "listing-table" class="pagination justify-content-center">
                <li class="page-item" id="btn_prev"><a class="page-link" v-on:click="prevPage()">Previous</a></li>
              <li class="page-item"><a class="page-link" v-on:click="changePage(1)">Atlantic</a></li>
              <li class="page-item"><a class="page-link" v-on:click="changePage(2)">Central</a></li>
              <li class="page-item"><a class="page-link" v-on:click="changePage(3)">SouthEast</a></li>
            </ul>
          </nav>

          <h5 class="text-center">Western Conference</h5>

          <nav aria-label="Page navigation example" class="pt-4">
            <ul id = "listing-table" class="pagination justify-content-center">
              <li class="page-item"><a class="page-link" v-on:click="changePage(4)">NorthWest</a></li>
              <li class="page-item"><a class="page-link" v-on:click="changePage(5)">Pacific</a></li>
              <li class="page-item"><a class="page-link" v-on:click="changePage(6)">SouthWest</a></li>
              <li class="page-item" id="btn_next"><a class="page-link" v-on:click="nextPage()">Next</a></li>
            </ul>
          </nav> 
      </div>
   </div>
</template>

<script>
import Teams from '@/assets/teams.json'

export default {
  name: 'Table',
  props: {
    scores: Array
   },
   components: {
    Teams
   },
  data() {
    return {
      currentPage: 1,
      numPages: 6,
      teams: [],
    }
  },
  methods: {
    createStandings(division) {
        document.querySelector('#rows').innerHTML = '';
        this.teams.forEach(team => { 
            if(team.div == division){
                let row = this.createRow(team);
                document.querySelector('#rows').appendChild(row); 
            }
        });
    },
    createRow(team) {
      let newRow = document.createElement('tr');
      newRow.setAttribute('scope', 'row');

      let newCell = document.createElement('td');
      let image = document.createElement('img');
      image.src = team.img;
      image.style.width = '50px';
      image.style.height = '50px';
      image.style.padding = 'none';
      newCell.appendChild(image);
      newRow.appendChild(newCell);
      newCell = document.createElement('td');
      newCell.appendChild(document.createTextNode(team.city + " " + team.name));
      newRow.appendChild(newCell);
      newCell = document.createElement('td');
      newCell.appendChild(document.createTextNode(team.wins[0]));
      newRow.appendChild(newCell);
      newCell = document.createElement('td');
      newCell.appendChild(document.createTextNode(team.losses[0]));
      newRow.appendChild(newCell);
      newCell = document.createElement('td');
      newCell.appendChild(document.createTextNode(team.pct));
      newRow.appendChild(newCell);
      newCell = document.createElement('td');
      newCell.appendChild(document.createTextNode(team.GB));
      newRow.appendChild(newCell);
      newCell = document.createElement('td');
      newCell.appendChild(document.createTextNode(team.wins[1] + "-" + team.losses[1]));
      newCell.classList.add('hide');
      newRow.appendChild(newCell);
      newCell = document.createElement('td');
      newCell.appendChild(document.createTextNode(team.wins[2] + "-" + team.losses[2]));
      newCell.classList.add('hide');
      newRow.appendChild(newCell);
      newCell = document.createElement('td');
      newCell.appendChild(document.createTextNode(team.wins[3] + "-" + team.losses[3]));
      newCell.classList.add('hide');
      newRow.appendChild(newCell);
      newCell = document.createElement('td');
      newCell.appendChild(document.createTextNode(team.wins[4] + "-" + team.losses[4]));
      newCell.classList.add('hide');
      newRow.appendChild(newCell);
      newCell = document.createElement('td');
      let l10win = 0;
      let l10loss = 0;
      team.lastTen.forEach( game => {
          if(game)
              l10win++
          else if(!game)
              l10loss++;
      })
      newCell.appendChild(document.createTextNode(l10win + "-" + l10loss));
      newCell.classList.add('hide');
      newRow.appendChild(newCell);
      newCell = document.createElement('td');
      if(team.wins[5] > 0)
          newCell.appendChild(document.createTextNode("W" + team.wins[5]));
      else 
          newCell.appendChild(document.createTextNode("L" + team.losses[5]));
      newRow.appendChild(newCell);
      return newRow;
 },
 createTeams(scores, teams){
    let league = [];

    Teams.forEach(team => {
        let oneTeam = {};
        oneTeam.city = team.City;
        oneTeam.name = team.Name;
        oneTeam.div = team.Division;
        oneTeam.conf = team.Conference;
        oneTeam.wins = this.getWins(teams, scores, team.TeamID);
        oneTeam.losses = this.getLosses(teams, scores, team.TeamID);
        oneTeam.pct = (oneTeam.wins[0]/(oneTeam.wins[0] + oneTeam.losses[0])).toFixed(3);
        oneTeam.GB = this.getGB(teams, scores, team.TeamID);
        oneTeam.lastTen = this.getLastTen(teams, scores, team.TeamID);
        oneTeam.img = team.Img;
        league.push(oneTeam);
    })

     console.log('Hi')

    league = league.sort((a, b) => a.GB - b.GB);

    return league;  
 },
  getStandings(page){
        let title = document.getElementById("division-title");

        if (page == 1) {
            title.innerHTML = 'Atlantic';
            this.createStandings("Atlantic");
        } else if (page == 2) {
            title.innerHTML = 'Central';
            this.createStandings("Central");
        } else if (page == 3) {
            title.innerHTML = 'SouthEast';
            this.createStandings("Southeast");
        } else if (page == 4) {
            title.innerHTML = 'NorthWest';
            this.createStandings("Northwest");
        } else if (page == 5) {
            title.innerHTML = 'Pacific';
            this.createStandings("Pacific");
        } else if (page == 6) {
            title.innerHTML = 'SouthWest';
            this.createStandings("Southwest"); 
        }
  } ,
  getLeagueLeader(teams, scores){
    let mostWins = 0;
    let leastLosses = 0;

    teams.forEach(team => {
        let wins = this.getWins(teams, scores, team.TeamID);
        let losses = this.getLosses(teams, scores, team.TeamID);

        if (wins[0] > mostWins){
            mostWins = wins[0];
            leastLosses = losses[0];
        }  
    })

    return [mostWins, leastLosses];
},
  getGB(teams, scores, ID){
    let leader = this.getLeagueLeader(teams, scores);

    let wins = this.getWins(teams, scores, ID);
    let losses = this.getLosses(teams, scores, ID);

    let GBwins = (leader[0] - wins[0]) * 0.5;
    let GBlosses = (losses[0] - leader[1]) * 0.5;

    return GBwins + GBlosses; 
},

getLastTen(teams, scores, ID){
    let lastTen = [];
    let start = 0;
    let remove = 0;

    scores.forEach(game => {
        if(game.Status != "Postponed"){
            let win = false;
            let lose = false;
            let increaseStart = false;

            if(game.HomeTeamID == ID){
                increaseStart = true;
                if(game.HomeTeamScore > game.AwayTeamScore){
                    lastTen.splice(start, remove, true);    
                }  else {
                    lastTen.splice(start, remove, false); 
                }
            } else if (game.AwayTeamID == ID) {
                increaseStart = true;
                if(game.HomeTeamScore < game.AwayTeamScore){
                    lastTen.splice(start, remove, true);  
                }  else {
                    lastTen.splice(start, remove, false);
                }
            }

            if(increaseStart){
                start++;
                increaseStart = false;
            }

            if(start >= 10){
                remove = 1;
                start = 0;
            }
        }
    })

    return lastTen;
},

getWins(teams, scores, ID){
    let wins = 0;
    let conferenceWins = 0;
    let divisionWins = 0;
    let homeWins = 0;
    let awayWins = 0;
    let streak = 0;
    let OpponentID;
    let countStreak = false;

    scores.forEach(game => {
        if(game.Status != "Postponed" && game.Status != "Canceled"){
        let win = false;

        if(game.HomeTeamID == ID){
            countStreak = true;
            if(game.HomeTeamScore > game.AwayTeamScore){
                win = true;
                homeWins++;
                OpponentID = game.AwayTeamID;       
            } 
        } else if (game.AwayTeamID == ID) {
            countStreak = true;
            if(game.HomeTeamScore < game.AwayTeamScore){
                 win = true;
                 awayWins++;
                 OpponentID = game.HomeTeamID; 
            } 
        }

        if(win){
            wins++;
            streak++;

            let div = 0;
            let opponentDiv = 1;
            let conf = 0;
            let opponentConf = 1;

            teams.forEach(team => {

                if(ID == team.TeamID){
                    div = team.Division;
                    conf = team.Conference;
                }

                if(OpponentID == team.TeamID){
                    opponentDiv = team.Division;
                    opponentConf = team.Conference;
                }
            })

            if(div == opponentDiv)
                divisionWins++;

            if(conf == opponentConf)
                conferenceWins++;

            countStreak = false;

        } else if (countStreak){
            streak = 0;
            countStreak = false;
        }
    }
    })

    return [wins, conferenceWins, divisionWins, homeWins, awayWins, streak];
},
getLosses(teams, scores, ID){
    let losses = 0;
    let conferenceLosses = 0;
    let divisionLosses = 0;
    let homeLosses = 0;
    let awayLosses = 0;
    let streak = 0;
    let countStreak = false;
    let OpponentID;

    scores.forEach(game => {
        if(game.Status != "Postponed" && game.Status != "Canceled"){
        let loss = false;

        if(game.HomeTeamID == ID){
            countStreak = true;
            if(game.HomeTeamScore < game.AwayTeamScore){
                loss = true;
                OpponentID = game.AwayTeamID;  
                homeLosses++;   
            }
        } else if (game.AwayTeamID == ID) {
            countStreak = true;
            if(game.HomeTeamScore > game.AwayTeamScore){
                 loss = true;
                 OpponentID = game.HomeTeamID; 
                 awayLosses++;
            }
        }

        if(loss){
            losses++;
            streak++;

            let div = 0;
            let opponentDiv = 1;
            let conf = 0;
            let opponentConf = 1;

            teams.forEach(team => {

                if(ID == team.TeamID){
                    div = team.Division;
                    conf = team.Conference;
                }

                if(OpponentID == team.TeamID){
                    opponentDiv = team.Division;
                    opponentConf = team.Conference;
                }
            })

            if(div == opponentDiv)
                divisionLosses++;

            if(conf == opponentConf)
                conferenceLosses++;

            countStreak = false;
        } else if(countStreak) {
            streak = 0;
            countStreak = false;
        }
    }
    })

    return [losses, conferenceLosses, divisionLosses, homeLosses, awayLosses, streak];
},
  prevPage()
{
    if (this.currentPage > 1) {
        this.currentPage--;
        this.changePage(this.currentPage);
    }
},

nextPage()
{
    if (this.currentPage < this.numPages) {
        this.currentPage++;
        this.changePage(this.currentPage);
    }
},

changePage(page)
{
    let  btn_next = document.getElementById("btn_next");
    let btn_prev = document.getElementById("btn_prev");

    if (page < 1) page = 1;
    if (page > this.numPages) page = this.numPages;

    document.querySelector('#rows').innerHTML = '';
    this.currentPage = page;
    this.getStandings(page);

    if (page == 1) {
        btn_prev.classList.add('invisible');
    } else {
        btn_prev.classList.remove('invisible');
    }

    if (page == this.numPages) {
        btn_next.classList.add('invisible');
    } else {
        btn_next.classList.remove('invisible');
    }
},
async fetchGames() {
      const res = await fetch('http://localhost:5000/games')

      const data = await res.json()

      return data
    }
  },
  mounted(){
    this.fetchGames().then(data => {
        this.teams = this.createTeams(data, Teams);
        this.changePage(1); 
    });
  
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@media (max-width: 768px) {
    .hide{
        display: none;
    }
}
</style>
