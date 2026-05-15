/* =========================
   KO画面
========================= */

function drawKO() {

    drawGame();

    ctx.fillStyle =
        "rgba(0,0,0,0.65)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.textAlign = "center";

    ctx.fillStyle = "#fff";
    ctx.font = `bold ${canvas.width * 0.045}px Arial`

    ctx.fillText(
        player.stocks > 0
            ? "YOU WIN!"
            : "YOU LOSE...",
        canvas.width / 2,
        canvas.height / 2 - 30
    );

    drawButton(
        canvas.width / 2 - 150,
        canvas.height / 2 + 35,
        300,
        65,
        "TITLE"
    );

    ctx.textAlign = "left";
}