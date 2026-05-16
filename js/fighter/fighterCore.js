class Fighter {

    constructor(x, y, charKey, isCPU = false) {

        const data = CHARACTERS[charKey];

        this.charKey = charKey;
        this.data = data;
        this.isCPU = isCPU;

        /* =========================
           ダッシュ速度自動計算
        ========================= */

        this.data.dashSpeed =
            Math.floor(
                this.data.speed * 1.65
            );

        this.x = x;
        this.y = y;

        /* =========================
           サイズ
        ========================= */

        this.w = 78;
        this.h = 102;

        this.vx = 0;
        this.vy = 0;

        this.dir = 1;

        this.damage = 0;
        this.stocks = 3;

        this.onGround = false;

        /* =========================
           ダッシュ
        ========================= */

        this.isDashing = false;
        this.dashTimer = 0;

        /* =========================
           攻撃
        ========================= */

        this.attackTimer = 0;
        this.specialTimer = 0;

        this.attackCharging = false;
        this.attackCharge = 0;

        this.coolAttack = 0;
        this.coolSpecial = 0;

        /* =========================
           状態異常
        ========================= */

        this.hitstun = 0;
        this.actionLock = 0;
        this.invincible = 0;

        /* =========================
           ガード
        ========================= */

        this.guardHeld = false;
        this.isGuarding = false;

        this.guardHoldTimer = 0;
        this.guardBreakTimer = 0;

        /* =========================
           前フレーム位置
        ========================= */

        this.prevX = x;
        this.prevY = y;
    }

    reset(x, y) {

        this.x = x;
        this.y = y;

        this.vx = 0;
        this.vy = 0;

        this.damage = 0;

        this.onGround = false;

        this.hitstun = 0;
        this.actionLock = 0;
        this.invincible = 90;

        /* =========================
           ダッシュ
        ========================= */

        this.isDashing = false;
        this.dashTimer = 0;

        /* =========================
           攻撃
        ========================= */

        this.attackTimer = 0;
        this.specialTimer = 0;

        this.attackCharging = false;
        this.attackCharge = 0;

        this.coolAttack = 0;
        this.coolSpecial = 0;

        /* =========================
           ガード
        ========================= */

        this.guardHeld = false;
        this.isGuarding = false;

        this.guardHoldTimer = 0;
        this.guardBreakTimer = 0;

        /* =========================
           前フレーム位置
        ========================= */

        this.prevX = x;
        this.prevY = y;
    }
}