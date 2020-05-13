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
// Pointer
var pointer;
var idleWeaponDistance = 70;
var idleWeaponX;
var idleWeaponY;
// Player statistics
var playerState = 0; // 0 = red, 1 = blue
var isInvuln = false; // invulnerability state after taking damage
var invulnTime = 1000;
var pMaxHealth = 5;
var pCurrHealth = pMaxHealth;
var pDeathDelay = 3000;
var idleWeaponExists = true;


// Player movement settings
var playerRunAccel = 30;
var playerStopDrag = 600;
var maxMoveVelocity = 300;

// Player attack settings
// Knife
var knifeSpeed = 800;
var knifeThrowDamage = 1;
var knifeMeleeDamage = 3;
var knifeROF = 300;
var knifeMeleeROF = 500;
var knifeSecondDamage = 2;
var knifeSecondRadius = 2;

// Orb
var orbSpeed = 300;
var orbDamage = 2;
var orbROF = 500;

// Enemies ----------------------------------------------------------------------------------------------------
var timedSwitchDelay = 5000;
var infiniteSpawnerDelay = 6000;
var enemySwitchPause = 1000;

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
var chaserHealth = 5;


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