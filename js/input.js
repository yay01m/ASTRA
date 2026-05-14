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
   クリック
========================= */

function clickHandler(x, y) {

    // フェード中は操作禁止
    if (isFading) return;

    // =========================
    // 戻るボタン
    // =========================

    if (isBackButtonHit(x, y)) {

        goBackState();

        return;
    }

    /* =========================
       TITLE
    ========================= */

    if (gameState === STATE.TITLE) {

        changeState(
            STATE.SELECT
        );

        return;
    }

    /* =========================
       CHARACTER SELECT
    ========================= */

    if (gameState === STATE.SELECT) {

        const cards = [

            {
                key: "balance",
                x: canvas.width / 2 - 330
            },

            {
                key: "power",
                x: canvas.width / 2 - 105
            },

            {
                key: "speed",
                x: canvas.width / 2 + 120
            }
        ];

        // キャラ選択
        for (const c of cards) {

            if (
                inside(
                    x,
                    y,
                    c.x,
                    125,
                    205,
                    300
                )
            ) {

                selectedChar =
                    c.key;
            }
        }

        // STARTボタン
        if (
            inside(
                x,
                y,
                canvas.width / 2 - 130,
                canvas.height - 90,
                260,
                60
            )
        ) {

            changeState(
                STATE.STAGE_SELECT
            );
        }

        return;
    }

    /* =========================
       STAGE SELECT
    ========================= */

    if (
        gameState ===
        STATE.STAGE_SELECT
    ) {

        const cards = [

            {
                key: "cyber_core",
                x: canvas.width / 2 - 160
            }
        ];

        // ステージ選択
        for (const s of cards) {

            if (
                inside(
                    x,
                    y,
                    s.x,
                    140,
                    320,
                    190
                )
            ) {

                selectedStage =
                    s.key;

                currentStage =
                    s.key;

                loadStageImages();
            }
        }

        // STARTボタン
        if (
            inside(
                x,
                y,
                canvas.width / 2 - 130,
                canvas.height - 90,
                260,
                60
            )
        ) {

            changeState(
                STATE.CPU_LEVEL
            );
        }

        return;
    }

    /* =========================
       CPU LEVEL
    ========================= */

    if (gameState === STATE.CPU_LEVEL) {

        const cardW = 90;
        const cardH = 100;
        const gap = 18;

        const totalW =
            cardW * 9 + gap * 8;

        const startX =
            canvas.width / 2 - totalW / 2;

        const cardY =
            canvas.height / 2 - 40;

        // レベル選択
        for (let i = 1; i <= 9; i++) {

            const cardX =
                startX +
                (i - 1) *
                (cardW + gap);

            if (
                inside(
                    x,
                    y,
                    cardX,
                    cardY,
                    cardW,
                    cardH
                )
            ) {

                cpuLevel = i;
            }
        }

        // START BATTLE
        if (
            inside(
                x,
                y,
                canvas.width / 2 - 140,
                canvas.height - 85,
                280,
                58
            )
        ) {

            setupGame();

            changeState(
                STATE.GAME
            );
        }

        return;
    }

    /* =========================
       KO
    ========================= */

    if (gameState === STATE.KO) {

        if (
            inside(
                x,
                y,
                canvas.width / 2 - 150,
                canvas.height / 2 + 35,
                300,
                65
            )
        ) {

            changeState(
                STATE.TITLE
            );
        }
    }
}

/* =========================
   マウス
========================= */

canvas.addEventListener(
    "mousedown",
    e => {

        clickHandler(
            e.clientX,
            e.clientY
        );
    }
);

/* =========================
   タッチ
========================= */

canvas.addEventListener(
    "touchstart",
    e => {

        const t =
            e.touches[0];

        clickHandler(
            t.clientX,
            t.clientY
        );
    }
);

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
   キーボード
========================= */

window.addEventListener(
    "keydown",
    e => {

        keys[e.key] = true;
        keys[e.code] = true;

        if (
            e.code === "Space"
        ) {

            e.preventDefault();
        }

        if (
            gameState !== STATE.GAME
        ) return;

        // ジャンプ
        if (
            e.key === "w" ||
            e.key === "W" ||
            e.key === "ArrowUp" ||
            e.code === "Space"
        ) {

            player.jump();
        }

        // 攻撃
        if (
            e.key === "j" ||
            e.key === "J"
        ) {

            if (
                !keys.attackCharging
            ) {

                keys.attackCharging =
                    true;

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
   キー離す
========================= */

window.addEventListener(
    "keyup",
    e => {

        keys[e.key] = false;
        keys[e.code] = false;

        if (
            gameState !== STATE.GAME
        ) return;

        if (
            e.key === "j" ||
            e.key === "J"
        ) {

            keys.attackCharging =
                false;

            player.releaseAttackCharge();
        }
    }
);

/* =========================
   スマホボタン
========================= */

const attackBtn =
    document.getElementById(
        "btnAttack"
    );

attackBtn.addEventListener(
    "touchstart",
    e => {

        e.preventDefault();

        if (
            gameState === STATE.GAME
        ) {

            player.startAttackCharge();
        }
    }
);

attackBtn.addEventListener(
    "touchend",
    e => {

        e.preventDefault();

        if (
            gameState === STATE.GAME
        ) {

            player.releaseAttackCharge();
        }
    }
);

attackBtn.addEventListener(
    "touchcancel",
    e => {

        e.preventDefault();

        if (
            gameState === STATE.GAME
        ) {

            player.releaseAttackCharge();
        }
    }
);

document
    .getElementById(
        "btnSpecial"
    )
    .addEventListener(
        "touchstart",
        e => {

            e.preventDefault();

            if (
                gameState === STATE.GAME
            ) {

                player.special();
            }
        }
    );

document
    .getElementById(
        "btnJump"
    )
    .addEventListener(
        "touchstart",
        e => {

            e.preventDefault();

            if (
                gameState === STATE.GAME
            ) {

                player.jump();
            }
        }
    );

/* =========================
   ガード / 空中回避
========================= */

const guardBtn =
    document.getElementById(
        "btnGuard"
    );

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
                stickX
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
    document.getElementById(
        "stickArea"
    );

const stick =
    document.getElementById(
        "stick"
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
            rect.left +
            rect.width / 2;

        const cy =
            rect.top +
            rect.height / 2;

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

        const base =
            rect.width / 2 -
            stick.offsetWidth / 2;

        stick.style.left =
            base + dx + "px";

        stick.style.top =
            base + dy + "px";

        stickX = dx / max;
    }
);

/* =========================
   スティック離す
========================= */

stickArea.addEventListener(
    "touchend",
    () => {

        stickX = 0;

        const rect =
            stickArea.getBoundingClientRect();

        const base =
            rect.width / 2 -
            stick.offsetWidth / 2;

        stick.style.left =
            base + "px";

        stick.style.top =
            base + "px";
    }
);