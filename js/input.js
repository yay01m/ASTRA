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
   スマホボタン共通
========================= */

function safePrevent(e) {
    e.preventDefault();
    e.stopPropagation();
}

/* =========================
   攻撃ボタン
========================= */

const attackBtn =
    document.getElementById("btnAttack");

attackBtn.addEventListener("touchstart", e => {
    safePrevent(e);

    if (gameState === STATE.GAME) {
        player.startAttackCharge();
    }
}, { passive: false });

attackBtn.addEventListener("touchend", e => {
    safePrevent(e);

    if (gameState === STATE.GAME) {
        player.releaseAttackCharge();
    }
}, { passive: false });

attackBtn.addEventListener("touchcancel", e => {
    safePrevent(e);

    if (gameState === STATE.GAME) {
        player.releaseAttackCharge();
    }
}, { passive: false });

/* =========================
   必殺ボタン
========================= */

document
    .getElementById("btnSpecial")
    .addEventListener("touchstart", e => {
        safePrevent(e);

        if (gameState === STATE.GAME) {
            player.special();
        }
    }, { passive: false });

/* =========================
   ジャンプボタン
========================= */

document
    .getElementById("btnJump")
    .addEventListener("touchstart", e => {
        safePrevent(e);

        if (gameState === STATE.GAME) {
            player.jump();
        }
    }, { passive: false });

/* =========================
   ガード / 空中回避
========================= */

const guardBtn =
    document.getElementById("btnGuard");

guardBtn.addEventListener("touchstart", e => {
    safePrevent(e);

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
}, { passive: false });

guardBtn.addEventListener("touchend", e => {
    safePrevent(e);
    guardButtonDown = false;
}, { passive: false });

guardBtn.addEventListener("touchcancel", e => {
    safePrevent(e);
    guardButtonDown = false;
}, { passive: false });

/* =========================
   スティック
========================= */

const stickArea =
    document.getElementById("stickArea");

const stick =
    document.getElementById("stick");

let stickTouchId = null;

function getStickBase() {
    const rect =
        stickArea.getBoundingClientRect();

    return {
        rect,
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
        baseX: rect.width / 2 - stick.offsetWidth / 2,
        baseY: rect.height / 2 - stick.offsetHeight / 2,
        max: rect.width * 0.34
    };
}

function moveStick(touch) {
    const data =
        getStickBase();

    let dx =
        touch.clientX - data.centerX;

    let dy =
        touch.clientY - data.centerY;

    const len =
        Math.hypot(dx, dy);

    if (len > data.max) {
        dx =
            dx / len * data.max;

        dy =
            dy / len * data.max;
    }

    stick.style.left =
        data.baseX + dx + "px";

    stick.style.top =
        data.baseY + dy + "px";

    stickX =
        dx / data.max;
}

function findStickTouch(touches) {
    for (const t of touches) {
        if (t.identifier === stickTouchId) {
            return t;
        }
    }

    return null;
}

stickArea.addEventListener("touchstart", e => {
    safePrevent(e);

    const t =
        e.changedTouches[0];

    stickTouchId =
        t.identifier;

    moveStick(t);
}, { passive: false });

stickArea.addEventListener("touchmove", e => {
    safePrevent(e);

    const t =
        findStickTouch(e.touches);

    if (!t) return;

    moveStick(t);
}, { passive: false });

/* =========================
   スティックリセット
========================= */

function resetStick() {
    stickX = 0;
    stickTouchId = null;

    if (!stickArea || !stick) return;

    const data =
        getStickBase();

    stick.style.left =
        data.baseX + "px";

    stick.style.top =
        data.baseY + "px";
}

stickArea.addEventListener("touchend", e => {
    safePrevent(e);

    const ended =
        Array.from(e.changedTouches)
            .some(t => t.identifier === stickTouchId);

    if (ended) {
        resetStick();
    }
}, { passive: false });

stickArea.addEventListener("touchcancel", e => {
    safePrevent(e);
    resetStick();
}, { passive: false });

window.addEventListener("resize", resetStick);

window.addEventListener("orientationchange", () => {
    setTimeout(resetStick, 300);
});

setTimeout(resetStick, 300);