/* =========================
   試合開始・リスポーン
========================= */

let matchStartTimer = 0;

let playerRespawnTimer = 0;
let cpuRespawnTimer = 0;

let playerPrevStocks = 0;
let cpuPrevStocks = 0;

let playerInvincibleTimer = 0;
let cpuInvincibleTimer = 0;

const MATCH_START_TIME = 240;
const RESPAWN_WAIT_TIME = 90;
const INVINCIBLE_TIME = 120;

function resetBattleTimers() {
  matchStartTimer = MATCH_START_TIME;

  playerRespawnTimer = 0;
  cpuRespawnTimer = 0;

  playerInvincibleTimer = 0;
  cpuInvincibleTimer = 0;

  playerPrevStocks = player.stocks;
  cpuPrevStocks = cpu.stocks;
}

function getSpawnGap() {
  return 250;
}

function startRespawn(fighter, isCpu) {
  fighter.x = -9999;
  fighter.y = -9999;
  fighter.vx = 0;
  fighter.vy = 0;

  if (isCpu) {
    cpuRespawnTimer = RESPAWN_WAIT_TIME;
  } else {
    playerRespawnTimer = RESPAWN_WAIT_TIME;
  }
}

function finishRespawn(fighter, isCpu) {
  const centerX =
    stage.x + stage.w / 2;

  const safeGap = 300;

  fighter.x =
    isCpu
      ? centerX + safeGap
      : centerX - safeGap - 120;

  fighter.y =
    stage.y -
    fighter.h -
    100;

  fighter.vx = 0;
  fighter.vy = 0;

  fighter.damage = 0;

  fighter.onGround = false;

  fighter.dir =
    isCpu ? -1 : 1;

  if (isCpu) {
    cpuInvincibleTimer = INVINCIBLE_TIME;
  } else {
    playerInvincibleTimer = INVINCIBLE_TIME;
  }
}

function updateRespawn() {
  if (
    player.stocks < playerPrevStocks &&
    player.stocks > 0
  ) {
    startRespawn(player, false);
  }

  if (
    cpu.stocks < cpuPrevStocks &&
    cpu.stocks > 0
  ) {
    startRespawn(cpu, true);
  }

  playerPrevStocks = player.stocks;
  cpuPrevStocks = cpu.stocks;

  if (playerRespawnTimer > 0) {
    playerRespawnTimer--;

    if (playerRespawnTimer === 0) {
      finishRespawn(player, false);
    }
  }

  if (cpuRespawnTimer > 0) {
    cpuRespawnTimer--;

    if (cpuRespawnTimer === 0) {
      finishRespawn(cpu, true);
    }
  }

  if (playerInvincibleTimer > 0) {
    playerInvincibleTimer--;
  }

  if (cpuInvincibleTimer > 0) {
    cpuInvincibleTimer--;
  }
}

/* =========================
   カウントダウン表示
========================= */

function drawStartCountdown() {
  if (matchStartTimer <= 0) return;

  let text = "";

  if (matchStartTimer > 180) {
    text = "3";
  } else if (matchStartTimer > 120) {
    text = "2";
  } else if (matchStartTimer > 60) {
    text = "1";
  } else {
    text = "START";
  }

  ctx.save();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.font =
    text === "START"
      ? "bold 76px Arial"
      : "bold 120px Arial";

  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "#4cc9f0";
  ctx.shadowBlur = 35;

  ctx.fillText(
    text,
    GAME_W / 2,
    GAME_H / 2
  );

  ctx.restore();
}

function drawRespawnText() {
  ctx.save();

  ctx.textAlign = "center";
  ctx.font = "bold 22px Arial";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "#4cc9f0";
  ctx.shadowBlur = 18;

  if (playerRespawnTimer > 0) {
    ctx.fillText(
      "PLAYER RESPAWNING...",
      GAME_W / 2,
      GAME_H / 2 + 90
    );
  }

  if (cpuRespawnTimer > 0) {
    ctx.fillText(
      "CPU RESPAWNING...",
      GAME_W / 2,
      GAME_H / 2 + 125
    );
  }

  ctx.restore();
}

/* =========================
   ゲーム準備
========================= */

