"use strict";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const miniMap = document.getElementById("miniMap");
const mapCtx = miniMap.getContext("2d");

const ui = {
  hpText: document.getElementById("hpText"),
  hpFill: document.getElementById("hpFill"),
  levelText: document.getElementById("levelText"),
  formText: document.getElementById("formText"),
  typeText: document.getElementById("typeText"),
  expFill: document.getElementById("expFill"),
  timerText: document.getElementById("timerText"),
  stageText: document.getElementById("stageText"),
  evoGaugeText: document.getElementById("evoGaugeText"),
  dataGrid: document.getElementById("dataGrid"),
  skillList: document.getElementById("skillList"),
  levelPanel: document.getElementById("levelPanel"),
  upgradeChoices: document.getElementById("upgradeChoices"),
  evolutionOverlay: document.getElementById("evolutionOverlay"),
  evoName: document.getElementById("evoName"),
  codexPanel: document.getElementById("codexPanel"),
  codexEntries: document.getElementById("codexEntries"),
  codexButton: document.getElementById("codexButton"),
  closeCodex: document.getElementById("closeCodex"),
  gameOverPanel: document.getElementById("gameOverPanel"),
  resultTitle: document.getElementById("resultTitle"),
  resultText: document.getElementById("resultText"),
  restartButton: document.getElementById("restartButton"),
  touchStick: document.getElementById("touchStick"),
  touchKnob: document.getElementById("touchKnob"),
  touchPause: document.getElementById("touchPause"),
  touchCodex: document.getElementById("touchCodex")
};

const DATA_TYPES = ["Vaccine", "Data", "Virus", "Free"];

const STAGES = [
  { name: "Data Shore", color: "#32d5ff", enemyBias: ["Free", "Data"] },
  { name: "Network City", color: "#ffdf5c", enemyBias: ["Data", "Vaccine"] },
  { name: "Server Ruins", color: "#9f7bff", enemyBias: ["Virus", "Data"] },
  { name: "Deep Digital World", color: "#ff3e71", enemyBias: ["Virus", "Vaccine"] }
];

const FORMS = [
  {
    id: "botamon",
    name: "Botamon",
    stage: "Fresh",
    type: "Free",
    desc: "黒い幼年期データ。未知の進化分岐を多く持つ。",
    condition: "初期登録",
    color: "#7cffe9",
    radius: 17
  },
  {
    id: "agumon",
    name: "Agumon",
    stage: "Rookie",
    type: "Vaccine",
    desc: "攻撃データを多く吸収した小型恐竜型。",
    condition: "Vaccine 18 / Power 2",
    color: "#ffb340",
    radius: 22
  },
  {
    id: "gabumon",
    name: "Gabumon",
    stage: "Rookie",
    type: "Data",
    desc: "速度と回避ログが高い獣型データ。",
    condition: "Data 18 / Speed 2",
    color: "#65d9ff",
    radius: 22
  },
  {
    id: "devimon",
    name: "Devimon",
    stage: "Champion",
    type: "Virus",
    desc: "ウイルス片を抱え込み、範囲攻撃へ特化した成熟期。",
    condition: "Virus 26 / Area 2",
    color: "#b178ff",
    radius: 27
  },
  {
    id: "metalgreymon",
    name: "MetalGreymon",
    stage: "Ultimate",
    type: "Vaccine",
    desc: "ボスデータを解析し、機械化装甲を得た完全体。",
    condition: "Vaccine 42 / Boss 1 / Power 3",
    color: "#ff6a3d",
    radius: 32
  },
  {
    id: "machinedramon",
    name: "Machinedramon",
    stage: "Mega",
    type: "Virus",
    desc: "深層サーバーの破損コードを制御する究極体。",
    condition: "Virus 54 / Boss 2 / Area 3",
    color: "#ff3e71",
    radius: 38
  }
];

