function getPauseButtonRect(){

return{

x:GAME_W-95,
y:105,

w:60,
h:55

};

}

function drawPauseButton(){

if(
gameState!==STATE.GAME
)return;

const b=
getPauseButtonRect();

ctx.save();

ctx.fillStyle=
"rgba(0,0,0,.45)";

ctx.strokeStyle=
"#4cc9f0";

ctx.lineWidth=2;

ctx.beginPath();

ctx.roundRect(
b.x,b.y,
b.w,b.h,
12
);

ctx.fill();

ctx.stroke();

ctx.fillStyle=
"#fff";

ctx.font=
"bold 26px Arial";

ctx.textAlign=
"center";

ctx.textBaseline=
"middle";

ctx.fillText(
"Ⅱ",
b.x+b.w/2,
b.y+b.h/2
);

ctx.restore();

}