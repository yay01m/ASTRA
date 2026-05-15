/* =========================
   ステージ描画
========================= */

function drawStage() {
    drawStagePart(
        stage,
        true
    );

    if (typeof platforms !== "undefined") {
        for (const p of platforms) {
            drawStagePart(
                p,
                false
            );
        }
    }
}

/* =========================
   ステージパーツ描画
========================= */

function drawStagePart(
    s,
    isMain
) {
    const img =
        isMain
            ? stageImages.main
            : stageImages.platform;

    if (
        img &&
        img.complete &&
        img.naturalWidth > 0
    ) {
        ctx.drawImage(
            img,
            s.x,
            isMain
                ? s.y - s.h * 1.4
                : s.y - s.h * 1.1,
            s.w,
            isMain
                ? s.h * 2.6
                : s.h * 2.2
        );

        return;
    }

    ctx.fillStyle =
        isMain ? "#36366b" : "#44448f";

    ctx.fillRect(
        s.x,
        s.y,
        s.w,
        s.h
    );
}