const UPGRADES = [
  { id: "power", name: "Attack Kernel", desc: "攻撃力 +18%。Vaccine 進化へ寄る。", type: "Vaccine" },
  { id: "speed", name: "Clock Boost", desc: "移動速度 +12%。Data 進化へ寄る。", type: "Data" },
  { id: "area", name: "Wide Bus", desc: "攻撃範囲 +16%。Virus 進化へ寄る。", type: "Virus" },
  { id: "regen", name: "Repair Thread", desc: "HPを回復し最大HP +10。Free 進化へ寄る。", type: "Free" },
  { id: "cooldown", name: "Async Cast", desc: "攻撃間隔 -10%。Data 進化へ寄る。", type: "Data" },
  { id: "magnet", name: "Data Magnet", desc: "データ吸収範囲 +24%。Free 進化へ寄る。", type: "Free" }
];

const SPRITES = Object.fromEntries(FORMS.map((form) => [form.id, `assets/sprites/${form.id}.png`]));
const spriteImages = new Map();

function preloadSpriteImages() {
  for (const [id, src] of Object.entries(SPRITES)) {
    const image = new Image();
    image.src = src;
    spriteImages.set(id, image);
  }
}

const ENEMY_ARCHETYPES = {
  Vaccine: { color: "#75ff9e", hp: 18, speed: 52, xp: 5 },
  Data: { color: "#4ff6ff", hp: 15, speed: 66, xp: 5 },
  Virus: { color: "#ff3e71", hp: 22, speed: 44, xp: 7 },
  Free: { color: "#ffe66b", hp: 12, speed: 58, xp: 4 }
};

const keys = new Set();
const touchMove = { x: 0, y: 0, activeId: null };
let lastTime = performance.now();
let pausedForChoice = false;
let evolutionLock = false;
let gameEnded = false;
let audioCtx = null;

const state = createInitialState();

function createInitialState() {
  return {
    elapsed: 0,
    worldSize: 2600,
    shake: 0,
    player: {
      x: 1300,
      y: 1300,
      hp: 100,
      maxHp: 100,
      level: 1,
      xp: 0,
      xpNext: 18,
      formId: "botamon",
      speed: 178,
      attack: 20,
      range: 165,
      cooldown: 0.72,
      cooldownLeft: 0,
      magnet: 84,
      skills: []
    },
    data: { Vaccine: 0, Data: 0, Virus: 0, Free: 0 },
    upgradeCounts: { power: 0, speed: 0, area: 0, regen: 0, cooldown: 0, magnet: 0 },
    bossesDefeated: 0,
    enemies: [],
    projectiles: [],
    pickups: [],
    particles: [],
    discovered: loadCodex(),
    bossTimer: 60,
    spawnTimer: 0,
    stageIndex: 0
  };
}

state.discovered.botamon = true;
saveCodex();

function resetGame() {
  const fresh = createInitialState();
  Object.keys(state).forEach((key) => delete state[key]);
  Object.assign(state, fresh);
  state.discovered.botamon = true;
  saveCodex();
  pausedForChoice = false;
  evolutionLock = false;
  gameEnded = false;
  ui.levelPanel.classList.add("hidden");
  ui.evolutionOverlay.classList.add("hidden");
  ui.gameOverPanel.classList.add("hidden");
  lastTime = performance.now();
}

function loadCodex() {
  try {
    return JSON.parse(localStorage.getItem("digivice-survivor-codex") || "{}");
  } catch {
    return {};
  }
}

function saveCodex() {
  localStorage.setItem("digivice-survivor-codex", JSON.stringify(state.discovered));
}

function currentForm() {
  return FORMS.find((form) => form.id === state.player.formId) || FORMS[0];
}

function currentStage() {
  return STAGES[state.stageIndex] || STAGES[0];
}

