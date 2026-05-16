/* =========================
   KO画面
========================= */

function drawKO() {

    drawGame();

    ctx.fillStyle =
        "rgba(0,0,0,0.72)";

    ctx.fillRect(
        0,
        0,
        GAME_W,
        GAME_H
    );

    ctx.textAlign = "center";

    ctx.fillStyle = "#fff";

    ctx.font =
        "bold 64px Arial";

    ctx.fillText(

        player.stocks > 0
        ? "YOU WIN!"
        : "YOU LOSE...",

        GAME_W/2,
        180
    );

    drawButton(
        GAME_W/2-150,
        300,
        300,
        60,
        "REMATCH"
    );

    drawButton(
        GAME_W/2-150,
        390,
        300,
        60,
        "CHARACTER"
    );

    drawButton(
        GAME_W/2-150,
        480,
        300,
        60,
        "TITLE"
    );

    ctx.textAlign="left";
}


/* =========================
   KOクリック
========================= */

function handleKoClick(
    mouseX,
    mouseY
){

    /* REMATCH */

    if(
        inside(
            mouseX,
            mouseY,

            GAME_W/2-150,
            300,
            300,
            60
        )
    ){

        setupGame();

        changeState(
            STATE.GAME
        );

        return;
    }

    /* CHARACTER */

    if(
        inside(
            mouseX,
            mouseY,

            GAME_W/2-150,
            390,
            300,
            60
        )
    ){

        changeState(
            STATE.SELECT
        );

        return;
    }

    /* TITLE */

    if(
        inside(
            mouseX,
            mouseY,

            GAME_W/2-150,
            480,
            300,
            60
        )
    ){

        changeState(
            STATE.TITLE
        );

    }

}