/* =========================
   ノックバック自動計算
========================= */

function getDamageKnockback(damage, type = "normal") {

    const rate = {
        normal: 0.95,
        special: 1.35,
        smash: 1.55
    };

    return damage * (rate[type] || 1);
}


/* =========================
   ダメージ処理
========================= */

function applyHit(
    attacker,
    target,
    damage,
    hitType = "normal",
    isSpecial = false,
    isSmash = false
) {

    const guarded = target.isGuarding;

    const knock =
        getDamageKnockback(
            damage,
            hitType
        );

    const finalDamage =
        guarded
            ? Math.floor(damage * 0.25)
            : damage;

    const finalKnock =
        guarded
            ? knock * 0.16
            : knock;

    target.damage += finalDamage;

    const power =
        getKnockbackPower(
            target,
            finalKnock
        );

    const finishHit =
        !guarded &&
        (isSpecial || isSmash) &&
        isFinishHit(
            target,
            finalKnock,
            true
        );

    applyKnockback(
        attacker,
        target,
        power,
        finishHit
    );

    target.hitstun =
        finishHit
            ? 34
            : guarded
                ? 5
                : isSmash
                    ? 24
                    : 16;

    target.invincible =
        finishHit
            ? 20
            : isSmash
                ? 16
                : 12;

    if (isSpecial) {
        attacker.actionLock =
            Math.max(
                attacker.actionLock,
                20
            );
    }

    const tx =
        target.x + target.w / 2;

    const ty =
        target.y + target.h / 2;

    if (finishHit) {

        addFinishHitFeel();

        addKOFlashEffect(
            tx,
            ty
        );

        addEffect(
            tx,
            ty,
            "#ffffff",
            58
        );

    } else {

        addHitFeel(
            isSpecial,
            guarded
        );

    }

    if (guarded) {

        addEffect(
            tx,
            ty,
            "#b388ff",
            18
        );

        return;
    }

    addCharacterHitEffect(
        tx,
        ty,
        attacker
    );

    if (isSmash) {

        addEffect(
            tx,
            ty,
            "#ffffff",
            62 + (attacker.smashLevel || 1) * 8
        );

    }
}


/* =========================
   攻撃判定時間
========================= */

function isNormalActive(attacker) {

    return (
        attacker.attackTimer > 1 &&
        attacker.attackTimer <= 10
    );

}


function isSmashActive(attacker) {

    return (
        attacker.attackTimer > 2 &&
        attacker.attackTimer <= 14
    );

}


function isSpecialActive(attacker) {

    if (attacker.data.specialType === "blazeBurst") {
        return (
            attacker.specialTimer > 5 &&
            attacker.specialTimer <= 11
        );
    }

    if (attacker.data.specialType === "voltSlash") {
        return (
            attacker.specialTimer > 9 &&
            attacker.specialTimer <= 13
        );
    }

    if (attacker.data.specialType === "novaShot") {
        return false;
    }

    return (
        attacker.specialTimer > 4 &&
        attacker.specialTimer <= 10
    );
}


/* =========================
   攻撃判定設定
========================= */

function makeHitBox({
    shape = "rect",
    offsetX = 0,
    offsetY = 0,
    width = 80,
    height = 40,
    radius = 60
}) {

    return {
        shape,
        offsetX,
        offsetY,
        width,
        height,
        radius
    };

}


/* =========================
   当たり判定
========================= */

function isHitBoxTouching(
    hitBox,
    attacker,
    target
) {

    const ax =
        attacker.x +
        attacker.w / 2 +
        attacker.dir * hitBox.offsetX;

    const ay =
        attacker.y +
        attacker.h / 2 +
        hitBox.offsetY;

    const tx =
        target.x + target.w / 2;

    const ty =
        target.y + target.h / 2;

    const dx =
        Math.abs(tx - ax);

    const dy =
        Math.abs(ty - ay);

    if (hitBox.shape === "circle") {
        return Math.hypot(dx, dy) < hitBox.radius;
    }

    if (hitBox.shape === "rect") {
        return (
            dx < hitBox.width / 2 &&
            dy < hitBox.height / 2
        );
    }

    if (hitBox.shape === "ellipse") {

        const rx =
            hitBox.width / 2;

        const ry =
            hitBox.height / 2;

        return (
            (dx * dx) / (rx * rx) +
            (dy * dy) / (ry * ry)
        ) < 1;
    }

    return false;
}


/* =========================
   攻撃判定
========================= */

function hitCheck(
    attacker,
    target
) {

    if (target.invincible > 0) return;

    let hitBox = null;

    let damage =
        attacker.data.attackDamage;

    let hitType =
        "normal";

    let isSpecial =
        false;

    let isSmash =
        false;

    if (
        attacker.attackKind === "smash"
            ? isSmashActive(attacker)
            : isNormalActive(attacker)
    ) {

        if (attacker.attackKind === "smash") {

            isSmash = true;
            hitType = "smash";

            const level =
                attacker.smashLevel || 1;

            const damageRate =
                level === 3
                    ? 2.8
                    : level === 2
                        ? 2.1
                        : 1.55;

            damage =
                Math.floor(
                    attacker.data.attackDamage *
                    damageRate
                );

            hitBox =
                makeHitBox({
                    shape: "rect",
                    offsetX: 114,
                    width: 150,
                    height: 120
                });

        } else {

            hitType = "normal";

            damage =
                Math.floor(
                    attacker.data.attackDamage *
                    1.15
                );

            hitBox =
                makeHitBox({
                    shape: "rect",
                    offsetX: 88,
                    width: 100,
                    height: 120
                });

        }
    }

    if (isSpecialActive(attacker)) {

        isSpecial = true;
        hitType = "special";

        damage =
            attacker.data.specialDamage;

        if (attacker.data.specialType === "blazeBurst") {

            hitBox =
                makeHitBox({
                    shape: "circle",
                    offsetX: 100,
                    radius: 138
                });

        }

        if (attacker.data.specialType === "voltSlash") {

            hitBox =
                makeHitBox({
                    shape: "rect",
                    offsetX: 72,
                    width: 190,
                    height: 75
                });

        }

        if (attacker.data.specialType === "novaShot") {
            hitBox = null;
        }
    }

    if (!hitBox) return;

    if (
        isHitBoxTouching(
            hitBox,
            attacker,
            target
        )
    ) {

        applyHit(
            attacker,
            target,
            damage,
            hitType,
            isSpecial,
            isSmash
        );

        attacker.attackKind = "";
        attacker.smashLevel = 0;

        if (isSpecial) {
            attacker.specialTimer = 0;
        }
    }
}