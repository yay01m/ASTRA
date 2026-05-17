/* =========================
   カメラ適用
========================= */

function applyCamera(){

const scale=
CAMERA&&CAMERA.scale
?CAMERA.scale
:1;

const viewCenterX=
GAME_W/2;

const viewCenterY=
GAME_H/2;

const targetX=
stage.x+stage.w/2;

const floorScreenY=
GAME_H-8;

const targetY=
stage.y-
(
floorScreenY-viewCenterY
)
/scale;

ctx.translate(
viewCenterX,
viewCenterY
);

ctx.scale(
scale,
scale
);

ctx.translate(
-targetX,
-targetY
);

}

/* =========================
   ゲーム描画
========================= */

function drawGame(){

drawBattleBackground();

ctx.save();

applyCamera();

if(screenShake>0){

const sx=
(Math.random()-0.5)
*
screenShakePower;

const sy=
(Math.random()-0.5)
*
screenShakePower;

ctx.translate(
sx,
sy
);

screenShake--;

screenShakePower*=0.9;

if(
screenShakePower<0.5
){
screenShakePower=0;
}

}

drawStage();

drawProjectiles();

if(
playerRespawnTimer<=0
){
player.draw();
}

if(
cpuRespawnTimer<=0
){
cpu.draw();
}

drawEffects();

ctx.restore();

drawHUD();

drawPauseButton();

drawStartCountdown();

drawRespawnText();

}