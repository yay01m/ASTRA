/* =========================
   ステージ選択レイアウト
========================= */

function getStageSelectLayout() {
    const cardW = 420;
    const cardH = 190;

    const cardX =
        GAME_W / 2 -
        cardW / 2;

    const cardY = 190;

    const buttonW = 260;
    const buttonH = 64;

    const buttonX =
        GAME_W / 2 -
        buttonW / 2;

    const buttonY = 600;

    return {
        cardX,
        cardY,
        cardW,
        cardH,
        buttonX,
        buttonY,
        buttonW,
        buttonH
    };
}

/* =========================
   ステージ選択画面
========================= */

function drawStageSelect() {
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
        "rgba(0,0,0,0.25)";

    ctx.fillRect(
        0,
        0,
        GAME_W,
        GAME_H
    );

    const layout =
        getStageSelectLayout();

    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    ctx.fillStyle = "#fff";
    ctx.font = "bold 48px Arial";

    ctx.fillText(
        "STAGE SELECT",
        GAME_W / 2,
        115
    );

    drawStageCard(
        "cyber_core",
        layout.cardX,
        layout.cardY,
        layout.cardW,
        layout.cardH
    );

    drawButton(
        layout.buttonX,
        layout.buttonY,
        layout.buttonW,
        layout.buttonH,
        "NEXT"
    );

    ctx.textAlign = "left";
}

/* =========================
   ステージカード
========================= */

function drawStageCard(
    key,
    x,
    y,
    w,
    h
) {
    const active =
        selectedStage === key;

    ctx.fillStyle =
        active
            ? "rgba(255,255,255,0.20)"
            : "rgba(0,0,0,0.45)";

    ctx.fillRect(x, y, w, h);

    ctx.strokeStyle =
        active
            ? "#4cc9f0"
            : "rgba(255,255,255,0.25)";

    ctx.lineWidth =
        active ? 5 : 2;

    ctx.strokeRect(x, y, w, h);

    const img =
        stageImages.main;

    const imgMargin = 25;

    const imgX =
        x + imgMargin;

    const imgY =
        y + 34;

    const imgW =
        w - imgMargin * 2;

    const imgH =
        92;

    if (
        img &&
        img.complete &&
        img.naturalWidth > 0
    ) {
        ctx.drawImage(
            img,
            imgX,
            imgY,
            imgW,
            imgH
        );
    } else {
        ctx.fillStyle = "#36366b";

        ctx.fillRect(
            imgX,
            imgY,
            imgW,
            imgH
        );
    }

    ctx.fillStyle = "#fff";
    ctx.font = "bold 26px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "CYBER CORE",
        x + w / 2,
        y + h * 0.82
    );
}

/* =========================
   ステージ選択クリック
========================= */

function handleStageSelectClick(mouseX, mouseY) {
    const layout =
        getStageSelectLayout();

    if (
        inside(
            mouseX,
            mouseY,
            layout.cardX,
            layout.cardY,
            layout.cardW,
            layout.cardH
        )
    ) {
        selectedStage = "cyber_core";
        currentStage = "cyber_core";

        if (typeof loadStageImages === "function") {
            loadStageImages();
        }

        return;
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
        changeState(STATE.CPU_LEVEL);
    }
}