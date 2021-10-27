//localStorage.clear();

const allGamesString = localStorage.getItem('storedAllGames');

let allGames;
let allTeams;

async function getAllGames() {
    const res = await fetch('scores2.json');
    const data = await res.json();
    return data;
 }

 getAllGames().then(data => { 
    if(allGamesString != null){
        allGames = JSON.parse(allGamesString);
    } else {
        allGames = data;
    }
  });

  async function getTeams() {
    const res = await fetch('teams.json');
    const data = await res.json();
    return data;
 }

 getTeams().then(data => { 
        allTeams = data;
  });
    
try {
let form = document.getElementById("score-form");
form.addEventListener('submit', addScore);
} catch (err){}

function addScore(e){
    e.preventDefault();
    let score = {};

    let homeTeamID = document.getElementById("home-team").value;
    let homeTeamScore = document.getElementById("home-score").value;
    let awayTeamID = document.getElementById("away-team").value;
    let awayTeamScore = document.getElementById("away-score").value;
    let day = document.getElementById("date").value;
    let errMsg = document.getElementById("err-msg");
    let status = document.getElementById("duration").value;

    errMsg.innerHTML = ' ';

    if(homeTeamID == "Choose a Team"){
        errMsg.appendChild(document.createTextNode("*Please select a Home Team"));
    } else if(awayTeamID == "Choose a Team"){
        errMsg.appendChild(document.createTextNode("*Please select an Away Team"));
    } else if(homeTeamScore == "" || homeTeamScore < 0){
        errMsg.appendChild(document.createTextNode("*Please select a valid Home Score"));
    } else if(awayTeamScore == "" || awayTeamScore < 0){
        errMsg.appendChild(document.createTextNode("*Please select a valid Away Score"));
    } else if(day == ""){
        errMsg.appendChild(document.createTextNode("*Please select a valid Day"));
    } else if (status == "Duration of the Game") {
        errMsg.appendChild(document.createTextNode("*Please select a valid Duration"));
    } else if (homeTeamID == awayTeamID) {
        errMsg.appendChild(document.createTextNode("*Home and Away teams cannot be the same"));
    } else if (homeTeamScore == awayTeamScore) {
        errMsg.appendChild(document.createTextNode("*Home and Away scores cannot be the same"));
    } else {
        score.HomeTeamID = parseInt(document.getElementById("home-team").value, 10);
        score.HomeTeamScore = parseInt(document.getElementById("home-score").value, 10);
        score.AwayTeamID = document.getElementById("away-team").value;
        score.AwayTeamScore = document.getElementById("away-score").value;

        allTeams.forEach(team => {
            if(team.TeamID == score.HomeTeamID)
                score.HomeTeam = team.Key;

            if(team.TeamID == score.AwayTeamID)
                score.AwayTeam = team.Key;
        })
        
        let tempDate = new Date (day);
        score.Day = tempDate.setDate(tempDate.getDate() + 1);
        score.Status = document.getElementById("duration").value;

        allGames.push(score);

        storeData();

        document.getElementById("home-team").value = null;
        document.getElementById("home-score").value = null;
        document.getElementById("away-team").value = null;
        document.getElementById("away-score").value = null;
        document.getElementById("date").value = null;
        document.getElementById("duration").value = null;

        console.log(score);
    }
}

function storeData() {
    localStorage.setItem('storedAllGames', JSON.stringify(allGames));
    console.log(allGames);
}


  function getStandings(page){
        try{
        let title = document.getElementById("division-title");

        if (page == 1) {
            title.innerHTML = 'Atlantic';
            createStandings(allGames, allTeams, "Atlantic");
        } else if (page == 2) {
            title.innerHTML = 'Central';
            createStandings(allGames, allTeams, "Central");
        } else if (page == 3) {
            title.innerHTML = 'SouthEast';
            createStandings(allGames, allTeams, "Southeast");
        } else if (page == 4) {
            title.innerHTML = 'NorthWest';
            createStandings(allGames, allTeams, "Northwest");
        } else if (page == 5) {
            title.innerHTML = 'Pacific';
            createStandings(allGames, allTeams, "Pacific");
        } else if (page == 6) {
            title.innerHTML = 'SouthWest';
            createStandings(allGames, allTeams, "Southwest"); 
        }
    } catch(err){}
} 

