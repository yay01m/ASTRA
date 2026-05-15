/* =========================
   ステージ選択レイアウト
========================= */

function isStageSelectMobile() {
    return (
        canvas.width < 900 &&
        canvas.height > canvas.width
    );
}

function getStageSelectLayout() {

    const mobile =
        isStageSelectMobile();

    const cardW =
        mobile
            ? canvas.width * 0.82
            : canvas.width * 0.3;

    const cardH =
        mobile
            ? canvas.height * 0.24
            : canvas.height * 0.24;

    const cardX =
        canvas.width / 2 - cardW / 2;

    const cardY =
        mobile
            ? canvas.height * 0.24
            : canvas.height * 0.2;

    const buttonW =
        mobile
            ? canvas.width * 0.56
            : 260;

    const buttonH =
        mobile
            ? canvas.height * 0.07
            : 60;

    const buttonX =
        canvas.width / 2 - buttonW / 2;

    const buttonY =
        mobile
            ? canvas.height * 0.74
            : canvas.height - 90;

    return {
        mobile,
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
            canvas.width,
            canvas.height
        );
    } else {
        drawBackground();
    }

    ctx.fillStyle =
        "rgba(0,0,0,0.25)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    const layout =
        getStageSelectLayout();

    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    ctx.fillStyle = "#fff";

    ctx.font =
        layout.mobile
            ? "bold 32px Arial"
            : "bold 42px Arial";

    ctx.fillText(
        "STAGE SELECT",
        canvas.width / 2,
        layout.mobile
            ? canvas.height * 0.13
            : 80
    );

    drawStageCard(
        "cyber_core",
        layout.cardX,
        layout.cardY,
        layout.cardW,
        layout.cardH,
        layout.mobile
    );

    drawButton(
        layout.buttonX,
        layout.buttonY,
        layout.buttonW,
        layout.buttonH,
        "START"
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
    h,
    mobile = false
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

    const imgMargin =
        mobile ? 18 : 25;

    const imgX =
        x + imgMargin;

    const imgY =
        y + h * 0.18;

    const imgW =
        w - imgMargin * 2;

    const imgH =
        h * 0.48;

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
    ctx.font =
        mobile
            ? "bold 22px Arial"
            : "bold 24px Arial";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "CYBER CORE",
        x + w / 2,
        y + h * 0.8
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
        changeState(
            STATE.CPU_LEVEL
        );
    }
}