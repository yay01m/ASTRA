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
    width: 190,
    height: 18,
    offsetX: 260,
    offsetY: -145
};

/* =========================
   カメラ設定
========================= */

const CAMERA = {
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
   足場
========================= */

const platforms = [
    {
        x: 0,
        y: 0,
        w: PLATFORM.width,
        h: PLATFORM.height,
        offsetX: -PLATFORM.offsetX,
        offsetY: PLATFORM.offsetY
    },
    {
        x: 0,
        y: 0,
        w: PLATFORM.width,
        h: PLATFORM.height,
        offsetX: PLATFORM.offsetX,
        offsetY: PLATFORM.offsetY
    },
    {
        x: 0,
        y: 0,
        w: 170,
        h: PLATFORM.height,
        offsetX: 0,
        offsetY: -250
    }
];

/* =========================
   足場位置更新
========================= */

function updatePlatformPositions() {
    if (typeof platforms === "undefined") return;

    platforms[0].w = PLATFORM.width;
    platforms[0].h = PLATFORM.height;
    platforms[0].x =
        stage.x +
        stage.w / 2 +
        platforms[0].offsetX -
        platforms[0].w / 2;
    platforms[0].y =
        stage.y +
        platforms[0].offsetY;

    platforms[1].w = PLATFORM.width;
    platforms[1].h = PLATFORM.height;
    platforms[1].x =
        stage.x +
        stage.w / 2 +
        platforms[1].offsetX -
        platforms[1].w / 2;
    platforms[1].y =
        stage.y +
        platforms[1].offsetY;

    platforms[2].w = 170;
    platforms[2].h = PLATFORM.height;
    platforms[2].x =
        stage.x +
        stage.w / 2 -
        platforms[2].w / 2;
    platforms[2].y =
        stage.y -
        250;
}