function playTone(freq, duration, type = "square", gain = 0.035) {
  if (!audioCtx) {
    return;
  }
  const osc = audioCtx.createOscillator();
  const amp = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  amp.gain.value = gain;
  osc.connect(amp);
  amp.connect(audioCtx.destination);
  osc.start();
  amp.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
  osc.stop(audioCtx.currentTime + duration);
}

function startAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function spawnEnemy(forceBoss = false) {
  const stage = currentStage();
  const angle = Math.random() * Math.PI * 2;
  const distance = 520 + Math.random() * 260;
  const type = forceBoss ? stage.enemyBias[1] : stage.enemyBias[Math.floor(Math.random() * stage.enemyBias.length)];
  const base = ENEMY_ARCHETYPES[type];
  const scale = 1 + state.elapsed / 240;
  const bossScale = forceBoss ? 8 + state.bossesDefeated * 2.5 : 1;
  const x = clamp(state.player.x + Math.cos(angle) * distance, 60, state.worldSize - 60);
  const y = clamp(state.player.y + Math.sin(angle) * distance, 60, state.worldSize - 60);

  state.enemies.push({
    x,
    y,
    type,
    boss: forceBoss,
    hp: base.hp * scale * bossScale,
    maxHp: base.hp * scale * bossScale,
    speed: base.speed * (forceBoss ? 0.66 : 1),
    xp: Math.round(base.xp * scale * (forceBoss ? 10 : 1)),
    radius: forceBoss ? 34 : 15 + Math.random() * 5,
    color: base.color,
    damage: forceBoss ? 24 : 8
  });

  if (forceBoss) {
    playTone(120, 0.45, "sawtooth", 0.05);
    state.shake = 18;
  }
}

function update(dt) {
  if (pausedForChoice || evolutionLock || gameEnded || ui.codexPanel.classList.contains("hidden") === false) {
    return;
  }

  state.elapsed += dt;
  state.stageIndex = Math.min(STAGES.length - 1, Math.floor(state.elapsed / 55));
  state.spawnTimer -= dt;
  state.bossTimer -= dt;
  state.shake = Math.max(0, state.shake - dt * 28);

  const spawnRate = Math.max(0.09, 0.62 - state.elapsed * 0.006);
  if (state.spawnTimer <= 0) {
    state.spawnTimer = spawnRate;
    spawnEnemy(false);
    if (state.elapsed > 90 && Math.random() < 0.18) spawnEnemy(false);
  }

  if (state.bossTimer <= 0) {
    state.bossTimer = 75;
    spawnEnemy(true);
  }

  updatePlayer(dt);
  updateEnemies(dt);
  updateProjectiles(dt);
  updatePickups(dt);
  updateParticles(dt);
  tryEvolution();

  if (state.elapsed >= 30 * 60) {
    endGame(true);
  }
}

function updatePlayer(dt) {
  const p = state.player;
  let dx = 0;
  let dy = 0;
  if (keys.has("arrowleft") || keys.has("a")) dx -= 1;
  if (keys.has("arrowright") || keys.has("d")) dx += 1;
  if (keys.has("arrowup") || keys.has("w")) dy -= 1;
  if (keys.has("arrowdown") || keys.has("s")) dy += 1;
  dx += touchMove.x;
  dy += touchMove.y;
  const len = Math.hypot(dx, dy) || 1;
  p.x = clamp(p.x + (dx / len) * p.speed * dt, 30, state.worldSize - 30);
  p.y = clamp(p.y + (dy / len) * p.speed * dt, 30, state.worldSize - 30);

  p.cooldownLeft -= dt;
  if (p.cooldownLeft <= 0) {
    const target = nearestEnemy(p.range);
    if (target) {
      fireAt(target);
      p.cooldownLeft = p.cooldown;
    }
  }
}

function nearestEnemy(range) {
  let best = null;
  let bestDist = range;
  for (const enemy of state.enemies) {
    const dist = Math.hypot(enemy.x - state.player.x, enemy.y - state.player.y);
    if (dist < bestDist) {
      best = enemy;
      bestDist = dist;
    }
  }
  return best;
}

