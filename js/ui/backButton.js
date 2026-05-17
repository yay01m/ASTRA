function shouldShowBackButton(){

return(

gameState===STATE.SELECT||

gameState===
STATE.STAGE_SELECT||

gameState===
STATE.CPU_LEVEL

);

}

function getBackButtonRect(){

return{

x:GAME_W*0.025,
y:GAME_H*0.035,

w:150,
h:48

};

}

function drawBackButton(){

if(
!shouldShowBackButton()
)return;

const b=
getBackButtonRect();

ctx.save();

ctx.fillStyle=
"rgba(8,16,40,.78)";

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
"bold 18px Arial";

ctx.textAlign=
"center";

ctx.textBaseline=
"middle";

ctx.fillText(
"← BACK",
b.x+b.w/2,
b.y+b.h/2
);

ctx.restore();

}

function isBackButtonHit(x,y){

const b=
getBackButtonRect();

return(

shouldShowBackButton()&&

x>=b.x&&
x<=b.x+b.w&&

y>=b.y&&
y<=b.y+b.h

);

}

function goBackState(){

if(
gameState===
STATE.SELECT
){
changeState(
STATE.TITLE
);
}

if(
gameState===
STATE.STAGE_SELECT
){
changeState(
STATE.SELECT
);
}

if(
gameState===
STATE.CPU_LEVEL
){
changeState(
STATE.STAGE_SELECT
);
}

}