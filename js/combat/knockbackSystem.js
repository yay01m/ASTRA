/* =========================
   吹っ飛び・決定打演出
========================= */

/* =========================
   吹っ飛びの強さ計算
========================= */

function getKnockbackPower(target, finalKnock) {

  // ダメージが20%を超えてから吹っ飛びが強くなる
  // 数字を上げるほど、高%でよく飛ぶ
  const percentPower =
    Math.max(0, target.damage - 20) * 0.25;

  // 技ごとの基本吹っ飛び
  const basePower =
    finalKnock * 0.95;

  return basePower + percentPower;
}

/* =========================
   決定打判定
========================= */

function isFinishHit(target, finalKnock, isSpecial) {

  return (
    target.damage >= 100 &&
    (
      finalKnock >= 12 ||
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
    finishHit ? 1.45 : 1.0;

  target.vx =
    attacker.dir *
    power *
    boost /
    target.data.weight;

  target.vy =
    isAir
      ? -(power * 0.66 * boost) / target.data.weight
      : -(power * 0.56 * boost) / target.data.weight;
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

    // ガード時は揺らさない
    // addScreenShake(1, 0.8);

    return;
  }

  if (isAir) {

    addHitStop(5);

    // 空中攻撃ヒット時だけ一瞬軽く揺らす
    addScreenShake(1, 1.0);

    return;
  }

  if (isSpecial) {

    addHitStop(7);

    // 必殺技ヒット時だけ一瞬軽く揺らす
    addScreenShake(1, 1.4);

    return;
  }

  addHitStop(4);

  // 通常ヒット時だけ一瞬軽く揺らす
  addScreenShake(1, 0.8);
}

/* =========================
   決定打ヒット感
========================= */

function addFinishHitFeel() {

  addHitStop(16);

  // 撃墜級の一撃だけ少し揺らす
  addScreenShake(1, 2.0);
}