function fireAt(target) {
  const angle = Math.atan2(target.y - state.player.y, target.x - state.player.x);
  const form = currentForm();
  state.projectiles.push({
    x: state.player.x,
    y: state.player.y,
    vx: Math.cos(angle) * 520,
    vy: Math.sin(angle) * 520,
    life: 0.72,
    damage: state.player.attack,
    radius: 5 + state.upgradeCounts.area,
    color: form.color
  });
  playTone(420 + state.player.level * 18, 0.04, "square", 0.018);
}

function updateEnemies(dt) {
  const p = state.player;
  for (let i = state.enemies.length - 1; i >= 0; i -= 1) {
    const enemy = state.enemies[i];
    const angle = Math.atan2(p.y - enemy.y, p.x - enemy.x);
    enemy.x += Math.cos(angle) * enemy.speed * dt;
    enemy.y += Math.sin(angle) * enemy.speed * dt;

    if (Math.hypot(enemy.x - p.x, enemy.y - p.y) < enemy.radius + currentForm().radius) {
      p.hp -= enemy.damage * dt;
      state.shake = Math.max(state.shake, 3);
      if (p.hp <= 0) {
        p.hp = 0;
        endGame(false);
      }
    }

    if (enemy.hp <= 0) {
      killEnemy(enemy);
      state.enemies.splice(i, 1);
    }
  }
}

function killEnemy(enemy) {
  state.player.xp += enemy.xp;
  state.data[enemy.type] += enemy.boss ? 8 : 1;
  if (enemy.boss) {
    state.bossesDefeated += 1;
  }
  for (let i = 0; i < (enemy.boss ? 18 : 5); i += 1) {
    state.pickups.push({
      x: enemy.x + rand(-18, 18),
      y: enemy.y + rand(-18, 18),
      type: enemy.type,
      value: enemy.boss ? 2 : 1,
      radius: enemy.boss ? 5 : 3
    });
  }
  burst(enemy.x, enemy.y, enemy.color, enemy.boss ? 38 : 12);
  playTone(enemy.boss ? 90 : 260, enemy.boss ? 0.18 : 0.05, enemy.boss ? "sawtooth" : "triangle", 0.025);
  while (state.player.xp >= state.player.xpNext) {
    levelUp();
  }
}

function updateProjectiles(dt) {
  for (let i = state.projectiles.length - 1; i >= 0; i -= 1) {
    const shot = state.projectiles[i];
    shot.x += shot.vx * dt;
    shot.y += shot.vy * dt;
    shot.life -= dt;
    let hit = false;
    for (const enemy of state.enemies) {
      if (Math.hypot(enemy.x - shot.x, enemy.y - shot.y) < enemy.radius + shot.radius) {
        enemy.hp -= shot.damage;
        burst(shot.x, shot.y, shot.color, 4);
        hit = true;
        break;
      }
    }
    if (hit || shot.life <= 0) {
      state.projectiles.splice(i, 1);
    }
  }
}

function updatePickups(dt) {
  const p = state.player;
  for (let i = state.pickups.length - 1; i >= 0; i -= 1) {
    const pickup = state.pickups[i];
    const dist = Math.hypot(pickup.x - p.x, pickup.y - p.y);
    if (dist < p.magnet) {
      const angle = Math.atan2(p.y - pickup.y, p.x - pickup.x);
      const speed = 280 + (p.magnet - dist) * 5;
      pickup.x += Math.cos(angle) * speed * dt;
      pickup.y += Math.sin(angle) * speed * dt;
    }
    if (dist < 22) {
      state.data[pickup.type] += pickup.value;
      state.pickups.splice(i, 1);
      playTone(720, 0.025, "sine", 0.012);
    }
  }
}

function updateParticles(dt) {
  for (let i = state.particles.length - 1; i >= 0; i -= 1) {
    const particle = state.particles[i];
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.life -= dt;
    if (particle.life <= 0) {
      state.particles.splice(i, 1);
    }
  }
}