function setupGame() {
  stage.w = GAME_W * 1.6;
  stage.h = STAGE.height;

  stage.x =
    GAME_W / 2 -
    stage.w / 2;

  stage.y =
    GAME_H -
    stage.h;

  updatePlatformPositions();

  const centerX =
    stage.x + stage.w / 2;

  const gap = 300;

  player = new Fighter(
    centerX - gap - 120,
    stage.y - 220,
    selectedChar,
    false
  );

  const cpuChars = [
    "balance",
    "power",
    "speed"
  ];

  const randomCpuChar =
    cpuChars[
      Math.floor(
        Math.random() *
        cpuChars.length
      )
    ];

  cpu = new Fighter(
    centerX + gap,
    stage.y - 220,
    randomCpuChar,
    true
  );

  player.dir = 1;
  cpu.dir = -1;

  projectiles = [];
  effects = [];

  resetBattleTimers();
}

/* =========================
   キャラ重なり防止
========================= */

function separateFighters(a, b) {
  if (!a || !b) return;

  const overlapX =
    Math.min(a.x + a.w, b.x + b.w) -
    Math.max(a.x, b.x);

  const overlapY =
    Math.min(a.y + a.h, b.y + b.h) -
    Math.max(a.y, b.y);

  if (overlapX <= 0 || overlapY <= 0) return;

  if (overlapX < overlapY) {
    const push = overlapX / 2 + 1;

    if (a.x < b.x) {
      a.x -= push;
      b.x += push;
    } else {
      a.x += push;
      b.x -= push;
    }

    a.vx *= 0.35;
    b.vx *= 0.35;
  }
}

/* =========================
   ゲーム更新
========================= */

function updateGame() {
  if (matchStartTimer > 0) {
    matchStartTimer--;

    stickX = 0;
    guardButtonDown = false;

    if (player) {
      player.vx = 0;
      player.vy = 0;
      player.attackCharging = false;
      player.attackCharge = 0;
      player.setGuard(false);
    }

    if (cpu) {
      cpu.vx = 0;
      cpu.vy = 0;
      cpu.attackCharging = false;
      cpu.attackCharge = 0;
      cpu.setGuard(false);
    }

    updateEffects();

    return;
  }

  if (hitStop > 0) {
    hitStop--;

    updateEffects();
    updateProjectiles();

    return;
  }

  updateRespawn();

  let inputX = 0;

  if (
    playerRespawnTimer <= 0 &&
    (
      keys["a"] ||
      keys["A"] ||
      keys["ArrowLeft"]
    )
  ) {
    inputX -= 1;
  }

  if (
    playerRespawnTimer <= 0 &&
    (
      keys["d"] ||
      keys["D"] ||
      keys["ArrowRight"]
    )
  ) {
    inputX += 1;
  }

  if (
    playerRespawnTimer <= 0 &&
    Math.abs(stickX) > 0.25
  ) {
    inputX += stickX > 0 ? 1 : -1;
  }

  inputX =
    Math.max(
      -1,
      Math.min(1, inputX)
    );

  const dashInput =
    playerRespawnTimer <= 0 &&
    (
      Math.abs(stickX) > 0.72 ||
      keys["a"] ||
      keys["A"] ||
      keys["d"] ||
      keys["D"] ||
      keys["ArrowLeft"] ||
      keys["ArrowRight"]
    );

  if (playerRespawnTimer <= 0) {
    player.setGuard(
      player.onGround &&
      (
        keys["l"] ||
        keys["L"] ||
        guardButtonDown
      )
    );

    player.move(
      inputX,
      dashInput
    );
  }

  if (cpuRespawnTimer <= 0) {
    updateCPU();
  }

  if (playerRespawnTimer <= 0) {
    player.update();
  }

  if (cpuRespawnTimer <= 0) {
    cpu.update();
  }

  if (
    playerRespawnTimer <= 0 &&
    cpuRespawnTimer <= 0
  ) {
    separateFighters(player, cpu);
  }

  if (
    playerRespawnTimer <= 0 &&
    cpuRespawnTimer <= 0 &&
    playerInvincibleTimer <= 0 &&
    cpuInvincibleTimer <= 0
  ) {
    hitCheck(player, cpu);
    hitCheck(cpu, player);
  }

  updateProjectiles();
  updateEffects();

  if (
    player.stocks <= 0 ||
    cpu.stocks <= 0
  ) {
    changeState(STATE.KO);
  }
}