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
  starterPanel: document.getElementById("starterPanel"),
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
  endingDevice: document.getElementById("endingDevice"),
  endingCredit: document.getElementById("endingCredit"),
  restartButton: document.getElementById("restartButton"),
  touchStick: document.getElementById("touchStick"),
  touchKnob: document.getElementById("touchKnob"),
  touchSpecial: document.getElementById("touchSpecial"),
  touchPause: document.getElementById("touchPause"),
  touchCodex: document.getElementById("touchCodex"),
  specialCutin: document.getElementById("specialCutin"),
  cutinImage: document.getElementById("cutinImage"),
  cutinName: document.getElementById("cutinName")
};

const DATA_TYPES = ["Vaccine", "Data", "Virus", "Free"];
const STARTERS = ["botamon", "babumon", "tanemon"];
const SHOTENGAI_URL = "https://natsuyasumi-shotengai.vercel.app/";
const SPECIAL_STAGE_ORDER = { Fresh: 0, "In-Training": 1, Rookie: 2, Champion: 3, Ultimate: 4, Mega: 5 };

const STAGES = [
  { name: "Data Shore", color: "#32d5ff", enemyBias: ["Free", "Data"] },
  { name: "Network City", color: "#ffdf5c", enemyBias: ["Data", "Vaccine"] },
  { name: "Server Ruins", color: "#9f7bff", enemyBias: ["Virus", "Data"] },
  { name: "Deep Digital World", color: "#ff3e71", enemyBias: ["Virus", "Vaccine"] }
];

const SPRITE_ASSET_VERSION = "plotmon-hououmon-20260710";

const MONSTERS = [
  monster("botamon", "Botamon", "Fresh", "Free", "player_candidate", 90, 1.0, 8, 3, ["koromon", "tsunomon"], null, "#7cffe9", 17),
  monster("babumon", "Babumon", "Fresh", "Free", "player_candidate", 88, 1.08, 8, 3, ["biyomon", "tentomon", "gomamon"], null, "#c7fff2", 17),
  monster("tanemon", "Tanemon", "Fresh", "Data", "player_candidate", 92, 0.98, 8, 3, ["palmon", "plotmon", "kokuwamon"], null, "#9dff70", 17),
  monster("koromon", "Koromon", "In-Training", "Free", "player_candidate", 100, 1.02, 9, 4, ["agumon", "patamon"], "Botamon route", "#ff9fc8", 18),
  monster("tsunomon", "Tsunomon", "In-Training", "Data", "player_candidate", 105, 1.08, 9, 4, ["gabumon"], "Botamon + Data route", "#d8d6c8", 18),
  monster("agumon", "Agumon", "Rookie", "Vaccine", "player_candidate", 120, 1.1, 12, 5, ["greymon", "devimon"], "Koromon route", "#ffb340", 22),
  monster("gabumon", "Gabumon", "Rookie", "Data", "player_candidate", 112, 1.2, 11, 5, ["garurumon"], "Tsunomon route", "#65d9ff", 22),
  monster("patamon", "Patamon", "Rookie", "Free", "enemy", 95, 1.18, 9, 5, ["angemon"], "Wild enemy 03:00-08:00 / defeat to register", "#ffe66b", 20),
  monster("tentomon", "Tentomon", "Rookie", "Vaccine", "player_candidate", 112, 0.95, 10, 5, ["kabuterimon"], "Babumon + Vaccine route / wild enemy 03:00-08:00", "#75ff9e", 21),
  monster("palmon", "Palmon", "Rookie", "Data", "player_candidate", 102, 1.0, 9, 5, ["togemon"], "Tanemon + Data route / wild enemy 03:00-08:00", "#9dff70", 20),
  monster("gomamon", "Gomamon", "Rookie", "Free", "player_candidate", 108, 1.08, 10, 5, ["ikkakumon"], "Babumon + Free route / wild enemy 03:00-08:00", "#e7f7ff", 20),
  monster("biyomon", "Biyomon", "Rookie", "Data", "player_candidate", 98, 1.25, 9, 5, ["birdramon"], "Babumon + Data route / wild enemy 03:00-08:00", "#ff8fcf", 20),
  monster("plotmon", "Plotmon", "Rookie", "Vaccine", "player_candidate", 104, 1.16, 10, 5, ["tailmon"], "Tanemon + Vaccine route", "#79eaff", 20),
  monster("kokuwamon", "Kokuwamon", "Rookie", "Virus", "player_candidate", 112, 1.0, 11, 5, ["kuwagamon"], "Tanemon + machine route", "#ff705c", 20),
  monster("greymon", "Greymon", "Champion", "Vaccine", "player_candidate", 210, 0.92, 20, 9, ["metalgreymon", "skullgreymon"], "Agumon + power", "#ff6a3d", 30),
  monster("garurumon", "Garurumon", "Champion", "Data", "player_candidate", 180, 1.35, 17, 9, ["weregarurumon"], "Gabumon route", "#70c7ff", 29),
  monster("devimon", "Devimon", "Champion", "Virus", "player_candidate", 190, 1.08, 19, 10, ["skullgreymon"], "Virus / area route", "#b178ff", 29),
  monster("angemon", "Angemon", "Champion", "Vaccine", "player_candidate", 185, 1.08, 18, 10, ["holyangemon"], "Patamon branch / wild enemy discovery", "#fff0a8", 29),
  monster("kuwagamon", "Kuwagamon", "Champion", "Virus", "player_candidate", 205, 1.0, 21, 10, ["andromon"], "Kokuwamon machine route / wild enemy discovery", "#76ff72", 30),
  monster("birdramon", "Birdramon", "Champion", "Data", "player_candidate", 175, 1.28, 18, 10, ["garudamon"], "Biyomon branch", "#ff7048", 29),
  monster("kabuterimon", "Kabuterimon", "Champion", "Vaccine", "player_candidate", 210, 0.94, 21, 10, ["megakabuterimon"], "Tentomon branch / sprite pending", "#44e7ff", 30),
  monster("ikkakumon", "Ikkakumon", "Champion", "Free", "player_candidate", 205, 0.92, 20, 10, ["zudomon"], "Gomamon branch", "#8ee8ff", 31),
  monster("togemon", "Togemon", "Champion", "Data", "player_candidate", 195, 0.92, 19, 10, ["lilymon"], "Palmon branch", "#d9b52c", 29),
  monster("tailmon", "Tailmon", "Champion", "Vaccine", "player_candidate", 170, 1.32, 18, 10, ["angewomon"], "Plotmon branch", "#c99dff", 28),
  monster("metalgreymon", "MetalGreymon", "Ultimate", "Vaccine", "player_candidate", 330, 0.88, 34, 16, ["wargreymon"], "Greymon + boss data", "#ff6a3d", 36),
  monster("weregarurumon", "WereGarurumon", "Ultimate", "Data", "player_candidate", 285, 1.42, 30, 16, ["metalgarurumon"], "Garurumon route", "#8ed8ff", 35),
  monster("skullgreymon", "SkullGreymon", "Ultimate", "Virus", "player_candidate", 350, 0.82, 38, 18, ["mugendramon"], "Dark Greymon route", "#d8d8d8", 36),
  monster("andromon", "Andromon", "Ultimate", "Vaccine", "player_candidate", 310, 0.9, 32, 17, ["machinedramon"], "Kuwagamon machine route / wild enemy discovery", "#bfc8d4", 35),
  monster("garudamon", "Garudamon", "Ultimate", "Data", "player_candidate", 300, 1.24, 32, 17, ["hououmon", "phoenixmon"], "Birdramon branch", "#ff7a22", 36),
  monster("megakabuterimon", "MegaKabuterimon", "Ultimate", "Vaccine", "player_candidate", 345, 0.86, 36, 17, ["herculeskabuterimon"], "Kabuterimon branch", "#8268ff", 36),
  monster("zudomon", "Zudomon", "Ultimate", "Free", "player_candidate", 360, 0.82, 37, 17, ["vikemon"], "Ikkakumon branch", "#8ecf72", 37),
  monster("holyangemon", "HolyAngemon", "Ultimate", "Vaccine", "player_candidate", 320, 1.05, 32, 17, ["holydramon"], "Angemon branch", "#ffe46a", 36),
  monster("lilymon", "Lilymon", "Ultimate", "Data", "player_candidate", 285, 1.22, 30, 17, ["rosemon"], "Togemon branch", "#a8ff7a", 35),
  monster("angewomon", "Angewomon", "Ultimate", "Vaccine", "player_candidate", 295, 1.18, 31, 17, ["holydramon"], "Tailmon branch", "#ffd1ee", 35),
  monster("wargreymon", "WarGreymon", "Mega", "Vaccine", "player_candidate", 460, 1.08, 48, 28, [], "MetalGreymon route", "#ffd45c", 42),
  monster("metalgarurumon", "MetalGarurumon", "Mega", "Data", "player_candidate", 420, 1.35, 44, 28, [], "WereGarurumon route", "#8ee8ff", 41),
  monster("machinedramon", "Machinedramon", "Mega", "Virus", "player_candidate", 500, 0.78, 54, 32, [], "Virus machine route", "#ff3e71", 42),
  monster("mugendramon", "Mugendramon", "Mega", "Virus", "player_candidate", 505, 0.78, 55, 32, [], "Dark machine route", "#8f5cff", 42),
  monster("hououmon", "Hououmon", "Mega", "Vaccine", "player_candidate", 430, 1.18, 46, 28, [], "Garudamon + Vaccine route", "#ffb12a", 42),
  monster("phoenixmon", "Phoenixmon", "Mega", "Data", "player_candidate", 420, 1.26, 45, 28, [], "Garudamon + Data route", "#ff6a22", 42),
  monster("herculeskabuterimon", "HerculesKabuterimon", "Mega", "Vaccine", "player_candidate", 510, 0.84, 52, 30, [], "MegaKabuterimon route", "#6d8dff", 43),
  monster("vikemon", "Vikemon", "Mega", "Free", "player_candidate", 500, 0.88, 50, 30, [], "Zudomon route", "#8ed8ff", 43),
  monster("holydramon", "Holydramon", "Mega", "Vaccine", "player_candidate", 455, 1.06, 47, 28, [], "HolyAngemon or Angewomon route", "#bcefff", 42),
  monster("rosemon", "Rosemon", "Mega", "Data", "player_candidate", 430, 1.16, 46, 28, [], "Lilymon route", "#ff5c96", 42),
  monster("diaboromon", "Diaboromon", "Mega", "Virus", "final_boss", 1800, 0.94, 60, 0, [], "Final boss: appears 20s after Mega evolution", "#a35cff", 48)
];