function levelUp() {
  const p = state.player;
  p.xp -= p.xpNext;
  p.level += 1;
  p.xpNext = Math.round(p.xpNext * 1.32 + 8);
  p.hp = Math.min(p.maxHp, p.hp + 18);
  pausedForChoice = true;
  showUpgradeChoices();
  playTone(880, 0.12, "square", 0.035);
}

function showUpgradeChoices() {
  ui.upgradeChoices.innerHTML = "";
  const choices = shuffle([...UPGRADES]).slice(0, 3);
  for (const upgrade of choices) {
    const button = document.createElement("button");
    button.className = "upgrade-card";
    button.type = "button";
    button.innerHTML = `<strong>${upgrade.name}</strong><span>${upgrade.desc}</span>`;
    button.addEventListener("click", () => applyUpgrade(upgrade));
    ui.upgradeChoices.appendChild(button);
  }
  ui.levelPanel.classList.remove("hidden");
}

function applyUpgrade(upgrade) {
  const p = state.player;
  state.upgradeCounts[upgrade.id] += 1;
  state.data[upgrade.type] += 4;
  if (upgrade.id === "power") p.attack *= 1.18;
  if (upgrade.id === "speed") p.speed *= 1.12;
  if (upgrade.id === "area") p.range *= 1.16;
  if (upgrade.id === "regen") {
    p.maxHp += 10;
    p.hp = Math.min(p.maxHp, p.hp + 38);
  }
  if (upgrade.id === "cooldown") p.cooldown *= 0.9;
  if (upgrade.id === "magnet") p.magnet *= 1.24;
  p.skills = summarizeSkills();
  ui.levelPanel.classList.add("hidden");
  pausedForChoice = false;
  tryEvolution(true);
}

function summarizeSkills() {
  return Object.entries(state.upgradeCounts)
    .filter(([, count]) => count > 0)
    .map(([id, count]) => {
      const upgrade = UPGRADES.find((item) => item.id === id);
      return { name: upgrade.name, count };
    });
}

function tryEvolution(fromChoice = false) {
  if (evolutionLock) return;
  const p = state.player;
  const d = state.data;
  const u = state.upgradeCounts;
  let next = null;

  if (p.formId === "botamon" && p.level >= 3) {
    if (d.Vaccine >= 18 || u.power >= 2) next = "agumon";
    else if (d.Data >= 18 || u.speed >= 2 || u.cooldown >= 2) next = "gabumon";
  }

  if ((p.formId === "agumon" || p.formId === "gabumon") && p.level >= 7) {
    if (d.Virus >= 26 || u.area >= 2) next = "devimon";
    if (p.formId === "agumon" && d.Vaccine >= 42 && u.power >= 3 && state.bossesDefeated >= 1) next = "metalgreymon";
  }

  if ((p.formId === "devimon" || p.formId === "metalgreymon") && p.level >= 12) {
    if (d.Virus >= 54 && u.area >= 3 && state.bossesDefeated >= 2) next = "machinedramon";
  }

  if (next && next !== p.formId) {
    evolveTo(next);
  } else if (fromChoice) {
    state.shake = 5;
  }
}

function evolveTo(formId) {
  const form = FORMS.find((item) => item.id === formId);
  evolutionLock = true;
  state.player.formId = formId;
  state.player.maxHp += 26;
  state.player.hp = state.player.maxHp;
  state.player.attack *= 1.28;
  state.player.range *= 1.08;
  state.discovered[formId] = true;
  saveCodex();
  ui.evoName.textContent = form.name;
  ui.evolutionOverlay.classList.remove("hidden");
  state.shake = 24;

  const notes = [180, 260, 360, 520, 760, 980];
  notes.forEach((note, index) => setTimeout(() => playTone(note, 0.12, "sawtooth", 0.04), index * 170));

  setTimeout(() => {
    ui.evolutionOverlay.classList.add("hidden");
    evolutionLock = false;
    burst(state.player.x, state.player.y, form.color, 70);
  }, 2600);
}

