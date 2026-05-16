const CHARACTERS = {

    balance: {
        name: "NOVA",
        type: "バランス型",

        color: "#4cc9f0",
        subColor: "#bdefff",

        speed: 11,
        accel: 0.75,

        jump: 16,
        weight: 1.0,
        maxJumps: 2,

        attackDamage: 8,

        smashCharge1: 20,
        smashCharge2: 40,
        smashCharge3: 60,

        dashDamage: 10,
        airDamage: 9,

        specialDamage: 20,
        specialCooldown: 180,
        specialType: "novaShot",

        normalTime: 8,
        normalCooldown: 11,
        normalLock: 6,

        smashTime: 14,
        smashCooldown: 34,
        smashLock: 24,

        dashTime: 13,
        dashCooldown: 34,
        dashLock: 13,

        airTime: 11,
        airCooldown: 24,
        airLock: 5
    },

    power: {
        name: "BLAZE",
        type: "パワー型",

        color: "#ff4d4d",
        subColor: "#ffd166",

        speed: 8.5,
        accel: 0.55,

        jump: 13,
        weight: 1.25,
        maxJumps: 2,

        attackDamage: 9,

        smashCharge1: 40,
        smashCharge2: 80,
        smashCharge3: 120,

        dashDamage: 12,
        airDamage: 9,

        specialDamage: 35,
        specialCooldown: 480,
        specialType: "blazeBurst",

        normalTime: 10,
        normalCooldown: 15,
        normalLock: 9,

        smashTime: 18,
        smashCooldown: 42,
        smashLock: 32,

        dashTime: 16,
        dashCooldown: 46,
        dashLock: 18,

        airTime: 13,
        airCooldown: 30,
        airLock: 8
    },

    speed: {
        name: "VOLT",
        type: "スピード型",

        color: "#ffe66d",
        subColor: "#ffffff",

        speed: 14,
        accel: 0.95,

        jump: 16,
        weight: 0.78,
        maxJumps: 3,

        attackDamage: 6,

        smashCharge1: 10,
        smashCharge2: 20,
        smashCharge3: 30,

        dashDamage: 8,
        airDamage: 7,

        specialDamage: 15,
        specialCooldown: 120,
        specialType: "voltSlash",

        normalTime: 6,
        normalCooldown: 8,
        normalLock: 4,

        smashTime: 10,
        smashCooldown: 24,
        smashLock: 16,

        dashTime: 10,
        dashCooldown: 24,
        dashLock: 8,

        airTime: 8,
        airCooldown: 16,
        airLock: 3
    }
};