function monster(id, name, stage, attribute, role, hp, speed, attack, exp, evolutionTo, unlockCondition, color, radius) {
  return {
    id,
    name,
    stage,
    attribute,
    type: attribute,
    role,
    hp,
    speed,
    attack,
    exp,
    sprites: [`assets/sprites/${id}_01.png?v=${SPRITE_ASSET_VERSION}`, `assets/sprites/${id}_02.png?v=${SPRITE_ASSET_VERSION}`],
    evolutionTo,
    evolutionFrom: [],
    unlockCondition,
    desc: `${stage} / ${attribute} attribute digital monster.`,
    condition: unlockCondition || "???",
    color,
    radius
  };
}

for (const source of MONSTERS) {
  for (const targetId of source.evolutionTo) {
    const target = MONSTERS.find((candidate) => candidate.id === targetId);
    if (target) target.evolutionFrom.push(source.id);
  }
}

const MONSTER_BY_ID = Object.fromEntries(MONSTERS.map((monsterData) => [monsterData.id, monsterData]));
const FORMS = MONSTERS;

const UPGRADES = [
  { id: "power", name: "Attack Kernel", desc: "攻撃力 +18%。Vaccine 進化へ寄る。", type: "Vaccine" },
  { id: "speed", name: "Clock Boost", desc: "移動速度 +12%。Data 進化へ寄る。", type: "Data" },
  { id: "area", name: "Wide Bus", desc: "攻撃範囲 +16%。Virus 進化へ寄る。", type: "Virus" },
  { id: "regen", name: "Repair Thread", desc: "HP回復、最大HP +10。Free 進化へ寄る。", type: "Free" },
  { id: "cooldown", name: "Async Cast", desc: "攻撃間隔 -10%。Data 進化へ寄る。", type: "Data" },
  { id: "magnet", name: "Data Magnet", desc: "データ吸収範囲 +24%。Free 進化へ寄る。", type: "Free" },
  { id: "shield", name: "Damage Shield", desc: "接触シールドで近くの敵を焼き、被弾も軽減。", type: "Vaccine" },
  { id: "drones", name: "Attack Drone", desc: "自動射撃ドローンを1機追加。周回して援護。", type: "Data" },
  { id: "beam", name: "Pierce Beam", desc: "通常弾が貫通し、射程と威力も少し上昇。", type: "Vaccine" },
  { id: "orbit", name: "Orbit Blade", desc: "周回するデータ刃で周囲の敵を切り裂く。", type: "Virus" },
  { id: "chain", name: "Chain Spark", desc: "弾が命中時に近くの敵へ連鎖ダメージ。", type: "Data" },
  { id: "nova", name: "Data Nova", desc: "一定間隔で周囲にデータ爆発を発生。", type: "Free" }
];

const SPRITES = Object.fromEntries(MONSTERS.map((monsterData) => [monsterData.id, monsterData.sprites]));
const spriteImages = new Map();

function preloadSpriteImages() {
  for (const sprites of Object.values(SPRITES)) {
    for (const src of sprites) {
      if (spriteImages.has(src)) continue;
      const image = new Image();
      image.src = src;
      spriteImages.set(src, image);
    }
  }
}

const ENEMY_ARCHETYPES = {
  Vaccine: { color: "#75ff9e", hp: 18, speed: 52, xp: 5 },
  Data: { color: "#4ff6ff", hp: 15, speed: 66, xp: 5 },
  Virus: { color: "#ff3e71", hp: 22, speed: 44, xp: 7 },
  Free: { color: "#ffe66b", hp: 12, speed: 58, xp: 4 }
};

const ENEMY_SPAWN_TABLE = [
  { until: 180, ids: ["botamon", "babumon", "tanemon", "koromon", "tsunomon", "agumon", "tentomon"] },
  { until: 480, ids: ["agumon", "gabumon", "tentomon", "patamon", "palmon", "gomamon", "biyomon", "plotmon", "kokuwamon"] },
  { until: 900, ids: ["greymon", "garurumon", "devimon", "angemon", "kuwagamon", "birdramon", "kabuterimon", "ikkakumon", "togemon", "tailmon"] },
  { until: Infinity, ids: ["metalgreymon", "skullgreymon", "andromon", "machinedramon", "weregarurumon", "garudamon", "megakabuterimon", "zudomon", "holyangemon", "lilymon", "angewomon"] }
];

const BOSS_POOL = ["greymon", "garurumon", "devimon", "metalgreymon", "skullgreymon", "machinedramon", "garudamon", "megakabuterimon", "zudomon", "holyangemon", "lilymon", "angewomon"];

const keys = new Set();
const touchMove = { x: 0, y: 0, activeId: null };
let lastTime = performance.now();
let pausedForChoice = false;
let evolutionLock = false;
let gameEnded = false;
let audioCtx = null;
let resizeQueued = true;
let nextEnemyId = 1;
let starterSelected = false;
let specialCutinLock = false;

const state = createInitialState();