function burst(x, y, color, count) {
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = rand(50, 240);
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color,
      life: rand(0.24, 0.82)
    });
  }
}

function draw() {
  const shakeX = state.shake ? rand(-state.shake, state.shake) : 0;
  const shakeY = state.shake ? rand(-state.shake, state.shake) : 0;
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(shakeX, shakeY);
  drawBackground();
  drawPickups();
  drawProjectiles();
  drawEnemies();
  drawPlayer();
  drawParticles();
  ctx.restore();
  drawMiniMap();
  updateHud();
}

function camera() {
  return {
    x: state.player.x - canvas.width / 2,
    y: state.player.y - canvas.height / 2
  };
}

function toScreen(x, y) {
  const cam = camera();
  return { x: x - cam.x, y: y - cam.y };
}

function drawBackground() {
  const cam = camera();
  const stage = currentStage();
  ctx.fillStyle = "#02070d";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = hexToRgba(stage.color, 0.17);
  ctx.lineWidth = 1;
  const grid = 54;
  for (let x = -((cam.x * 0.6) % grid); x < canvas.width; x += grid) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 70, canvas.height);
    ctx.stroke();
  }
  for (let y = -((cam.y * 0.6) % grid); y < canvas.height; y += grid) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.font = "12px Consolas, monospace";
  ctx.fillStyle = hexToRgba(stage.color, 0.22);
  for (let i = 0; i < 26; i += 1) {
    const y = (i * 47 + state.elapsed * 32) % (canvas.height + 80) - 40;
    const x = (i * 137 - cam.x * 0.18) % canvas.width;
    ctx.fillText(`0x${Math.floor((state.elapsed * 999 + i * 771) % 65535).toString(16).padStart(4, "0")} // ${stage.name}`, x, y);
  }

  ctx.strokeStyle = hexToRgba(stage.color, 0.38);
  for (let i = 0; i < 8; i += 1) {
    const x = ((i * 320 - cam.x * 0.35) % (canvas.width + 120)) - 60;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + Math.sin(state.elapsed + i) * 70, canvas.height);
    ctx.stroke();
  }
}

