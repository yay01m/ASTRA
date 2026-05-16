/* =========================
   CPUレベル設定
========================= */

const CPU_LEVELS = {
    1: { attack: 0.012, smash: 0.03, special: 0.002, air: 0.006, guard: 0.03, jump: 0.006, chase: 90 },
    2: { attack: 0.018, smash: 0.06, special: 0.004, air: 0.010, guard: 0.05, jump: 0.008, chase: 100 },
    3: { attack: 0.026, smash: 0.12, special: 0.006, air: 0.014, guard: 0.08, jump: 0.010, chase: 110 },
    4: { attack: 0.036, smash: 0.20, special: 0.009, air: 0.020, guard: 0.12, jump: 0.013, chase: 120 },
    5: { attack: 0.048, smash: 0.30, special: 0.013, air: 0.030, guard: 0.18, jump: 0.016, chase: 130 },
    6: { attack: 0.060, smash: 0.42, special: 0.018, air: 0.042, guard: 0.26, jump: 0.020, chase: 140 },
    7: { attack: 0.076, smash: 0.55, special: 0.025, air: 0.058, guard: 0.36, jump: 0.025, chase: 150 },
    8: { attack: 0.095, smash: 0.70, special: 0.035, air: 0.078, guard: 0.48, jump: 0.030, chase: 165 },
    9: { attack: 0.140, smash: 0.88, special: 0.060, air: 0.120, guard: 0.70, jump: 0.040, chase: 185 }
};

/* =========================
   CPU待機位置
========================= */

function getCpuHomeX() {
    return stage.x + stage.w / 2 + 220;
}

/* =========================
   CPU更新
========================= */

function updateCPU() {

    const level =
        CPU_LEVELS[cpuLevel] ||
        CPU_LEVELS[5];

    if (!cpu || !player) return;

    cpu.setGuard(false);

    const dx = player.x - cpu.x;
    const dy = player.y - cpu.y;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    const dir = dx > 0 ? 1 : -1;

    const playerAttacking =
        player.attackTimer > 0 ||
        player.airAttackTimer > 0 ||
        player.dashAttackTimer > 0 ||
        player.specialTimer > 0;

    /* =====================
       リスポーン中は戻る
    ===================== */

    if (
        playerRespawnTimer > 0 ||
        cpuRespawnTimer > 0
    ) {
        const homeX = getCpuHomeX();
        const diff = homeX - cpu.x;

        if (Math.abs(diff) > 24) {
            cpu.move(diff > 0 ? 1 : -1, true);
        } else {
            cpu.move(0, false);
            cpu.vx *= 0.75;
            cpu.dir = -1;
        }

        return;
    }

    /* =====================
       向き調整
    ===================== */

    if (absDx > 20) {
        cpu.dir = dir;
    }

    /* =====================
       復帰ジャンプ
    ===================== */

    const dangerLow =
        cpu.y > stage.y - 95;

    const farFromCenter =
        Math.abs(
            cpu.x - (stage.x + stage.w / 2)
        ) > stage.w * 0.42;

    if (
        !cpu.onGround &&
        (
            dangerLow ||
            farFromCenter
        )
    ) {
        cpu.jump();

        const centerX =
            stage.x + stage.w / 2;

        cpu.move(
            cpu.x < centerX ? 1 : -1,
            true
        );

        return;
    }

    /* =====================
       上にいる相手を追う
       二段ジャンプ用
    ===================== */

    if (
        player.y + player.h < cpu.y - 55 &&
        absDx < 260
    ) {
        cpu.move(dir, true);

        if (
            Math.random() < level.jump * 3.2
        ) {
            cpu.jump();
        }
    }

    /* =====================
       空中で横追跡
    ===================== */

    if (!cpu.onGround) {
        if (absDx > 45) {
            cpu.move(dir, true);
        }

        if (
            absDx < 145 &&
            absDy < 120 &&
            Math.random() < level.air
        ) {
            cpu.airAttack();
            return;
        }
    }

    /* =====================
       地上追跡
    ===================== */

    if (cpu.onGround) {

        if (absDx > level.chase) {
            cpu.move(dir, true);
        }
        else if (absDx > 55) {
            cpu.move(dir, false);
        }
        else {
            cpu.move(0, false);
            cpu.vx *= 0.82;
        }

        if (
            player.y + player.h < cpu.y - 65 &&
            Math.random() < level.jump * 2.2
        ) {
            cpu.jump();
        }
    }

    /* =====================
       ガード判断
    ===================== */

    if (
        playerAttacking &&
        absDx < 150 &&
        absDy < 120 &&
        cpu.onGround &&
        Math.random() < level.guard
    ) {
        cpu.setGuard(true);
        return;
    }

    /* =====================
       ダッシュ攻撃
    ===================== */

    if (
        cpu.onGround &&
        absDx < 135 &&
        absDx > 65 &&
        Math.random() < level.attack
    ) {
        cpu.dashAttack();
        return;
    }

    /* =====================
       近距離攻撃
    ===================== */

    if (
        absDx < 115 &&
        absDy < 95 &&
        Math.random() < level.attack
    ) {
        cpu.startAttackCharge();

        const shouldSmash =
            player.damage >= 75 ||
            Math.random() < level.smash;

        if (shouldSmash) {
            cpu.attackCharge =
                cpuLevel >= 8
                    ? 999
                    : 90;
        }

        cpu.releaseAttackCharge();
        return;
    }

    /* =====================
       必殺技
    ===================== */

    if (
        absDx < 230 &&
        absDy < 110 &&
        cpu.coolSpecial <= 0 &&
        Math.random() < level.special
    ) {
        cpu.special();
        return;
    }

    /* =====================
       たまにジャンプ接近
    ===================== */

    if (
        cpu.onGround &&
        absDx < 240 &&
        Math.random() < level.jump
    ) {
        cpu.jump();
    }
}