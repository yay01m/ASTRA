/* =========================
   当たり判定
========================= */

function inside(x, y, bx, by, bw, bh) {
    return (
        x >= bx &&
        x <= bx + bw &&
        y >= by &&
        y <= by + bh
    );
}

/* =========================
   回避方向取得
========================= */

function getDodgeInput() {

    let dodgeInput = 0;

    if (
        keys["a"] ||
        keys["A"] ||
        keys["ArrowLeft"]
    ) {
        dodgeInput = -1;
    }

    if (
        keys["d"] ||
        keys["D"] ||
        keys["ArrowRight"]
    ) {
        dodgeInput = 1;
    }

    if (Math.abs(stickX) > 0.25) {
        dodgeInput =
            stickX > 0 ? 1 : -1;
    }

    return dodgeInput;
}

/* =========================
   キーボード押す
========================= */

window.addEventListener(
    "keydown",
    e => {

        keys[e.key] = true;
        keys[e.code] = true;

        if (e.code === "Space") {
            e.preventDefault();
        }

        if (gameState !== STATE.GAME) return;

        // ジャンプ
        if (
            e.key === "w" ||
            e.key === "W" ||
            e.key === "ArrowUp" ||
            e.code === "Space"
        ) {
            player.jump();
        }

        // 攻撃ため開始
        if (
            e.key === "j" ||
            e.key === "J"
        ) {
            if (!keys.attackCharging) {
                keys.attackCharging = true;
                player.startAttackCharge();
            }
        }

        // 必殺技
        if (
            e.key === "k" ||
            e.key === "K"
        ) {
            player.special();
        }

        // ガード / 空中回避
        if (
            e.key === "l" ||
            e.key === "L"
        ) {
            if (
                player &&
                !player.onGround
            ) {
                player.airDodge(
                    getDodgeInput()
                );
            }
        }
    }
);

/* =========================
   キーボード離す
========================= */

window.addEventListener(
    "keyup",
    e => {

        keys[e.key] = false;
        keys[e.code] = false;

        if (gameState !== STATE.GAME) return;

        // 攻撃ため解除
        if (
            e.key === "j" ||
            e.key === "J"
        ) {
            keys.attackCharging = false;
            player.releaseAttackCharge();
        }
    }
);

/* =========================
   スマホ攻撃ボタン
========================= */

const attackBtn =
    document.getElementById("btnAttack");

attackBtn.addEventListener(
    "touchstart",
    e => {
        e.preventDefault();

        if (gameState === STATE.GAME) {
            player.startAttackCharge();
        }
    }
);

attackBtn.addEventListener(
    "touchend",
    e => {
        e.preventDefault();

        if (gameState === STATE.GAME) {
            player.releaseAttackCharge();
        }
    }
);

attackBtn.addEventListener(
    "touchcancel",
    e => {
        e.preventDefault();

        if (gameState === STATE.GAME) {
            player.releaseAttackCharge();
        }
    }
);

/* =========================
   スマホ必殺ボタン
========================= */

document
    .getElementById("btnSpecial")
    .addEventListener(
        "touchstart",
        e => {
            e.preventDefault();

            if (gameState === STATE.GAME) {
                player.special();
            }
        }
    );

/* =========================
   スマホジャンプボタン
========================= */

document
    .getElementById("btnJump")
    .addEventListener(
        "touchstart",
        e => {
            e.preventDefault();

            if (gameState === STATE.GAME) {
                player.jump();
            }
        }
    );

/* =========================
   スマホガード / 空中回避
========================= */

const guardBtn =
    document.getElementById("btnGuard");

guardBtn.addEventListener(
    "touchstart",
    e => {
        e.preventDefault();

        if (
            gameState === STATE.GAME &&
            player &&
            !player.onGround
        ) {
            player.airDodge(
                getDodgeInput()
            );

            return;
        }

        guardButtonDown = true;
    }
);

guardBtn.addEventListener(
    "touchend",
    e => {
        e.preventDefault();

        guardButtonDown = false;
    }
);

guardBtn.addEventListener(
    "touchcancel",
    e => {
        e.preventDefault();

        guardButtonDown = false;
    }
);

/* =========================
   スティック
========================= */

const stickArea =
    document.getElementById("stickArea");

const stick =
    document.getElementById("stick");

stickArea.addEventListener(
    "touchstart",
    e => {
        e.preventDefault();
    }
);

stickArea.addEventListener(
    "touchmove",
    e => {
        e.preventDefault();

        const rect =
            stickArea.getBoundingClientRect();

        const t =
            e.touches[0];

        const cx =
            rect.left + rect.width / 2;

        const cy =
            rect.top + rect.height / 2;

        let dx =
            t.clientX - cx;

        let dy =
            t.clientY - cy;

        const max =
            rect.width * 0.32;

        const len =
            Math.hypot(dx, dy);

        if (len > max) {
            dx =
                dx / len * max;

            dy =
                dy / len * max;
        }

        const baseX =
            rect.width / 2 -
            stick.offsetWidth / 2;

        const baseY =
            rect.height / 2 -
            stick.offsetHeight / 2;

        stick.style.left =
            baseX + dx + "px";

        stick.style.top =
            baseY + dy + "px";

        stickX = dx / max;
    }
);

/* =========================
   スティック離す
========================= */

function resetStick() {

    stickX = 0;

    const rect =
        stickArea.getBoundingClientRect();

    const baseX =
        rect.width / 2 -
        stick.offsetWidth / 2;

    const baseY =
        rect.height / 2 -
        stick.offsetHeight / 2;

    stick.style.left =
        baseX + "px";

    stick.style.top =
        baseY + "px";
}

stickArea.addEventListener(
    "touchend",
    e => {
        e.preventDefault();
        resetStick();
    }
);

stickArea.addEventListener(
    "touchcancel",
    e => {
        e.preventDefault();
        resetStick();
    }
);