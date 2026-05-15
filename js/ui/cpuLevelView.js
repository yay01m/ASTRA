/* =========================
   CPUレベル選択画面
========================= */

function getCpuLevelLayout() {
    const isMobile =
        canvas.width < 900;

    const cardW =
        isMobile
            ? canvas.width * 0.16
            : canvas.width * 0.07;

    const cardH =
        isMobile
            ? canvas.height * 0.13
            : canvas.height * 0.12;

    const gap =
        isMobile
            ? canvas.width * 0.035
            : canvas.width * 0.012;

    const cols =
        isMobile ? 3 : 9;

    const rows =
        isMobile ? 3 : 1;

    const totalW =
        cardW * cols + gap * (cols - 1);

    const startX =
        canvas.width / 2 - totalW / 2;

    const startY =
        isMobile
            ? canvas.height * 0.28
            : canvas.height / 2 - 40;

    return {
        isMobile,
        cardW,
        cardH,
        gap,
        cols,
        rows,
        startX,
        startY
    };
}

function drawCpuLevelSelect() {

    // 背景画像
    if (
        menuBg &&
        menuBg.complete &&
        menuBg.naturalWidth > 0
    ) {
        ctx.drawImage(
            menuBg,
            0,
            0,
            canvas.width,
            canvas.height
        );
    } else {
        ctx.fillStyle = "#080816";
        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
    }

    // 暗めフィルター
    ctx.fillStyle = "rgba(0, 0, 15, 0.25)";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    const layout =
        getCpuLevelLayout();

    // タイトル
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    ctx.fillStyle = "#ffffff";
    ctx.font =
        `bold ${layout.isMobile ? 30 : 42}px sans-serif`;

    ctx.fillText(
        "CPU LEVEL",
        canvas.width / 2,
        canvas.height * 0.13
    );

    ctx.font =
        `${layout.isMobile ? 13 : 18}px sans-serif`;

    ctx.fillStyle = "#9ee7ff";

    ctx.fillText(
        "1 = EASY   /   9 = ASTRA MASTER",
        canvas.width / 2,
        canvas.height * 0.18
    );

    // レベルカード
    for (let i = 1; i <= 9; i++) {

        const index =
            i - 1;

        const col =
            index % layout.cols;

        const row =
            Math.floor(index / layout.cols);

        const x =
            layout.startX +
            col * (layout.cardW + layout.gap);

        const y =
            layout.startY +
            row * (layout.cardH + layout.gap);

        const isSelected =
            cpuLevel === i;

        ctx.fillStyle = isSelected
            ? "rgba(80, 210, 255, 0.38)"
            : "rgba(10, 16, 38, 0.72)";

        ctx.strokeStyle = isSelected
            ? "#ffffff"
            : "#4cc9f0";

        ctx.lineWidth = isSelected ? 4 : 2;

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

        if (isSelected) {
            ctx.shadowColor = "#4cc9f0";
            ctx.shadowBlur = 18;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        ctx.fillStyle = "#ffffff";
        ctx.font =
            `bold ${layout.isMobile ? 28 : 40}px sans-serif`;

        ctx.textAlign = "center";
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

        ctx.font =
            `${layout.isMobile ? 10 : 12}px sans-serif`;

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

    // 下説明
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#ffffff";
    ctx.font =
        `${layout.isMobile ? 14 : 20}px sans-serif`;

    const desc =
        cpuLevel === 9
            ? "LEVEL 9：ASTRA MASTER"
            : `LEVEL ${cpuLevel}：CPUの強さを選択中`;

    ctx.fillText(
        desc,
        canvas.width / 2,
        canvas.height * 0.78
    );

    // 決定ボタン
    const bw =
        layout.isMobile
            ? canvas.width * 0.38
            : 280;

    const bh =
        layout.isMobile
            ? canvas.height * 0.09
            : 58;

    const bx =
        canvas.width / 2 - bw / 2;

    const by =
        canvas.height * 0.84;

    ctx.fillStyle = "rgba(76, 201, 240, 0.25)";
    ctx.strokeStyle = "#4cc9f0";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.roundRect(
        bx,
        by,
        bw,
        bh,
        16
    );
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font =
        `bold ${layout.isMobile ? 17 : 22}px sans-serif`;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "START BATTLE",
        canvas.width / 2,
        by + bh / 2
    );

    ctx.textBaseline = "alphabetic";
}

/* =========================
   CPUレベルクリック
========================= */

function handleCpuLevelClick(mouseX, mouseY) {

    const layout =
        getCpuLevelLayout();

    // レベルカード判定
    for (let i = 1; i <= 9; i++) {

        const index =
            i - 1;

        const col =
            index % layout.cols;

        const row =
            Math.floor(index / layout.cols);

        const x =
            layout.startX +
            col * (layout.cardW + layout.gap);

        const y =
            layout.startY +
            row * (layout.cardH + layout.gap);

        if (
            mouseX >= x &&
            mouseX <= x + layout.cardW &&
            mouseY >= y &&
            mouseY <= y + layout.cardH
        ) {
            cpuLevel = i;
            return;
        }
    }

    // STARTボタン判定
    const bw =
        layout.isMobile
            ? canvas.width * 0.38
            : 280;

    const bh =
        layout.isMobile
            ? canvas.height * 0.09
            : 58;

    const bx =
        canvas.width / 2 - bw / 2;

    const by =
        canvas.height * 0.84;

    if (
        mouseX >= bx &&
        mouseX <= bx + bw &&
        mouseY >= by &&
        mouseY <= by + bh
    ) {
        setupGame();
        changeState(STATE.GAME);
    }
}