function createInitialState(starterId = "botamon") {
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
      formId: starterId,
      speed: 178,
      attack: 20,
      range: 165,
      cooldown: 0.72,
      cooldownLeft: 0,
      specialCooldown: 14,
      specialCooldownLeft: 0,
      magnet: 84,
      effects: {
        shield: 0,
        drones: 0,
        beam: 0,
        orbit: 0,
        chain: 0,
        nova: 0
      },
      droneCooldown: 0,
      novaCooldown: 0,
      skills: []
    },
    data: { Vaccine: 0, Data: 0, Virus: 0, Free: 0 },
    upgradeCounts: { power: 0, speed: 0, area: 0, regen: 0, cooldown: 0, magnet: 0 },
    bossesDefeated: 0,
    megaReachedAt: null,
    finalBossSpawned: false,
    finalBossDefeated: false,
    enemies: [],
    projectiles: [],
    pickups: [],
    particles: [],
    specialEffects: [],
    discovered: loadCodex(),
    bossTimer: 60,
    spawnTimer: 0,
    stageIndex: 0
  };
}

function resetGame() {
  const fresh = createInitialState();
  Object.keys(state).forEach((key) => delete state[key]);
  Object.assign(state, fresh);
  starterSelected = false;
  pausedForChoice = false;
  evolutionLock = false;
  gameEnded = false;
  specialCutinLock = false;
  ui.levelPanel.classList.add("hidden");
  ui.starterPanel.classList.remove("hidden");
  ui.evolutionOverlay.classList.add("hidden");
  ui.specialCutin.classList.add("hidden");
  ui.gameOverPanel.classList.add("hidden");
  ui.endingDevice.classList.add("hidden");
  ui.endingCredit.classList.add("hidden");
  ui.codexPanel.classList.add("hidden");
  resetTouchMove();
  nextEnemyId = 1;
  lastTime = performance.now();
}

function beginRun(starterId) {
  const safeStarter = STARTERS.includes(starterId) ? starterId : "botamon";
  const fresh = createInitialState(safeStarter);
  Object.keys(state).forEach((key) => delete state[key]);
  Object.assign(state, fresh);
  state.discovered[safeStarter] = true;
  saveCodex();
  starterSelected = true;
  pausedForChoice = false;
  evolutionLock = false;
  gameEnded = false;
  specialCutinLock = false;
  ui.starterPanel.classList.add("hidden");
  ui.levelPanel.classList.add("hidden");
  ui.gameOverPanel.classList.add("hidden");
  ui.endingDevice.classList.add("hidden");
  ui.endingCredit.classList.add("hidden");
  ui.codexPanel.classList.add("hidden");
  resetTouchMove();
  nextEnemyId = 1;
  spawnInitialEnemies();
  lastTime = performance.now();
}

