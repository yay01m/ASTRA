/* =========================
   通常背景
   タイトル・選択画面用
========================= */

function drawBackground() {

    const g =
        ctx.createLinearGradient(
            0,
            0,
            0,
            canvas.height
        );

    g.addColorStop(0, "#101044");
    g.addColorStop(1, "#080812");

    ctx.fillStyle = g;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle =
        "rgba(255,255,255,0.08)";

    for (let i = 0; i < 70; i++) {

        const x =
            (
                i * 97 +
                Date.now() * 0.015
            ) % canvas.width;

        const y =
            (i * 53) % canvas.height;

        ctx.fillRect(x, y, 3, 3);
    }
}

/* =========================
   バトル背景
   対戦画面専用
========================= */

function drawBattleBackground() {

    if (
        backgroundImage &&
        backgroundImage.complete &&
        backgroundImage.naturalWidth > 0
    ) {
        const gameH =
            typeof getGameAreaHeight === "function"
                ? getGameAreaHeight()
                : canvas.height;

        ctx.drawImage(
            backgroundImage,
            0,
            0,
            canvas.width,
            gameH
        );
    } else {
        drawBackground();
    }

    const darkGrad =
        ctx.createLinearGradient(
            0,
            canvas.height * 0.55,
            0,
            canvas.height
        );

    darkGrad.addColorStop(0, "rgba(0,0,0,0)");
    darkGrad.addColorStop(1, "rgba(0,0,0,0.45)");

    ctx.fillStyle = darkGrad;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        gameH
    );
}