Fighter.prototype.setGuard = function(on) {

    this.guardHeld = on;
};

Fighter.prototype.guardBreak = function() {

    this.isGuarding = false;
    this.guardHeld = false;
    this.guardHoldTimer = 0;

    this.guardBreakTimer = 75;
    this.hitstun = 75;

    this.vx = 0;
    this.vy = -4;

    shake = 10;

    if (typeof addGuardBreakEffect === "function") {
        addGuardBreakEffect(
            this.x + this.w / 2,
            this.y + this.h / 2
        );
    } else {
        addEffect(
            this.x + this.w / 2,
            this.y + this.h / 2,
            "#b388ff",
            38
        );
    }
};

Fighter.prototype.updateGuard = function() {

    const canGuard =
        this.guardHeld &&
        this.hitstun <= 0 &&
        this.actionLock <= 0 &&
        this.guardBreakTimer <= 0;

    this.isGuarding = canGuard;

    if (this.isGuarding) {

        this.guardHoldTimer++;

        this.vx *= 0.85;

        if (
            this.guardHoldTimer % 12 === 0 &&
            typeof addGuardEffect === "function"
        ) {
            addGuardEffect(
                this.x + this.w / 2,
                this.y + this.h / 2,
                this.data.color
            );
        }

        if (this.guardHoldTimer >= 120) {
            this.guardBreak();
        }

    } else {
        this.guardHoldTimer = 0;
    }
};