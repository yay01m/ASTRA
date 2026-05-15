/* =========================
   ヒット系エフェクト
========================= */

/* 通常ヒット：画像スター */
function addEffect(x, y, color, size) {
  effects.push({
    x,
    y,
    type: "hitStar",

    color,
    size: size || 64,
    w: size || 64,
    h: size || 64,

    life: 12,
    maxLife: 12,

    alpha: 0.95,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: 0.12,

    grow: 2.6,

    vx: 0,
    vy: 0
  });
}

/* 攻撃スラッシュ */
function addAttackEffect(x, y, dir, color) {
  effects.push({
    x,
    y,
    dir,
    color,
    size: 36,
    life: 12,
    maxLife: 12,
    type: "slash"
  });
}

/* 決定打：赤黒白フラッシュ */
function addKOFlashEffect(x, y) {
  effects.push({
    x,
    y,
    type: "koFlash",

    size: 180,
    w: 210,
    h: 210,

    life: 18,
    maxLife: 18,

    alpha: 1,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: 0.04,

    grow: 6,

    vx: 0,
    vy: 0
  });
}

/* =========================
   キャラ別ヒットエフェクト
========================= */

function addCharacterHitEffect(x, y, attacker) {
  addEffect(x, y, "#ffffff", 58);

  if (!attacker) return;

  if (attacker.charKey === "balance") {
    addNovaHitEffect(x, y);
  } else if (attacker.charKey === "power") {
    addBlazeHitEffect(x, y);
  } else if (attacker.charKey === "speed") {
    addVoltHitEffect(x, y);
  }
}

function addNovaHitEffect(x, y) {
  for (let i = 0; i < 5; i++) {
    effects.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 5,
      vy: (Math.random() - 0.5) * 5,
      color: "#7ee7ff",
      size: 10 + Math.random() * 14,
      life: 12,
      maxLife: 12,
      type: "novaHit",
      rot: Math.random() * Math.PI * 2
    });
  }
}

function addBlazeHitEffect(x, y) {
  for (let i = 0; i < 7; i++) {
    effects.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      color: Math.random() > 0.5 ? "#ff5a1f" : "#ffd447",
      size: 9 + Math.random() * 16,
      life: 13,
      maxLife: 13,
      type: "blazeHit",
      rot: Math.random() * Math.PI * 2
    });
  }
}

function addVoltHitEffect(x, y) {
  for (let i = 0; i < 6; i++) {
    effects.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      color: "#fff15a",
      size: 10 + Math.random() * 15,
      life: 11,
      maxLife: 11,
      type: "voltHit",
      rot: Math.random() * Math.PI * 2
    });
  }
}