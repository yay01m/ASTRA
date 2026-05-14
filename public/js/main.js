/* =========================
   フレーム
========================= */

let frameCount = 0;

/* =========================
   画面遷移フェード
========================= */

let nextState = null;
let fadeAlpha = 0;
let isFading = false;
let fadeMode = "out";

function changeState(state) {
  if (isFading) return;

  nextState = state;
  isFading = true;
  fadeMode = "out";
  fadeAlpha = 0;
}

function updateFade() {
  if (!isFading) return;

  if (fadeMode === "out") {
    fadeAlpha += 0.08;

    if (fadeAlpha >= 1) {
      fadeAlpha = 1;
      gameState = nextState;
      nextState = null;
      fadeMode = "in";
    }

  } else {
    fadeAlpha -= 0.08;

    if (fadeAlpha <= 0) {
      fadeAlpha = 0;
      isFading = false;
    }
  }
}

function drawFade() {
  if (!isFading && fadeAlpha <= 0) return;

  ctx.fillStyle = `rgba(0, 0, 18, ${fadeAlpha})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/* =========================
   戻るボタン
========================= */

function shouldShowBackButton() {
  return (
    gameState === STATE.SELECT ||
    gameState === STATE.STAGE_SELECT ||
    gameState === STATE.CPU_LEVEL
  );
}

function drawBackButton() {
  if (!shouldShowBackButton()) return;

  const x = 30;
  const y = 28;
  const w = 130;
  const h = 44;

  ctx.save();

  ctx.fillStyle = "rgba(8, 16, 40, 0.78)";
  ctx.strokeStyle = "#4cc9f0";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 18px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText("← BACK", x + w / 2, y + h / 2);

  ctx.restore();
}

function isBackButtonHit(x, y) {
  return (
    shouldShowBackButton() &&
    x >= 30 &&
    x <= 160 &&
    y >= 28 &&
    y <= 72
  );
}

function goBackState() {
  if (gameState === STATE.SELECT) {
    changeState(STATE.TITLE);
  }

  if (gameState === STATE.STAGE_SELECT) {
    changeState(STATE.SELECT);
  }

  if (gameState === STATE.CPU_LEVEL) {
    changeState(STATE.STAGE_SELECT);
  }
}

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
  fighter.x = isCpu
    ? stage.x + stage.w - 180
    : stage.x + 120;

  fighter.y = stage.y - 140;

  fighter.vx = 0;
  fighter.vy = 0;
  fighter.damage = 0;
  fighter.onGround = false;
  fighter.dir = isCpu ? -1 : 1;

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
    canvas.width / 2,
    canvas.height / 2
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
      canvas.width / 2,
      canvas.height / 2 + 90
    );
  }

  if (cpuRespawnTimer > 0) {
    ctx.fillText(
      "CPU RESPAWNING...",
      canvas.width / 2,
      canvas.height / 2 + 125
    );
  }

  ctx.restore();
}

/* =========================
   ゲーム準備
========================= */

function setupGame() {
  stage.x =
    canvas.width / 2 - stage.w / 2;

  stage.y =
    canvas.height * 0.68;

  updatePlatformPositions();

  player = new Fighter(
    stage.x + 120,
    stage.y - 100,
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
        Math.random() * cpuChars.length
      )
    ];

  cpu = new Fighter(
    stage.x + stage.w - 180,
    stage.y - 100,
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
   ゲーム更新
========================= */

function updateGame() {
  if (matchStartTimer > 0) {
    matchStartTimer--;

    updateEffects();
    updateProjectiles();

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
    keys["a"] ||
    keys["A"] ||
    keys["ArrowLeft"]
  ) {
    inputX -= 1;
  }

  if (
    playerRespawnTimer <= 0 &&
    keys["d"] ||
    keys["D"] ||
    keys["ArrowRight"]
  ) {
    inputX += 1;
  }

  if (
    playerRespawnTimer <= 0 &&
    Math.abs(stickX) > 0.25
  ) {
    inputX +=
      stickX > 0 ? 1 : -1;
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

/* =========================
   カメラ適用
========================= */

function applyCamera() {
  const scale =
    CAMERA && CAMERA.scale
      ? CAMERA.scale
      : 1;

  const centerX =
    canvas.width / 2;

  const centerY =
    canvas.height / 2;

  ctx.translate(centerX, centerY);
  ctx.scale(scale, scale);
  ctx.translate(-centerX, -centerY);
}

/* =========================
   ゲーム描画
========================= */

function drawGame() {
  drawBattleBackground();

  ctx.save();

  applyCamera();

  if (screenShake > 0) {
    const sx =
      (Math.random() - 0.5) *
      screenShakePower;

    const sy =
      (Math.random() - 0.5) *
      screenShakePower;

    ctx.translate(sx, sy);

    screenShake--;
    screenShakePower *= 0.9;

    if (screenShakePower < 0.5) {
      screenShakePower = 0;
    }
  }

  drawStage();

  drawProjectiles();

  if (playerRespawnTimer <= 0) {
    player.draw();
  }

  if (cpuRespawnTimer <= 0) {
    cpu.draw();
  }

  drawEffects();

  ctx.restore();

  drawHUD();

  drawStartCountdown();
  drawRespawnText();
}

/* =========================
   メインループ
========================= */

function loop() {
  frameCount++;

  const mobileControls =
    document.getElementById(
      "mobileControls"
    );

  if (mobileControls) {
    mobileControls.style.display =
      gameState === STATE.GAME
        ? "flex"
        : "none";
  }

  if (
    gameState === STATE.GAME &&
    !isFading
  ) {
    updateGame();
  }

  if (gameState === STATE.TITLE) {
    drawTitle();
  }

  if (gameState === STATE.SELECT) {
    drawSelect();
  }

  if (gameState === STATE.STAGE_SELECT) {
    drawStageSelect();
  }

  if (gameState === STATE.CPU_LEVEL) {
    drawCpuLevelSelect();
  }

  if (gameState === STATE.GAME) {
    drawGame();
  }

  if (gameState === STATE.KO) {
    drawKO();
  }

  drawBackButton();

  updateFade();
  drawFade();

  requestAnimationFrame(loop);
}

loop();

/* =========================
   クリック操作
========================= */

canvas.addEventListener("click", (event) => {
  if (isFading) return;

  const rect =
    canvas.getBoundingClientRect();

  const mouseX =
    event.clientX - rect.left;

  const mouseY =
    event.clientY - rect.top;

  if (isBackButtonHit(mouseX, mouseY)) {
    goBackState();
    return;
  }

  if (gameState === STATE.TITLE) {
    changeState(STATE.SELECT);
    return;
  }
});
//a