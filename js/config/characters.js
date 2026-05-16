const CHARACTERS = {

    balance: {
        name: "NOVA",
        type: "バランス型",

        color: "#4cc9f0",
        subColor: "#bdefff",

        speed: 8,
        accel: 1.25,

        jump: 18,
        weight: 1.0,

        attackDamage: 8,

        smashCharge1: 20,
        smashCharge2: 40,
        smashCharge3: 60,

        specialDamage: 20,
        specialCooldown: 180,
        specialType: "novaShot",

        normalTime: 8,
        normalCooldown: 11,
        normalLock: 6,

        smashTime: 14,
        smashCooldown: 34,
        smashLock: 24
    },

    power: {
        name: "BLAZE",
        type: "パワー型",

        color: "#ff4d4d",
        subColor: "#ffd166",

        speed: 6,
        accel: 1,

        jump: 16,
        weight: 1.25,

        attackDamage: 9,

        smashCharge1: 40,
        smashCharge2: 80,
        smashCharge3: 120,

        specialDamage: 35,
        specialCooldown: 480,
        specialType: "blazeBurst",

        normalTime: 10,
        normalCooldown: 15,
        normalLock: 9,

        smashTime: 18,
        smashCooldown: 42,
        smashLock: 32
    },

    speed: {
        name: "VOLT",
        type: "スピード型",

        color: "#ffe66d",
        subColor: "#ffffff",

        speed: 10,
        accel: 1.5,

        jump: 20,
        weight: 0.78,

        attackDamage: 6,

        smashCharge1: 10,
        smashCharge2: 20,
        smashCharge3: 30,

        specialDamage: 15,
        specialCooldown: 30,
        specialType: "voltSlash",

        normalTime: 6,
        normalCooldown: 8,
        normalLock: 4,

        smashTime: 10,
        smashCooldown: 24,
        smashLock: 16
    }
};