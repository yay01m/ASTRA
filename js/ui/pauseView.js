function drawPauseMenu(){

    ctx.fillStyle=
    "rgba(0,0,0,0.65)";

    ctx.fillRect(
        0,
        0,
        GAME_W,
        GAME_H
    );

    ctx.fillStyle="#fff";

    ctx.textAlign=
    "center";

    ctx.font=
    "bold 62px Arial";

    ctx.fillText(
        "PAUSE",
        GAME_W/2,
        170
    );

    drawButton(
        GAME_W/2-150,
        280,
        300,
        60,
        "RESUME"
    );

    drawButton(
        GAME_W/2-150,
        370,
        300,
        60,
        "RESTART"
    );

    drawButton(
        GAME_W/2-150,
        460,
        300,
        60,
        "CHARACTER"
    );

    drawButton(
        GAME_W/2-150,
        550,
        300,
        60,
        "TITLE"
    );

}


function handlePauseClick(
    x,
    y
){

if(
inside(
x,y,
GAME_W/2-150,
280,
300,
60
)){
gameState=
STATE.GAME;
return;
}

if(
inside(
x,y,
GAME_W/2-150,
370,
300,
60
)){
setupGame();

changeState(
STATE.GAME
);
return;
}

if(
inside(
x,y,
GAME_W/2-150,
460,
300,
60
)){
changeState(
STATE.SELECT
);
return;
}

if(
inside(
x,y,
GAME_W/2-150,
550,
300,
60
)){
changeState(
STATE.TITLE
);
}

}