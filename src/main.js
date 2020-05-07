var gravityY = 600;

// define and configure main Phaser game object
let config = {
    parent: 'myGame',
    type: Phaser.AUTO,
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
var gameWidth = game.config.width;
var gameHeight = game.config.height;
var centerX = game.config.width/2;
var centerY = game.config.height/2;
var textSpacer = 80;

// Text settings

// Game globals
var isGameOver = false;
var resetAudio = true;
var collider

// Obstacle settings
var obstacleDrag = 300;

// Player state settings
var playerState = 0; // 0 = red, 1 = blue

// Player movement settings
var playerRunAccel = 30;
var playerStopDrag = 600;
var maxMoveVelocity = 300;

// Game controls
// Player
var keyLeft, keyRight, keyUp, keyDown, keySwitch;

// Menu
var keyStart;

// Audio Settings
var globalVolume = 1;
var normalSoundRate = 1;
var volumeChange = 0.1;

// Audio