/* =========================
   ガード系エフェクト
========================= */

function addGuardEffect(x, y, color) {
  effects.push({
    x,
    y,
    color,
    size: 34,
    life: 14,
    maxLife: 14,
    type: "guard"
  });
}

function addGuardBreakEffect(x, y) {
  effects.push({
    x,
    y,
    color: "#b388ff",
    size: 42,
    life: 22,
    maxLife: 22,
    type: "break",
    rot: Math.random() * Math.PI * 2
  });
}