function createStandings(scores, data, division) {
    document.querySelector('#rows').innerHTML = '';
    let teams = createTeams(scores, data);
    console.log(teams);
    teams.forEach(team => { 
         if(team.div == division){
             let row = createRow(team);
             document.querySelector('#rows').appendChild(row); 
         }
     });
 }

 function createTeams(scores, teams){
    let league = [];

    teams.forEach(team => {
        let oneTeam = {};
        oneTeam.city = team.City;
        oneTeam.name = team.Name;
        oneTeam.div = team.Division;
        oneTeam.conf = team.Conference;
        oneTeam.wins = getWins(teams, scores, team.TeamID, false, 0);
        oneTeam.losses = getLosses(teams, scores, team.TeamID);
        oneTeam.pct = (oneTeam.wins[0]/(oneTeam.wins[0] + oneTeam.losses[0])).toFixed(3);
        oneTeam.GB = getGB(teams, scores, team.TeamID);
        oneTeam.lastTen = getLastTen(teams, scores, team.TeamID);
        oneTeam.img = team.Img;
        league.push(oneTeam);
    })

    league = league.sort((a, b) => a.GB - b.GB);

    return league;  
 }

 function createRow(team) {
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
 }
 

 setTimeout(function(){ getStandings(1) }, 50);

function getHomeTeam(){
        try{
        let select = document.querySelector("#home-team");
        allTeams.forEach((team) => {
            let option = document.createElement("option");
            option.value = team.TeamID;
            option.text = team.City + ' ' + team.Name;
            select.appendChild(option);
        })
    }catch(err){}
}

setTimeout(function(){ getHomeTeam() }, 50);

function getAwayTeam(){
        try{
        let select = document.querySelector("#away-team");
        allTeams.forEach((team) => {
            let option = document.createElement("option");
            option.value = team.TeamID;
            option.text = team.City + ' ' + team.Name;
            select.appendChild(option);
        })
    }catch(err){}
}

setTimeout(function(){ getAwayTeam() }, 50);

let scoresPage = 1;

function prevPage2() {

        if (scoresPage > 0) {
            scoresPage--;
            changePage2(scoresPage, dates);
        }
}

function nextPage2() {

        if (scoresPage < dates.length - 1) {
            scoresPage++;
            changePage2(scoresPage, dates);
        }
    }

function changeToFirst(){
        scoresPage  = 0;

        changePage2(scoresPage, dates);
}

function changeToLast(){
        scoresPage = dates.length - 1;

        changePage2(scoresPage, dates);
}

function changePage2(page, dates)
{
    try{
    let btn_next = document.getElementById("btn_next");
    let btn_prev = document.getElementById("btn_prev");

    if (page < 0) page = 0;
    if (page > dates.length - 1) page = dates.length - 1;

    currentPage = page;
    document.querySelector('#container').innerHTML = '';
    displayScores(dates[page]);

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
    }catch(err){}
}

function sortAllGames(){
    allGames.sort((a,b) => {

        return a.Day
    })
}

setTimeout(function(){ sortAllGames()}, 50);

function getDates(scores){
    try{

    let dates = [];
    let dates2 = [];
    let lastDay = new Date ();

    allGames.forEach(date => {
        let day =  new Date (date.Day);

        if(day.getTime() != lastDay.getTime()){
            dates.push(day);
            lastDay = day;
        }
    })

    dates = dates.sort((a, b) => a - b);

    let previous = new Date ();

    dates.forEach(date => {
        previous = previous.toLocaleDateString("en-US", options);

        if(previous != date.toLocaleDateString("en-US", options))
            dates2.push(date.toLocaleDateString("en-US", options));
        previous = date;
    })

    console.log(dates2);
    return dates2;
}catch(err){}
}

let dates;

setTimeout(function(){ dates = getDates(allGames) }, 50);

function callPageChange(page){
        changePage2(page, dates);
}

setTimeout(function(){ callPageChange(0) }, 50);

 let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

