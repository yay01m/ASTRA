/* =========================
   ダメージ処理
========================= */

function applyHit(
    attacker,
    target,
    damage,
    knock,
    isSpecial = false,
    isAir = false,
    isSmash = false
) {
    const guarded = target.isGuarding;

    const finalDamage = guarded
        ? Math.floor(damage * 0.25)
        : damage;

    const finalKnock = guarded
        ? knock * 0.16
        : knock;

    target.damage += finalDamage;

    const power = getKnockbackPower(
        target,
        finalKnock
    );

    const finishHit =
        !guarded &&
        (
            isSpecial ||
            isSmash
        ) &&
        isFinishHit(
            target,
            finalKnock,
            true
        );

    applyKnockback(
        attacker,
        target,
        power,
        isAir,
        finishHit
    );

    target.hitstun = finishHit
        ? 34
        : guarded
            ? 5
            : isSmash
                ? 24
                : 16;

    target.invincible = finishHit
        ? 20
        : isSmash
            ? 16
            : 12;

    if (isSpecial) {
        attacker.actionLock =
            Math.max(attacker.actionLock, 20);
    }

    const tx = target.x + target.w / 2;
    const ty = target.y + target.h / 2;

    if (finishHit) {

        addFinishHitFeel();

        addKOFlashEffect(tx, ty);

        addEffect(
            tx,
            ty,
            "#ffffff",
            58
        );

    } else {

        addHitFeel(
            isSpecial,
            isAir,
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

    if (isAir) {

        attacker.airAttackTimer = 0;

        attacker.actionLock =
            Math.max(attacker.actionLock, 8);
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

/*
attackTime

> 3 && <= 8

なら

8〜4 の間だけ
攻撃判定が出る
*/

/* =========================
   通常攻撃
========================= */

function isNormalActive(attacker) {

    return (
        attacker.attackTimer > 3 &&
        attacker.attackTimer <= 8
    );
}

/* =========================
   スマッシュ
========================= */

function isSmashActive(attacker) {

    return (
        attacker.attackTimer > 4 &&
        attacker.attackTimer <= 11
    );
}

/* =========================
   ダッシュ攻撃
========================= */

function isDashActive(attacker) {

    return (
        attacker.dashAttackTimer > 4 &&
        attacker.dashAttackTimer <= 10
    );
}

/* =========================
   空中攻撃
========================= */

function isAirActive(attacker) {

    return (
        attacker.airAttackTimer > 3 &&
        attacker.airAttackTimer <= 8
    );
}

/* =========================
   必殺技
========================= */

function isSpecialActive(attacker) {

    // =========================
    // BLAZE
    // =========================

    if (
        attacker.data.specialType ===
        "blazeBurst"
    ) {

        return (
            attacker.specialTimer > 5 &&
            attacker.specialTimer <= 10
        );
    }

    // =========================
    // VOLT
    // =========================

    if (
        attacker.data.specialType ===
        "voltSlash"
    ) {

        return (
            attacker.specialTimer > 10 &&
            attacker.specialTimer <= 12
        );
    }

    // =========================
    // NOVA
    // =========================

    if (
        attacker.data.specialType ===
        "novaShot"
    ) {

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
   当たり判定チェック
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
        target.x +
        target.w / 2;

    const ty =
        target.y +
        target.h / 2;

    const dx =
        Math.abs(tx - ax);

    const dy =
        Math.abs(ty - ay);

    /* =========================
       円形
    ========================= */

    if (hitBox.shape === "circle") {

        return (
            Math.hypot(dx, dy) <
            hitBox.radius
        );
    }

    /* =========================
       長方形
    ========================= */

    if (hitBox.shape === "rect") {

        return (
            dx < hitBox.width / 2 &&
            dy < hitBox.height / 2
        );
    }

    /* =========================
       楕円
    ========================= */

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

function hitCheck(attacker, target) {

    if (target.invincible > 0) return;

    let hitBox = null;

    let damage =
        attacker.data.attackDamage;

    let knock =
        attacker.data.attackKnockback;

    let isSpecial = false;
    let isAir = false;
    let isSmash = false;

    /* =========================
       通常攻撃 / スマッシュ
    ========================= */

    if (
        attacker.attackKind === "smash"
            ? isSmashActive(attacker)
            : isNormalActive(attacker)
    ) {

        if (attacker.attackKind === "smash") {

            isSmash = true;

            const level =
                attacker.smashLevel || 1;

            /* =========================
               スマッシュ倍率
            ========================= */

            const damageRate =
                level === 3
                    ? 5.5
                    : level === 2
                        ? 3.75
                        : 2.95;

            const knockRate =
                level === 3
                    ? 6.35
                    : level === 2
                        ? 4.8
                        : 4.25;

            damage =
                Math.floor(
                    attacker.data.attackDamage *
                    damageRate
                );

            knock =
                attacker.data.attackKnockback *
                knockRate;

            /* =========================
               スマッシュ判定
            ========================= */

            if (attacker.charKey === "power") {

                hitBox = makeHitBox({
                    shape: "rect",
                    offsetX: 48,
                    width: 105,
                    height: 58
                });

            } else if (
                attacker.charKey === "speed"
            ) {

                hitBox = makeHitBox({
                    shape: "rect",
                    offsetX: 52,
                    width: 112,
                    height: 44
                });

            } else {

                hitBox = makeHitBox({
                    shape: "rect",
                    offsetX: 50,
                    width: 108,
                    height: 50
                });
            }

        } else {

            /* =========================
               通常攻撃倍率
            ========================= */

            damage =
                Math.floor(
                    attacker.data.attackDamage *
                    1.15
                );

            knock =
                attacker.data.attackKnockback *
                1.2;

            /* =========================
               通常攻撃判定
            ========================= */

            if (attacker.charKey === "power") {

                hitBox = makeHitBox({
                    shape: "rect",
                    offsetX: 42,
                    width: 82,
                    height: 46
                });

            } else if (
                attacker.charKey === "speed"
            ) {

                hitBox = makeHitBox({
                    shape: "rect",
                    offsetX: 48,
                    width: 92,
                    height: 34
                });

            } else {

                hitBox = makeHitBox({
                    shape: "rect",
                    offsetX: 45,
                    width: 86,
                    height: 40
                });
            }
        }
    }

    /* =========================
       ダッシュ攻撃
    ========================= */

    if (isDashActive(attacker)) {

        damage =
            attacker.data.dashDamage * 1.35;

        knock =
            attacker.data.dashKnockback * 1.9;

        if (attacker.charKey === "speed") {

            hitBox = makeHitBox({
                shape: "rect",
                offsetX: 48,
                width: 95,
                height: 32
            });

        } else if (
            attacker.charKey === "power"
        ) {

            hitBox = makeHitBox({
                shape: "rect",
                offsetX: 45,
                width: 90,
                height: 40
            });

        } else {

            hitBox = makeHitBox({
                shape: "rect",
                offsetX: 46,
                width: 92,
                height: 36
            });
        }
    }

    /* =========================
       空中攻撃
    ========================= */

    if (isAirActive(attacker)) {

        isAir = true;

        damage =
            attacker.data.airDamage * 1.25;

        knock =
            attacker.data.airKnockback * 1.7;

        if (attacker.charKey === "power") {

            hitBox = makeHitBox({
                shape: "ellipse",
                offsetX: 28,
                width: 78,
                height: 58
            });

        } else if (
            attacker.charKey === "speed"
        ) {

            hitBox = makeHitBox({
                shape: "ellipse",
                offsetX: 34,
                width: 82,
                height: 42
            });

        } else {

            hitBox = makeHitBox({
                shape: "ellipse",
                offsetX: 30,
                width: 78,
                height: 48
            });
        }
    }

    /* =========================
       必殺技
    ========================= */

    if (isSpecialActive(attacker)) {

        isSpecial = true;

        damage =
            attacker.data.specialDamage;

        knock =
            attacker.data.specialKnockback;

        /* =========================
           BLAZE
        ========================= */

        if (
            attacker.data.specialType ===
            "blazeBurst"
        ) {

            hitBox = makeHitBox({
                shape: "circle",
                offsetX: 70,
                radius: 122
            });
        }

        /* =========================
           VOLT
        ========================= */

        if (
            attacker.data.specialType ===
            "voltSlash"
        ) {

            hitBox = makeHitBox({
                shape: "rect",
                offsetX: 10,
                width: 135,
                height: 38
            });
        }

        /* =========================
           NOVA
        ========================= */

        if (
            attacker.data.specialType ===
            "novaShot"
        ) {

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
            knock,
            isSpecial,
            isAir,
            isSmash
        );

        attacker.attackKind = "";
        attacker.smashLevel = 0;

        if (isSpecial) {
            attacker.specialTimer = 0;
        }
    }
}