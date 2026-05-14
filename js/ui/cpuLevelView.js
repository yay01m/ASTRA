/* =========================
   CPUレベル選択画面
========================= */

function drawCpuLevelSelect() {

    // =========================
    // 背景画像
    // =========================
    if (menuBg.complete) {

        ctx.drawImage(
            menuBg,
            0,
            0,
            canvas.width,
            canvas.height
        );

    } else {

        // 画像が読み込めない時用の予備背景
        ctx.fillStyle = "#080816";
        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
    }

    // =========================
    // 背景の暗めフィルター
    // =========================
    ctx.fillStyle = "rgba(0, 0, 15, 0.25)";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // =========================
    // タイトル
    // =========================
    ctx.textAlign = "center";

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px sans-serif";
    ctx.fillText(
        "CPU LEVEL",
        canvas.width / 2,
        95
    );

    ctx.font = "18px sans-serif";
    ctx.fillStyle = "#9ee7ff";
    ctx.fillText(
        "1 = EASY   /   9 = ASTRA MASTER",
        canvas.width / 2,
        130
    );

    // =========================
    // レベルカード
    // =========================
    const cardW = 90;
    const cardH = 100;
    const gap = 18;

    const totalW =
        cardW * 9 + gap * 8;

    const startX =
        canvas.width / 2 - totalW / 2;

    const y =
        canvas.height / 2 - 40;

    for (let i = 1; i <= 9; i++) {

        const x =
            startX + (i - 1) * (cardW + gap);

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
            cardW,
            cardH,
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
        ctx.font = "bold 40px sans-serif";
        ctx.fillText(
            i,
            x + cardW / 2,
            y + 58
        );

        const label =
            i <= 3
                ? "EASY"
                : i <= 6
                    ? "NORMAL"
                    : i <= 8
                        ? "HARD"
                        : "MASTER";

        ctx.font = "12px sans-serif";
        ctx.fillStyle =
            i <= 3
                ? "#7cffc4"
                : i <= 6
                    ? "#ffe66d"
                    : "#ff6b6b";

        ctx.fillText(
            label,
            x + cardW / 2,
            y + 82
        );
    }

    // =========================
    // 下説明
    // =========================
    ctx.fillStyle = "#ffffff";
    ctx.font = "20px sans-serif";

    const desc =
        cpuLevel === 9
            ? "LEVEL 9：反応・攻撃頻度・ガード精度が最高。かなり強い。"
            : `LEVEL ${cpuLevel}：CPUの強さを選択中`;

    ctx.fillText(
        desc,
        canvas.width / 2,
        canvas.height - 115
    );

    // =========================
    // 決定ボタン
    // =========================
    const bx =
        canvas.width / 2 - 140;

    const by =
        canvas.height - 85;

    ctx.fillStyle = "rgba(76, 201, 240, 0.25)";
    ctx.strokeStyle = "#4cc9f0";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.roundRect(
        bx,
        by,
        280,
        58,
        16
    );
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText(
        "START BATTLE",
        canvas.width / 2,
        by + 38
    );
}