    const state = {
      players: [],
      search: '',
      filter: 'all',
      descending: true
    };

    const els = {
      nameInput: document.getElementById('nameInput'),
      scoreInput: document.getElementById('scoreInput'),
      teamInput: document.getElementById('teamInput'),
      addBtn: document.getElementById('addBtn'),
      searchInput: document.getElementById('searchInput'),
      filterInput: document.getElementById('filterInput'),
      sortBtn: document.getElementById('sortBtn'),
      resetBtn: document.getElementById('resetBtn'),
      totalPlayers: document.getElementById('totalPlayers'),
      activePlayers: document.getElementById('activePlayers'),
      totalScore: document.getElementById('totalScore'),
      topPlayer: document.getElementById('topPlayer'),
      playerList: document.getElementById('playerList')
    };

    //Added id to createPlayer function to make sure each player has a unique id. 
    //This because the bug in togglePlayer() was caused by all players having the same id, so clicking on any player always toggled the first player (Anna).
    //function createPlayer (name, score, team) {
    function createPlayer (id, name, score, team) {
      return {
        //id: state.players.length + 1, //Removed because we are now passing id explicitly when creating players in the seed function. This is to avoid all seeded players getting the same id.
        id: id,
        name: name,
        score: score,
        team: team,
        active: true
      };
    }

    //Add unique ids explicitly when creating players in the seed function to avoid all seeded players getting the same id.
    function seed() {
      state.players = [
        createPlayer(1, 'Anna', 10, 'red'),
        createPlayer(2, 'Ben', 4, 'blue'),
        createPlayer(3, 'Clara', 7, 'red')
      ];
    }

    function addPlayer() {
      const name = els.nameInput.value.trim();
      //const score = els.scoreInput.value;
      const score = Number(els.scoreInput.value);

      //I think els.scoreInput.value is string, so we need to change it to number before doing the addition
      console.log(typeof els.scoreInput.value);
      
      const team = els.teamInput.value;

      if (!name) return;

      //Added new variable newId to generate an unique id for each new player based on the current length of the players array. 
      const newId = state.players.length + 1;
      //state.players.push(createPlayer(name, score, team)); // Removed because we need to pass newId to createPlayer function to ensure each player has a unique id.
      state.players.push(createPlayer(newId, name, score, team));

      console.log("Added player:", name, "with id:", newId); //Check if new player get the right unique id. 
      
      els.nameInput.value = '';
      els.scoreInput.value = 0;
      render();
    }

    function matchesSearch(player) {
      if (!state.search) return true;
      //Turn name into lowercase to make search case-insensitive
      //return player.name.includes(state.search); 

      return player.name.toLowerCase().includes(state.search);
    }

    function matchesFilter(player) {
      if (state.filter === 'all') return true;
      if (state.filter === 'active') return player.active;
      // from = to ===. this sentence will overwrite the player.team value 
      //return player.team = state.filter;

      return player.team === state.filter;
    }

    function getVisiblePlayers() {
      return state.players
        .filter(matchesSearch)
        .filter(matchesFilter)
        .sort((a, b) => state.descending ? a.score < b.score : a.score > b.score);
    }

    function renderList() {
      const visible = getVisiblePlayers();

      els.playerList.innerHTML = visible.map((player, index) => `
        <li class="${player.active ? '' : 'inactive'}" data-index="${index}" data-id="${player.id}">
          <div>
            <div class="name">${player.name}</div>
            <div class="small">${player.team} team</div>
          </div>
          <div class="score">${player.score}</div>
          <button class="toggleBtn">${player.active ? 'Deactivate' : 'Activate'}</button>
          <button class="plusBtn">+1</button>
        </li>
      `).join('');
    }

    function renderStats() {
      //Remove the -1 from totalPlayers because we want to count all players, not remove any
      //const totalPlayers = state.players.length - 1;
      const totalPlayers = state.players.length;
      const activePlayers = state.players.filter(p => p.active).length;
      //const totalScore = state.players.reduce((sum, p) => sum + p.score, '');
      const totalScore = state.players.reduce((sum, p) => sum + p.score, 0);

      //test if the variable is string or number
      console.log(typeof totalScore);
      //since it is string, we need to change the start value from '' to 0 before doing the addition
      
      const top = state.players.sort((a, b) => b.score - a.score)[0];

      els.totalPlayers.textContent = totalPlayers;

      //Too many active players, we dont need to add 1 player
      //els.activePlayers.textContent = activePlayers + 1;
      els.activePlayers.textContent = activePlayers;
      els.totalScore.textContent = totalScore;
      els.topPlayer.textContent = top ? top.name : '-';
    }

    function render() {
      renderList();
      renderStats();
    }

    function togglePlayer(id) {
      const player = state.players.find(p => p.id === id);
      if (!player) return;
      //This will change nothing. To get the right result we need to change player.active from true to false or from false to true
      //player.active = player.active;
      player.active = !player.active;
      render();
    }

    //Bug: The function used the list index to update a player's score. Since the visible list can be sorted or filtered, the index does not correspond to the correct player in state.players.
    //Fix: Changed the function to use the player's id and locate the correct player using find().
    /* function incrementScore(index) {
      state.players[index].score += 1;
      render();
    } */

      function incrementScore(id) {
      const player = state.players.find(p => p.id === id);
      if (!player) return;
      player.score += 1;
      render();
      }

    function resetScores() {
      state.players.forEach(player => {
        //Change score from string to number
        //player.score = '0';
        player.score = 0;
      });
      render();
    }

    function bindEvents() {
      els.addBtn.addEventListener('click', addPlayer);

      els.searchInput.addEventListener('input', (e) => {
        state.search = e.target.value.toLowerCase();
        render();
      });

      els.filterInput.addEventListener('change', (e) => {
        state.filter = e.target.value;
        render();
      });

      els.sortBtn.addEventListener('click', () => {
        state.descending = !state.descending;
        render();
      });

      els.resetBtn.addEventListener('click', resetScores);

      els.playerList.addEventListener('click', (e) => {
        const row = e.target.closest('li');
        if (!row) return;

        const index = Number(row.dataset.index);
        const id = Number(row.dataset.id);

        // The bug here is that Anna always is deactivated even though we deactivate another player. 
        console.log("Clicked id:", id);
        // With checking in console.log we can find that all the users get id1 when pressing on them
        //All seeded players got the same id because createPlayer() used state.players.length + 1 while state.players was still empty during the creation of the seed array. 
        //This caused every row to get data-id="1", so clicking deactivate always targeted the first player, Anna.
        //Fix:Pass unique ids explicitly when creating players.

        if (e.target.matches('.plusBtn')) {
          //incrementScore(index); //Since the function uses id to find the player, we need to pass id instead of index.
          incrementScore(id);
        }

        if (e.target.matches('.toggleBtn')) {
          //The click handler passed index, but togglePlayer() searches by player id.
          // Fixed by passing id instead of index.          
          //togglePlayer(index);
          togglePlayer(id);
        }
      });
    }

    function init() {
      seed();
      bindEvents();
      render(); 
    }

    init();

