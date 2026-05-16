/* =========================
   移動系エフェクト
========================= */


/* ダッシュ煙 */

function addDashEffect(
    x,
    y,
    color
){

    effects.push({

        x,
        y,

        color,

        size:18,

        life:18,
        maxLife:18,

        type:"dash",

        vx:
        (Math.random()-0.5)
        *1.4,

        vy:0.4

    });

}