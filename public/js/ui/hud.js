/* =========================
   HUD
========================= */

function drawHUD() {

    drawStatus(
        25,
        20,
        player
    );

    drawStatus(
        canvas.width - 260,
        20,
        cpu
    );
}

/* =========================
   ステータス表示
========================= */

function drawStatus(x, y, f) {

    ctx.fillStyle =
        "rgba(0,0,0,0.45)";

    ctx.fillRect(
        x,
        y,
        235,
        82
    );

    ctx.fillStyle =
        f.data.color;

    ctx.font =
        "bold 24px Arial";

    ctx.fillText(
        f.data.name,
        x + 15,
        y + 30
    );

    ctx.fillStyle = "#fff";

    ctx.font =
        "bold 22px Arial";

    ctx.fillText(
        `${f.damage.toFixed(1)}%`,
        x + 15,
        y + 60
    );

    ctx.font =
        "16px Arial";

    ctx.fillText(
        `STOCK: ${f.stocks}`,
        x + 105,
        y + 60
    );

    drawSpecialGauge(
        x + 15,
        y + 74,
        205,
        14,
        f
    );

    if (f.isGuarding) {

        ctx.fillStyle = "#b388ff";
        ctx.font = "13px Arial";

        ctx.fillText(
            "GUARD",
            x + 165,
            y + 30
        );
    }

    if (f.guardBreakTimer > 0) {

        ctx.fillStyle = "#ff77ff";
        ctx.font = "13px Arial";

        ctx.fillText(
            "BREAK",
            x + 165,
            y + 30
        );
    }
}

/* =========================
   必殺ゲージ
========================= */

function drawSpecialGauge(x, y, w, h, f) {

    const maxCool =
        f.data.specialCooldown || 120;

    const readyRate =
        1 -
        Math.min(f.coolSpecial, maxCool) / maxCool;

    ctx.fillStyle =
        "rgba(255,255,255,0.15)";

    ctx.fillRect(x, y, w, h);

    ctx.fillStyle =
        readyRate >= 1
            ? f.data.color
            : "rgba(255,255,255,0.45)";

    ctx.fillRect(
        x,
        y,
        w * readyRate,
        h
    );

    ctx.strokeStyle =
        readyRate >= 1
            ? "#ffffff"
            : "rgba(255,255,255,0.45)";

    ctx.lineWidth = 2;

    ctx.strokeRect(x, y, w, h);

    ctx.font = "11px Arial";
    ctx.fillStyle = "#fff";

    ctx.fillText(
        readyRate >= 1
            ? "SPECIAL ATTACK"
            : "SPECIAL",
        x + 4,
        y - 3
    );
}