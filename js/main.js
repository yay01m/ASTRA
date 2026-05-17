let lastPlayingState = null;

function loop() {

    frameCount++;

    if (lastPlayingState !== gameState) {

        document.body.classList.toggle(
            "playing",
            gameState === STATE.GAME
        );

        lastPlayingState = gameState;
    }

    if (
        gameState === STATE.GAME &&
        !isFading
    ) {
        updateGame();
    }

    ctx.clearRect(
        0,
        0,
        GAME_W,
        GAME_H
    );

    const sx =
        typeof screenShakeX !== "undefined"
            ? screenShakeX
            : 0;

    const sy =
        typeof screenShakeY !== "undefined"
            ? screenShakeY
            : 0;

    ctx.save();

    ctx.translate(
        sx,
        sy
    );

    switch (gameState) {

        case STATE.TITLE:
            drawTitle();
            break;

        case STATE.SELECT:
            drawSelect();
            break;

        case STATE.STAGE_SELECT:
            drawStageSelect();
            break;

        case STATE.CPU_LEVEL:
            drawCpuLevelSelect();
            break;

        case STATE.GAME:
            drawGame();
            break;

        case STATE.PAUSE:
            drawGame();
            drawPauseMenu();
            break;

        case STATE.KO:
            drawKO();
            break;
    }

    drawBackButton();

    ctx.restore();

    updateFade();

    drawFade();

    requestAnimationFrame(loop);
}

loop();