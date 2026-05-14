/* =========================
   画像エフェクト読み込み
========================= */

const effectImages = {
  airJumpRing: new Image(),
  hitStar: new Image(),
  koFlash: new Image(),

  fireBurst: new Image(),
  lightningSlash: new Image(),
  novaBall: new Image()
};

effectImages.airJumpRing.src = "./img/effects/air_jump_ring.png";
effectImages.hitStar.src = "./img/effects/hit_star.png";
effectImages.koFlash.src = "./img/effects/ko_flash.png";

effectImages.fireBurst.src = "./img/effects/fire_burst.png";
effectImages.lightningSlash.src = "./img/effects/lightning_slash.png";
effectImages.novaBall.src = "./img/effects/nova_ball.png";

/* =========================
   エフェクト更新
========================= */

function updateEffects() {
  effects = effects.filter(e => e.life > 0);

  for (const e of effects) {
    e.life--;

    if (e.type === "circle") {
      e.size += 1.7;
    }

    if (e.type === "dash") {
      e.size += 1.1;
      e.x += e.vx || 0;
      e.y += e.vy || 0;
    }

    if (e.type === "slash") {
      e.size += 2.6;
      e.x += (e.dir || 1) * 2.2;
    }

    if (e.type === "guard") {
      e.size += 0.8;
    }

    if (e.type === "break") {
      e.size += 3;
    }

    if (
      e.type === "novaHit" ||
      e.type === "blazeHit" ||
      e.type === "voltHit"
    ) {
      e.x += e.vx || 0;
      e.y += e.vy || 0;
      e.size *= 0.96;
    }

    if (
      e.type === "airJumpRing" ||
      e.type === "hitStar" ||
      e.type === "koFlash" ||
      e.type === "fireBurst" ||
      e.type === "lightningSlash" ||
      e.type === "novaBall"
    ) {
      e.size += e.grow || 0;
      e.rot += e.rotSpeed || 0;
      e.x += e.vx || 0;
      e.y += e.vy || 0;
    }
  }
}

/* =========================
   エフェクト描画
========================= */

function drawEffects() {
  for (const e of effects) {
    const maxLife = e.maxLife || 20;
    const alpha = Math.max(0, e.life / maxLife);

    if (e.type === "airJumpRing") {
      drawImageEffect(effectImages.airJumpRing, e, alpha);
      continue;
    }

    if (e.type === "hitStar") {
      drawImageEffect(effectImages.hitStar, e, alpha);
      continue;
    }

    if (e.type === "koFlash") {
      drawImageEffect(effectImages.koFlash, e, alpha);
      continue;
    }

    if (e.type === "fireBurst") {
      drawImageEffect(effectImages.fireBurst, e, alpha);
      continue;
    }

    if (e.type === "lightningSlash") {
      drawImageEffect(effectImages.lightningSlash, e, alpha);
      continue;
    }

    if (e.type === "novaBall") {
      drawImageEffect(effectImages.novaBall, e, alpha);
      continue;
    }

    if (e.type === "circle") {
      drawCircleHitEffect(e, alpha);
    }

    if (e.type === "dash") {
      drawDashEffect(e, alpha);
    }

    if (e.type === "slash") {
      drawAttackSlashEffect(e, alpha);
    }

    if (e.type === "guard") {
      drawGuardVisualEffect(e, alpha);
    }

    if (e.type === "break") {
      drawGuardBreakVisualEffect(e, alpha);
    }

    if (e.type === "novaHit") {
      drawNovaHitEffect(e, alpha);
    }

    if (e.type === "blazeHit") {
      drawBlazeHitEffect(e, alpha);
    }

    if (e.type === "voltHit") {
      drawVoltHitEffect(e, alpha);
    }
  }
}

/* =========================
   画像エフェクト共通描画
========================= */

function drawImageEffect(img, e, alpha) {
  if (!img) return;
  if (!img.complete) return;
  if (img.naturalWidth === 0) return;

  ctx.save();

  ctx.globalAlpha = alpha * (e.alpha || 1);
  ctx.translate(e.x, e.y);
  ctx.rotate(e.rot || 0);

  if (e.flipX) {
    ctx.scale(-1, 1);
  }

  const w = Math.abs(e.w || e.size);
  const h = Math.abs(e.h || e.size);

  ctx.drawImage(
    img,
    -w / 2,
    -h / 2,
    w,
    h
  );

  ctx.restore();
}

/* =========================
   個別描画
========================= */

