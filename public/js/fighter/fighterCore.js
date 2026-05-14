class Fighter {

    constructor(x, y, charKey, isCPU = false) {

        const data = CHARACTERS[charKey];

        this.charKey = charKey;
        this.data = data;
        this.isCPU = isCPU;

        this.x = x;
        this.y = y;

        this.w = 54;
        this.h = 82;

        this.vx = 0;
        this.vy = 0;

        this.dir = 1;

        this.damage = 0;
        this.stocks = 3;

        this.onGround = false;

        this.jumpCount = 0;
        this.maxJumps =
            this.data.maxJumps || 2;

        this.isDashing = false;
        this.dashTimer = 0;

        this.attackTimer = 0;
        this.dashAttackTimer = 0;
        this.airAttackTimer = 0;
        this.specialTimer = 0;

        this.hitstun = 0;
        this.actionLock = 0;
        this.invincible = 0;

        this.coolAttack = 0;
        this.coolDashAttack = 0;
        this.coolAirAttack = 0;
        this.coolSpecial = 0;

        this.guardHeld = false;
        this.isGuarding = false;
        this.guardHoldTimer = 0;
        this.guardBreakTimer = 0;

        // 空中回避
        this.airDodgeTimer = 0;
        this.airDodgeUsed = false;
    }

    reset(x, y) {

        this.x = x;
        this.y = y;

        this.vx = 0;
        this.vy = 0;

        this.damage = 0;

        this.hitstun = 0;
        this.actionLock = 0;
        this.invincible = 90;

        this.isDashing = false;
        this.dashTimer = 0;

        this.attackTimer = 0;
        this.dashAttackTimer = 0;
        this.airAttackTimer = 0;
        this.specialTimer = 0;

        this.coolAttack = 0;
        this.coolDashAttack = 0;
        this.coolAirAttack = 0;
        this.coolSpecial = 0;

        this.guardHeld = false;
        this.isGuarding = false;
        this.guardHoldTimer = 0;
        this.guardBreakTimer = 0;

        this.jumpCount = 0;
        this.maxJumps =
            this.data.maxJumps || 2;

        this.airDodgeTimer = 0;
        this.airDodgeUsed = false;
    }
}