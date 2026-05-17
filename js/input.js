/* =========================
   当たり判定
========================= */

function inside(x, y, bx, by, bw, bh) {
    return x >= bx && x <= bx + bw && y >= by && y <= by + bh;
}

/* =========================
   キーボード操作
========================= */

window.addEventListener("keydown", e => {
    keys[e.key] = true;
    keys[e.code] = true;

    if (e.code === "Space") e.preventDefault();
    if (gameState !== STATE.GAME) return;

    /* 小ジャン */
    if (
        e.key === "w" ||
        e.key === "W"
    ) {
        player.jump(0.62);
    }

    /* 大ジャン */
    if (
        e.key === "ArrowUp" ||
        e.code === "Space"
    ) {
        player.jump(1);
    }

    /* S = 足場降り */

    if (
        e.key === "s" ||
        e.key === "S"
    ) {

        if (
            player &&
            player.onGround
        ) {

            player.dropPlatformTimer = 12;

            player.y += 8;

        }

    }

    if (e.key === "j" || e.key === "J") {
        if (!keys.attackCharging) {
            keys.attackCharging = true;
            player.startAttackCharge();
        }
    }

    if (e.key === "k" || e.key === "K") {
        player.special();
    }

});

window.addEventListener("keyup", e => {
    keys[e.key] = false;
    keys[e.code] = false;

    if (gameState !== STATE.GAME) return;

    if (e.key === "j" || e.key === "J") {
        keys.attackCharging = false;
        player.releaseAttackCharge();
    }

    if (
        e.key === "p" ||
        e.key === "P" ||
        e.key === "Escape"
    ) {

        if (
            gameState ===
            STATE.GAME
        ) {

            gameState =
                STATE.PAUSE;

            return;
        }

        if (
            gameState ===
            STATE.PAUSE
        ) {

            gameState =
                STATE.GAME;

            return;
        }

    }
});

/* =========================
   スマホ操作
========================= */

let touchMoveId = null;
let touchActionId = null;

let moveStartX = 0;
let moveStartY = 0;

let actionStartX = 0;
let actionStartY = 0;

let actionDidSpecial = false;
let actionDidGuard = false;

let lastTapTime = 0;

stickX = 0;
guardButtonDown = false;

let stickVisible = false;

let stickBaseX = 0;
let stickBaseY = 0;

let stickKnobX = 0;
let stickKnobY = 0;

/* =========================
   タッチ開始
========================= */

window.addEventListener("touchstart", e => {
    if (gameState !== STATE.GAME) return;

    for (const t of e.changedTouches) {
        const p = getCanvasPoint(t);

        if (
            typeof getPauseButtonRect === "function" &&
            gameState === STATE.GAME
        ) {
            const b = getPauseButtonRect();

            if (
                inside(
                    p.x,
                    p.y,
                    b.x,
                    b.y,
                    b.w,
                    b.h
                )
            ) {
                gameState = STATE.PAUSE;
                e.preventDefault();
                return;
            }
        }

        /* 左半分：移動 */
        if (
            p.x < GAME_W / 2 &&
            touchMoveId === null
        ) {

            const now = Date.now();

            if (
                now - lastTapTime < 250
            ) {

                // 小ジャン
                player.jump(0.62);

            }

            lastTapTime = now;

            touchMoveId = t.identifier;

            moveStartX = p.x;
            moveStartY = p.y;

            stickVisible = true;

            stickBaseX = p.x;
            stickBaseY = p.y;

            stickKnobX = p.x;
            stickKnobY = p.y;
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
}, { passive: false });

/* =========================
   タッチ移動
========================= */

window.addEventListener("touchmove", e => {
    if (gameState !== STATE.GAME) return;

    for (const t of e.changedTouches) {

        /* 左半分：移動・ジャンプ・足場降り */
        if (t.identifier === touchMoveId) {
            const p = getCanvasPoint(t);

            const dx = p.x - moveStartX;
            const dy = p.y - moveStartY;

            const len = Math.hypot(dx, dy);

            const maxR = 55;

            if (len > maxR) {

                stickKnobX =
                    stickBaseX +
                    dx / len * maxR;

                stickKnobY =
                    stickBaseY +
                    dy / len * maxR;

            } else {

                stickKnobX = p.x;
                stickKnobY = p.y;

            }

            stickX = Math.max(
                -1,
                Math.min(1, dx / 70)
            );

            /*
   上フリック＝ジャンプ
*/

            if (
                dy < -150 &&
                Math.abs(dx) < 60
            ) {

                // 大ジャン
                player.jump(1);

                moveStartX = p.x;
                moveStartY = p.y;
            }

            /*
               下フリック＝足場降り
            */
            if (
                dy > 150 &&
                Math.abs(dx) < 60 &&
                player &&
                player.onGround
            ) {
                player.dropPlatformTimer = 12;
                player.y += 8;

                moveStartX = p.x;
                moveStartY = p.y;
            }
        }

        /* 右半分：必殺・ガード */
        if (t.identifier === touchActionId) {
            const p = getCanvasPoint(t);

            const dy = p.y - actionStartY;

            /* 上フリック＝必殺 */
            if (
                dy < -60 &&
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

            /* 下フリック保持＝ガード */
            else if (
                dy > 60 &&
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
}, { passive: false });

/* =========================
   タッチ終了
========================= */

window.addEventListener("touchend", e => {
    if (gameState !== STATE.GAME) return;

    for (const t of e.changedTouches) {

        if (t.identifier === touchMoveId) {

            touchMoveId = null;

            stickX = 0;

            stickVisible = false;

        }

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
}, { passive: false });

/* =========================
   タッチキャンセル
========================= */

window.addEventListener("touchcancel", e => {
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
}, { passive: false });