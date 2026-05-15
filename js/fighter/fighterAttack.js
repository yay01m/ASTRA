/* =========================
   攻撃溜め開始
========================= */

Fighter.prototype.startAttackCharge = function () {

    if (
        this.isGuarding ||
        this.guardBreakTimer > 0
    ) return;

    if (
        this.coolAttack > 0 ||
        this.hitstun > 0 ||
        this.actionLock > 0
    ) return;

    this.attackCharging = true;
    this.attackCharge = 0;
};

/* =========================
   攻撃解放
========================= */

Fighter.prototype.releaseAttackCharge = function () {
    if (!this.attackCharging) return;

    this.attackCharging = false;

    if (!this.onGround) {
        this.airAttack();
        return;
    }

    if (
        this.isDashing &&
        this.coolDashAttack <= 0 &&
        Math.abs(this.vx) > 3.2
    ) {
        this.dashAttack();
        return;
    }

    // 地上で動いている時はスマッシュ溜めをキャンセルして通常攻撃
    if (
        this.onGround &&
        Math.abs(this.vx) > 0.4 &&
        !this.isDashing
    ) {
        this.attackCharge = 0;
    }

    if (this.attackCharge >= this.data.smashCharge3) {
        this.smashAttack(3);
    } else if (this.attackCharge >= this.data.smashCharge2) {
        this.smashAttack(2);
    } else if (this.attackCharge >= this.data.smashCharge1) {
        this.smashAttack(1);
    } else {
        this.normalAttack();
    }

    this.attackCharge = 0;
};

/* =========================
   更新中溜め
========================= */

Fighter.prototype.updateAttackCharge = function () {
    if (!this.attackCharging) return;

    this.attackCharge++;
    this.attackCharge =
        Math.min(this.attackCharge, 1000);
};

/* =========================
   弱攻撃
========================= */

Fighter.prototype.normalAttack = function () {
    if (
        this.coolAttack > 0 ||
        this.hitstun > 0 ||
        this.actionLock > 0
    ) return;

    this.attackKind = "normal";
    this.attackTimer = this.data.normalTime;
    this.coolAttack = this.data.normalCooldown;
    this.actionLock = this.data.normalLock;
};

/* =========================
   スマッシュ攻撃
========================= */

Fighter.prototype.smashAttack = function (level = 1) {
    if (
        this.coolAttack > 0 ||
        this.hitstun > 0 ||
        this.actionLock > 0
    ) return;

    this.attackKind = "smash";
    this.smashLevel = level;

    this.attackTimer =
        this.data.smashTime + level * 2;

    this.coolAttack =
        this.data.smashCooldown + level * 4;

    this.actionLock =
        this.data.smashLock + level * 3;

    addHitStop(4 + level);
};

/* =========================
   ダッシュ攻撃
========================= */

Fighter.prototype.dashAttack = function () {
    if (
        this.coolDashAttack > 0 ||
        this.hitstun > 0 ||
        this.actionLock > 0
    ) return;

    this.dashAttackTimer = this.data.dashTime;
    this.coolDashAttack = this.data.dashCooldown;
    this.actionLock = this.data.dashLock;

    this.vx =
        this.dir *
        this.data.dashSpeed *
        0.95;

    addDashEffect(
        this.x + this.w / 2,
        this.y + this.h - 4,
        this.data.color
    );
};

/* =========================
   空中攻撃
========================= */

Fighter.prototype.airAttack = function () {
    if (
        this.isGuarding ||
        this.guardBreakTimer > 0
    ) return;

    if (
        this.coolAirAttack > 0 ||
        this.hitstun > 0 ||
        this.actionLock > 0
    ) return;

    if (this.onGround) return;

    this.airAttackTimer = this.data.airTime;
    this.coolAirAttack = this.data.airCooldown;
    this.actionLock = this.data.airLock;

    this.vx += this.dir * 4.5;

    if (this.charKey === "power") {
        this.vy += 1.5;
        this.vx += this.dir * 1.5;
    }

    if (this.charKey === "speed") {
        this.vx += this.dir * 2.5;
    }
};

/* =========================
   必殺技
========================= */

Fighter.prototype.special = function () {
    if (
        this.isGuarding ||
        this.guardBreakTimer > 0
    ) return;

    if (
        this.coolSpecial > 0 ||
        this.hitstun > 0 ||
        this.actionLock > 0
    ) return;

    this.specialTimer = 18;
    this.coolSpecial = this.data.specialCooldown;
    this.actionLock = 24;

    if (this.data.specialType === "novaShot") {
        projectiles.push({
            type: "novaShot",
            owner: this,

            x:
                this.x +
                this.w / 2 +
                this.dir * 35,

            y:
                this.y +
                this.h / 2,

            vx:
                this.dir * 10,

            r: 15,
            life: 55,

            damage:
                this.data.specialDamage,

            hitType: "special",

            color:
                this.data.color,

            rot: 0
        });

        addNovaBallEffect(
            this.x + this.w / 2 + this.dir * 25,
            this.y + this.h / 2,
            92
        );
    }

    if (this.data.specialType === "blazeBurst") {
        addHitStop(7);

        addFireBurstEffect(
            this.x + this.w / 2 + this.dir * 70,
            this.y + this.h / 2
        );
    }

    if (this.data.specialType === "voltSlash") {
        this.vx = this.dir * 30;
        this.dashAttackTimer = 10;

        addDashEffect(
            this.x + this.w / 2,
            this.y + this.h - 4,
            this.data.color
        );

        addLightningSlashEffect(
            this.x + this.w / 2 + this.dir * 80,
            this.y + this.h / 2,
            this.dir
        );
    }
};