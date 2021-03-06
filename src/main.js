/*
    Shadow's Corruption by Evan Li, Hoang Huynh, Henry Nguyen.

    Credits: 
    http://www.geekwagon.net/index.php/2019/room-changing-phaser3-titled/ for tile 
    map room changing code in Player.js, Play.js

    https://www.freepik.com/free-vector/london-fire-plague-epidemic-illustration-london-city-burning-plague-disease_2890909.htm
    Title splash background art 

*/

var gravityY = 600;

// define and configure main Phaser game object
let config = {
    parent: "Shadow's Realm Corruption",
    type: Phaser.WEBGL,
    // width: 1024,
    // height: 576,
    width: 1280,
    height: 720,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        }
    },
    scene: [ Load, StartCinematic, Menu, Instructions, Credits, Tutorial, Practice, Play, Arena, HUD, GameOver ]
}

// Define game
let game = new Phaser.Game(config);

// Game globals
var isGameOver = true;
var isPaused = false;
var resetAudio = true;
var inTutorial = false;
var tutorialNum = 0;
var hudScene = game.scene.keys.hudScene;
var currScene = null;
var nextScene = "next";

// Game measurements & text placement
var screenWidth = game.config.width;
var screenHeight = game.config.height;
var centerX = game.config.width/2;
var centerY = game.config.height/2;
var textSpacer = 64;
var smallTextSpacer = 32;

// Text & GUI settings
// Instructions
var imagesY = screenHeight - 190;
// Cooldown
var weaponCooldownX = 4;
var weaponCooldownY = screenHeight - 68;
var cooldownTextY = screenHeight - 48;
var switchCooldownX = 72;
var switchCooldownY = screenHeight - 68;
var cooldownBoxWidth = 64;
var cooldownBoxHeight = 64;

var boxAlpha = 0.6;
var cooldownAlpha = 0.4;

var corruptionLevelAlpha = 0.5;
var corruptionExpireX = centerX;
var corruptionExpireY = screenHeight - 8;
var expireBoxWidth = 400;
var expireBoxHeight = 16;

var healWidth = 325;
var healHeight = 16;

var pauseAlpha = 0.8;
var healthFlashAlpha = 0.5;
var healthMissingAlpha = 0.3;

// Colors
var black = 0x000000;
var playerRed = 0xDC143C;
var playerBlue = 0x4169E1;
var playerPurple = 0xFF00FF;
var orchid = 0xDA70D6;
var darkMagenta = 0x8B008B;
var gray = 0x808080;
var dimGray = 0x696969;
var orange = 0xFFA500;

// Text settings
var strokeThickness = 6;
var enemyStrokeThickness = 2;

// Particles;
var corruptionParticles;
var particleDestroy = 2000;
var siphonPredictMult = 0.5;

var enemyExplodeVel = 100;
var playerExplodeVel = 150;

// Obstacle settings
var obstacleDrag = 300;
var obsHealth = 3;

// Player ----------------------------------------------------------------------------------------------------
var player;

// Player statistics
var pStats = {
    enemiesKilled: 0,
    orbKilled: 0,
    knifeKilled: 0,
    damageDealt: 0,
    knifeCorruptedDamage: 0,
    orbCorruptedDamage: 0,
    corruptionGained: 0,
    switchNum: 0,
    knifeThrown: 0,
    knifeStabbed: 0,
    knifeBulletBlock: 0,
    orbShot: 0,
    orbEnemyBlock: 0,
    orbBulletBlock: 0,
}

// Pointer & idle weapon
var pointer;
var minPXTDist = 80;
var idleWeaponDistance = 70;
var idleWeaponX;
var idleWeaponY;
var idleWeaponExists = true;

// Player statuses
var playerState = 0; // 0 = red, 1 = blue
var switchOnCooldown = false;
var switchCooldown = 800;
var switchEffectsDuration = 500;
var switchScreenShake = 0.002;

var isInvuln = false; // invulnerability state after taking damage
var invulnDuration = 1500;

var pMaxHealth = 5;
var pCurrHealth = pMaxHealth;
var healBenchmark = 50;
var healedHeartScale = 1.5;

// Player corruption
var usingCorruption = false;
var gainingCorruption = false;
var gainingActive = false;
var gainingCorruptionDuration = 1000;
var corruption = 0;
var maxCorruption = 5;
var corruptionDecayDelay = 1000;
var corruptionExpireDelay = 3000;
var blockCorruptionGain = 3;
var corruptionScreenShake = 0.002;

var deathFadeDuration = 1000;
var deathFadeDelay = 2000;

// Player movement settings
var playerAccel = 30;
var playerStopDrag = 600;
var maxMoveVelocity = 300;
var playerCorruptMaxVelocity = 1.4*maxMoveVelocity;
var playerCorruptAccel = 1.4*playerAccel;

