function drawTitle() {
    if (
        titleBg &&
        titleBg.complete &&
        titleBg.naturalWidth > 0
    ) {
        ctx.drawImage(
            titleBg,
            0,
            0,
            GAME_W,
            GAME_H
        );
    } else {
        drawBackground();
    }

    ctx.fillStyle =
        "rgba(0,0,0,0.2)";

    ctx.fillRect(
        0,
        0,
        GAME_W,
        GAME_H
    );

    const alpha =
        0.5 +
        Math.sin(Date.now() * 0.005) * 0.5;

    ctx.save();

    ctx.globalAlpha = alpha;
    ctx.fillStyle = "white";
    ctx.font = "bold 44px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "#9d4dff";
    ctx.shadowBlur = 20;

    ctx.fillText(
        "TAP TO START",
        GAME_W / 2,
        GAME_H * 0.82
    );

    ctx.restore();

    ctx.fillStyle =
        "rgba(255,255,255,0.7)";

    ctx.font = "18px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    ctx.fillText(
        "v1.0",
        GAME_W / 2,
        GAME_H * 0.93
    );
}