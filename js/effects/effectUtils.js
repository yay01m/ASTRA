/* =========================
   色に透明度を付ける
========================= */

function colorAlpha(color, alpha) {

  if (!color) {

    return `rgba(
      255,
      255,
      255,
      ${alpha}
    )`;

  }

  if (
      color[0] === "#" &&
      color.length === 4
  ) {

    const r =
      color[1] + color[1];

    const g =
      color[2] + color[2];

    const b =
      color[3] + color[3];

    return `rgba(
      ${parseInt(r,16)},
      ${parseInt(g,16)},
      ${parseInt(b,16)},
      ${alpha}
    )`;

  }

  if (
      color[0] === "#" &&
      color.length === 7
  ) {

    return `rgba(
      ${parseInt(color.slice(1,3),16)},
      ${parseInt(color.slice(3,5),16)},
      ${parseInt(color.slice(5,7),16)},
      ${alpha}
    )`;

  }

  return color;

}


/* =========================
   ヒットストップ
========================= */

function addHitStop(frames){

    hitStop=
    Math.max(
        hitStop,
        frames
    );

}


/* =========================
   画面揺れ
========================= */

function addScreenShake(
    power,
    time
){

    screenShakePower=
    Math.max(
        screenShakePower,
        power
    );

    screenShake=
    Math.max(
        screenShake,
        time
    );

}