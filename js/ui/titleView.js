function drawTitle() {

    // 背景
    if (
        titleBg &&
        titleBg.complete &&
        titleBg.naturalWidth > 0
    ) {
        ctx.drawImage(
            titleBg,
            0,
            0,
            canvas.width,
            canvas.height
        );
    } else {
        drawBackground();
    }

    // 暗くする
    ctx.fillStyle =
        "rgba(0,0,0,0.2)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    

    // 点滅
    const alpha =
        0.5 +
        Math.sin(Date.now() * 0.005) * 0.5;

    ctx.save();

    ctx.globalAlpha = alpha;
    ctx.fillStyle = "white";
    ctx.font =
        `bold ${Math.max(18, canvas.width * 0.035)}px Arial`;

    ctx.textAlign = "center";
    ctx.shadowColor = "#9d4dff";
    ctx.shadowBlur = 20;

    ctx.fillText(
        "TAP TO START",
        canvas.width / 2,
        canvas.height * 0.82
    );

    ctx.restore();

    // version
    ctx.fillStyle =
        "rgba(255,255,255,0.7)";

    ctx.font =
        `${Math.max(12, canvas.width * 0.016)}px Arial`;

    ctx.textAlign = "center";

    ctx.fillText(
        "v1.0",
        canvas.width / 2,
        canvas.height * 0.93
    );
}