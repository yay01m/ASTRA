/* =========================
   吹っ飛び・決定打演出
========================= */

/* =========================
   吹っ飛びの強さ計算
========================= */

function getKnockbackPower(target, finalKnock) {

  // 25%を超えてから吹っ飛びが強くなる
  const percentPower =
    Math.max(0, target.damage - 25) * 0.22;

  // 技ごとの基本吹っ飛びを少し弱める
  const basePower =
    finalKnock * 0.88;

  return basePower + percentPower;
}

/* =========================
   決定打判定
========================= */

function isFinishHit(target, finalKnock, isSpecial) {

  return (
    target.damage >= 115 &&
    (
      finalKnock >= 13 ||
      isSpecial
    )
  );
}

/* =========================
   吹っ飛び適用
========================= */

function applyKnockback(
  attacker,
  target,
  power,
  isAir,
  finishHit
) {

  const boost =
    finishHit ? 1.35 : 1.0;

  target.vx =
    attacker.dir *
    power *
    boost /
    (target.data.weight * 1.08);

  target.vy =
    isAir
      ? -(power * 0.60 * boost) / (target.data.weight * 1.08)
      : -(power * 0.50 * boost) / (target.data.weight * 1.08);
}

/* =========================
   ヒット感
========================= */

function addHitFeel(
  isSpecial,
  isAir,
  guarded
) {

  if (guarded) {
    addHitStop(2);
    return;
  }

  if (isAir) {
    addHitStop(5);
    addScreenShake(1, 1.0);
    return;
  }

  if (isSpecial) {
    addHitStop(7);
    addScreenShake(1, 1.4);
    return;
  }

  addHitStop(4);
  addScreenShake(1, 0.8);
}

/* =========================
   決定打ヒット感
========================= */

function addFinishHitFeel() {
  addHitStop(16);
  addScreenShake(1, 2.0);
}