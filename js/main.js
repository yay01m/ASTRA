/* =========================
   固定ゲームサイズ
========================= */

const GAME_W = 1280;
const GAME_H = 720;

let frameCount = 0;

/* =========================
   CANVAS RESIZE
========================= */

function isPortraitMobile() {
  const viewport = window.visualViewport;

  const w = viewport ? viewport.width : window.innerWidth;
  const h = viewport ? viewport.height : window.innerHeight;

  return (
    w < 900 &&
    h > w
  );
}

function resizeCanvas() {
  const viewport = window.visualViewport;

  const screenW = viewport ? viewport.width : window.innerWidth;
  const screenH = viewport ? viewport.height : window.innerHeight;

  canvas.width = GAME_W;
  canvas.height = GAME_H;

  const aspect = GAME_W / GAME_H;

  if (isPortraitMobile()) {
    const cssW = screenW;
    const cssH = cssW / aspect;

    canvas.style.position = "fixed";
    canvas.style.left = "0px";
    canvas.style.top = "55px";
    canvas.style.width = cssW + "px";
    canvas.style.height = cssH + "px";
  } else {
    let cssW = screenW;
    let cssH = cssW / aspect;

    if (cssH > screenH) {
      cssH = screenH;
      cssW = cssH * aspect;
    }

    canvas.style.position = "fixed";
    canvas.style.left = (screenW - cssW) / 2 + "px";
    canvas.style.top = (screenH - cssH) / 2 + "px";
    canvas.style.width = cssW + "px";
    canvas.style.height = cssH + "px";
  }
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

window.addEventListener("orientationchange", () => {
  setTimeout(resizeCanvas, 300);
});

if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", resizeCanvas);
  window.visualViewport.addEventListener("scroll", resizeCanvas);
}

/* =========================
   画面エリア
========================= */

function getGameAreaHeight() {
  return GAME_H;
}

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

function getBackButtonRect() {
  return {
    x: GAME_W * 0.025,
    y: GAME_H * 0.035,
    w: 150,
    h: 48
  };
}

function drawBackButton() {
  if (!shouldShowBackButton()) return;

  const b = getBackButtonRect();

  ctx.save();

  ctx.fillStyle = "rgba(8, 16, 40, 0.78)";
  ctx.strokeStyle = "#4cc9f0";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.roundRect(
    b.x,
    b.y,
    b.w,
    b.h,
    12
  );
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 18px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(
    "← BACK",
    b.x + b.w / 2,
    b.y + b.h / 2
  );

  ctx.restore();
}

function isBackButtonHit(x, y) {
  const b = getBackButtonRect();

  return (
    shouldShowBackButton() &&
    x >= b.x &&
    x <= b.x + b.w &&
    y >= b.y &&
    y <= b.y + b.h
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

  const safeGap =
    getSpawnGap();

  fighter.x =
    isCpu
      ? centerX + safeGap
      : centerX - safeGap;

  fighter.y =
    stage.y - fighter.h - 20;

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
  stage.w =
    GAME_W * 1.6;

  stage.h =
    STAGE.height;

  stage.x =
    GAME_W / 2 -
    stage.w / 2;

  stage.y =
    GAME_H -
    stage.h;

  updatePlatformPositions();

  const centerX =
    stage.x + stage.w / 2;

  const gap =
    getSpawnGap();

  player = new Fighter(
    centerX - gap,
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
      Math.floor(Math.random() * cpuChars.length)
    ];

  cpu = new Fighter(
    centerX + gap,
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

  const viewCenterX =
    GAME_W / 2;

  const viewCenterY =
    GAME_H / 2;

  const targetX =
    stage.x + stage.w / 2;

  const floorScreenY =
    GAME_H - 8;

  const targetY =
    stage.y -
    (floorScreenY - viewCenterY) / scale;

  ctx.translate(
    viewCenterX,
    viewCenterY
  );

  ctx.scale(scale, scale);

  ctx.translate(
    -targetX,
    -targetY
  );
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

  document.body.classList.toggle(
    "playing",
    gameState === STATE.GAME
  );

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
   クリック座標変換
========================= */

function getCanvasPoint(event) {
  const rect =
    canvas.getBoundingClientRect();

  const scaleX =
    canvas.width / rect.width;

  const scaleY =
    canvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY
  };
}

/* =========================
   クリック操作
========================= */

canvas.addEventListener("click", (event) => {
  if (isFading) return;

  const point =
    getCanvasPoint(event);

  const mouseX =
    point.x;

  const mouseY =
    point.y;

  if (isBackButtonHit(mouseX, mouseY)) {
    goBackState();
    return;
  }

  if (gameState === STATE.TITLE) {
    changeState(STATE.SELECT);
    return;
  }

  if (
    gameState === STATE.SELECT &&
    typeof handleSelectClick === "function"
  ) {
    handleSelectClick(mouseX, mouseY);
    return;
  }

  if (
    gameState === STATE.STAGE_SELECT &&
    typeof handleStageSelectClick === "function"
  ) {
    handleStageSelectClick(mouseX, mouseY);
    return;
  }

  if (
    gameState === STATE.CPU_LEVEL &&
    typeof handleCpuLevelClick === "function"
  ) {
    handleCpuLevelClick(mouseX, mouseY);
    return;
  }

  if (
    gameState === STATE.KO
  ) {
    changeState(STATE.TITLE);
    return;
  }
});