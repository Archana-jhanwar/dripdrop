let isPaused = false;
let isMuted = false;
let level = 1;
const maxLevel = 30;
const pourSound = document.getElementById("pourSound");
const completeSound = document.getElementById("completeSound");
let gameData = [];
let selectedTube = null;

function getColor(code) {
  const colors = {
    color0: "red",
    color1: "blue",
    color2: "green",
    color3: "orange",
    color4: "purple",
    color5: "yellow",
    color6: "pink",
    color7: "brown"
  };
  return colors[code] || "gray";
}

function generateLevel(levelNumber) {
  const baseColors = Math.min(2 + Math.floor(levelNumber / 4), 8);
  const totalTubes = baseColors + 2;
  const emptyTubes = levelNumber >= 10
    ? Math.min(2 + Math.floor((levelNumber - 10) / 5), 3)
    : 1;
  const blocks = [];

  for (let i = 0; i < baseColors; i++) {
    for (let j = 0; j < 4; j++) {
      blocks.push("color" + i);
    }
  }

  blocks.sort(() => Math.random() - 0.5);
  const tubes = Array.from({ length: totalTubes }, () => []);
  for (const color of blocks) {
    let placed = false;
    while (!placed) {
      const rand = Math.floor(Math.random() * (totalTubes - emptyTubes));
      if (tubes[rand].length < 4) {
        tubes[rand].push(color);
        placed = true;
      }
    }
  }
  return tubes;
}

function createGame(currentLevel) {
  const container = document.getElementById("game");
  const levelTitle = document.getElementById("level-title");
  const message = document.getElementById("message");

  container.innerHTML = "";
  message.textContent = "";
  levelTitle.textContent = `Level ${currentLevel}`;
  gameData = generateLevel(currentLevel);

  gameData.forEach((tubeColors, index) => {
    const tube = document.createElement("div");
    tube.className = "tube";
    tube.dataset.index = index;
    tube.onclick = () => selectTube(index);

    tubeColors.forEach(color => {
      const div = document.createElement("div");
      div.className = "color";
      div.style.background = getColor(color);
      tube.appendChild(div);
    });

    container.appendChild(tube);
  });
}

function selectTube(index) {
  if (isPaused) return;

  if (selectedTube === null) {
    selectedTube = index;
  } else {
    if (selectedTube !== index) {
      moveColor(selectedTube, index);
    }
    selectedTube = null;
  }
}

function moveColor(fromIndex, toIndex) {
  const from = gameData[fromIndex];
  const to = gameData[toIndex];

  if (from.length === 0 || to.length >= 4) return;

  const topColor = from[from.length - 1];
  const canMove = to.length === 0 || to[to.length - 1] === topColor;

  if (canMove) {
    from.pop();
    to.push(topColor);
    if (!isMuted) pourSound.play();
    refreshTubes();
    checkLevelComplete();
  }
}

function refreshTubes() {
  const tubes = document.querySelectorAll(".tube");
  tubes.forEach((tube, index) => {
    tube.innerHTML = "";
    gameData[index].forEach(color => {
      const div = document.createElement("div");
      div.className = "color";
      div.style.background = getColor(color);
      tube.appendChild(div);
    });
  });
}

function checkLevelComplete() {
  const completed = gameData.every(tube =>
    tube.length === 0 || (new Set(tube).size === 1 && tube.length === 4)
  );

  if (completed) {
    if (!isMuted) completeSound.play();
    document.getElementById("message").textContent = `Level ${level} Completed!`;

    setTimeout(() => {
      level++;
      if (level <= maxLevel) {
        createGame(level);
      } else {
        document.getElementById("message").textContent = "You finished all 30 levels!";
      }
    }, 1500);
  }
}

function pauseGame() {
  isPaused = true;
}

function resumeGame() {
  isPaused = false;
}

function toggleMute() {
  isMuted = !isMuted;
  const btn = document.getElementById("muteBtn");
  btn.textContent = isMuted ? "🔇 Sound Off" : "🔊 Sound On";
}

createGame(level);