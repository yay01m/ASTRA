/* =========================
   移動
========================= */

Fighter.prototype.move = function (inputX, dashInput = false) {

    if (
        this.hitstun > 0 ||
        this.actionLock > 0 ||
        this.guardBreakTimer > 0
    ) return;

    this.isDashing = false;

    if (inputX !== 0) {

        this.dir = inputX > 0 ? 1 : -1;

        const guardRate =
            this.isGuarding ? 0.35 : 1;

        const accel =
            (
                dashInput
                    ? this.data.accel * 1.25
                    : this.data.accel
            ) * guardRate;

        const max =
            (
                dashInput
                    ? this.data.dashSpeed
                    : this.data.speed
            ) * guardRate;

        this.vx += inputX * accel;

        this.vx = Math.max(
            -max,
            Math.min(max, this.vx)
        );

        if (
            dashInput &&
            this.onGround &&
            !this.isGuarding
        ) {

            this.isDashing = true;
            this.dashTimer++;

            if (this.dashTimer % 6 === 0) {

                addDashEffect(
                    this.x + this.w / 2 - this.dir * 18,
                    this.y + this.h - 5,
                    this.data.color
                );
            }
        }

    } else {

        this.dashTimer = 0;
    }
};

/* =========================
   ジャンプ
========================= */

Fighter.prototype.jump = function () {

    if (
        this.hitstun > 0 ||
        this.actionLock > 0 ||
        this.guardBreakTimer > 0 ||
        this.isGuarding
    ) return;

    if (this.jumpCount >= this.maxJumps) return;

    this.vy = -this.data.jump;

    this.onGround = false;

    this.jumpCount++;

    if (this.jumpCount >= 2) {

        addAirJumpRingEffect(
            this.x + this.w / 2,
            this.y + this.h * 0.7,
            this.dir
        );

        addHitStop(1);
    }
};

/* =========================
   空中回避
========================= */

Fighter.prototype.airDodge = function (inputX = 0) {

    if (this.onGround) return;
    if (this.airDodgeUsed) return;

    if (
        this.hitstun > 0 ||
        this.guardBreakTimer > 0
    ) return;

    this.airDodgeUsed = true;

    this.airDodgeTimer = 14;

    this.invincible =
        Math.max(this.invincible, 16);

    this.actionLock =
        Math.max(this.actionLock, 14);

    const dodgeDir =
        inputX !== 0
            ? inputX > 0 ? 1 : -1
            : this.dir;

    this.vx =
        dodgeDir * 9;

    this.vy = -2;

    addDashEffect(
        this.x + this.w / 2,
        this.y + this.h / 2,
        "#ffffff"
    );

    addHitStop(1);
};

/* =========================
   床・足場に乗る処理
========================= */

Fighter.prototype.checkLandingOn = function (
    s,
    isMainStage = false
) {

    const footY =
        this.y + this.h;

    const prevFootY =
        this.prevY + this.h;

    const bodyTop =
        this.y;

    const isOverlappingX =
        this.x + this.w > s.x &&
        this.x < s.x + s.w;

    const isFalling =
        this.vy >= 0;

    if (isMainStage) {

        const hitStageBody =
            footY >= s.y &&
            bodyTop <= s.y + s.h;

        if (
            isOverlappingX &&
            hitStageBody
        ) {

            if (this.vy >= 0) {

                this.y =
                    s.y - this.h;

                this.onGround = true;

                this.jumpCount = 0;

                this.airDodgeUsed = false;

            } else {

                this.y =
                    s.y + s.h;

                this.onGround = false;
            }

            this.vy = 0;

            return true;
        }

        return false;
    }

    if (
        !isOverlappingX ||
        !isFalling
    ) {
        return false;
    }

    const crossedTop =
        prevFootY <= s.y &&
        footY >= s.y;

    const notTooLow =
        footY <= s.y + s.h + 28;

    if (
        crossedTop &&
        notTooLow
    ) {

        this.y =
            s.y - this.h;

        this.vy = 0;

        this.onGround = true;

        this.jumpCount = 0;

        this.airDodgeUsed = false;

        return true;
    }

    return false;
};

/* =========================
   更新
========================= */

Fighter.prototype.update = function () {

    this.updateAttackCharge();

    if (this.coolAttack > 0) this.coolAttack--;
    if (this.coolDashAttack > 0) this.coolDashAttack--;
    if (this.coolAirAttack > 0) this.coolAirAttack--;
    if (this.coolSpecial > 0) this.coolSpecial--;

    if (this.attackTimer > 0) this.attackTimer--;
    if (this.dashAttackTimer > 0) this.dashAttackTimer--;
    if (this.airAttackTimer > 0) this.airAttackTimer--;
    if (this.specialTimer > 0) this.specialTimer--;
    if (this.airDodgeTimer > 0) this.airDodgeTimer--;

    if (this.hitstun > 0) this.hitstun--;
    if (this.actionLock > 0) this.actionLock--;
    if (this.invincible > 0) this.invincible--;

    if (this.guardBreakTimer > 0) {
        this.guardBreakTimer--;
    }

    this.updateGuard();

    this.prevX = this.x;
    this.prevY = this.y;

    this.vy += 0.65;
    this.vy = Math.min(this.vy, 15);

    this.x += this.vx;
    this.y += this.vy;

    this.vx *= this.onGround ? 0.78 : 0.94;

    this.onGround = false;

    updatePlatformPositions();

    let landed = false;

    landed =
        this.checkLandingOn(stage, true);

    if (
        !landed &&
        typeof platforms !== "undefined"
    ) {

        for (const p of platforms) {

            if (this.checkLandingOn(p)) {
                landed = true;
                break;
            }
        }
    }

    if (
        this.attackCharging &&
        this.attackCharge > 12
    ) {

        if (frameCount % 4 === 0) {

            addEffect(
                this.x + this.w / 2 + this.dir * 25,
                this.y + this.h / 2,
                this.data.color,
                18
            );
        }
    }

    const gameH =
        typeof getGameAreaHeight === "function"
            ? getGameAreaHeight()
            : canvas.height;

    const koMarginX =
        isPortraitMobile()
            ? 520
            : 220;

    const koMarginY =
        isPortraitMobile()
            ? 520
            : 260;

    if (
        this.x < -koMarginX ||
        this.x > canvas.width + koMarginX ||
        this.y > gameH + koMarginY
    ) {

        this.stocks--;

        this.reset(
            canvas.width / 2,
            stage.y - 120
        );

        addScreenShake(16, 18);
    }
};