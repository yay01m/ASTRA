/* =========================
   キャラ選択画面
========================= */

function drawSelect() {

    /* 背景画像 */
    ctx.drawImage(
        menuBg,
        0,
        0,
        canvas.width,
        canvas.height
    );

    /* 暗めオーバーレイ */
    ctx.fillStyle =
        "rgba(0,0,0,0.35)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    /* タイトル */
    ctx.textAlign = "center";

    ctx.fillStyle = "#ffffff";

    ctx.font =
        "bold 52px Arial";

    ctx.shadowColor =
        "#7a5cff";

    ctx.shadowBlur = 25;

    ctx.fillText(
        "CHARACTER SELECT",
        canvas.width / 2,
        90
    );

    ctx.shadowBlur = 0;

    /* キャラカード */
    const cards = [
        {
            key: "balance",
            x: canvas.width / 2 - 360
        },
        {
            key: "power",
            x: canvas.width / 2 - 110
        },
        {
            key: "speed",
            x: canvas.width / 2 + 140
        }
    ];

    for (const c of cards) {

        drawCharCard(
            c.key,
            c.x,
            145,
            220,
            330
        );
    }

    /* STARTボタン */

    drawCyberButton(
        canvas.width / 2 - 140,
        canvas.height - 95,
        280,
        62,
        "START BATTLE"
    );

    ctx.textAlign = "left";
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

    ctx.fillRect(x, y, w, h);

    ctx.strokeStyle =
        "#7a5cff";

    ctx.lineWidth = 3;

    ctx.strokeRect(x, y, w, h);

    ctx.shadowColor =
        "#7a5cff";

    ctx.shadowBlur = 20;

    ctx.fillStyle = "#fff";

    ctx.font =
        "bold 28px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
        text,
        x + w / 2,
        y + 40
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

    /* カード背景 */

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

    /* 光 */

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

    /* 名前 */

    ctx.fillStyle =
        ch.color;

    ctx.font =
        "bold 34px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
        ch.name,
        x + w / 2,
        y + 42
    );

    /* タイプ */

    ctx.fillStyle =
        "#d9d9ff";

    ctx.font =
        "18px Arial";

    ctx.fillText(
        ch.type,
        x + w / 2,
        y + 72
    );

    /* キャラ画像 */

    drawPreviewCharacter(
        key,
        x + w / 2 - 40,
        y + 85,
        ch
    );

    /* ステータス */

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
    ch
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
            82,
            104
        );

        return;
    }

    /* fallback */

    ctx.fillStyle =
        ch.color;

    ctx.fillRect(
        x + 20,
        y + 30,
        42,
        52
    );
}