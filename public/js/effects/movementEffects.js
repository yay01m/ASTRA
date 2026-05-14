/* =========================
   移動系エフェクト
========================= */

/* ダッシュ煙 */
function addDashEffect(x, y, color) {

  effects.push({
    x,
    y,
    color,

    size: 18,

    life: 18,
    maxLife: 18,

    type: "dash",

    vx: (Math.random() - 0.5) * 1.4,
    vy: 0.4
  });
}

/* =========================
   空中ジャンプリング
========================= */

function addAirJumpRingEffect(
  x,
  y,
  dir = 1
) {

  effects.push({

    x,
    y,

    type: "airJumpRing",

    size: 86,

    w: 96,
    h: 72,

    life: 16,
    maxLife: 16,

    alpha: 0.9,

    // 向いてる方向へ傾ける
    rot: 0.25 * dir,

    rotSpeed: 0,

    grow: 2.2,

    // 左向きだけ画像反転
    flipX:
      dir === -1,

    vx: 0,
    vy: 0
  });
}