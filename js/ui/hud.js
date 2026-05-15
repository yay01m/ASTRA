/* =========================
   HUD
========================= */

function isHudMobile() {
    return (
        canvas.width < 900 &&
        canvas.height > canvas.width
    );
}

function drawHUD() {

    const mobile =
        isHudMobile();

    if (mobile) {

        const w =
            canvas.width * 0.44;

        const h =
            canvas.height * 0.075;

        drawStatus(
            canvas.width * 0.03,
            canvas.height * 0.02,
            w,
            h,
            player,
            true
        );

        drawStatus(
            canvas.width * 0.53,
            canvas.height * 0.02,
            w,
            h,
            cpu,
            true
        );

        return;
    }

    drawStatus(
        canvas.width * 0.02,
        canvas.height * 0.02,
        235,
        82,
        player,
        false
    );

    drawStatus(
        canvas.width - 260,
        canvas.height * 0.02,
        235,
        82,
        cpu,
        false
    );
}

/* =========================
   ステータス表示
========================= */

function drawStatus(
    x,
    y,
    w,
    h,
    f,
    mobile = false
) {

    ctx.fillStyle =
        "rgba(0,0,0,0.45)";

    ctx.fillRect(
        x,
        y,
        w,
        h
    );

    ctx.strokeStyle =
        "rgba(255,255,255,0.18)";

    ctx.lineWidth = 1;

    ctx.strokeRect(
        x,
        y,
        w,
        h
    );

    ctx.fillStyle =
        f.data.color;

    ctx.font =
        mobile
            ? "bold 13px Arial"
            : "bold 24px Arial";

    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    ctx.fillText(
        f.data.name,
        x + w * 0.06,
        y + h * 0.35
    );

    ctx.fillStyle = "#fff";

    ctx.font =
        mobile
            ? "bold 15px Arial"
            : "bold 22px Arial";

    ctx.fillText(
        `${f.damage.toFixed(1)}%`,
        x + w * 0.06,
        y + h * 0.68
    );

    ctx.font =
        mobile
            ? "11px Arial"
            : "16px Arial";

    ctx.fillText(
        `STOCK: ${f.stocks}`,
        x + w * 0.55,
        y + h * 0.68
    );

    drawSpecialGauge(
        x + w * 0.06,
        y + h * 0.82,
        w * 0.88,
        mobile ? 6 : 14,
        f,
        mobile
    );

    if (f.isGuarding) {
        ctx.fillStyle = "#b388ff";
        ctx.font =
            mobile
                ? "10px Arial"
                : "13px Arial";

        ctx.fillText(
            "GUARD",
            x + w * 0.65,
            y + h * 0.35
        );
    }

    if (f.guardBreakTimer > 0) {
        ctx.fillStyle = "#ff77ff";
        ctx.font =
            mobile
                ? "10px Arial"
                : "13px Arial";

        ctx.fillText(
            "BREAK",
            x + w * 0.65,
            y + h * 0.35
        );
    }
}

/* =========================
   必殺ゲージ
========================= */

function drawSpecialGauge(
    x,
    y,
    w,
    h,
    f,
    mobile = false
) {

    const maxCool =
        f.data.specialCooldown || 120;

    const readyRate =
        1 -
        Math.min(f.coolSpecial, maxCool) / maxCool;

    ctx.fillStyle =
        "rgba(255,255,255,0.15)";

    ctx.fillRect(
        x,
        y,
        w,
        h
    );

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

    ctx.lineWidth =
        mobile ? 1 : 2;

    ctx.strokeRect(
        x,
        y,
        w,
        h
    );

    if (!mobile) {
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
}