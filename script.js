import Play from './play-module.js';

document.addEventListener("DOMContentLoaded", () => {
  const url = 'https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php';
  
  // DOM element references
  const playList = document.querySelector('#playList');
  const actList = document.querySelector('#actList');
  const sceneList = document.querySelector('#sceneList');
  const playHere = document.querySelector('#playHere');
  const playerList = document.querySelector('#playerList');
  const filterButton = document.querySelector('#btnHighlight');
  const inputBox = document.querySelector('#txtHighlight');
  
  let playData = {}; // Store fetched play data
  const playHereBackup = playHere.innerHTML; // Backup original HTML
  
  // Event: When a play is selected
  playList.addEventListener('change', async (e) => {
    const newUrl = url + `?name=${e.target.value}`;
    
    try {
      const response = await fetch(newUrl);
      const data = await response.json();
      
      // Clear previous options
      actList.innerHTML = '';
      sceneList.innerHTML = '';
      playerList.innerHTML = '';
      playData = data;
      
      if (Array.isArray(data.acts)) {
        let firstAct = true;
        
        data.acts.forEach(act => {
          populateSelectList(act.name, actList);
          
          if (firstAct) {
            let firstScene = true;
            
            act.scenes.forEach(scene => {
              populateSelectList(scene.name, sceneList);
              
              if (firstScene) {
                const display = new Play(playData, playHere);
                display.displayPlay(act.name, scene.name);
                firstScene = false;
              }
            });
            
            firstAct = false;
          }
        });
        
        // Populate player list
        populateSelectList('All Players', playerList);
        data.persona.forEach(p => {
          populateSelectList(p.player, playerList);
        });
      } else {
        inputBox.value = '';
        playHere.innerHTML = playHereBackup;
      }
    } catch (error) {
      console.error(error);
    }
  });
  
  // Event: When an act is selected
  actList.addEventListener('change', (e) => {
    const selectedAct = playData.acts.find(act => act.name === e.target.value);
    let firstScene = true;
    
    sceneList.innerHTML = '';
    
    selectedAct.scenes.forEach(scene => {
      populateSelectList(scene.name, sceneList);
      
      if (firstScene) {
        const display = new Play(playData, playHere);
        display.displayPlay(selectedAct.name, scene.name);
        firstScene = false;
      }
    });
  });
  
  // Event: When a scene is selected
  sceneList.addEventListener('change', (e) => {
    const selectedAct = playData.acts.find(act => act.name === actList.value);
    const selectedScene = selectedAct.scenes.find(scene => scene.name === e.target.value);
    const display = new Play(playData, playHere);
    display.displayPlay(selectedAct.name, selectedScene.name);
  });
  
  // Event: Filter speeches based on player and/or keyword
  filterButton.addEventListener('click', () => {
    const speeches = document.querySelectorAll('#sceneHere .speech');
    const searchKeyword = inputBox.value;
    const regex = new RegExp(searchKeyword, 'gi');
    
    speeches.forEach(speech => {
      const speaker = speech.querySelector('span').textContent;
      
      // Reset previous highlights
      speech.querySelectorAll('p').forEach(p => {
        p.innerHTML = p.textContent;
      });
      
      // Show/hide based on player
      if (playerList.value === 'All Players' || speaker === playerList.value || !Array.isArray(playData.persona)) {
        speech.style.display = 'block';
        
        // Highlight matching text
        speech.querySelectorAll('p').forEach(p => {
          p.innerHTML = p.textContent.replace(regex, match => `<b>${match}</b>`);
        });
      } else {
        speech.style.display = 'none';
      }
    });
  });
  
  // Utility function: Add option to select list
  function populateSelectList(content, selectList) {
    const option = document.createElement('option');
    option.textContent = content;
    option.value = content;
    selectList.appendChild(option);
  }
});