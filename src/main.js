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
            // debug: true,
        }
    },
    scene: [ Load, Menu, Play, GameOver ]
}

// Define game
let game = new Phaser.Game(config);

// Audio Settings
var globalVolume = 1;
var normalSoundRate = 1;
var volumeChange = 0.1;

// Audio

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

// Game objects
var background;
var player = null;
var pointer;


// Game controls
var keyLeft, keyRight, keyJump, keySlowmo, keyStart, keyMute, keyVolumeUp, keyVolumeDown;
