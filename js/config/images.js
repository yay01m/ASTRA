const characterImages = {

    balance: new Image(),
    power: new Image(),
    speed: new Image(),

    balanceRun: new Image(),
    powerRun: new Image(),
    speedRun: new Image(),

    balanceJump: new Image(),
    powerJump: new Image(),
    speedJump: new Image(),

    balanceAttack: new Image(),
    powerAttack: new Image(),
    speedAttack: new Image(),

    balanceGuard: new Image(),
    powerGuard: new Image(),
    speedGuard: new Image()
};

/* =========================
   通常画像
========================= */

characterImages.balance.src =
    "img/nova.png";

characterImages.power.src =
    "img/blaze.png";

characterImages.speed.src =
    "img/volt.png";

/* =========================
   ダッシュ画像
========================= */

characterImages.balanceRun.src =
    "img/nova_run.png";

characterImages.powerRun.src =
    "img/blaze_run.png";

characterImages.speedRun.src =
    "img/volt_run.png";

/* =========================
   ジャンプ画像
========================= */

characterImages.balanceJump.src =
    "img/nova_jump.png";

characterImages.powerJump.src =
    "img/blaze_jump.png";

characterImages.speedJump.src =
    "img/volt_jump.png";

/* =========================
   攻撃画像
========================= */

characterImages.balanceAttack.src =
    "img/nova_attack.png";

characterImages.powerAttack.src =
    "img/blaze_attack.png";

characterImages.speedAttack.src =
    "img/volt_attack.png";

/* =========================
   ガード画像
========================= */

characterImages.balanceGuard.src =
    "img/nova_guard.png";

characterImages.powerGuard.src =
    "img/blaze_guard.png";

characterImages.speedGuard.src =
    "img/volt_guard.png";

/* =========================
   ステージ画像
========================= */

let currentStage = "cyber_core";

const stageImages = {
    main: new Image(),
    platform: new Image()
};

function loadStageImages() {

    stageImages.main.src =
        `img/stage/main/${currentStage}.png`;

    stageImages.platform.src =
        `img/stage/platform/${currentStage}.png`;
}

loadStageImages();

/* =========================
   バトル背景
========================= */

const backgroundImage =
    new Image();

backgroundImage.src =
    "img/background/battle_bg.jpg";

/* =========================
   タイトル背景
========================= */

const titleBg =
    new Image();

titleBg.src =
    "img/ui/title_bg.jpg";

/* =========================
   共通メニュー背景
========================= */

const menuBg =
    new Image();

menuBg.src =
    "img/ui/menu_bg.jpg";

/* =========================
宇宙船ドア
========================= */

const uiImages = {

    doorLeft: new Image(),
    doorRight: new Image()

};

uiImages.doorLeft.src =
    "img/ui/door_left.png";

uiImages.doorRight.src =
    "img/ui/door_right.png";