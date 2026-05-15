/* =========================
   CPUレベル選択画面
========================= */

function getCpuLevelLayout() {
    const cardW = 86;
    const cardH = 92;
    const gap = 22;
    const cols = 9;

    const totalW =
        cardW * cols +
        gap * (cols - 1);

    const startX =
        GAME_W / 2 -
        totalW / 2;

    const startY =
        310;

    const buttonW = 300;
    const buttonH = 64;

    const buttonX =
        GAME_W / 2 -
        buttonW / 2;

    const buttonY =
        600;

    return {
        cardW,
        cardH,
        gap,
        cols,
        startX,
        startY,
        buttonX,
        buttonY,
        buttonW,
        buttonH
    };
}

function drawCpuLevelSelect() {
    if (
        menuBg &&
        menuBg.complete &&
        menuBg.naturalWidth > 0
    ) {
        ctx.drawImage(
            menuBg,
            0,
            0,
            GAME_W,
            GAME_H
        );
    } else {
        drawBackground();
    }

    ctx.fillStyle =
        "rgba(0,0,15,0.25)";

    ctx.fillRect(
        0,
        0,
        GAME_W,
        GAME_H
    );

    const layout =
        getCpuLevelLayout();

    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 48px Arial";

    ctx.fillText(
        "CPU LEVEL",
        GAME_W / 2,
        115
    );

    ctx.font = "18px Arial";
    ctx.fillStyle = "#9ee7ff";

    ctx.fillText(
        "1 = EASY   /   9 = ASTRA MASTER",
        GAME_W / 2,
        155
    );

    for (let i = 1; i <= 9; i++) {
        const index = i - 1;

        const x =
            layout.startX +
            index * (layout.cardW + layout.gap);

        const y =
            layout.startY;

        const selected =
            cpuLevel === i;

        ctx.fillStyle = selected
            ? "rgba(80,210,255,0.38)"
            : "rgba(10,16,38,0.72)";

        ctx.strokeStyle = selected
            ? "#ffffff"
            : "#4cc9f0";

        ctx.lineWidth = selected ? 4 : 2;

        ctx.beginPath();
        ctx.roundRect(
            x,
            y,
            layout.cardW,
            layout.cardH,
            14
        );
        ctx.fill();
        ctx.stroke();

        if (selected) {
            ctx.shadowColor = "#4cc9f0";
            ctx.shadowBlur = 18;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 40px Arial";
        ctx.textBaseline = "middle";

        ctx.fillText(
            i,
            x + layout.cardW / 2,
            y + layout.cardH * 0.42
        );

        const label =
            i <= 3
                ? "EASY"
                : i <= 6
                    ? "NORMAL"
                    : i <= 8
                        ? "HARD"
                        : "MASTER";

        ctx.font = "12px Arial";

        ctx.fillStyle =
            i <= 3
                ? "#7cffc4"
                : i <= 6
                    ? "#ffe66d"
                    : "#ff6b6b";

        ctx.fillText(
            label,
            x + layout.cardW / 2,
            y + layout.cardH * 0.78
        );
    }

    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#ffffff";
    ctx.font = "22px Arial";

    const desc =
        cpuLevel === 9
            ? "LEVEL 9：ASTRA MASTER"
            : `LEVEL ${cpuLevel}：CPUの強さを選択中`;

    ctx.fillText(
        desc,
        GAME_W / 2,
        550
    );

    ctx.fillStyle =
        "rgba(76,201,240,0.25)";

    ctx.strokeStyle = "#4cc9f0";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.roundRect(
        layout.buttonX,
        layout.buttonY,
        layout.buttonW,
        layout.buttonH,
        16
    );
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px Arial";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "START BATTLE",
        GAME_W / 2,
        layout.buttonY + layout.buttonH / 2
    );

    ctx.textBaseline = "alphabetic";
}

function handleCpuLevelClick(mouseX, mouseY) {
    const layout =
        getCpuLevelLayout();

    for (let i = 1; i <= 9; i++) {
        const index = i - 1;

        const x =
            layout.startX +
            index * (layout.cardW + layout.gap);

        const y =
            layout.startY;

        if (
            inside(
                mouseX,
                mouseY,
                x,
                y,
                layout.cardW,
                layout.cardH
            )
        ) {
            cpuLevel = i;
            return;
        }
    }

    if (
        inside(
            mouseX,
            mouseY,
            layout.buttonX,
            layout.buttonY,
            layout.buttonW,
            layout.buttonH
        )
    ) {
        setupGame();
        changeState(STATE.GAME);
    }
}