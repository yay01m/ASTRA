/* =========================
   吹っ飛び・決定打演出
========================= */


/* =========================
   吹っ飛びの強さ計算
========================= */

function getKnockbackPower(target, finalKnock) {

  const d =
    Math.max(0, target.damage - 40);

  const percentPower =
    d * 0.07 + d * d * 0.0016;

  const basePower =
    finalKnock * 0.58;

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
  finishHit
) {

  const boost =
    finishHit ? 1.35 : 1.0;

  target.vx =
    attacker.dir *
    power *
    boost /
    (target.data.weight * 1.25);

  target.vy =
    -(power * 0.42 * boost) /
    (target.data.weight * 1.25);
}


/* =========================
   ヒット感
========================= */

function addHitFeel(
  isSpecial,
  guarded
) {

  if (guarded) {
    addHitStop(2);
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