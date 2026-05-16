/* =========================
   攻撃溜め開始
========================= */

Fighter.prototype.startAttackCharge =
function(){

    if(
        this.isGuarding||
        this.guardBreakTimer>0
    )return;

    if(
        this.coolAttack>0||
        this.hitstun>0||
        this.actionLock>0
    )return;

    this.attackCharging=true;

    this.attackCharge=0;

};



/* =========================
   攻撃解放
========================= */

Fighter.prototype.releaseAttackCharge=
function(){

    if(
        !this.attackCharging
    )return;

    this.attackCharging=
    false;

    //空中攻撃削除
    //ダッシュ攻撃削除

    if(
        this.attackCharge>=
        this.data.smashCharge3
    ){

        this.smashAttack(3);

    }
    else if(
        this.attackCharge>=
        this.data.smashCharge2
    ){

        this.smashAttack(2);

    }
    else if(
        this.attackCharge>=
        this.data.smashCharge1
    ){

        this.smashAttack(1);

    }
    else{

        this.normalAttack();

    }

    this.attackCharge=0;

};



/* =========================
   溜め更新
========================= */

Fighter.prototype.updateAttackCharge=
function(){

    if(
        !this.attackCharging
    )return;

    this.attackCharge++;

    this.attackCharge=
    Math.min(
        this.attackCharge,
        1000
    );

};



/* =========================
   通常攻撃
========================= */

Fighter.prototype.normalAttack=
function(){

    if(
        this.coolAttack>0||
        this.hitstun>0||
        this.actionLock>0
    )return;

    this.attackKind=
    "normal";

    this.attackTimer=
    this.data.normalTime;

    this.coolAttack=
    this.data.normalCooldown;

    this.actionLock=
    this.data.normalLock;

};



/* =========================
   スマッシュ
========================= */

Fighter.prototype.smashAttack=
function(level=1){

    if(
        this.coolAttack>0||
        this.hitstun>0||
        this.actionLock>0
    )return;

    this.attackKind=
    "smash";

    this.smashLevel=
    level;

    this.attackTimer=
    this.data.smashTime+
    level*2;

    this.coolAttack=
    this.data.smashCooldown+
    level*4;

    this.actionLock=
    this.data.smashLock+
    level*3;

    addHitStop(
        4+level
    );

};



/* =========================
   必殺技
========================= */

Fighter.prototype.special=
function(){

    if(
        this.isGuarding||
        this.guardBreakTimer>0
    )return;

    if(
        this.coolSpecial>0||
        this.hitstun>0||
        this.actionLock>0
    )return;

    this.specialTimer=18;

    this.coolSpecial=
    this.data.specialCooldown;

    this.actionLock=24;


    if(
        this.data.specialType===
        "novaShot"
    ){

        projectiles.push({

            type:
            "novaShot",

            owner:this,

            x:
            this.x+
            this.w/2+
            this.dir*35,

            y:
            this.y+
            this.h/2,

            vx:
            this.dir*16,

            r:22,

            life:70,

            damage:
            this.data.specialDamage,

            hitType:
            "special",

            color:
            this.data.color,

            rot:0

        });

        addNovaBallEffect(

            this.x+
            this.w/2+
            this.dir*25,

            this.y+
            this.h/2,

            92

        );

    }


    if(
        this.data.specialType===
        "blazeBurst"
    ){

        addHitStop(7);

        addFireBurstEffect(

            this.x+
            this.w/2+
            this.dir*70,

            this.y+
            this.h/2

        );

    }


    if(
        this.data.specialType===
        "voltSlash"
    ){

        this.vx=
        this.dir*30;

        addDashEffect(

            this.x+
            this.w/2,

            this.y+
            this.h-4,

            this.data.color

        );

        addLightningSlashEffect(

            this.x+
            this.w/2+
            this.dir*80,

            this.y+
            this.h/2,

            this.dir

        );

    }

};