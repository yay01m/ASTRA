/* =========================
   通常背景
========================= */

function drawBackground() {
    const w =
        typeof GAME_W !== "undefined"
            ? GAME_W
            : canvas.width;

    const h =
        typeof GAME_H !== "undefined"
            ? GAME_H
            : canvas.height;

    const g =
        ctx.createLinearGradient(
            0,
            0,
            0,
            h
        );

    g.addColorStop(0, "#101044");
    g.addColorStop(1, "#080812");

    ctx.fillStyle = g;

    ctx.fillRect(
        0,
        0,
        w,
        h
    );

    ctx.fillStyle =
        "rgba(255,255,255,0.08)";

    for (let i = 0; i < 70; i++) {
        const x =
            (
                i * 97 +
                Date.now() * 0.015
            ) % w;

        const y =
            (i * 53) % h;

        ctx.fillRect(
            x,
            y,
            3,
            3
        );
    }
}

/* =========================
   バトル背景
========================= */

function drawBattleBackground() {
    const w =
        typeof GAME_W !== "undefined"
            ? GAME_W
            : canvas.width;

    const h =
        typeof GAME_H !== "undefined"
            ? GAME_H
            : canvas.height;

    if (
        backgroundImage &&
        backgroundImage.complete &&
        backgroundImage.naturalWidth > 0
    ) {
        ctx.drawImage(
            backgroundImage,
            0,
            0,
            w,
            h
        );
    } else {
        drawBackground();
    }

    const darkGrad =
        ctx.createLinearGradient(
            0,
            h * 0.55,
            0,
            h
        );

    darkGrad.addColorStop(
        0,
        "rgba(0,0,0,0)"
    );

    darkGrad.addColorStop(
        1,
        "rgba(0,0,0,0.45)"
    );

    ctx.fillStyle = darkGrad;

    ctx.fillRect(
        0,
        0,
        w,
        h
    );
}