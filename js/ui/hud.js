/* =========================
   HUD
========================= */

function drawHUD() {
    drawStatus(
        26,
        18,
        235,
        82,
        player
    );

    drawStatus(
        GAME_W - 260,
        18,
        235,
        82,
        cpu
    );

    drawTouchStick();
}

/* =========================
   ステータス表示
========================= */

function drawStatus(x, y, w, h, f) {
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(x, y, w, h);

    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);

    ctx.fillStyle = f.data.color;
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    ctx.fillText(
        f.data.name,
        x + 14,
        y + 30
    );

    ctx.fillStyle = "#fff";
    ctx.font = "bold 22px Arial";

    ctx.fillText(
        `${f.damage.toFixed(1)}%`,
        x + 14,
        y + 56
    );

    ctx.font = "16px Arial";

    ctx.fillText(
        `STOCK: ${f.stocks}`,
        x + 130,
        y + 56
    );

    drawSpecialGauge(
        x + 14,
        y + 68,
        w - 28,
        12,
        f
    );

    if (f.isGuarding) {
        ctx.fillStyle = "#b388ff";
        ctx.font = "13px Arial";
        ctx.fillText("GUARD", x + 150, y + 30);
    }

    if (f.guardBreakTimer > 0) {
        ctx.fillStyle = "#ff77ff";
        ctx.font = "13px Arial";
        ctx.fillText("BREAK", x + 150, y + 30);
    }
}

/* =========================
   必殺ゲージ
========================= */

function drawSpecialGauge(x, y, w, h, f) {
    const maxCool = f.data.specialCooldown || 120;

    const readyRate =
        1 -
        Math.min(f.coolSpecial, maxCool) / maxCool;

    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillRect(x, y, w, h);

    ctx.fillStyle =
        readyRate >= 1
            ? f.data.color
            : "rgba(255,255,255,0.45)";

    ctx.fillRect(x, y, w * readyRate, h);

    ctx.strokeStyle =
        readyRate >= 1
            ? "#ffffff"
            : "rgba(255,255,255,0.45)";

    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
}

/* =========================
   透明スティック
========================= */

function drawTouchStick() {
    if (
        typeof stickVisible === "undefined" ||
        !stickVisible ||
        gameState !== STATE.GAME
    ) return;

    ctx.save();

    ctx.globalAlpha = 0.35;

    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.beginPath();
    ctx.arc(
        stickBaseX,
        stickBaseY,
        58,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.28)";
    ctx.beginPath();
    ctx.arc(
        stickKnobX,
        stickKnobY,
        24,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
}