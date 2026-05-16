/* =========================
   必殺技エフェクト
========================= */

function addFireBurstEffect(x, y) {

    effects.push({
        x,
        y,
        type: "fireBurst",
        size: 250,
        w: 250,
        h: 250,
        life: 16,
        maxLife: 16,
        alpha: 1,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: 0.03,
        grow: 5,
        vx: 0,
        vy: 0
    });

}


function addLightningSlashEffect(x, y, dir = 1) {

    effects.push({
        x,
        y,
        type: "lightningSlash",
        size: 120,
        w: 190,
        h: 95,
        life: 12,
        maxLife: 12,
        alpha: 1,
        rot: 0,
        rotSpeed: 0,
        grow: 2,
        flipX: dir === -1,
        vx: 0,
        vy: 0
    });

}


function addNovaBallEffect(x, y, size = 70) {

    effects.push({
        x,
        y,
        type: "novaBall",
        size,
        w: size,
        h: size,
        life: 18,
        maxLife: 18,
        alpha: 0.95,
        rot: 0,
        rotSpeed: 0.08,
        grow: 0,
        vx: 0,
        vy: 0
    });

}


/* =========================
   弾更新
========================= */

function updateProjectiles() {

    projectiles =
        projectiles.filter(
            p => p.life > 0
        );

    for (const p of projectiles) {

        p.x += p.vx;
        p.y += p.vy || 0;

        p.life--;

        if (
            p.x < -300 ||
            p.x > GAME_W + 300 ||
            p.y < -300 ||
            p.y > GAME_H + 300
        ) {
            p.life = 0;
            continue;
        }

        const target =
            p.owner === player
                ? cpu
                : player;

        if (!target) continue;
        if (target.invincible > 0) continue;

        const hit =
            p.x + p.r > target.x &&
            p.x - p.r < target.x + target.w &&
            p.y + p.r > target.y &&
            p.y - p.r < target.y + target.h;

        if (hit) {

            applyHit(
                p.owner,
                target,
                p.damage,
                "special",
                true,
                false,
                false
            );

            p.life = 0;

            addNovaBallEffect(
                p.x,
                p.y,
                95
            );

            addCharacterHitEffect(
                p.x,
                p.y,
                p.owner
            );

        }

    }

}


/* =========================
   弾描画
========================= */

function drawProjectiles() {

    for (const p of projectiles) {

        if (p.type === "novaShot") {

            p.rot =
                (p.rot || 0) + 0.08;

            drawImageEffect(
                effectImages.novaBall,
                {
                    x: p.x,
                    y: p.y,
                    w: p.r * 2.2,
                    h: p.r * 2.2,
                    alpha: 1,
                    rot: p.rot,
                    flipX: p.vx < 0
                },
                1
            );

            continue;

        }

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            p.r,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            p.color;

        ctx.fill();

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            p.r + 8,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            colorAlpha(
                p.color,
                0.35
            );

        ctx.fill();

    }

}