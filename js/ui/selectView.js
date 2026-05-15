/* =========================
   キャラ選択画面
========================= */

function isSelectMobile() {
    return (
        canvas.width < 900 &&
        canvas.height > canvas.width
    );
}

function getSelectLayout() {

    const mobile =
        isSelectMobile();

    if (mobile) {

        const cardW =
            canvas.width * 0.82;

        const cardH =
            canvas.height * 0.16;

        const gap =
            canvas.height * 0.025;

        const startX =
            canvas.width / 2 - cardW / 2;

        const startY =
            canvas.height * 0.18;

        const buttonW =
            canvas.width * 0.62;

        const buttonH =
            canvas.height * 0.07;

        const buttonX =
            canvas.width / 2 - buttonW / 2;

        const buttonY =
            canvas.height * 0.82;

        return {
            mobile,
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

    const cardW =
        canvas.width * 0.18;

    const cardH =
        canvas.height * 0.5;

    const gap =
        canvas.width * 0.03;

    const totalW =
        cardW * 3 + gap * 2;

    const startX =
        canvas.width / 2 - totalW / 2;

    const startY =
        canvas.height * 0.2;

    return {
        mobile,
        cardW,
        cardH,
        gap,
        startX,
        startY,
        buttonX: canvas.width / 2 - 140,
        buttonY: canvas.height - 95,
        buttonW: 280,
        buttonH: 62
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
            canvas.width,
            canvas.height
        );
    } else {
        drawBackground();
    }

    ctx.fillStyle =
        "rgba(0,0,0,0.35)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    const layout =
        getSelectLayout();

    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    ctx.fillStyle = "#ffffff";

    ctx.font =
        layout.mobile
            ? "bold 30px Arial"
            : "bold 52px Arial";

    ctx.shadowColor =
        "#7a5cff";

    ctx.shadowBlur = 25;

    ctx.fillText(
        "CHARACTER SELECT",
        canvas.width / 2,
        layout.mobile
            ? canvas.height * 0.11
            : 90
    );

    ctx.shadowBlur = 0;

    const keys = [
        "balance",
        "power",
        "speed"
    ];

    keys.forEach((key, i) => {

        const x =
            layout.mobile
                ? layout.startX
                : layout.startX + i * (layout.cardW + layout.gap);

        const y =
            layout.mobile
                ? layout.startY + i * (layout.cardH + layout.gap)
                : layout.startY;

        drawCharCard(
            key,
            x,
            y,
            layout.cardW,
            layout.cardH,
            layout.mobile
        );
    });

    drawCyberButton(
        layout.buttonX,
        layout.buttonY,
        layout.buttonW,
        layout.buttonH,
        "NEXT",
        layout.mobile
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
    text,
    mobile = false
) {

    ctx.fillStyle =
        "rgba(20,20,40,0.75)";

    ctx.fillRect(x, y, w, h);

    ctx.strokeStyle =
        "#7a5cff";

    ctx.lineWidth =
        mobile ? 2 : 3;

    ctx.strokeRect(x, y, w, h);

    ctx.shadowColor =
        "#7a5cff";

    ctx.shadowBlur =
        mobile ? 14 : 20;

    ctx.fillStyle = "#fff";

    ctx.font =
        mobile
            ? "bold 18px Arial"
            : "bold 28px Arial";

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
    h,
    mobile = false
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
        ctx.shadowColor =
            ch.color;

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

    if (mobile) {
        drawMobileCharCardContent(
            key,
            x,
            y,
            w,
            h,
            ch
        );
    } else {
        drawDesktopCharCardContent(
            key,
            x,
            y,
            w,
            h,
            ch
        );
    }
}

/* =========================
   スマホ用カード中身
========================= */

function drawMobileCharCardContent(
    key,
    x,
    y,
    w,
    h,
    ch
) {

    drawPreviewCharacter(
        key,
        x + 18,
        y + h / 2 - 42,
        ch,
        64,
        84
    );

    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    ctx.fillStyle =
        ch.color;

    ctx.font =
        "bold 24px Arial";

    ctx.fillText(
        ch.name,
        x + 100,
        y + 34
    );

    ctx.fillStyle =
        "#d9d9ff";

    ctx.font =
        "14px Arial";

    ctx.fillText(
        ch.type,
        x + 100,
        y + 56
    );

    ctx.fillStyle =
        "#ffffff";

    ctx.font =
        "13px Arial";

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

    ctx.fillText(
        `SPD ${ch.speed} / ATK ${ch.attackDamage} / ${jumpText}`,
        x + 100,
        y + 82
    );

    ctx.fillText(
        `SPECIAL : ${specialText}`,
        x + 100,
        y + 104
    );
}

/* =========================
   PC用カード中身
========================= */

function drawDesktopCharCardContent(
    key,
    x,
    y,
    w,
    h,
    ch
) {

    ctx.fillStyle =
        ch.color;

    ctx.font =
        "bold 34px Arial";

    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    ctx.fillText(
        ch.name,
        x + w / 2,
        y + 42
    );

    ctx.fillStyle =
        "#d9d9ff";

    ctx.font =
        "18px Arial";

    ctx.fillText(
        ch.type,
        x + w / 2,
        y + 72
    );

    drawPreviewCharacter(
        key,
        x + w / 2 - 40,
        y + 85,
        ch,
        82,
        104
    );

    ctx.textAlign = "left";

    ctx.fillStyle =
        "#ffffff";

    ctx.font =
        "14px Arial";

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
            x + 20,
            y + 205 + i * 17
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

    ctx.fillStyle =
        ch.color;

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
            layout.mobile
                ? layout.startX
                : layout.startX + i * (layout.cardW + layout.gap);

        const y =
            layout.mobile
                ? layout.startY + i * (layout.cardH + layout.gap)
                : layout.startY;

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
        changeState(
            STATE.STAGE_SELECT
        );
    }
}