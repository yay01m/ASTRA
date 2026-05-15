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
        GAME_W,
        GAME_H
    );

    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    ctx.fillStyle = "#fff";

    ctx.font =
        "bold 64px Arial";

    ctx.fillText(
        player.stocks > 0
            ? "YOU WIN!"
            : "YOU LOSE...",
        GAME_W / 2,
        GAME_H / 2 - 30
    );

    drawButton(
        GAME_W / 2 - 150,
        GAME_H / 2 + 35,
        300,
        65,
        "TITLE"
    );

    ctx.textAlign = "left";
}