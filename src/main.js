var gravityY = 600;

// define and configure main Phaser game object
let config = {
    parent: 'myGame',
    type: Phaser.WEBGL,
    width: 1024,
    height: 576,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        }
    },
    scene: [ Load, Menu, Play, HUD, GameOver ]
}

// Define game
let game = new Phaser.Game(config);

// Game measurements & text placement
var screenWidth = game.config.width;
var screenHeight = game.config.height;
var centerX = game.config.width/2;
var centerY = game.config.height/2;
var textSpacer = 100;

// Text settings

// Game globals
var isGameOver = false;
var resetAudio = true;
var pointer;

// Obstacle settings
var obstacleDrag = 300;
var obsHealth = 3;

// Player ----------------------------------------------------------------------------------------------------
var player;

// Pointer & idle weapon
var pointer;
var idleWeaponDistance = 70;
var idleWeaponX;
var idleWeaponY;
var idleWeaponExists = true;

// Player statistics
var playerState = 0; // 0 = red, 1 = blue
var switchOnCooldown = false;
var switchCooldown = 1000;

var isInvuln = false; // invulnerability state after taking damage
var invulnDuration = 1000;

var pMaxHealth = 1000;
var pCurrHealth = pMaxHealth;

// Player corruption
var usingCorruption = false;
var corruption = 0;
var maxCorruption = 5;
var corruptionDecayDelay = 1000;
var corruptionExpireDelay = 3000;
var blockCorruptionGain = 3;

var pDeathDelay = 3000;

// Player movement settings
var playerRunAccel = 30;
var playerStopDrag = 600;
var maxMoveVelocity = 300;

// Player attack settings
// Knife throw
var knifeSpeed = 1000;
var knifeThrowDamage = 1;
var knifeSecondDamage = 1;
var knifeSecondRadius = 2;
var knifeThrowROF = 200;

// Knife idle
var knifeMeleeROF = 500;
var knifeMeleeDamage = 4;

// Orb shot
var orbAccel = 40;
var orbAccelMult = 1.05;
var orbMaxSpeed = maxMoveVelocity;
var orbShootDamage = 1;
var orbShootROF = 2000;
var orbShotInvulnDuration = 200;    // Enemy invulnerability duration for orb after being hit by orb

// Orb idle
var orbBlockStunDuration = 200;
var orbBlockInvulnDuration = 1000;
var orbKnockbackVelocity = 500;

// Enemies ----------------------------------------------------------------------------------------------------
var timedSwitchDelay = 5000;
var infiniteSpawnerDelay = 10000;
var enemySwitchPause = 1000;

var enemyDamageTextDestoryDelay = 1000;

// Chaser settings
var chaserSpawnPause = 1000;
var chaserAccel = 1000;
var chaserMaxVel = 400;
var chaserMoveDelay = 100;
var chaserSlowdownDelay = 1000;
var turnAroundMult = 1;
var predictMult = 1.5;
var predictMinDist = 200;
var chaserBounce = 0.1;
var chaserHealth = 10;


// Game controls ----------------------------------------------------------------------------------------------------
// Player
var keyLeft, keyRight, keyUp, keyDown, keySwitch;

// Menu
var keyStart;

// Audio Settings
var globalVolume = 1;
var normalSoundRate = 1;
var volumeChange = 0.1;

// Audio

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
    if(corruption + amount < maxCorruption){
        corruption += amount;
    } else {
        corruption = maxCorruption;
    }
}