function displayScores(date){

        let container = document.querySelector("#container");
        let lastDate = 0;

        let day = new Date(date);
        day = day.toLocaleDateString("en-US", options);

        allGames.forEach((game) => {
            let currentDay = new Date(game.Day)
            currentDay = currentDay.toLocaleDateString("en-US", options);
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
                allTeams.forEach(team => {
                    if(game.HomeTeamID == team.TeamID)
                        image1.src = team.Img;
                })
                image1.style.width ='75px';
                image1.style.height ='75px';
                let image2 = document.createElement("img");
                allTeams.forEach(team => {
                    if(game.AwayTeamID == team.TeamID)
                        image2.src = team.Img;
                })
                image2.style.width ='75px';
                image2.style.height ='75px'; 

                let team1 = document.createElement("h5");
                team1.innerHTML = game.HomeTeam;
                let team2 = document.createElement("h5");
                team2.innerHTML = game.AwayTeam;

                let currentWins = getWins(allTeams, allGames, game.HomeTeamID, true, game.Day);
                let currentLosses = getLosses(allTeams, allGames, game.HomeTeamID, true, game.Day)

                let record1 = document.createElement("h8");
                record1.classList.add("mb-5");
                record1.innerHTML = currentWins + "-" + currentLosses;

                currentWins = getWins(allTeams, allGames, game.AwayTeamID, true, game.Day);
                currentLosses = getLosses(allTeams, allGames, game.AwayTeamID, true, game.Day)

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
                checkDate = checkDate.toLocaleDateString("en-US", options);

                if(checkDate != lastDate){
                    lastDate = checkDate;
                    displayDate = document.createElement("h2");
                    displayDate.classList.add("my-3");
                    let abbreviatedDate = new Date (checkDate);
                    displayDate.innerHTML = abbreviatedDate.toLocaleDateString("en-US", options);
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
}

function getLeagueLeader(teams, scores){
    let mostWins = 0;
    let leastLosses = 0;

    teams.forEach(team => {
        let wins = getWins(teams, scores, team.TeamID, false, 0);
        let losses = getLosses(teams, scores, team.TeamID, false, 0);

        if (wins[0] > mostWins){
            mostWins = wins[0];
            leastLosses = losses[0];
        }  
    })

    return [mostWins, leastLosses];
}

function getGB(teams, scores, ID){
    let leader = getLeagueLeader(teams, scores);

    let wins = getWins(teams, scores, ID, false, 0);
    let losses = getLosses(teams, scores, ID, false, 0);

    let GBwins = (leader[0] - wins[0]) * 0.5;
    let GBlosses = (losses[0] - leader[1]) * 0.5;

    return GBwins + GBlosses; 
}

function getLastTen(teams, scores, ID){
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
}

function getWins(teams, scores, ID, getDate, date){
    let wins = 0;
    let conferenceWins = 0;
    let divisionWins = 0;
    let homeWins = 0;
    let awayWins = 0;
    let streak = 0;
    let currentWins = 0;
    let OpponentId;
    let countStreak = false;

    scores.forEach(game => {
        if(game.Status != "Postponed"){
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
        if(getDate){
            let currentDate = new Date(game.Day);
            let gameDate = new Date(date);

            if(currentDate <= gameDate)
                currentWins = wins;
            
        }
    })

    if(getDate)
        return currentWins;

    return [wins, conferenceWins, divisionWins, homeWins, awayWins, streak];
}

function getLosses(teams, scores, ID, getDate, date){
    let losses = 0;
    let conferenceLosses = 0;
    let divisionLosses = 0;
    let homeLosses = 0;
    let awayLosses = 0;
    let currentLosses = 0;
    let streak = 0;
    let countStreak = false;
    let OpponentId;

    scores.forEach(game => {
        if(game.Status != "Postponed"){
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
        if(getDate){
            let currentDate = new Date(game.Day);
            let gameDate = new Date(date);

            if(currentDate <= gameDate)
                currentLosses = losses;
            
        }
    })

    if(getDate)
        return currentLosses;

    return [losses, conferenceLosses, divisionLosses, homeLosses, awayLosses, streak];
}

let currentPage = 1;
let numPages = 6;

function prevPage()
{
    if (currentPage > 1) {
        currentPage--;
        changePage(currentPage);
    }
}

function nextPage()
{
    if (currentPage < numPages) {
        currentPage++;
        changePage(currentPage);
    }
}

function changePage(page)
{
    try{
    var btn_next = document.getElementById("btn_next");
    var btn_prev = document.getElementById("btn_prev");

    if (page < 1) page = 1;
    if (page > numPages) page = numPages;

    document.querySelector('#rows').innerHTML = '';
    currentPage = page;
    getStandings(page);

    if (page == 1) {
        btn_prev.classList.add('invisible');
    } else {
        btn_prev.classList.remove('invisible');
    }

    if (page == numPages) {
        btn_next.classList.add('invisible');
    } else {
        btn_next.classList.remove('invisible');
    }
} catch(err) {}
}

changePage(1);