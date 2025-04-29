class Play {
  constructor(playData, playHere) {
    this.title = playData.title;
    this.acts = playData.acts.map(act => new Act(act));
    this.playHere = playHere; // Container element
  }
  
  // Display specific act and scene
  displayPlay(actName, sceneName) {
    this.playHere.innerHTML = '';
    
    const h2 = document.createElement('h2');
    h2.textContent = this.title;
    this.playHere.appendChild(h2);
    
    const article = document.createElement('article');
    article.setAttribute('id', 'actHere');
    
    const selectedAct = this.acts.find(act => act.name === actName);
    selectedAct.displayAct(article, sceneName);
    
    this.playHere.appendChild(article);
  }
}

class Act {
  constructor(actData) {
    this.name = actData.name;
    this.scenes = actData.scenes.map(scene => new Scene(scene));
  }
  
  // Display specific scene in act
  displayAct(container, sceneName) {
    const h3 = document.createElement('h3');
    h3.textContent = this.name;
    container.appendChild(h3);
    
    const div = document.createElement('div');
    div.setAttribute('id', 'sceneHere');
    
    const selectedScene = this.scenes.find(scene => scene.name === sceneName);
    selectedScene.displayScene(div);
    
    container.appendChild(div);
  }
}

class Scene {
  constructor(sceneData) {
    this.name = sceneData.name;
    this.title = sceneData.title;
    this.stageDirection = sceneData.stageDirection;
    this.speeches = sceneData.speeches;
  }
  
  // Display scene content
  displayScene(container) {
    const h4 = document.createElement('h4');
    h4.textContent = this.name;
    container.appendChild(h4);
    
    const p1 = document.createElement('p');
    p1.className = 'title';
    p1.textContent = this.title;
    container.appendChild(p1);
    
    const p2 = document.createElement('p');
    p2.className = 'direction';
    p2.textContent = this.stageDirection;
    container.appendChild(p2);
    
    // Render each speech
    this.speeches.forEach(speech => {
      const speechDiv = document.createElement('div');
      speechDiv.className = 'speech';
      
      const span = document.createElement('span');
      span.textContent = speech.speaker;
      speechDiv.appendChild(span);
      
      speech.lines.forEach(line => {
        const p = document.createElement('p');
        p.textContent = line;
        speechDiv.appendChild(p);
      });
      
      // Add stage direction if present
      if (speech.stagedir) {
        const em = document.createElement('em');
        em.textContent = speech.stagedir;
        speechDiv.appendChild(em);
      }
      
      container.appendChild(speechDiv);
    });
  }
}

export default Play;