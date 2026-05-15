/* =========================
   ノックバック自動計算
========================= */

function getDamageKnockback(
    damage,
    type = "normal"
) {
    const rate = {
        normal: 0.95,
        dash: 1.05,
        air: 1.00,
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
    isAir = false,
    isSmash = false
) {
    const guarded =
        target.isGuarding;

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
            Math.max(
                attacker.actionLock,
                8
            );
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
            62 +
            (attacker.smashLevel || 1) * 8
        );
    }
}

/* =========================
   攻撃判定時間
========================= */

function isNormalActive(attacker) {
    return (
        attacker.attackTimer > 3 &&
        attacker.attackTimer <= 8
    );
}

function isSmashActive(attacker) {
    return (
        attacker.attackTimer > 4 &&
        attacker.attackTimer <= 11
    );
}

function isDashActive(attacker) {
    return (
        attacker.dashAttackTimer > 4 &&
        attacker.dashAttackTimer <= 10
    );
}

function isAirActive(attacker) {
    return (
        attacker.airAttackTimer > 3 &&
        attacker.airAttackTimer <= 8
    );
}

function isSpecialActive(attacker) {
    if (attacker.data.specialType === "blazeBurst") {
        return (
            attacker.specialTimer > 5 &&
            attacker.specialTimer <= 10
        );
    }

    if (attacker.data.specialType === "voltSlash") {
        return (
            attacker.specialTimer > 10 &&
            attacker.specialTimer <= 12
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

    if (hitBox.shape === "circle") {
        return (
            Math.hypot(dx, dy) <
            hitBox.radius
        );
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

    let isSpecial = false;
    let isAir = false;
    let isSmash = false;

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
                    ? 5.5
                    : level === 2
                        ? 3.75
                        : 2.95;

            damage =
                Math.floor(
                    attacker.data.attackDamage *
                    damageRate
                );

            if (attacker.charKey === "power") {
                hitBox = makeHitBox({
                    shape: "rect",
                    offsetX: 48,
                    width: 105,
                    height: 58
                });
            } else if (attacker.charKey === "speed") {
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
            hitType = "normal";

            damage =
                Math.floor(
                    attacker.data.attackDamage *
                    1.15
                );

            if (attacker.charKey === "power") {
                hitBox = makeHitBox({
                    shape: "rect",
                    offsetX: 42,
                    width: 82,
                    height: 46
                });
            } else if (attacker.charKey === "speed") {
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

    if (isDashActive(attacker)) {
        hitType = "dash";

        damage =
            Math.floor(
                attacker.data.dashDamage *
                1.35
            );

        if (attacker.charKey === "speed") {
            hitBox = makeHitBox({
                shape: "rect",
                offsetX: 48,
                width: 95,
                height: 32
            });
        } else if (attacker.charKey === "power") {
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

    if (isAirActive(attacker)) {
        isAir = true;
        hitType = "air";

        damage =
            Math.floor(
                attacker.data.airDamage *
                1.25
            );

        if (attacker.charKey === "power") {
            hitBox = makeHitBox({
                shape: "ellipse",
                offsetX: 28,
                width: 78,
                height: 58
            });
        } else if (attacker.charKey === "speed") {
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

    if (isSpecialActive(attacker)) {
        isSpecial = true;
        hitType = "special";

        damage =
            attacker.data.specialDamage;

        if (attacker.data.specialType === "blazeBurst") {
            hitBox = makeHitBox({
                shape: "circle",
                offsetX: 70,
                radius: 122
            });
        }

        if (attacker.data.specialType === "voltSlash") {
            hitBox = makeHitBox({
                shape: "rect",
                offsetX: 10,
                width: 135,
                height: 38
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