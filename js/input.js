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

window.addEventListener("keydown", e => {
    keys[e.key] = true;
    keys[e.code] = true;

    if (e.code === "Space") {
        e.preventDefault();
    }

    if (gameState !== STATE.GAME) return;

    if (
        e.key === "w" ||
        e.key === "W" ||
        e.key === "ArrowUp" ||
        e.code === "Space"
    ) {
        player.jump();
    }

    if (
        e.key === "j" ||
        e.key === "J"
    ) {
        if (!keys.attackCharging) {
            keys.attackCharging = true;
            player.startAttackCharge();
        }
    }

    if (
        e.key === "k" ||
        e.key === "K"
    ) {
        player.special();
    }

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
});

/* =========================
   キーボード離す
========================= */

window.addEventListener("keyup", e => {
    keys[e.key] = false;
    keys[e.code] = false;

    if (gameState !== STATE.GAME) return;

    if (
        e.key === "j" ||
        e.key === "J"
    ) {
        keys.attackCharging = false;
        player.releaseAttackCharge();
    }
});

/* =========================
   ASTRAスマホジェスチャー
========================= */

let touchMoveId = null;
let touchActionId = null;

let moveStartX = 0;
let moveStartY = 0;

let actionStartX = 0;
let actionStartY = 0;

let actionDidSpecial = false;
let actionDidGuard = false;

stickX = 0;
guardButtonDown = false;

/* =========================
   スマホ：タッチ開始
========================= */

canvas.addEventListener(
    "touchstart",
    e => {
        if (gameState !== STATE.GAME) return;

        for (const t of e.changedTouches) {
            const p = getCanvasPoint(t);

            /* 左半分：移動 */
            if (
                p.x < GAME_W / 2 &&
                touchMoveId === null
            ) {
                touchMoveId = t.identifier;

                moveStartX = p.x;
                moveStartY = p.y;
            }

            /* 右半分：攻撃 */
            else if (
                p.x >= GAME_W / 2 &&
                touchActionId === null
            ) {
                touchActionId = t.identifier;

                actionStartX = p.x;
                actionStartY = p.y;

                actionDidSpecial = false;
                actionDidGuard = false;

                player.startAttackCharge();
            }
        }

        e.preventDefault();
    },
    { passive: false }
);

/* =========================
   スマホ：タッチ移動
========================= */

canvas.addEventListener(
    "touchmove",
    e => {
        if (gameState !== STATE.GAME) return;

        for (const t of e.changedTouches) {

            /* 左半分：左右移動・上ジャンプ */
            if (t.identifier === touchMoveId) {
                const p = getCanvasPoint(t);

                const dx = p.x - moveStartX;
                const dy = p.y - moveStartY;

                stickX =
                    Math.max(
                        -1,
                        Math.min(
                            1,
                            dx / 65
                        )
                    );

                /* 上スライド：ジャンプ */
                if (dy < -42) {
                    player.jump();

                    /*
                       ここを少し下に戻すことで、
                       同じ指でも2回目の上スライドを出しやすくする
                    */
                    moveStartY = p.y + 30;
                }
            }

            /* 右半分：上スライド必殺 / 下スライドガード */
            if (t.identifier === touchActionId) {
                const p = getCanvasPoint(t);

                const dy = p.y - actionStartY;

                /* 上スライド：必殺技 */
                if (
                    dy < -55 &&
                    !actionDidSpecial
                ) {
                    actionDidSpecial = true;

                    if (player.attackCharging) {
                        player.attackCharging = false;
                        player.attackCharge = 0;
                    }

                    guardButtonDown = false;
                    player.special();
                }

                /* 下スライド保持：ガード */
                else if (
                    dy > 55 &&
                    !actionDidSpecial
                ) {
                    actionDidGuard = true;
                    guardButtonDown = true;

                    if (player.attackCharging) {
                        player.attackCharging = false;
                        player.attackCharge = 0;
                    }
                }

                else if (
                    dy <= 35 &&
                    actionDidGuard
                ) {
                    guardButtonDown = false;
                    actionDidGuard = false;
                }
            }
        }

        e.preventDefault();
    },
    { passive: false }
);

/* =========================
   スマホ：タッチ終了
========================= */

canvas.addEventListener(
    "touchend",
    e => {
        if (gameState !== STATE.GAME) return;

        for (const t of e.changedTouches) {

            /* 左指を離した */
            if (t.identifier === touchMoveId) {
                touchMoveId = null;
                stickX = 0;
            }

            /* 右指を離した */
            if (t.identifier === touchActionId) {
                touchActionId = null;

                guardButtonDown = false;

                if (
                    player &&
                    player.attackCharging &&
                    !actionDidSpecial &&
                    !actionDidGuard
                ) {
                    player.releaseAttackCharge();
                }

                actionDidSpecial = false;
                actionDidGuard = false;
            }
        }

        e.preventDefault();
    },
    { passive: false }
);

/* =========================
   スマホ：タッチキャンセル
========================= */

canvas.addEventListener(
    "touchcancel",
    e => {
        touchMoveId = null;
        touchActionId = null;

        stickX = 0;
        guardButtonDown = false;

        if (player && player.attackCharging) {
            player.attackCharging = false;
            player.attackCharge = 0;
        }

        actionDidSpecial = false;
        actionDidGuard = false;

        e.preventDefault();
    },
    { passive: false }
);