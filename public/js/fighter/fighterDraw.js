Fighter.prototype.drawCharacterImage = function () {

    let img;

    if (this.isGuarding) {

        if (this.charKey === "balance") {
            img = characterImages.balanceGuard;
        }
        else if (this.charKey === "power") {
            img = characterImages.powerGuard;
        }
        else if (this.charKey === "speed") {
            img = characterImages.speedGuard;
        }
    }

    else if (
        this.attackTimer > 0 ||
        this.dashAttackTimer > 0 ||
        this.airAttackTimer > 0
    ) {

        if (this.charKey === "balance") {
            img = characterImages.balanceAttack;
        }
        else if (this.charKey === "power") {
            img = characterImages.powerAttack;
        }
        else if (this.charKey === "speed") {
            img = characterImages.speedAttack;
        }
    }

    else if (!this.onGround) {

        if (this.charKey === "balance") {
            img = characterImages.balanceJump;
        }
        else if (this.charKey === "power") {
            img = characterImages.powerJump;
        }
        else if (this.charKey === "speed") {
            img = characterImages.speedJump;
        }
    }

    else if (this.isDashing) {

        if (this.charKey === "balance") {
            img = characterImages.balanceRun;
        }
        else if (this.charKey === "power") {
            img = characterImages.powerRun;
        }
        else if (this.charKey === "speed") {
            img = characterImages.speedRun;
        }
    }

    else {
        img = characterImages[this.charKey];
    }

    if (
        !img ||
        !img.complete ||
        img.naturalWidth === 0
    ) {
        this.drawFallbackCharacter();
        return;
    }

    const drawW = this.w + 30;
    const drawH = this.h + 20;

    const drawX = -15;
    const drawY = -14;

    ctx.save();

    if (this.dir === 1) {

        ctx.translate(this.w / 2, 0);
        ctx.scale(-1, 1);

        ctx.drawImage(
            img,
            -this.w / 2 + drawX,
            drawY,
            drawW,
            drawH
        );

    } else {

        ctx.drawImage(
            img,
            drawX,
            drawY,
            drawW,
            drawH
        );
    }

    ctx.restore();
};

Fighter.prototype.drawFallbackCharacter = function () {

    ctx.fillStyle = this.data.color;

    ctx.fillRect(
        12,
        28,
        30,
        40
    );

    ctx.fillStyle = this.data.subColor;

    ctx.fillRect(
        15,
        8,
        24,
        24
    );

    ctx.fillStyle = "#111";

    ctx.fillRect(
        this.dir === 1 ? 31 : 18,
        17,
        4,
        4
    );

    ctx.fillStyle = this.data.color;

    ctx.fillRect(4, 36, 12, 28);
    ctx.fillRect(38, 36, 12, 28);

    ctx.fillStyle = "#222";

    ctx.fillRect(13, 68, 10, 18);
    ctx.fillRect(31, 68, 10, 18);
};

Fighter.prototype.drawChargeEffect = function () {

    if (!this.attackCharging) return;

    const charge = this.attackCharge || 0;

    let level = 0;

    if (charge >= this.data.smashCharge3) {
        level = 3;
    }
    else if (charge >= this.data.smashCharge2) {
        level = 2;
    }
    else if (charge >= this.data.smashCharge1) {
        level = 1;
    }

    if (level <= 0) return;

    const cx =
        this.w / 2 + this.dir * 26;

    const cy =
        this.h / 2 - 2;

    const pulse =
        Math.sin(Date.now() / 65) * 2;

    let color;
    let radius;
    let core;

    if (level === 1) {
        color = "rgba(255, 220, 40, 0.9)";
        radius = 10;
        core = 4;
    }
    else if (level === 2) {
        color = "rgba(80, 170, 255, 0.95)";
        radius = 13;
        core = 5;
    }
    else {
        color = "rgba(255, 70, 70, 1)";
        radius = 16;
        core = 6;
    }

    ctx.save();

    ctx.globalCompositeOperation = "lighter";

    ctx.beginPath();
    ctx.arc(
        cx,
        cy,
        radius + pulse,
        0,
        Math.PI * 2
    );
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(
        cx,
        cy,
        radius * 0.75,
        0,
        Math.PI * 2
    );
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.28;
    ctx.fill();

    ctx.globalAlpha = 1;

    ctx.beginPath();
    ctx.arc(
        cx,
        cy,
        core + pulse * 0.4,
        0,
        Math.PI * 2
    );
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.restore();
};

Fighter.prototype.draw = function () {

    const blink =
        this.invincible > 0 &&
        Math.floor(this.invincible / 5) % 2 === 0;

    if (blink) return;

    ctx.save();

    ctx.translate(this.x, this.y);

    if (this.isDashing) {

        ctx.fillStyle =
            this.data.color + "33";

        ctx.fillRect(
            -10,
            this.h - 7,
            this.w + 20,
            6
        );
    }

    if (this.guardBreakTimer > 0) {

        ctx.fillStyle =
            "rgba(180,80,255,0.35)";

        ctx.fillRect(
            -6,
            -12,
            this.w + 12,
            8
        );
    }

    if (this.isGuarding) {

        const rate =
            this.guardHoldTimer / 120;

        ctx.beginPath();

        ctx.arc(
            this.w / 2,
            this.h / 2,
            50,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            rate > 0.7
                ? "rgba(255,80,120,0.16)"
                : "rgba(150,100,255,0.16)";

        ctx.fill();

        ctx.strokeStyle =
            rate > 0.7
                ? "rgba(255,120,120,0.7)"
                : "rgba(220,200,255,0.65)";

        ctx.lineWidth = 3;
        ctx.stroke();
    }

    if (this.specialTimer > 0) {

        ctx.beginPath();

        ctx.arc(
            this.w / 2,
            this.h / 2,
            44 + Math.sin(Date.now() / 60) * 4,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            this.data.color + "22";

        ctx.fill();
    }

    this.drawChargeEffect();

    this.drawCharacterImage();

    if (this.isCPU) {

        ctx.textAlign = "center";
        ctx.font = "bold 14px sans-serif";

        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 4;

        ctx.strokeText(
            "CPU",
            this.w / 2,
            -10
        );

        ctx.fillStyle = "#ff4d6d";

        ctx.fillText(
            "CPU",
            this.w / 2,
            -10
        );
    }

    ctx.restore();
};