function drawPlayer() {
  const p = state.player;
  const form = currentForm();
  const pos = toScreen(p.x, p.y);
  const sprite = spriteImages.get(form.id);
  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.shadowColor = form.color;
  ctx.shadowBlur = 18;

  if (sprite && sprite.complete && sprite.naturalWidth > 0) {
    const size = form.radius * 3.2;
    ctx.drawImage(sprite, -size / 2, -size / 2, size, size);
    ctx.restore();
    return;
  }

  ctx.fillStyle = form.color;
  ctx.beginPath();
  for (let i = 0; i < 6; i += 1) {
    const angle = Math.PI / 6 + (i * Math.PI) / 3;
    const r = form.radius + (i % 2) * 4;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#001018";
  ctx.font = "bold 10px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText("???", 0, 3);
  ctx.restore();
}

function drawEnemies() {
  for (const enemy of state.enemies) {
    const pos = toScreen(enemy.x, enemy.y);
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.shadowColor = enemy.color;
    ctx.shadowBlur = enemy.boss ? 22 : 10;
    ctx.strokeStyle = enemy.color;
    ctx.fillStyle = hexToRgba(enemy.color, enemy.boss ? 0.28 : 0.54);
    polygon(0, 0, enemy.radius, enemy.boss ? 8 : 4, state.elapsed * (enemy.boss ? 0.8 : 1.7));
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#fff";
    ctx.fillRect(-enemy.radius, -enemy.radius - 8, enemy.radius * 2 * (enemy.hp / enemy.maxHp), 3);
    if (enemy.boss) {
      ctx.font = "bold 10px Segoe UI";
      ctx.textAlign = "center";
      ctx.fillText("BOSS", 0, enemy.radius + 16);
    }
    ctx.restore();
  }
}

function drawProjectiles() {
  for (const shot of state.projectiles) {
    const pos = toScreen(shot.x, shot.y);
    ctx.fillStyle = shot.color;
    ctx.shadowColor = shot.color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, shot.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function drawPickups() {
  for (const pickup of state.pickups) {
    const pos = toScreen(pickup.x, pickup.y);
    const color = ENEMY_ARCHETYPES[pickup.type].color;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 9;
    ctx.fillRect(pos.x - pickup.radius, pos.y - pickup.radius, pickup.radius * 2, pickup.radius * 2);
    ctx.shadowBlur = 0;
  }
}

function drawParticles() {
  for (const particle of state.particles) {
    const pos = toScreen(particle.x, particle.y);
    ctx.globalAlpha = Math.max(0, particle.life);
    ctx.fillStyle = particle.color;
    ctx.fillRect(pos.x, pos.y, 3, 3);
    ctx.globalAlpha = 1;
  }
}

function drawMiniMap() {
  mapCtx.clearRect(0, 0, miniMap.width, miniMap.height);
  mapCtx.fillStyle = "rgba(0, 0, 0, 0.35)";
  mapCtx.fillRect(0, 0, miniMap.width, miniMap.height);
  const scaleX = miniMap.width / state.worldSize;
  const scaleY = miniMap.height / state.worldSize;
  mapCtx.fillStyle = currentStage().color;
  mapCtx.fillRect(state.player.x * scaleX - 2, state.player.y * scaleY - 2, 4, 4);
  mapCtx.fillStyle = "#ff3e71";
  for (const enemy of state.enemies.slice(0, 90)) {
    mapCtx.fillRect(enemy.x * scaleX, enemy.y * scaleY, enemy.boss ? 4 : 2, enemy.boss ? 4 : 2);
  }
}

function polygon(x, y, radius, sides, rotation) {
  ctx.beginPath();
  for (let i = 0; i < sides; i += 1) {
    const angle = rotation + (i * Math.PI * 2) / sides;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function updateHud() {
  const p = state.player;
  const form = currentForm();
  ui.hpText.textContent = `${Math.ceil(p.hp)} / ${p.maxHp}`;
  ui.hpFill.style.width = `${(p.hp / p.maxHp) * 100}%`;
  ui.levelText.textContent = p.level;
  ui.formText.textContent = form.name;
  ui.typeText.textContent = form.type;
  ui.expFill.style.width = `${(p.xp / p.xpNext) * 100}%`;
  ui.timerText.textContent = formatTime(state.elapsed);
  ui.stageText.textContent = currentStage().name;
  ui.evoGaugeText.textContent = `${evoReadiness()}%`;

  ui.dataGrid.innerHTML = DATA_TYPES.map((type) => `<div class="data-chip">${type}<br><strong>${state.data[type]}</strong></div>`).join("");
  ui.skillList.innerHTML = p.skills.length
    ? p.skills.map((skill) => `<li><span>${skill.name}</span><strong>Lv${skill.count}</strong></li>`).join("")
    : "<li><span>Basic Bit</span><strong>Lv1</strong></li>";
}

function evoReadiness() {
  const p = state.player;
  const d = state.data;
  if (p.formId === "botamon") {
    return clamp(Math.round((Math.max(d.Vaccine, d.Data) / 18) * 100), 0, 100);
  }
  if (p.formId === "agumon" || p.formId === "gabumon") {
    return clamp(Math.round((Math.max(d.Virus / 26, d.Vaccine / 42) * 100)), 0, 100);
  }
  return clamp(Math.round((d.Virus / 54) * 100), 0, 100);
}

function showCodex() {
  ui.codexEntries.innerHTML = FORMS.map((form) => {
    const found = state.discovered[form.id];
    return `
      <article class="entry ${found ? "" : "locked"}">
        <div class="portrait" style="border-color:${found ? form.color : "rgba(255,255,255,.2)"}">
          ${found ? "画像準備中 / silhouette" : "？？？"}
        </div>
        <strong>${found ? form.name : "未発見"}</strong>
        <p>${found ? form.desc : "この進化ルートはまだ解析されていない。"}</p>
        <small>条件: ${found ? form.condition : "？？？"}</small>
      </article>
    `;
  }).join("");
  ui.codexPanel.classList.remove("hidden");
}

function endGame(cleared) {
  gameEnded = true;
  ui.resultTitle.textContent = cleared ? "SURVIVED 30:00" : "GAME OVER";
  ui.resultText.textContent = cleared
    ? `図鑑登録 ${Object.keys(state.discovered).length}/${FORMS.length}。究極体ルートをさらに解析できます。`
    : `接続時間 ${formatTime(state.elapsed)}。吸収データと能力選択を変えると別ルートへ進化します。`;
  ui.gameOverPanel.classList.remove("hidden");
}

function loop(now) {
  const dt = Math.min(0.033, (now - lastTime) / 1000);
  lastTime = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

function formatTime(seconds) {
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60).toString().padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function hexToRgba(hex, alpha) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function setTouchMoveFromPointer(event) {
  const rect = ui.touchStick.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const max = rect.width * 0.38;
  const rawX = event.clientX - centerX;
  const rawY = event.clientY - centerY;
  const dist = Math.hypot(rawX, rawY);
  const scale = dist > max ? max / dist : 1;
  const knobX = rawX * scale;
  const knobY = rawY * scale;
  touchMove.x = clamp(rawX / max, -1, 1);
  touchMove.y = clamp(rawY / max, -1, 1);
  if (dist > max) {
    const len = Math.hypot(touchMove.x, touchMove.y) || 1;
    touchMove.x /= len;
    touchMove.y /= len;
  }
  ui.touchKnob.style.transform = `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`;
}

function resetTouchMove() {
  touchMove.x = 0;
  touchMove.y = 0;
  touchMove.activeId = null;
  ui.touchKnob.style.transform = "translate(-50%, -50%)";
}

function togglePause() {
  pausedForChoice = !pausedForChoice;
  ui.levelPanel.classList.add("hidden");
}

window.addEventListener("keydown", (event) => {
  keys.add(event.key.toLowerCase());
  if (event.code === "Space") {
    togglePause();
  }
});

window.addEventListener("keyup", (event) => keys.delete(event.key.toLowerCase()));
window.addEventListener("pointerdown", startAudio, { once: true });
window.addEventListener("keydown", startAudio, { once: true });

ui.codexButton.addEventListener("click", showCodex);
ui.closeCodex.addEventListener("click", () => ui.codexPanel.classList.add("hidden"));
ui.restartButton.addEventListener("click", resetGame);
ui.touchPause.addEventListener("click", togglePause);
ui.touchCodex.addEventListener("click", showCodex);
ui.touchStick.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  startAudio();
  touchMove.activeId = event.pointerId;
  ui.touchStick.setPointerCapture(event.pointerId);
  setTouchMoveFromPointer(event);
});
ui.touchStick.addEventListener("pointermove", (event) => {
  if (touchMove.activeId !== event.pointerId) return;
  event.preventDefault();
  setTouchMoveFromPointer(event);
});
ui.touchStick.addEventListener("pointerup", (event) => {
  if (touchMove.activeId === event.pointerId) resetTouchMove();
});
ui.touchStick.addEventListener("pointercancel", (event) => {
  if (touchMove.activeId === event.pointerId) resetTouchMove();
});

preloadSpriteImages();

for (let i = 0; i < 12; i += 1) {
  spawnEnemy(false);
}

requestAnimationFrame(loop);