function spawnInitialEnemies() {
  for (let i = 0; i < 12; i += 1) {
    spawnEnemy(false);
  }
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
  return MONSTER_BY_ID[state.player.formId] || MONSTER_BY_ID.botamon;
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

function spawnEnemy(forceBoss = false, forcedId = null) {
  const angle = Math.random() * Math.PI * 2;
  const distance = 520 + Math.random() * 260;
  const monsterData = forcedId ? (MONSTER_BY_ID[forcedId] || MONSTER_BY_ID.botamon) : pickEnemyMonster(forceBoss);
  const type = monsterData.attribute;
  const base = ENEMY_ARCHETYPES[type] || ENEMY_ARCHETYPES.Free;
  const scale = 1 + state.elapsed / 240;
  const finalBoss = forcedId === "diaboromon";
  const bossScale = finalBoss ? 18 + state.player.level * 0.9 : forceBoss ? 8 + state.bossesDefeated * 2.5 : 1;
  const x = clamp(state.player.x + Math.cos(angle) * distance, 60, state.worldSize - 60);
  const y = clamp(state.player.y + Math.sin(angle) * distance, 60, state.worldSize - 60);
  const enemyHp = Math.max(base.hp, monsterData.hp * 0.18) * scale * bossScale;

  state.enemies.push({
    id: nextEnemyId++,
    monsterId: monsterData.id,
    name: monsterData.name,
    x,
    y,
    type,
    boss: forceBoss,
    finalBoss,
    hp: enemyHp,
    maxHp: enemyHp,
    speed: base.speed * monsterData.speed * (forceBoss ? 0.52 : 1),
    xp: Math.round(monsterData.exp * scale * (forceBoss ? 10 : 1)),
    radius: forceBoss ? monsterData.radius * 1.2 : monsterData.radius * 0.65,
    color: monsterData.color || base.color,
    damage: finalBoss ? monsterData.attack * 1.7 : forceBoss ? monsterData.attack * 1.4 : monsterData.attack * 0.45
  });

  if (forceBoss) {
    playTone(120, 0.45, "sawtooth", 0.05);
    state.shake = 18;
  }
}

function spawnFinalBoss() {
  if (state.finalBossSpawned || gameEnded) return;
  state.finalBossSpawned = true;
  state.bossTimer = Infinity;
  spawnEnemy(true, "diaboromon");
  state.shake = 30;
  playTone(72, 0.7, "sawtooth", 0.06);
}

function pickEnemyMonster(forceBoss) {
  const pool = forceBoss
    ? BOSS_POOL
    : (ENEMY_SPAWN_TABLE.find((entry) => state.elapsed < entry.until) || ENEMY_SPAWN_TABLE[0]).ids;
  const id = pool[Math.floor(Math.random() * pool.length)];
  return MONSTER_BY_ID[id] || MONSTER_BY_ID.botamon;
}

function update(dt) {
  if (!starterSelected || pausedForChoice || evolutionLock || gameEnded || ui.codexPanel.classList.contains("hidden") === false) {
    return;
  }

  state.elapsed += dt;
  state.stageIndex = Math.min(STAGES.length - 1, Math.floor(state.elapsed / 55));
  state.spawnTimer -= dt;
  state.bossTimer -= dt;
  state.shake = Math.max(0, state.shake - dt * 28);
  if (state.megaReachedAt !== null && !state.finalBossSpawned && state.elapsed - state.megaReachedAt >= 20) {
    spawnFinalBoss();
  }

  const spawnRate = Math.max(0.09, 0.62 - state.elapsed * 0.006);
  if (state.spawnTimer <= 0) {
    state.spawnTimer = spawnRate;
    spawnEnemy(false);
    if (state.elapsed > 90 && Math.random() < 0.18) spawnEnemy(false);
  }

  if (!state.finalBossSpawned && state.bossTimer <= 0) {
    state.bossTimer = 75;
    spawnEnemy(true);
  }

  updatePlayer(dt);
  updatePassiveEffects(dt);
  updateSpecialCooldown(dt);
  updateEnemies(dt);
  updateProjectiles(dt);
  updatePickups(dt);
  updateParticles(dt);
  updateSpecialEffects(dt);
  tryEvolution();

  if (state.elapsed >= 30 * 60 && !state.finalBossSpawned) spawnFinalBoss();
}

function updateSpecialCooldown(dt) {
  const p = state.player;
  p.specialCooldownLeft = Math.max(0, p.specialCooldownLeft - dt);
}

function resizeCanvasToDisplay() {
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.min(2, window.devicePixelRatio || 1);
  const width = Math.max(320, Math.round(rect.width * ratio));
  const height = Math.max(360, Math.round(rect.height * ratio));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const mapRect = miniMap.getBoundingClientRect();
  const mapWidth = Math.max(80, Math.round(mapRect.width * ratio));
  const mapHeight = Math.max(48, Math.round(mapRect.height * ratio));
  if (miniMap.width !== mapWidth || miniMap.height !== mapHeight) {
    miniMap.width = mapWidth;
    miniMap.height = mapHeight;
  }
  resizeQueued = false;
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
  const beamLevel = state.player.effects.beam;
  state.projectiles.push({
    x: state.player.x,
    y: state.player.y,
    vx: Math.cos(angle) * 520,
    vy: Math.sin(angle) * 520,
    life: 0.72 + beamLevel * 0.12,
    damage: state.player.attack * (1 + beamLevel * 0.08),
    radius: 5 + state.upgradeCounts.area + beamLevel,
    color: form.color,
    pierce: beamLevel,
    chain: state.player.effects.chain,
    hitIds: new Set()
  });
  playTone(420 + state.player.level * 18, 0.04, "square", 0.018);
}

function fireDroneShot(droneIndex, target) {
  const form = currentForm();
  const count = Math.max(1, state.player.effects.drones);
  const orbitAngle = state.elapsed * 2.6 + (droneIndex * Math.PI * 2) / count;
  const originX = state.player.x + Math.cos(orbitAngle) * 52;
  const originY = state.player.y + Math.sin(orbitAngle) * 52;
  const angle = Math.atan2(target.y - originY, target.x - originX);
  state.projectiles.push({
    x: originX,
    y: originY,
    vx: Math.cos(angle) * 610,
    vy: Math.sin(angle) * 610,
    life: 0.62,
    damage: state.player.attack * 0.52,
    radius: 4,
    color: form.color,
    pierce: 0,
    chain: Math.max(0, state.player.effects.chain - 1),
    hitIds: new Set()
  });
}

function hasSpecialMove(form = currentForm()) {
  return (SPECIAL_STAGE_ORDER[form.stage] || 0) >= SPECIAL_STAGE_ORDER.Ultimate;
}

function isMegaForm(form = currentForm()) {
  return form.stage === "Mega";
}

function specialMoveName(form = currentForm()) {
  const names = {
    metalgreymon: "Giga Burst",
    weregarurumon: "Crescent Rush",
    skullgreymon: "Dark Bone Quake",
    andromon: "Guardromon Protocol",
    garudamon: "Wing Flare",
    megakabuterimon: "Horn Buster",
    zudomon: "Hammer Spark",
    wargreymon: "Brave Tornado",
    metalgarurumon: "Cocytus Barrage",
    machinedramon: "Infinity Cannon",
    mugendramon: "Mugen Cannon",
    hououmon: "Holy Flame",
    phoenixmon: "Crimson Rebirth",
    herculeskabuterimon: "Giga Scissor",
    vikemon: "Arctic Hammer",
    holydramon: "Holy Blaze",
    rosemon: "Forbidden Temptation"
  };
  return names[form.id] || "Special Move";
}

function specialVisualStyle(form = currentForm()) {
  const styles = {
    wargreymon: "sword",
    metalgarurumon: "missile",
    machinedramon: "laser",
    mugendramon: "laser",
    hououmon: "flame",
    phoenixmon: "flame",
    herculeskabuterimon: "horn",
    vikemon: "wave",
    holydramon: "holy",
    rosemon: "flower"
  };
  return styles[form.id] || "burst";
}

function triggerSpecialMove() {
  if (specialCutinLock || pausedForChoice || evolutionLock || gameEnded || ui.codexPanel.classList.contains("hidden") === false) return false;

  const p = state.player;
  const form = currentForm();
  if (!hasSpecialMove(form)) {
    state.shake = Math.max(state.shake, 4);
    playTone(150, 0.05, "square", 0.012);
    return false;
  }
  if (p.specialCooldownLeft > 0) {
    state.shake = Math.max(state.shake, 3);
    playTone(190, 0.04, "square", 0.012);
    return false;
  }

  p.specialCooldown = isMegaForm(form) ? 18 : 14;
  p.specialCooldownLeft = p.specialCooldown;
  startAudio();
  if (isMegaForm(form)) {
    triggerMegaSpecialCutin(form);
    return true;
  }
  executeSpecialMove(form);
  state.shake = Math.max(state.shake, 13);
  playTone(150, 0.16, "sawtooth", 0.04);
  return true;
}

function triggerMegaSpecialCutin(form) {
  specialCutinLock = true;
  pausedForChoice = true;
  showSpecialCutin(form, 2000);
  state.shake = Math.max(state.shake, 8);
  playTone(95, 0.26, "sawtooth", 0.04);
  window.setTimeout(() => {
    executeSpecialMove(form);
    ui.specialCutin.classList.add("hidden");
    state.shake = Math.max(state.shake, 22);
    specialCutinLock = false;
    pausedForChoice = false;
    lastTime = performance.now();
  }, 2000);
}

function executeSpecialMove(form) {
  const p = state.player;
  const power = p.attack * (isMegaForm(form) ? 4.2 : 2.7);
  const color = form.color;
  const actions = {
    metalgreymon: () => radialPierce(12, power * 0.9, color, 660, 1.0, 3),
    weregarurumon: () => rapidLockOn(9, power * 0.75, color, 720),
    skullgreymon: () => areaBlast(230, power * 1.1, color, "curse"),
    andromon: () => {
      p.hp = Math.min(p.maxHp, p.hp + 34);
      areaBlast(190, power * 0.8, color, "guard");
    },
    garudamon: () => {
      areaBlast(240, power * 0.85, color, "flare");
      radialPierce(10, power * 0.62, color, 760, 0.82, 2);
    },
    megakabuterimon: () => {
      areaBlast(210, power * 1.05, color, "horn");
      radialPierce(8, power * 0.75, color, 620, 1.1, 4);
    },
    zudomon: () => {
      areaBlast(250, power * 1.15, color, "hammer");
    },
    wargreymon: () => {
      areaBlast(260, power * 1.1, color, "brave");
      radialPierce(18, power * 0.72, color, 760, 1.05, 5);
    },
    metalgarurumon: () => {
      rapidLockOn(18, power * 0.68, color, 820);
      radialPierce(14, power * 0.52, color, 720, 0.8, 2);
    },
    machinedramon: () => {
      areaBlast(310, power * 1.25, color, "infinity");
      lineBeam(0, 72, canvas.width * 0.72, power * 1.05, color, "infinity");
      rapidLockOn(10, power * 0.9, color, 620);
    },
    mugendramon: () => {
      areaBlast(320, power * 1.3, color, "mugen");
      lineBeam(0, 84, canvas.width * 0.78, power * 1.12, color, "mugen");
      rapidLockOn(12, power * 0.95, color, 660);
    },
    hououmon: () => {
      areaBlast(310, power * 1.1, color, "holy");
      radialPierce(20, power * 0.58, color, 820, 0.9, 3);
    },
    phoenixmon: () => {
      p.hp = Math.min(p.maxHp, p.hp + 80);
      areaBlast(330, power * 1.18, color, "rebirth");
      radialPierce(16, power * 0.62, color, 850, 0.92, 3);
    },
    herculeskabuterimon: () => {
      areaBlast(340, power * 1.35, color, "giga");
      radialPierce(12, power * 0.9, color, 700, 1.15, 5);
    },
    vikemon: () => {
      areaBlast(360, power * 1.3, color, "arctic");
      rapidLockOn(8, power * 0.72, color, 680);
    },
    holydramon: () => {
      p.hp = Math.min(p.maxHp, p.hp + 100);
      areaBlast(340, power * 1.2, color, "holy-dragon");
      radialPierce(18, power * 0.62, color, 840, 0.92, 3);
    },
    rosemon: () => {
      areaBlast(330, power * 1.2, color, "rose");
      rapidLockOn(14, power * 0.72, color, 760);
    }
  };
  (actions[form.id] || (() => areaBlast(210, power, color, "special")))();
  state.specialEffects.push({
    x: p.x,
    y: p.y,
    radius: isMegaForm(form) ? 320 : 220,
    color,
    life: 0.55,
    maxLife: 0.55,
    style: specialVisualStyle(form),
    label: specialMoveName(form)
  });
  burst(p.x, p.y, color, isMegaForm(form) ? 90 : 48);
}

function areaBlast(radius, damage, color, mode) {
  const p = state.player;
  for (const enemy of state.enemies) {
    const dist = Math.hypot(enemy.x - p.x, enemy.y - p.y);
    if (dist < radius + enemy.radius) {
      enemy.hp -= damage * (1 - dist / (radius + enemy.radius) * 0.38);
      if (mode === "curse" || mode === "infinity") enemy.speed *= 0.94;
      if (mode === "arctic") enemy.speed *= 0.72;
      if (mode === "holy" || mode === "holy-dragon") enemy.speed *= 0.88;
      if (mode === "rose") enemy.speed *= 0.8;
      burst(enemy.x, enemy.y, color, 8);
    }
  }
}

function lineBeam(angle, width, length, damage, color, mode) {
  const p = state.player;
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  for (const enemy of state.enemies) {
    const ex = enemy.x - p.x;
    const ey = enemy.y - p.y;
    const along = ex * dx + ey * dy;
    const perp = Math.abs(ex * dy - ey * dx);
    if (Math.abs(along) < length && perp < width + enemy.radius) {
      enemy.hp -= damage;
      if (mode === "infinity" || mode === "mugen") enemy.speed *= 0.82;
      burst(enemy.x, enemy.y, color, 12);
    }
  }
}

function radialPierce(count, damage, color, speed, life, pierce) {
  const p = state.player;
  for (let i = 0; i < count; i += 1) {
    const angle = (i * Math.PI * 2) / count + state.elapsed * 0.35;
    state.projectiles.push({
      x: p.x,
      y: p.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life,
      damage,
      radius: 8,
      color,
      pierce,
      chain: state.player.effects.chain + 1,
      hitIds: new Set()
    });
  }
}

function rapidLockOn(count, damage, color, speed) {
  const p = state.player;
  const targets = [...state.enemies]
    .sort((a, b) => Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(b.x - p.x, b.y - p.y))
    .slice(0, count);
  const fallbackCount = targets.length ? 0 : count;

  targets.forEach((target, index) => {
    const angle = Math.atan2(target.y - p.y, target.x - p.x) + (index % 3 - 1) * 0.08;
    state.projectiles.push({
      x: p.x,
      y: p.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.92,
      damage,
      radius: 6,
      color,
      pierce: 1,
      chain: 0,
      hitIds: new Set()
    });
  });

  if (fallbackCount > 0) radialPierce(Math.min(12, fallbackCount), damage, color, speed, 0.75, 1);
}

function showSpecialCutin(form, duration = 920) {
  const image = getAnimatedSprite(form, 280);
  ui.cutinImage.src = image ? image.src : form.sprites[0];
  ui.cutinImage.alt = form.name;
  ui.cutinName.textContent = `${form.name} / ${specialMoveName(form)}`;
  ui.specialCutin.classList.remove("hidden");
  window.setTimeout(() => {
    if (!specialCutinLock) ui.specialCutin.classList.add("hidden");
  }, duration);
}

function updateEnemies(dt) {
  const p = state.player;
  for (let i = state.enemies.length - 1; i >= 0; i -= 1) {
    const enemy = state.enemies[i];
    const angle = Math.atan2(p.y - enemy.y, p.x - enemy.x);
    enemy.x += Math.cos(angle) * enemy.speed * dt;
    enemy.y += Math.sin(angle) * enemy.speed * dt;

    if (Math.hypot(enemy.x - p.x, enemy.y - p.y) < enemy.radius + currentForm().radius) {
      const shieldReduce = Math.min(0.5, p.effects.shield * 0.1);
      p.hp -= enemy.damage * (1 - shieldReduce) * dt;
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

function updatePassiveEffects(dt) {
  const p = state.player;
  const effects = p.effects;
  const form = currentForm();

  if (effects.shield > 0) {
    const radius = 46 + effects.shield * 18;
    const damage = (5 + effects.shield * 4) * dt;
    for (const enemy of state.enemies) {
      if (Math.hypot(enemy.x - p.x, enemy.y - p.y) < radius + enemy.radius) {
        enemy.hp -= damage;
      }
    }
  }

  if (effects.orbit > 0) {
    const blades = Math.min(4, effects.orbit);
    const radius = 76 + effects.orbit * 12;
    for (let i = 0; i < blades; i += 1) {
      const angle = state.elapsed * (2.2 + effects.orbit * 0.2) + (i * Math.PI * 2) / blades;
      const bx = p.x + Math.cos(angle) * radius;
      const by = p.y + Math.sin(angle) * radius;
      for (const enemy of state.enemies) {
        if (Math.hypot(enemy.x - bx, enemy.y - by) < enemy.radius + 18) {
          enemy.hp -= (14 + effects.orbit * 5) * dt;
        }
      }
    }
  }

  if (effects.drones > 0) {
    p.droneCooldown -= dt;
    if (p.droneCooldown <= 0) {
      const count = Math.min(4, effects.drones);
      for (let i = 0; i < count; i += 1) {
        const target = nearestEnemy(240 + effects.drones * 42);
        if (target) fireDroneShot(i, target);
      }
      p.droneCooldown = Math.max(0.34, 1.25 - effects.drones * 0.16);
    }
  }

  if (effects.nova > 0) {
    p.novaCooldown -= dt;
    if (p.novaCooldown <= 0) {
      const radius = 130 + effects.nova * 34;
      for (const enemy of state.enemies) {
        const dist = Math.hypot(enemy.x - p.x, enemy.y - p.y);
        if (dist < radius) {
          enemy.hp -= 18 + effects.nova * 14;
        }
      }
      burst(p.x, p.y, form.color, 32 + effects.nova * 10);
      playTone(160 + effects.nova * 55, 0.16, "sawtooth", 0.025);
      p.novaCooldown = Math.max(2.4, 6.2 - effects.nova * 0.7);
    }
  }
}

function killEnemy(enemy) {
  if (enemy.finalBoss) {
    state.finalBossDefeated = true;
    state.discovered[enemy.monsterId] = true;
    saveCodex();
    burst(enemy.x, enemy.y, enemy.color, 120);
    playTone(980, 0.32, "sawtooth", 0.055);
    endGame(true);
    return;
  }
  state.player.xp += enemy.xp;
  state.data[enemy.type] += enemy.boss ? 8 : 1;
  if (enemy.monsterId) {
    state.discovered[enemy.monsterId] = true;
    saveCodex();
  }
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
  dropEarlyVaccineShard(enemy);
  burst(enemy.x, enemy.y, enemy.color, enemy.boss ? 38 : 12);
  playTone(enemy.boss ? 90 : 260, enemy.boss ? 0.18 : 0.05, enemy.boss ? "sawtooth" : "triangle", 0.025);
  while (state.player.xp >= state.player.xpNext) {
    levelUp();
  }
}

function dropEarlyVaccineShard(enemy) {
  if (state.elapsed > 180 || enemy.boss) return;
  if (!["botamon", "koromon"].includes(enemy.monsterId)) return;
  if (Math.random() > 0.35) return;
  state.pickups.push({
    x: enemy.x + rand(-14, 14),
    y: enemy.y + rand(-14, 14),
    type: "Vaccine",
    value: 1,
    radius: 4
  });
}

function updateProjectiles(dt) {
  for (let i = state.projectiles.length - 1; i >= 0; i -= 1) {
    const shot = state.projectiles[i];
    shot.x += shot.vx * dt;
    shot.y += shot.vy * dt;
    shot.life -= dt;
    let hit = false;
    for (const enemy of state.enemies) {
      if (shot.hitIds && shot.hitIds.has(enemy.id)) continue;
      if (Math.hypot(enemy.x - shot.x, enemy.y - shot.y) < enemy.radius + shot.radius) {
        enemy.hp -= shot.damage;
        if (shot.hitIds) shot.hitIds.add(enemy.id);
        if (shot.chain > 0) chainDamage(enemy, shot.chain, shot.damage * 0.42, shot.color);
        burst(shot.x, shot.y, shot.color, 4);
        shot.pierce -= 1;
        hit = shot.pierce < 0;
        break;
      }
    }
    if (hit || shot.life <= 0) {
      state.projectiles.splice(i, 1);
    }
  }
}

function chainDamage(source, depth, damage, color) {
  let jumps = Math.min(4, depth);
  const candidates = state.enemies
    .filter((enemy) => enemy.id !== source.id && Math.hypot(enemy.x - source.x, enemy.y - source.y) < 170)
    .sort((a, b) => Math.hypot(a.x - source.x, a.y - source.y) - Math.hypot(b.x - source.x, b.y - source.y));

  for (const enemy of candidates) {
    if (jumps <= 0) break;
    enemy.hp -= damage;
    burst(enemy.x, enemy.y, color, 5);
    jumps -= 1;
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

function updateSpecialEffects(dt) {
  for (let i = state.specialEffects.length - 1; i >= 0; i -= 1) {
    const effect = state.specialEffects[i];
    effect.life -= dt;
    if (effect.life <= 0) state.specialEffects.splice(i, 1);
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
  if (upgrade.id === "shield") p.effects.shield += 1;
  if (upgrade.id === "drones") p.effects.drones += 1;
  if (upgrade.id === "beam") p.effects.beam += 1;
  if (upgrade.id === "orbit") p.effects.orbit += 1;
  if (upgrade.id === "chain") p.effects.chain += 1;
  if (upgrade.id === "nova") p.effects.nova += 1;
  p.skills = summarizeSkills();
  ui.levelPanel.classList.add("hidden");
  pausedForChoice = false;
  tryEvolution(true);
}

function summarizeSkills() {
  const upgradeSkills = Object.entries(state.upgradeCounts)
    .filter(([, count]) => count > 0)
    .map(([id, count]) => {
      const upgrade = UPGRADES.find((item) => item.id === id);
      return { name: upgrade.name, count };
    });
  const effectNames = {
    shield: "Damage Shield",
    drones: "Attack Drone",
    beam: "Pierce Beam",
    orbit: "Orbit Blade",
    chain: "Chain Spark",
    nova: "Data Nova"
  };
  const evolutionSkills = Object.entries(state.player.effects)
    .filter(([id, count]) => count > 0 && state.upgradeCounts[id] === 0)
    .map(([id, count]) => ({ name: effectNames[id], count }));
  return [...upgradeSkills, ...evolutionSkills];
}

function tryEvolution(fromChoice = false) {
  if (evolutionLock) return;
  const p = state.player;
  const form = currentForm();
  const next = pickEvolutionCandidate(form);

  if (next && next !== p.formId) {
    evolveTo(next);
  } else if (fromChoice) {
    state.shake = 5;
  }
}

function pickEvolutionCandidate(form) {
  if (!form.evolutionTo.length) return null;
  const p = state.player;
  const d = state.data;
  const u = state.upgradeCounts;
  const requiredLevel = { Fresh: 2, "In-Training": 3, Rookie: 6, Champion: 10, Ultimate: 14, Mega: 99 }[form.stage] || 4;
  if (p.level < requiredLevel) return null;

  const route = {
    tanemon: () => {
      if (d.Vaccine >= 8 || u.shield >= 1 || u.beam >= 1) return "plotmon";
      if (d.Virus >= 8 || u.drones >= 1 || u.orbit >= 1) return "kokuwamon";
      return "palmon";
    },
    babumon: () => {
      if (d.Vaccine >= 8 || u.power >= 1 || u.shield >= 1) return "tentomon";
      if (d.Free >= 8 || u.magnet >= 1 || u.regen >= 1) return "gomamon";
      return "biyomon";
    },
    botamon: () => (d.Data >= 12 || u.speed >= 2 || u.cooldown >= 2 ? "tsunomon" : "koromon"),
    koromon: () => {
      if (d.Free >= 22 || u.magnet >= 3) return "patamon";
      return "agumon";
    },
    tsunomon: () => "gabumon",
    agumon: () => {
      if (d.Virus >= 24 || u.area >= 2 || u.orbit >= 1) return "devimon";
      return "greymon";
    },
    gabumon: () => "garurumon",
    patamon: () => "angemon",
    tentomon: () => "kabuterimon",
    palmon: () => "togemon",
    plotmon: () => "tailmon",
    kokuwamon: () => "kuwagamon",
    gomamon: () => "ikkakumon",
    biyomon: () => "birdramon",
    greymon: () => (d.Virus >= 36 || u.chain >= 2 ? "skullgreymon" : "metalgreymon"),
    garurumon: () => "weregarurumon",
    devimon: () => "skullgreymon",
    angemon: () => "holyangemon",
    kuwagamon: () => "andromon",
    birdramon: () => "garudamon",
    kabuterimon: () => "megakabuterimon",
    ikkakumon: () => "zudomon",
    togemon: () => "lilymon",
    tailmon: () => "angewomon",
    metalgreymon: () => "wargreymon",
    weregarurumon: () => "metalgarurumon",
    skullgreymon: () => "mugendramon",
    andromon: () => "machinedramon",
    garudamon: () => (d.Vaccine >= d.Data ? "hououmon" : "phoenixmon"),
    megakabuterimon: () => "herculeskabuterimon",
    zudomon: () => "vikemon",
    holyangemon: () => "holydramon",
    lilymon: () => "rosemon",
    angewomon: () => "holydramon"
  };

  const picked = route[form.id] ? route[form.id]() : form.evolutionTo[0];
  return form.evolutionTo.includes(picked) ? picked : form.evolutionTo[0];
}

function evolveTo(formId) {
  const form = FORMS.find((item) => item.id === formId);
  evolutionLock = true;
  state.player.formId = formId;
  state.player.maxHp += 26;
  state.player.hp = state.player.maxHp;
  state.player.attack *= 1.28;
  state.player.range *= 1.08;
  applyEvolutionBonus(formId);
  if (hasSpecialMove(form)) {
    state.player.specialCooldownLeft = 0;
  }
  if (isMegaForm(form) && state.megaReachedAt === null) {
    state.megaReachedAt = state.elapsed;
    state.bossTimer = Infinity;
  }
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

function applyEvolutionBonus(formId) {
  const p = state.player;
  const bonus = {
    koromon: () => {
      p.maxHp += 8;
      p.hp = Math.min(p.maxHp, p.hp + 20);
    },
    tsunomon: () => {
      p.speed *= 1.06;
      p.effects.drones += 1;
    },
    agumon: () => {
      p.attack *= 1.12;
      p.effects.beam += 1;
    },
    gabumon: () => {
      p.speed *= 1.08;
      p.effects.drones += 1;
    },
    biyomon: () => {
      p.speed *= 1.1;
      p.effects.nova += 1;
      p.effects.beam += 1;
    },
    tentomon: () => {
      p.effects.shield += 1;
      p.effects.orbit += 1;
    },
    gomamon: () => {
      p.speed *= 1.06;
      p.effects.drones += 1;
      p.effects.shield += 1;
    },
    palmon: () => {
      p.effects.nova += 1;
      p.magnet *= 1.12;
    },
    plotmon: () => {
      p.effects.shield += 1;
      p.speed *= 1.08;
    },
    kokuwamon: () => {
      p.effects.drones += 1;
      p.effects.chain += 1;
    },
    devimon: () => {
      p.effects.orbit += 1;
      p.effects.chain += 1;
    },
    greymon: () => {
      p.attack *= 1.18;
      p.effects.beam += 1;
    },
    garurumon: () => {
      p.speed *= 1.12;
      p.effects.drones += 1;
    },
    angemon: () => {
      p.effects.shield += 2;
      p.effects.nova += 1;
    },
    kuwagamon: () => {
      p.effects.orbit += 2;
    },
    birdramon: () => {
      p.effects.nova += 1;
      p.effects.beam += 1;
    },
    kabuterimon: () => {
      p.effects.shield += 1;
      p.effects.beam += 1;
      p.attack *= 1.08;
    },
    ikkakumon: () => {
      p.effects.shield += 2;
      p.maxHp += 16;
      p.hp = Math.min(p.maxHp, p.hp + 32);
    },
    togemon: () => {
      p.effects.orbit += 1;
      p.effects.nova += 1;
    },
    tailmon: () => {
      p.speed *= 1.14;
      p.effects.beam += 1;
    },
    metalgreymon: () => {
      p.effects.beam += 2;
      p.effects.shield += 1;
    },
    weregarurumon: () => {
      p.effects.drones += 2;
      p.speed *= 1.12;
    },
    skullgreymon: () => {
      p.effects.chain += 2;
      p.effects.orbit += 1;
    },
    andromon: () => {
      p.effects.shield += 1;
      p.effects.drones += 1;
    },
    garudamon: () => {
      p.effects.nova += 2;
      p.speed *= 1.1;
    },
    megakabuterimon: () => {
      p.effects.shield += 2;
      p.effects.orbit += 1;
      p.attack *= 1.12;
    },
    zudomon: () => {
      p.effects.shield += 2;
      p.effects.chain += 1;
      p.attack *= 1.1;
    },
    holyangemon: () => {
      p.effects.shield += 2;
      p.effects.beam += 2;
      p.maxHp += 24;
    },
    lilymon: () => {
      p.effects.nova += 2;
      p.effects.orbit += 1;
      p.speed *= 1.08;
    },
    angewomon: () => {
      p.effects.beam += 2;
      p.effects.shield += 1;
      p.speed *= 1.06;
    },
    wargreymon: () => {
      p.effects.beam += 3;
      p.effects.nova += 1;
    },
    metalgarurumon: () => {
      p.effects.drones += 3;
      p.effects.chain += 1;
    },
    machinedramon: () => {
      p.effects.drones += 2;
      p.effects.nova += 2;
      p.effects.orbit += 1;
    },
    mugendramon: () => {
      p.effects.drones += 3;
      p.effects.chain += 2;
      p.effects.shield += 1;
    },
    hououmon: () => {
      p.effects.nova += 3;
      p.effects.beam += 2;
    },
    phoenixmon: () => {
      p.effects.nova += 3;
      p.effects.shield += 2;
      p.maxHp += 36;
    },
    herculeskabuterimon: () => {
      p.effects.shield += 3;
      p.effects.orbit += 2;
      p.attack *= 1.18;
    },
    vikemon: () => {
      p.effects.shield += 3;
      p.effects.chain += 2;
      p.attack *= 1.15;
    },
    holydramon: () => {
      p.effects.shield += 3;
      p.effects.beam += 3;
      p.maxHp += 48;
    },
    rosemon: () => {
      p.effects.nova += 4;
      p.effects.orbit += 2;
      p.speed *= 1.12;
    }
  };
  if (bonus[formId]) bonus[formId]();
  p.skills = summarizeSkills();
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
  if (resizeQueued) resizeCanvasToDisplay();
  const shakeX = state.shake ? rand(-state.shake, state.shake) : 0;
  const shakeY = state.shake ? rand(-state.shake, state.shake) : 0;
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(shakeX, shakeY);
  drawBackground();
  drawPickups();
  drawProjectiles();
  drawEnemies();
  drawPassiveEffects();
  drawPlayer();
  drawSpecialEffects();
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

function getAnimatedSprite(monsterData, frameMs = 320) {
  const sprites = monsterData?.sprites || [];
  if (!sprites.length) return null;
  const index = sprites.length > 1 ? Math.floor((state.elapsed * 1000) / frameMs) % sprites.length : 0;
  const image = spriteImages.get(sprites[index]);
  return image && image.complete && image.naturalWidth > 0 ? image : null;
}

function drawMonsterSprite(monsterData, x, y, size, label = "???") {
  const image = getAnimatedSprite(monsterData);
  if (image) {
    ctx.drawImage(image, x - size / 2, y - size / 2, size, size);
    return true;
  }

  ctx.fillStyle = monsterData?.color || "#4ff6ff";
  ctx.beginPath();
  ctx.arc(x, y, size * 0.28, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#001018";
  ctx.font = "bold 12px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText(label.slice(0, 3).toUpperCase(), x, y + 4);
  return false;
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
  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.shadowColor = form.color;
  ctx.shadowBlur = 18;

  if (drawMonsterSprite(form, 0, 0, form.radius * 5, form.name)) {
    ctx.restore();
    return;
  }
  ctx.restore();
}

function drawPassiveEffects() {
  const p = state.player;
  const pos = toScreen(p.x, p.y);
  const form = currentForm();
  const effects = p.effects;

  if (effects.shield > 0) {
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.strokeStyle = hexToRgba(form.color, 0.45);
    ctx.lineWidth = 2;
    ctx.shadowColor = form.color;
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(0, 0, 46 + effects.shield * 18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  if (effects.orbit > 0) {
    const blades = Math.min(4, effects.orbit);
    const radius = 76 + effects.orbit * 12;
    ctx.save();
    ctx.strokeStyle = hexToRgba("#ff3e71", 0.5);
    ctx.lineWidth = 2;
    for (let i = 0; i < blades; i += 1) {
      const angle = state.elapsed * (2.2 + effects.orbit * 0.2) + (i * Math.PI * 2) / blades;
      const bx = pos.x + Math.cos(angle) * radius;
      const by = pos.y + Math.sin(angle) * radius;
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineTo(bx, by);
      ctx.stroke();
      ctx.fillStyle = "#ff3e71";
      polygon(bx, by, 11, 3, -angle);
      ctx.fill();
    }
    ctx.restore();
  }

  if (effects.drones > 0) {
    const count = Math.min(4, effects.drones);
    ctx.save();
    ctx.fillStyle = form.color;
    ctx.strokeStyle = "#ffffff";
    ctx.shadowColor = form.color;
    ctx.shadowBlur = 12;
    for (let i = 0; i < count; i += 1) {
      const angle = state.elapsed * 2.6 + (i * Math.PI * 2) / count;
      const x = pos.x + Math.cos(angle) * 52;
      const y = pos.y + Math.sin(angle) * 52;
      polygon(x, y, 8, 6, angle);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }
}

function drawEnemies() {
  for (const enemy of state.enemies) {
    const pos = toScreen(enemy.x, enemy.y);
    const monsterData = MONSTER_BY_ID[enemy.monsterId] || MONSTER_BY_ID.botamon;
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.shadowColor = enemy.color;
    ctx.shadowBlur = enemy.boss ? 22 : 10;
    drawMonsterSprite(monsterData, 0, 0, enemy.radius * (enemy.boss ? 4.1 : 3.7), enemy.name || monsterData.name);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#fff";
    ctx.fillRect(-enemy.radius, -enemy.radius - 8, enemy.radius * 2 * (enemy.hp / enemy.maxHp), 3);
    if (enemy.boss) {
      ctx.font = "bold 10px Segoe UI";
      ctx.textAlign = "center";
      ctx.fillText(enemy.finalBoss ? "FINAL BOSS" : "BOSS", 0, enemy.radius + 16);
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

function drawSpecialEffects() {
  for (const effect of state.specialEffects) {
    const pos = toScreen(effect.x, effect.y);
    const t = 1 - effect.life / effect.maxLife;
    ctx.save();
    ctx.globalAlpha = Math.max(0, effect.life / effect.maxLife);
    ctx.strokeStyle = effect.color;
    ctx.fillStyle = hexToRgba(effect.color, 0.08);
    ctx.lineWidth = 4;
    ctx.shadowColor = effect.color;
    ctx.shadowBlur = 26;
    drawSpecialVisual(effect, pos, t);
    ctx.font = "bold 14px Consolas, monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(effect.label, pos.x, pos.y - effect.radius * 0.28);
    ctx.restore();
  }
}

function drawSpecialVisual(effect, pos, t) {
  const r = effect.radius * (0.35 + t * 0.85);
  if (effect.style === "laser") {
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(pos.x - canvas.width * 0.7, pos.y);
    ctx.lineTo(pos.x + canvas.width * 0.7, pos.y);
    ctx.stroke();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
    return;
  }
  if (effect.style === "missile") {
    for (let i = 0; i < 12; i += 1) {
      const a = (i * Math.PI * 2) / 12 + t * 2;
      const x = pos.x + Math.cos(a) * r;
      const y = pos.y + Math.sin(a) * r;
      polygon(x, y, 14, 3, a);
      ctx.fill();
      ctx.stroke();
    }
    return;
  }
  if (effect.style === "sword") {
    ctx.lineWidth = 8;
    for (let i = 0; i < 5; i += 1) {
      const a = -0.9 + i * 0.45;
      ctx.beginPath();
      ctx.moveTo(pos.x - Math.cos(a) * r * 0.2, pos.y - Math.sin(a) * r * 0.2);
      ctx.lineTo(pos.x + Math.cos(a) * r, pos.y + Math.sin(a) * r);
      ctx.stroke();
    }
    return;
  }
  if (effect.style === "holy") {
    ctx.lineWidth = 5;
    for (let i = 0; i < 10; i += 1) {
      const a = (i * Math.PI * 2) / 10;
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineTo(pos.x + Math.cos(a) * r, pos.y + Math.sin(a) * r);
      ctx.stroke();
    }
  }
  if (effect.style === "flame" || effect.style === "flower" || effect.style === "horn" || effect.style === "wave") {
    const count = effect.style === "flower" ? 14 : effect.style === "wave" ? 4 : 8;
    for (let i = 0; i < count; i += 1) {
      const a = (i * Math.PI * 2) / count + t * (effect.style === "wave" ? 0 : 2);
      const petalR = effect.style === "flower" ? 22 : effect.style === "wave" ? r * 0.25 : 16;
      ctx.beginPath();
      ctx.ellipse(pos.x + Math.cos(a) * r * 0.45, pos.y + Math.sin(a) * r * 0.45, petalR, petalR * 0.45, a, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
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

  updateSpecialButton(form);
}

function updateSpecialButton(form = currentForm()) {
  if (!ui.touchSpecial) return;
  const p = state.player;
  const unlocked = hasSpecialMove(form);
  const ready = unlocked && p.specialCooldownLeft <= 0;
  ui.touchSpecial.classList.toggle("locked", !unlocked);
  ui.touchSpecial.classList.toggle("ready", ready);
  ui.touchSpecial.classList.toggle("cooling", unlocked && !ready);
  ui.touchSpecial.disabled = !unlocked;
  if (!unlocked) {
    ui.touchSpecial.textContent = "SPECIAL LOCK";
  } else if (!ready) {
    ui.touchSpecial.textContent = `SPECIAL ${Math.ceil(p.specialCooldownLeft)}s`;
  } else {
    ui.touchSpecial.textContent = specialMoveName(form);
  }
}

function evoReadiness() {
  const p = state.player;
  const d = state.data;
  if (p.formId === "botamon") {
    return clamp(Math.round((Math.max(d.Vaccine, d.Free, d.Data * 0.7) / 16) * 100), 0, 100);
  }
  if (p.formId === "babumon") {
    return clamp(Math.round((Math.max(d.Vaccine, d.Data, d.Free) / 14) * 100), 0, 100);
  }
  if (p.formId === "tanemon") {
    return clamp(Math.round((Math.max(d.Data, d.Vaccine, d.Virus) / 14) * 100), 0, 100);
  }
  if (p.formId === "koromon") {
    return clamp(Math.round((Math.max(d.Vaccine, d.Free * 0.6) / 14) * 100), 0, 100);
  }
  if (p.formId === "agumon" || p.formId === "gabumon") {
    return clamp(Math.round((Math.max(d.Virus / 26, d.Vaccine / 42) * 100)), 0, 100);
  }
  return clamp(Math.round((d.Virus / 54) * 100), 0, 100);
}

function showCodex() {
  const roots = FORMS.filter((form) => form.evolutionFrom.length === 0);
  const discoveredCount = Object.keys(state.discovered).filter((id) => state.discovered[id]).length;
  ui.codexEntries.innerHTML = `
    <div class="codex-summary">
      <strong>EVOLUTION TREE</strong>
      <span>${discoveredCount}/${FORMS.length} discovered</span>
    </div>
    <div class="evolution-tree">
      ${roots.map((form) => renderEvolutionBranch(form.id)).join("")}
    </div>
  `;
  ui.codexPanel.classList.remove("hidden");
}

function renderEvolutionBranch(formId, visited = []) {
  const form = MONSTER_BY_ID[formId];
  if (!form) return "";
  const looped = visited.includes(formId);
  const children = looped ? [] : form.evolutionTo;
  return `
    <div class="tree-root">
      ${renderEvolutionNode(form)}
      ${children.length ? `<div class="tree-children">${children.map((id) => renderEvolutionBranch(id, [...visited, formId])).join("")}</div>` : ""}
    </div>
  `;
}

function renderEvolutionNode(form) {
  const found = state.discovered[form.id];
  const from = form.evolutionFrom.length ? form.evolutionFrom.map((id) => MONSTER_BY_ID[id]?.name || id).join(" / ") : form.role === "enemy" ? "WILD ENEMY" : "START";
  const to = form.evolutionTo.length ? form.evolutionTo.map((id) => MONSTER_BY_ID[id]?.name || id).join(" / ") : "FINAL";
  const role = form.role === "enemy" ? "Enemy discovery" : "Player route";
  const portrait = found ? spritePreviewHtml(form) : `<span class="unknown-mark">???</span>`;
  return `
    <article class="tree-node ${found ? "found" : "locked"}" style="--node-color:${found ? form.color : "rgba(255,255,255,.28)"}">
      <div class="tree-portrait">${portrait}</div>
      <div class="tree-copy">
        <strong>${found ? form.name : "Undiscovered"}</strong>
        <span>${found ? `${form.stage} / ${form.attribute}` : "Stage / Attribute ???"}</span>
        <small>ROLE: ${found ? role : "???"}</small>
        <small>FROM: ${found ? from : "???"}</small>
        <small>TO: ${found ? to : "???"}</small>
        <small>COND: ${found ? form.condition : "???"}</small>
      </div>
    </article>
  `;
}

function spritePreviewHtml(form) {
  const sprites = form.sprites && form.sprites.length ? form.sprites : [];
  if (!sprites.length) return "画像準備中 / silhouette";
  return `
    <span class="anim-preview">
      ${sprites.map((src, index) => `<img class="anim-frame frame-${index}" src="${src}" alt="${form.name} frame ${index + 1}" onerror="this.classList.add('missing')">`).join("")}
    </span>
  `;
}

function hydrateStarterPreviews() {
  document.querySelectorAll("[data-preview]").forEach((preview) => {
    const form = MONSTER_BY_ID[preview.dataset.preview];
    if (form) preview.innerHTML = spritePreviewHtml(form);
  });
}

function endGame(cleared) {
  gameEnded = true;
  ui.resultTitle.textContent = cleared ? "DIABOROMON DELETED" : "GAME OVER";
  ui.resultText.textContent = cleared
    ? `ENDING UNLOCKED / CODEX ${Object.keys(state.discovered).length}/${FORMS.length}. Tap the credit logo to jump to the shopping street.`
    : `接続時間 ${formatTime(state.elapsed)}。吸収データと能力選択を変えると別ルートへ進化します。`;
  ui.endingCredit.href = SHOTENGAI_URL;
  ui.endingDevice.classList.toggle("hidden", !cleared);
  ui.endingCredit.classList.toggle("hidden", !cleared);
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
  if (specialCutinLock) return;
  pausedForChoice = !pausedForChoice;
  ui.levelPanel.classList.add("hidden");
}

window.addEventListener("keydown", (event) => {
  keys.add(event.key.toLowerCase());
  if (event.repeat) return;
  if (event.code === "Space") {
    event.preventDefault();
    togglePause();
  } else if (event.code === "ShiftLeft" || event.code === "ShiftRight" || event.code === "Enter") {
    event.preventDefault();
    triggerSpecialMove();
  }
});

window.addEventListener("keyup", (event) => keys.delete(event.key.toLowerCase()));
window.addEventListener("resize", () => {
  resizeQueued = true;
});
window.addEventListener("orientationchange", () => {
  resizeQueued = true;
});
window.addEventListener("pointerdown", startAudio, { once: true });
window.addEventListener("keydown", startAudio, { once: true });

ui.codexButton.addEventListener("click", showCodex);
ui.closeCodex.addEventListener("click", () => ui.codexPanel.classList.add("hidden"));
ui.restartButton.addEventListener("click", resetGame);
document.querySelectorAll("[data-starter]").forEach((button) => {
  button.addEventListener("click", () => beginRun(button.dataset.starter));
});
ui.touchSpecial.addEventListener("click", triggerSpecialMove);
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
hydrateStarterPreviews();

requestAnimationFrame(loop);
