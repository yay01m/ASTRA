const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

/* =========================
   画面サイズ
========================= */

function resize() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);

resize();

/* =========================
   ゲーム状態
========================= */

const STATE = {

    TITLE: "title",
    SELECT: "select",
    STAGE_SELECT: "stageSelect",
    CPU_LEVEL: "cpuLevel",
    GAME: "game",
    KO: "ko"
};

let gameState = STATE.TITLE;

/* =========================
   CPUレベル
========================= */

let cpuLevel = 5;

/* =========================
   選択キャラ
========================= */

let selectedChar = "balance";

/* =========================
   共通配列
========================= */

let effects = [];
let projectiles = [];

/* =========================
   入力
========================= */

let keys = {};

let stickX = 0;

let guardButtonDown = false;

/* =========================
   プレイヤー
========================= */

let player;
let cpu;

/* =========================
   ヒットストップ
========================= */

let hitStop = 0;

/* =========================
   画面揺れ
========================= */

let screenShake = 0;

let screenShakePower = 0;