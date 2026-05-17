/* =========================
クリック座標変換
========================= */

function getCanvasPoint(event) {

    const rect = canvas.getBoundingClientRect();

    const scaleX = GAME_W / rect.width;
    const scaleY = GAME_H / rect.height;

    const rawX = (event.clientX - rect.left) * scaleX;
    const rawY = (event.clientY - rect.top) * scaleY;

    const x = Math.max(
        0,
        Math.min(GAME_W, rawX)
    );

    const y = Math.max(
        0,
        Math.min(GAME_H, rawY)
    );

    return {
        x,
        y,
        rawX,
        rawY
    };
}

/* =========================
クリック操作
========================= */

canvas.addEventListener("click", event => {

    if (isFading) return;

    const point = getCanvasPoint(event);

    const mouseX = point.x;
    const mouseY = point.y;

    if (
        isBackButtonHit(
            mouseX,
            mouseY
        )
    ) {
        goBackState();
        return;
    }

    if (gameState === STATE.GAME) {

        const b = getPauseButtonRect();

        if (
            inside(
                mouseX,
                mouseY,
                b.x,
                b.y,
                b.w,
                b.h
            )
        ) {
            gameState = STATE.PAUSE;
            return;
        }
    }

    if (gameState === STATE.TITLE) {
        changeState(STATE.SELECT);
        return;
    }

    if (gameState === STATE.SELECT) {
        handleSelectClick(mouseX, mouseY);
        return;
    }

    if (gameState === STATE.STAGE_SELECT) {
        handleStageSelectClick(mouseX, mouseY);
        return;
    }

    if (gameState === STATE.CPU_LEVEL) {
        handleCpuLevelClick(mouseX, mouseY);
        return;
    }

    if (gameState === STATE.PAUSE) {
        handlePauseClick(mouseX, mouseY);
        return;
    }

    if (gameState === STATE.KO) {
        handleKoClick(mouseX, mouseY);
    }
});