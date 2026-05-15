/* =========================
   キャラ選択レイアウト
========================= */

function getSelectLayout() {
    const cardW = 250;
    const cardH = 390;
    const gap = 50;

    const totalW =
        cardW * 3 +
        gap * 2;

    const startX =
        GAME_W / 2 -
        totalW / 2;

    const startY = 160;

    const buttonW = 300;
    const buttonH = 64;

    const buttonX =
        GAME_W / 2 -
        buttonW / 2;

    const buttonY = 600;

    return {
        cardW,
        cardH,
        gap,
        startX,
        startY,
        buttonX,
        buttonY,
        buttonW,
        buttonH
    };
}

/* =========================
   キャラ選択画面
========================= */

function drawSelect() {
    if (
        menuBg &&
        menuBg.complete &&
        menuBg.naturalWidth > 0
    ) {
        ctx.drawImage(
            menuBg,
            0,
            0,
            GAME_W,
            GAME_H
        );
    } else {
        drawBackground();
    }

    ctx.fillStyle =
        "rgba(0,0,0,0.35)";

    ctx.fillRect(
        0,
        0,
        GAME_W,
        GAME_H
    );

    const layout =
        getSelectLayout();

    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 56px Arial";

    ctx.shadowColor = "#7a5cff";
    ctx.shadowBlur = 25;

    ctx.fillText(
        "CHARACTER SELECT",
        GAME_W / 2,
        105
    );

    ctx.shadowBlur = 0;

    const keys = [
        "balance",
        "power",
        "speed"
    ];

    keys.forEach((key, i) => {
        const x =
            layout.startX +
            i * (layout.cardW + layout.gap);

        const y =
            layout.startY;

        drawCharCard(
            key,
            x,
            y,
            layout.cardW,
            layout.cardH
        );
    });

    drawCyberButton(
        layout.buttonX,
        layout.buttonY,
        layout.buttonW,
        layout.buttonH,
        "NEXT"
    );

    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
}

/* =========================
   サイバーボタン
========================= */

function drawCyberButton(
    x,
    y,
    w,
    h,
    text
) {
    ctx.fillStyle =
        "rgba(20,20,40,0.75)";

    ctx.fillRect(
        x,
        y,
        w,
        h
    );

    ctx.strokeStyle = "#7a5cff";
    ctx.lineWidth = 3;

    ctx.strokeRect(
        x,
        y,
        w,
        h
    );

    ctx.shadowColor = "#7a5cff";
    ctx.shadowBlur = 20;

    ctx.fillStyle = "#fff";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        text,
        x + w / 2,
        y + h / 2
    );

    ctx.shadowBlur = 0;
}

/* =========================
   キャラカード
========================= */

function drawCharCard(
    key,
    x,
    y,
    w,
    h
) {
    const ch =
        CHARACTERS[key];

    const active =
        selectedChar === key;

    ctx.fillStyle =
        active
            ? "rgba(255,255,255,0.14)"
            : "rgba(0,0,0,0.48)";

    ctx.fillRect(
        x,
        y,
        w,
        h
    );

    if (active) {
        ctx.shadowColor = ch.color;
        ctx.shadowBlur = 25;
    }

    ctx.strokeStyle =
        active
            ? ch.color
            : "rgba(255,255,255,0.2)";

    ctx.lineWidth =
        active ? 4 : 2;

    ctx.strokeRect(
        x,
        y,
        w,
        h
    );

    ctx.shadowBlur = 0;

    drawDesktopCharCardContent(
        key,
        x,
        y,
        w,
        h,
        ch
    );
}

/* =========================
   カード中身
========================= */

function drawDesktopCharCardContent(
    key,
    x,
    y,
    w,
    h,
    ch
) {
    ctx.fillStyle = ch.color;
    ctx.font = "bold 34px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    ctx.fillText(
        ch.name,
        x + w / 2,
        y + 42
    );

    ctx.fillStyle = "#d9d9ff";
    ctx.font = "18px Arial";

    ctx.fillText(
        ch.type,
        x + w / 2,
        y + 72
    );

    drawPreviewCharacter(
        key,
        x + w / 2 - 44,
        y + 88,
        ch,
        88,
        112
    );

    ctx.textAlign = "left";

    ctx.fillStyle = "#ffffff";
    ctx.font = "14px Arial";

    const jumpText =
        ch.maxJumps >= 3
            ? "Triple Jump"
            : ch.maxJumps >= 2
                ? "Double Jump"
                : "Single Jump";

    const specialText =
        ch.specialType === "novaShot"
            ? "Energy Shot"
            : ch.specialType === "blazeBurst"
                ? "Burst Explosion"
                : ch.specialType === "voltSlash"
                    ? "Dash Slash"
                    : "Special";

    const lines = [
        `MOVE SPEED : ${ch.speed}`,
        `DASH       : ${ch.dashSpeed}`,
        `JUMP       : ${jumpText}`,
        `ATTACK     : ${ch.attackDamage}`,
        `SMASH      : ${ch.smashCharge3}F`,
        `SPECIAL    : ${specialText}`,
        `POWER      : ${ch.specialDamage}`
    ];

    lines.forEach((t, i) => {
        ctx.fillText(
            t,
            x + 24,
            y + 225 + i * 19
        );
    });
}

/* =========================
   プレビューキャラ
========================= */

function drawPreviewCharacter(
    key,
    x,
    y,
    ch,
    w = 82,
    h = 104
) {
    const img =
        characterImages[key];

    if (
        img &&
        img.complete &&
        img.naturalWidth > 0
    ) {
        ctx.drawImage(
            img,
            x,
            y,
            w,
            h
        );

        return;
    }

    ctx.fillStyle = ch.color;

    ctx.fillRect(
        x + w * 0.25,
        y + h * 0.28,
        w * 0.5,
        h * 0.5
    );
}

/* =========================
   キャラ選択クリック
========================= */

function handleSelectClick(mouseX, mouseY) {
    const layout =
        getSelectLayout();

    const keys = [
        "balance",
        "power",
        "speed"
    ];

    for (let i = 0; i < keys.length; i++) {
        const x =
            layout.startX +
            i * (layout.cardW + layout.gap);

        const y =
            layout.startY;

        if (
            inside(
                mouseX,
                mouseY,
                x,
                y,
                layout.cardW,
                layout.cardH
            )
        ) {
            selectedChar =
                keys[i];

            return;
        }
    }

    if (
        inside(
            mouseX,
            mouseY,
            layout.buttonX,
            layout.buttonY,
            layout.buttonW,
            layout.buttonH
        )
    ) {
        changeState(STATE.STAGE_SELECT);
    }
}