// Player attack settings
var knifeStuckOffset = 50;
// Knife throw
var knifeSpeed = 1000;
var knifeThrowDamage = 1;
var knifeThrowROF = 200;
var corruptKnifeSpeed = 2000;

// Knife idle
var knifeMeleeROF = 800;
var knifeMeleeDamage = 3;
var knifeMeleeStunDuration = 1000;

// Orb shot
var orbAccel = 50;  // Initial accel for orb on shoot
var orbAccelMult = 1.05; // Accel multiplier every frame after being shot
var orbShootDamage = 2;
var orbShootROF = 1500;
var orbShotInvulnDuration = 500;    // Enemy orb damage invulnerability duration after being hit by shot orb
var orbAngularAccel = 300;
var corruptOrbAngularAccel = 600;
var corruptOrbAccel = 100;
var corruptOrbAccelMult = 1.1;

// Orb idle
var orbBlockStunDuration = 1000;     // Enemy orb stun (unable to move) duration after being blocked by idle orb
var orbBlockInvulnDuration = 500;  // Enemy orb block invulnerability duration after being blocked by idle orb
var orbKnockbackVelocity = 250;     // Velocity magnitude of block knockback

var orbMineDuration = 500;
// Enemies ----------------------------------------------------------------------------------------------------
var infiniteSpawnerDelay = 10000;
var enemySwitchPause = 1000;
var enemyDrag = 500;
var arenaMaxEnemies = 6;

// Enemy switch conditions
var timedSwitchDelay = 5000;
var damageSwitchNum = 2;
var mirrorSwitchDelay = 500;
var mirrorSwitchCD = 5000;

// Enemy text
var enemyDestroyDelay = 1000;

// Chaser enemy config
var chaserConfig = {
    spawnPause: 0,
    accel: 400,
    maxVel: 280,
    moveDelay: 100,
    slowdownDelay: 1000,
    turnAroundMult: 1.5,
    predictMult: 0.5,
    predictMinDist: 200,
    bounce: 0.1,
    health: 10,
    damage: 1
}

// Shooter enemy config
var shooterConfig = {
    spawnPause: 0,
    accel: 300,
    maxVel: 100,
    moveDelay: 200,
    slowdownDelay: 1000,
    closeDistance: 500,
    farDistance: 550,
    closeTargetDist: 150,
    farTargetDist: 600,
    bounce: 0.1,
    health: 10,
    damage: 1,
    bulletSpeed: 400,
    rof: 3000,
    shotPredictMult: 1,
    targetLaserLength: 200,
}

// Game controls ----------------------------------------------------------------------------------------------------
// Player
var keyLeft, keyRight, keyUp, keyDown, keySwitch, keyPause;

// Dev tools
var keyDebug, keySuicide, keyGodmode;
var isGodmode = false;

// Menu
var keyStart, keyInstructions, keyMute, keyCredits;

// Audio Settings
var BGMVolume = 0.25;
var globalVolume = 1;
var normalSoundRate = 1;
var volumeChange = 0.1;

var gameplayBGM;
var switchSound;
var buttonSound;

// Given co-ordinates of two points, start and end, and a chosen magnitude, returns a Vector2
// that has the same direction as the vector from the start point to end point, but has the chosen magnitude
function scaleVectorMagnitude(targetMagnitude, startX, startY, endX, endY) {
    // Calculate variables
    let xDist = endX - startX;
    let yDist = endY - startY;

    // Converts the xDist, yDist components to combine vector of same direction but with targetMagnitude
    // Uses Pythagorean theorum to solve for scaleFactor given a, b, and c where c is targetMagnitude and a, b are xDist, yDist
    let scaleFactor = Math.sqrt(Math.pow(Math.abs(xDist), 2) + Math.pow(Math.abs(yDist), 2)) / targetMagnitude;

    // Use scaleFactor to change components to proper magnitudes
    let resultX = xDist / scaleFactor;       
    let resultY = yDist / scaleFactor;

    return new Phaser.Math.Vector2(resultX, resultY);
}

function increaseCorruption(amount) {
    pStats.corruptionGained += amount;
    if(corruption + amount < maxCorruption){
        corruption += amount;
    } else {
        corruption = maxCorruption;
    }
}

// Displays shfrinking box cooldown
function displayCooldown(cooldownText, cooldownBox, cooldownTimer, cooldownTime, cooldownImage) {
    let timeLeft = Phaser.Math.RoundTo((cooldownTime - cooldownTimer.getElapsed())/1000, -1);
    let cooldownBoxDecrease = cooldownBoxWidth * cooldownTimer.getElapsed()/cooldownTime;
    cooldownText.setText(timeLeft);
    cooldownBox.setSize(cooldownBoxWidth - cooldownBoxDecrease, cooldownBoxHeight);
    cooldownImage.setAlpha(0);
}