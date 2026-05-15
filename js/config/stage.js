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
    height: 18
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
   4段: 3-2-3-2
========================= */

const platforms = [

    /* 下段3 */
    {
        x:0,
        y:0,
        w:300,
        h:PLATFORM.height,
        offsetX:-560,
        offsetY:-145
    },

    {
        x:0,
        y:0,
        w:330,
        h:PLATFORM.height,
        offsetX:0,
        offsetY:-175
    },

    {
        x:0,
        y:0,
        w:300,
        h:PLATFORM.height,
        offsetX:560,
        offsetY:-145
    },

    /* 中段2 */

    {
        x:0,
        y:0,
        w:300,
        h:PLATFORM.height,
        offsetX:-330,
        offsetY:-290
    },

    {
        x:0,
        y:0,
        w:300,
        h:PLATFORM.height,
        offsetX:330,
        offsetY:-290
    },

    /* 上段3 */

    {
        x:0,
        y:0,
        w:250,
        h:PLATFORM.height,
        offsetX:-560,
        offsetY:-410
    },

    {
        x:0,
        y:0,
        w:290,
        h:PLATFORM.height,
        offsetX:0,
        offsetY:-445
    },

    {
        x:0,
        y:0,
        w:250,
        h:PLATFORM.height,
        offsetX:560,
        offsetY:-410
    },

    /* 最上段2 */

    {
        x:0,
        y:0,
        w:240,
        h:PLATFORM.height,
        offsetX:-300,
        offsetY:-540
    },

    {
        x:0,
        y:0,
        w:240,
        h:PLATFORM.height,
        offsetX:300,
        offsetY:-540
    }
];

/* =========================
   足場位置更新
========================= */

function updatePlatformPositions() {

    if(
        typeof platforms==="undefined"
    ) return;

    for(const p of platforms){

        p.x=
            stage.x+
            stage.w/2+
            p.offsetX-
            p.w/2;

        p.y=
            stage.y+
            p.offsetY;
    }
}