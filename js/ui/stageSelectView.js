/* =========================
   ステージ選択画面
========================= */

function drawStageSelect() {

    ctx.drawImage(
        menuBg,
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle =
        "rgba(0,0,0,0.25)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.textAlign = "center";

    ctx.fillStyle = "#fff";
    ctx.font = "bold 42px Arial";

    ctx.fillText(
        "ステージ選択",
        canvas.width / 2,
        80
    );

    drawStageCard(
        "cyber_core",
        canvas.width / 2 - 160,
        140,
        canvas.width * 0.3,
        canvas.height * 0.24
    );

    drawButton(
        canvas.width / 2 - 130,
        canvas.height - 90,
        260,
        60,
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

    if (
        img &&
        img.complete &&
        img.naturalWidth > 0
    ) {
        ctx.drawImage(
            img,
            x + 25,
            y + 35,
            w - 50,
            85
        );
    } else {
        ctx.fillStyle = "#36366b";

        ctx.fillRect(
            x + 25,
            y + 35,
            w - 50,
            85
        );
    }

    ctx.fillStyle = "#fff";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "CYBER CORE",
        x + w / 2,
        y + 155
    );
}