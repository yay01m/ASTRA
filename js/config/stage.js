/* =========================
   選べるステージ
========================= */

const STAGES = [
    {
        key: "cyber_core",
        name: "CYBER CORE"
    }
];

let selectedStage = "cyber_core";

/* =========================
   ステージ設定
========================= */

const STAGE = {
    width: 800,
    height: 38
};

/* =========================
   足場設定
========================= */

const PLATFORM = {
    width: 180,
    height: 18,

    // メインステージ中心から左右にどれだけ離すか
    offsetX: 210,

    // メインステージよりどれだけ上に置くか
    offsetY: -125
};

/* =========================
   カメラ設定
========================= */

const CAMERA = {
    // 1.0 = 普通
    // 0.9 = 少し広い
    // 0.8 = かなり広い
    scale: 0.8
};

/* =========================
   メインステージ
========================= */

const stage = {
    x: 0,
    y: 0,
    w: STAGE.width,
    h: STAGE.height
};

/* =========================
   足場2つ
   x, y は setupGame() で決める
========================= */

const platforms = [
    // 左足場
    {
        x: 0,
        y: 0,
        w: PLATFORM.width,
        h: PLATFORM.height,
        offsetX: -PLATFORM.offsetX,
        offsetY: PLATFORM.offsetY
    },

    // 右足場
    {
        x: 0,
        y: 0,
        w: PLATFORM.width,
        h: PLATFORM.height,
        offsetX: PLATFORM.offsetX,
        offsetY: PLATFORM.offsetY
    },

    // 上の足場
    {
        x: 0,
        y: 0,
        w: 160,
        h: 18,
        offsetX: 0,
        offsetY: -230
    }
];

/* =========================
   足場位置更新
========================= */

function updatePlatformPositions() {

    const mobile =
        typeof isPortraitMobile === "function"
            ? isPortraitMobile()
            : false;

    // スマホ縦
    if (mobile) {

        // 左足場
        platforms[0].w =
            stage.w * 0.26;

        platforms[0].x =
            stage.x + stage.w * 0.14;

        platforms[0].y =
            stage.y - 105;

        // 右足場
        platforms[1].w =
            stage.w * 0.26;

        platforms[1].x =
            stage.x + stage.w * 0.60;

        platforms[1].y =
            stage.y - 105;

        // 上足場
        platforms[2].w =
            stage.w * 0.24;

        platforms[2].x =
            stage.x + stage.w / 2 -
            platforms[2].w / 2;

        platforms[2].y =
            stage.y - 185;

        return;
    }

    // PC / 横画面

    platforms[0].w =
        PLATFORM.width;

    platforms[0].x =
        stage.x +
        stage.w / 2 +
        platforms[0].offsetX -
        platforms[0].w / 2;

    platforms[0].y =
        stage.y +
        platforms[0].offsetY;

    platforms[1].w =
        PLATFORM.width;

    platforms[1].x =
        stage.x +
        stage.w / 2 +
        platforms[1].offsetX -
        platforms[1].w / 2;

    platforms[1].y =
        stage.y +
        platforms[1].offsetY;

    platforms[2].w =
        160;

    platforms[2].x =
        stage.x +
        stage.w / 2 -
        platforms[2].w / 2;

    platforms[2].y =
        stage.y - 230;
}