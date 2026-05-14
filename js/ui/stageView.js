/* =========================
   ステージ描画
========================= */

function drawStage() {

    drawStagePart(stage, true);

    if (typeof platforms !== "undefined") {

        for (const p of platforms) {
            drawStagePart(p, false);
        }
    }
}

/* =========================
   ステージパーツ描画
========================= */

function drawStagePart(s, isMain) {

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
            s.y - s.h * 2.4,
            s.w,
            s.h * 4
        );
    } else {
        ctx.fillStyle =
            isMain ? "#36366b" : "#44448f";

        ctx.fillRect(
            s.x,
            s.y,
            s.w,
            s.h
        );
    }

    /*
    // 判定確認用
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(s.x, s.y, s.w, s.h);
    */
}