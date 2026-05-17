let screenShakeX = 0;
let screenShakeY = 0;

let nextState = null;
let fadeAlpha = 0;
let isFading = false;
let fadeMode = "out";
let fadeHoldCount = 0;
let fadeType = "door";

function changeState(state) {

    if (isFading) return;

    const useDoor =
        (
            gameState === STATE.SELECT &&
            state === STATE.STAGE_SELECT
        )
        ||
        (
            gameState === STATE.STAGE_SELECT &&
            state === STATE.CPU_LEVEL
        );

    const useLaunch =
        (
            gameState === STATE.CPU_LEVEL &&
            state === STATE.GAME
        );

    nextState = state;
    isFading = true;
    fadeAlpha = 0;
    fadeHoldCount = 0;

    if (useLaunch) {
        fadeType = "launch";
        fadeMode = "out";
    } else if (useDoor) {
        fadeType = "door";
        fadeMode = "out";
    } else {
        fadeType = "snap";
        fadeMode = "out";
    }
}

function updateFade() {

    if (!isFading) return;

    let speed = 0.035;

    if (fadeType === "launch") {
        speed = 0.028;
    }

    if (fadeType === "snap") {
        speed = fadeMode === "out" ? 0.40 : 0.012;
    }

    if (fadeMode === "out") {

        fadeAlpha += speed;

        if (fadeAlpha >= 1) {
            fadeAlpha = 1;
            gameState = nextState;
            nextState = null;
            fadeMode = "hold";
            fadeHoldCount = 0;
        }

    } else if (fadeMode === "hold") {

        fadeHoldCount++;

        const holdTime =
            fadeType === "launch"
                ? 50
                : fadeType === "snap"
                    ? 42
                    : 18;

        if (fadeHoldCount >= holdTime) {
            fadeMode = "in";
        }

    } else {

        fadeAlpha -= speed;

        if (fadeAlpha <= 0) {
            fadeAlpha = 0;
            isFading = false;
            screenShakeX = 0;
            screenShakeY = 0;
        }
    }
}

function drawFade() {

    if (!isFading && fadeAlpha <= 0) return;

    if (fadeType === "launch") {
        drawLaunchFade();
        return;
    }

    if (fadeType === "snap") {
        drawSnapFade();
        return;
    }

    drawDoorFade();
}

function drawSnapFade() {

    const a = Math.min(1, fadeAlpha);

    ctx.save();

    if (fadeMode === "out") {

        const h = GAME_H / 2 * a;

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, GAME_W, h);
        ctx.fillRect(0, GAME_H - h, GAME_W, h);

        if (a > 0.75) {
            const t = (a - 0.75) / 0.25;
            const flash = Math.sin(t * Math.PI) * 0.75;

            ctx.fillStyle = `rgba(255,255,255,${flash})`;
            ctx.fillRect(0, 0, GAME_W, GAME_H);
        }

    } else if (fadeMode === "hold") {

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, GAME_W, GAME_H);

    } else {

        ctx.fillStyle = `rgba(0,0,0,${a})`;
        ctx.fillRect(0, 0, GAME_W, GAME_H);
    }

    ctx.restore();
}

function drawDoorFade() {

    const a = Math.min(1, fadeAlpha);

    ctx.save();

    const doorW = GAME_W * 0.535;
    const move = doorW * a;

    const leftX = -doorW + move;
    const rightX = GAME_W - move;

    const srcX = 95;
    const srcY = 70;
    const srcW = 834;
    const srcH = 870;

    const canDraw =
        uiImages &&
        uiImages.doorLeft &&
        uiImages.doorRight &&
        uiImages.doorLeft.complete &&
        uiImages.doorRight.complete &&
        uiImages.doorLeft.naturalWidth > 0 &&
        uiImages.doorRight.naturalWidth > 0;

    if (canDraw) {
        ctx.drawImage(uiImages.doorLeft, srcX, srcY, srcW, srcH, leftX, 0, doorW, GAME_H);
        ctx.drawImage(uiImages.doorRight, srcX, srcY, srcW, srcH, rightX, 0, doorW, GAME_H);
    } else {
        ctx.fillStyle = "#000";
        ctx.fillRect(leftX, 0, doorW, GAME_H);
        ctx.fillRect(rightX, 0, doorW, GAME_H);
    }

    ctx.fillStyle = `rgba(0,0,0,${a})`;
    ctx.fillRect(0, 0, GAME_W, GAME_H);

    ctx.restore();
}

function drawLaunchFade() {

    const a = Math.min(1, fadeAlpha);

    ctx.save();

    let lightPower = 0;

    if (a > 0.35) {
        lightPower = Math.min(1, (a - 0.35) / 0.65);
    }

    let shakePower = 0;

    if (fadeMode === "out") {
        if (a < 0.9) {
            shakePower = 12 + a * 14;
        } else {
            shakePower = 26 * (1 - lightPower);
        }
    } else if (fadeMode === "hold") {
        shakePower = 4;
    }

    const shakeX = Math.sin(frameCount * 1.9) * shakePower;
    const shakeY = Math.cos(frameCount * 2.5) * shakePower * 0.55;

    screenShakeX = shakeX;
    screenShakeY = shakeY;

    const dark = 0.3 + a * 0.45;

    ctx.fillStyle = `rgba(0,0,18,${dark})`;
    ctx.fillRect(-60, -60, GAME_W + 120, GAME_H + 120);

    const cx = GAME_W / 2;

    const glowHeight = GAME_H * (0.25 + lightPower * 1.05);

    const glow = ctx.createLinearGradient(
        cx,
        GAME_H,
        cx,
        GAME_H - glowHeight
    );

    glow.addColorStop(0, `rgba(255,255,255,${Math.min(1, 1.0 * lightPower)})`);
    glow.addColorStop(0.18, `rgba(100,230,255,${Math.min(1, 0.95 * lightPower)})`);
    glow.addColorStop(0.5, `rgba(110,90,255,${Math.min(1, 0.65 * lightPower)})`);
    glow.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = glow;

    ctx.fillRect(
        -60,
        GAME_H - glowHeight,
        GAME_W + 120,
        glowHeight + 80
    );

    const circleR = 90 + lightPower * 760;

    const rg = ctx.createRadialGradient(
        cx,
        GAME_H + 40,
        20,
        cx,
        GAME_H + 40,
        circleR
    );

    rg.addColorStop(0, `rgba(255,255,255,${Math.min(1, 1.0 * lightPower)})`);
    rg.addColorStop(0.2, `rgba(100,230,255,${Math.min(1, 0.9 * lightPower)})`);
    rg.addColorStop(0.55, `rgba(120,80,255,${Math.min(1, 0.45 * lightPower)})`);
    rg.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = rg;

    ctx.beginPath();
    ctx.arc(cx, GAME_H + 40, circleR, 0, Math.PI * 2);
    ctx.fill();

    if (fadeMode === "hold") {
        ctx.fillStyle = "rgba(255,255,255,0.92)";
        ctx.fillRect(-60, -60, GAME_W + 120, GAME_H + 120);
    }

    if (fadeMode === "in") {
        ctx.fillStyle = `rgba(255,255,255,${a * 0.65})`;
        ctx.fillRect(-60, -60, GAME_W + 120, GAME_H + 120);
    }

    ctx.restore();
}