function drawCircleHitEffect(e, alpha) {
  ctx.beginPath();
  ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
  ctx.fillStyle = colorAlpha(e.color, alpha * 0.45);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(e.x, e.y, e.size * 0.45, 0, Math.PI * 2);
  ctx.fillStyle = colorAlpha("#ffffff", alpha * 0.65);
  ctx.fill();

  for (let i = 0; i < 6; i++) {
    const a = e.rot + i * Math.PI / 3;

    ctx.strokeStyle = colorAlpha(e.color, alpha * 0.9);
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(e.x, e.y);
    ctx.lineTo(
      e.x + Math.cos(a) * e.size,
      e.y + Math.sin(a) * e.size
    );
    ctx.stroke();
  }
}

function drawDashEffect(e, alpha) {
  ctx.fillStyle = colorAlpha(e.color, alpha * 0.45);

  ctx.fillRect(
    e.x - e.size / 2,
    e.y,
    e.size,
    7
  );

  ctx.fillStyle = colorAlpha("#ffffff", alpha * 0.2);

  ctx.fillRect(
    e.x - e.size / 3,
    e.y - 3,
    e.size * 0.65,
    4
  );
}

function drawAttackSlashEffect(e, alpha) {
  ctx.save();

  ctx.translate(e.x, e.y);
  ctx.scale(e.dir || 1, 1);

  ctx.strokeStyle = colorAlpha("#ffffff", alpha * 0.95);
  ctx.lineWidth = 7;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.arc(0, 0, e.size, -0.8, 0.65);
  ctx.stroke();

  ctx.strokeStyle = colorAlpha(e.color, alpha * 0.9);
  ctx.lineWidth = 4;

  ctx.beginPath();
  ctx.arc(0, 0, e.size * 0.8, -0.75, 0.6);
  ctx.stroke();

  ctx.restore();
}

function drawGuardVisualEffect(e, alpha) {
  ctx.strokeStyle = colorAlpha(e.color, alpha * 0.75);
  ctx.lineWidth = 4;

  ctx.beginPath();
  ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = colorAlpha("#ffffff", alpha * 0.35);
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.arc(e.x, e.y, e.size * 0.72, 0, Math.PI * 2);
  ctx.stroke();
}

function drawGuardBreakVisualEffect(e, alpha) {
  ctx.strokeStyle = colorAlpha("#ff77ff", alpha * 0.95);
  ctx.lineWidth = 6;

  ctx.beginPath();
  ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < 10; i++) {
    const a = e.rot + i * Math.PI / 5;

    ctx.strokeStyle = colorAlpha("#ffffff", alpha * 0.8);
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(
      e.x + Math.cos(a) * e.size * 0.25,
      e.y + Math.sin(a) * e.size * 0.25
    );
    ctx.lineTo(
      e.x + Math.cos(a) * e.size,
      e.y + Math.sin(a) * e.size
    );
    ctx.stroke();
  }
}

/* =========================
   キャラ別ヒット描画
========================= */

function drawNovaHitEffect(e, alpha) {
  ctx.save();

  ctx.translate(e.x, e.y);
  ctx.rotate(e.rot);

  ctx.strokeStyle = colorAlpha("#ffffff", alpha * 0.9);
  ctx.lineWidth = 4;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(-e.size, e.size * 0.3);
  ctx.lineTo(e.size, -e.size * 0.3);
  ctx.stroke();

  ctx.strokeStyle = colorAlpha(e.color, alpha * 0.8);
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(-e.size * 0.7, e.size * 0.55);
  ctx.lineTo(e.size * 0.7, -e.size * 0.55);
  ctx.stroke();

  ctx.restore();
}

function drawBlazeHitEffect(e, alpha) {
  ctx.save();

  ctx.fillStyle = colorAlpha(e.color, alpha * 0.7);

  ctx.beginPath();
  ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = colorAlpha("#ffffff", alpha * 0.45);

  ctx.beginPath();
  ctx.arc(e.x, e.y, e.size * 0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawVoltHitEffect(e, alpha) {
  ctx.save();

  ctx.strokeStyle = colorAlpha(e.color, alpha * 0.95);
  ctx.lineWidth = 3;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(e.x, e.y);
  ctx.lineTo(
    e.x + Math.cos(e.rot) * e.size,
    e.y + Math.sin(e.rot) * e.size
  );
  ctx.lineTo(
    e.x + Math.cos(e.rot + 1.4) * e.size * 0.55,
    e.y + Math.sin(e.rot + 1.4) * e.size * 0.55
  );
  ctx.stroke();

  ctx.strokeStyle = colorAlpha("#ffffff", alpha * 0.7);
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(e.x, e.y);
  ctx.lineTo(
    e.x + Math.cos(e.rot) * e.size * 0.7,
    e.y + Math.sin(e.rot) * e.size * 0.7
  );
  ctx.stroke();

  ctx.restore();
}