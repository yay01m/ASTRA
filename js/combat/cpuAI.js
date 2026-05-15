/* =========================
   CPUレベル設定
========================= */

const CPU_LEVELS = {
  1: { attack: 0.015, smash: 0.05, special: 0.002, air: 0.006, guard: 0.03, jump: 0.006, range: 90 },
  2: { attack: 0.022, smash: 0.10, special: 0.004, air: 0.010, guard: 0.05, jump: 0.008, range: 95 },
  3: { attack: 0.030, smash: 0.18, special: 0.006, air: 0.014, guard: 0.08, jump: 0.010, range: 100 },
  4: { attack: 0.040, smash: 0.25, special: 0.009, air: 0.020, guard: 0.12, jump: 0.012, range: 105 },
  5: { attack: 0.052, smash: 0.35, special: 0.013, air: 0.030, guard: 0.18, jump: 0.014, range: 110 },
  6: { attack: 0.065, smash: 0.45, special: 0.018, air: 0.040, guard: 0.26, jump: 0.016, range: 115 },
  7: { attack: 0.080, smash: 0.58, special: 0.025, air: 0.055, guard: 0.38, jump: 0.018, range: 120 },
  8: { attack: 0.105, smash: 0.72, special: 0.035, air: 0.075, guard: 0.52, jump: 0.020, range: 125 },

  // ほぼ理不尽CPU
  9: { attack: 0.220, smash: 0.96, special: 0.080, air: 0.160, guard: 0.88, jump: 0.026, range: 145 }
};

/* =========================
   CPU待機位置
========================= */

function getCpuHomeX() {
  const centerX =
    stage.x + stage.w / 2;

  const safeGap =
    isPortraitMobile()
      ? canvas.width * 0.32
      : 220;

  return centerX + safeGap;
}

/* =========================
   CPU
========================= */

function updateCPU() {

  const level =
    CPU_LEVELS[cpuLevel] || CPU_LEVELS[5];

  cpu.setGuard(false);

  /* =========================
     リスポーン中は待機位置へ戻る
  ========================= */

  if (
    playerRespawnTimer > 0 ||
    cpuRespawnTimer > 0
  ) {
    const homeX =
      getCpuHomeX();

    const diff =
      homeX - cpu.x;

    if (Math.abs(diff) > 24) {
      const dir =
        diff > 0 ? 1 : -1;

      cpu.move(dir, true);
    } else {
      cpu.move(0, false);
      cpu.vx *= 0.75;
      cpu.dir = -1;
    }

    if (
      cpu.onGround &&
      cpu.y > stage.y - 60
    ) {
      cpu.jump();
    }

    return;
  }

  const dx =
    player.x - cpu.x;

  const dy =
    player.y - cpu.y;

  const absDx =
    Math.abs(dx);

  const absDy =
    Math.abs(dy);

  const dir =
    dx > 0 ? 1 : -1;

  const dash =
    absDx > 150;

  /* =========================
     レベル9補正
     ほぼボスCPU
  ========================= */

  if (cpuLevel >= 9) {
    cpu.invincible =
      Math.max(cpu.invincible, 1);

    cpu.data.speed =
      Math.max(cpu.data.speed, 5.2);

    cpu.data.dashSpeed =
      Math.max(cpu.data.dashSpeed, 8.2);
  }

  /* =========================
     移動
  ========================= */

  if (absDx > 55) {
    cpu.move(dir, true);
  }

  /* =========================
     復帰っぽいジャンプ
  ========================= */

  if (
    !cpu.onGround &&
    cpu.y > stage.y - 80 &&
    Math.random() < 0.20
  ) {
    cpu.jump();
  }

  /* =========================
     通常ジャンプ
  ========================= */

  if (
    cpu.onGround &&
    Math.random() < level.jump
  ) {
    cpu.jump();
  }

  /* =========================
     ガード
  ========================= */

  const playerAttacking =
    player.attackTimer > 0 ||
    player.airAttackTimer > 0 ||
    player.dashAttackTimer > 0 ||
    player.specialTimer > 0;

  if (
    playerAttacking &&
    absDx < 130 &&
    Math.random() < level.guard
  ) {
    cpu.setGuard(true);
    return;
  }

  /* =========================
     レベル9専用
  ========================= */

  if (
    cpuLevel >= 9 &&
    absDx < 120 &&
    absDy < 100
  ) {
    if (
      player.damage >= 70 &&
      Math.random() < 0.65
    ) {
      cpu.startAttackCharge();
      cpu.attackCharge = 999;
      cpu.releaseAttackCharge();
      return;
    }

    if (Math.random() < 0.55) {
      cpu.startAttackCharge();
      cpu.attackCharge = 0;
      cpu.releaseAttackCharge();
      return;
    }
  }

  /* =========================
     空中攻撃
  ========================= */

  if (
    !cpu.onGround &&
    absDx < level.range &&
    absDy < 105 &&
    Math.random() < level.air
  ) {
    cpu.airAttack();
    return;
  }

  /* =========================
     ダッシュ攻撃
  ========================= */

  if (
    absDx < 120 &&
    dash &&
    Math.random() < level.attack
  ) {
    cpu.dashAttack();
    return;
  }

  /* =========================
     通常攻撃 / スマッシュ
  ========================= */

  if (
    absDx < level.range &&
    Math.random() < level.attack
  ) {
    cpu.startAttackCharge();

    if (
      player.damage >= 65 ||
      Math.random() < level.smash
    ) {
      cpu.attackCharge =
        cpuLevel >= 9 ? 999 : 90;
    }

    cpu.releaseAttackCharge();
    return;
  }

  /* =========================
     必殺技
  ========================= */

  if (
    absDx < 190 &&
    cpu.coolSpecial <= 0 &&
    Math.random() < level.special
  ) {
    cpu.special();
    return;
  }
}