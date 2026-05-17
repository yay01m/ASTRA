/* =========================
   CANVAS RESIZE
========================= */

function isPortraitMobile(){

 const viewport=
 window.visualViewport;

 const w=
 viewport
 ?viewport.width
 :window.innerWidth;

 const h=
 viewport
 ?viewport.height
 :window.innerHeight;

 return(
   w<900 &&
   h>w
 );

}

function resizeCanvas(){

 const viewport=
 window.visualViewport;

 const screenW=
 viewport
 ?viewport.width
 :window.innerWidth;

 const screenH=
 viewport
 ?viewport.height
 :window.innerHeight;

 canvas.width=
 GAME_W;

 canvas.height=
 GAME_H;

 const aspect=
 GAME_W/GAME_H;

 let cssW=
 screenW;

 let cssH=
 cssW/aspect;

 if(cssH>screenH){

   cssH=
   screenH;

   cssW=
   cssH*aspect;

 }

 canvas.style.position=
 "fixed";

 canvas.style.left=
 ((screenW-cssW)/2)
 +"px";

 canvas.style.top=
 ((screenH-cssH)/2)
 +"px";

 canvas.style.width=
 cssW+"px";

 canvas.style.height=
 cssH+"px";

}

/* 初回だけ */
resizeCanvas();

/* 変更時だけ */

window.addEventListener(
"resize",
()=>{

requestAnimationFrame(
resizeCanvas
);

}
);

window.addEventListener(
"orientationchange",
()=>{

setTimeout(
resizeCanvas,
200
);

}
);