/* =========================
   メニュー用ボタン描画
   (戦闘画面では未使用)
========================= */

function drawButton(
    x,
    y,
    w,
    h,
    text
) {

    ctx.fillStyle = "#22224f";

    ctx.fillRect(
        x,
        y,
        w,
        h
    );

    ctx.strokeStyle = "#4cc9f0";
    ctx.lineWidth = 4;

    ctx.strokeRect(
        x,
        y,
        w,
        h
    );

    ctx.fillStyle = "#fff";

    ctx.font =
        "bold 28px Arial";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        text,
        x + w / 2,
        y + h / 2
    );

    ctx.textBaseline =
        "alphabetic";

}