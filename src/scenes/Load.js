class Load extends Phaser.Scene {
    constructor() {
        super('loadScene');
    }

    preload() {
        this.sys.canvas.style.cursor = 'none';
        this.loadingText = this.add.text(screenWidth, screenHeight, 'LOADING...', {
            fontFamily: 'Courier',
            fontSize: '40px',
            color: '#8B008B',
            align: 'center',
            stroke: '#000000',
            strokeThickness: strokeThickness,
        }).setOrigin(1, 1);
        this.tweens.add({
            targets: this.loadingText,
            alpha: { from: 1, to: 0.25},
            ease: 'Sine.easeInOut',
            duration: 1000,
            yoyo: true,
            loop: -1,
        });
        // Load image assets
        this.load.image('titleSplash', './assets/images/titleSplash.png');
        this.load.image('title', './assets/images/title.png');
        this.load.image('titleENTERbutton', './assets/images/titleENTERbutton.png');
        this.load.image('team7credits', './assets/images/team7credits.png');
        this.load.image('shadowBackground', './assets/images/ShadowBackground.png');

        this.load.image('redPlayerCutscene', './assets/images/REDplayer2.png');
        this.load.image('bluePlayerCutscene', './assets/images/BLUEplayer2.png');
        this.load.image('groundLight', './assets/images/lightonground.png');
        this.load.image('sourceLight', './assets/images/lightsource.png');
        this.load.image('prisonDoor', './assets/images/prisondoor.png');
        this.load.image('bigEss1', './assets/images/bigEss1.png');
        this.load.image('bigEss2', './assets/images/bigEss2.png');
        this.load.image('bigOrb', './assets/images/bigOrb.png');
        this.load.image('bigSword', './assets/images/bigSword.png');

        this.load.image('redPlayer', './assets/images/redPlayer.png');
        this.load.image('bluePlayer', './assets/images/bluePlayer.png');

        this.load.image('corruptRedRet', './assets/images/corruptRedRet.png');
        this.load.image('redReticle', './assets/images/redReticle.png');
        this.load.image('corruptBlueRet', './assets/images/corruptBlueRet.png');
        this.load.image('blueReticle', './assets/images/blueReticle.png');

        this.load.image('heart', './assets/images/heart.png');
        this.load.image('essCorruptionDim', './assets/images/essCorruptionDim.png');
        this.load.image('essCorruptionGlow', './assets/images/essCorruptionGlow.png');
        this.load.image('switchCD', './assets/images/switchCD.png');

        this.load.image('knife', './assets/images/knife.png');
        this.load.image('corruptKnife', './assets/images/corruptknife.png');
        this.load.image('orb', './assets/images/orb.png');
        this.load.image('corruptOrb', './assets/images/corruptorb.png');
        this.load.image('corruptionParticle', './assets/images/corruptionParticle.png');

        this.load.image('invisibleRed', './assets/images/invisibleRed.png');
        this.load.image('invisibleBlue', './assets/images/invisibleBlue.png');
        this.load.image('redObstacle', './assets/images/RedObstacle.png');
        this.load.image('blueObstacle', './assets/images/BlueObstacle.png');
        this.load.image('door', './assets/images/door.png');
        this.load.image('endDoor', './assets/images/EndDoor.png');

        this.load.image('redChaser', './assets/images/redChaser.png');
        this.load.image('blueChaser', './assets/images/blueChaser.png');
        this.load.image('redSlimeball', './assets/images/redSlimeball.png');
        this.load.image('blueSlimeball', './assets/images/blueSlimeball.png');
        this.load.image('stunParticle', './assets/images/stunParticle.png');

        this.load.image('redReticle', './assets/images/redReticle.png');
        
        // Load audio assets
        this.load.audio('buttonSound', './assets/sounds/buttonsound.mp3');
        this.load.audio('gameplayBGM', './assets/sounds/Bgm.wav');
        this.load.audio('knifeThrow', './assets/sounds/knife.mp3');
        this.load.audio('knifeHitmarker', './assets/sounds/knifeHitmarker.mp3');
        this.load.audio('switch', './assets/sounds/switch.mp3');
        this.load.audio('orbShoot', './assets/sounds/orb.mp3');
        this.load.audio('orbHitmarker', './assets/sounds/orbHitmarker.mp3');
        this.load.audio('orbBulletBlock', './assets/sounds/orbBulletBlock.mp3');
        this.load.audio('orbEnemyBlock', './assets/sounds/orbEnemyBlock.mp3');
        this.load.audio('playerDeath', './assets/sounds/demonDeath.mp3');
        this.load.audio('playerHurt1', './assets/sounds/hurt1.mp3');
        this.load.audio('playerHurt2', './assets/sounds/hurt2.mp3');
        this.load.audio('corruptionExpire', './assets/sounds/corruptionExpire.mp3');
        this.load.audio('corruptedKnife', './assets/sounds/corruptedKnife.mp3');
        this.load.audio('corruptedOrb', './assets/sounds/corruptedOrb.mp3');
        this.load.audio('corruptKnifeHitmarker', './assets/sounds/corruptedKnifeHitmarker.mp3');
        this.load.audio('corruptOrbHitmarker', './assets/sounds/corruptedOrbHitmarker.mp3');


        //tile maps
        // this.load.path = "./assets/tilemap/";
        this.load.tilemapTiledJSON("level","./assets/tilemap/tilemap.json")
        this.load.tilemapTiledJSON("arenaTilemap", "./assets/tilemap/arenaTileMap.json")
        this.load.tilemapTiledJSON("tutorialTilemap", "./assets/tilemap/linearTutorial.json")
        this.load.tilemapTiledJSON("practiceMap", "./assets/tilemap/practiceMap.json")
        //tile sheet
        this.load.image("tiles", "./assets/tilemap/fornow5.png");

    }

    create() {
        keyStart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.titleSplash = this.add.sprite(0, 0, 'titleSplash').setOrigin(0, 0);
        this.fadeInSplash = this.tweens.add({
            targets: this.titleSplash,
            alpha: { from: 0, to: 1 },
            ease: 'Quart.easeIn',
            duration: 2000,
        });

        gameplayBGM = game.sound.add('gameplayBGM', { 
            mute: false,
            volume: BGMVolume,
            rate: 1,
            loop: true 
        });

        switchSound = game.sound.add('switch', { 
            mute: false,
            volume: 4*globalVolume/10,
            rate: 3,
        });

        buttonSound = game.sound.add('buttonSound', { 
            mute: false,
            volume: globalVolume/3,
            rate: 1.5,
        });

        this.continueText = this.add.text(screenWidth, screenHeight, 'Press       to continue', {
            fontFamily: 'Courier',
            fontSize: '40px',
            color: '#8B008B',
            align: 'center',
            stroke: '#000000',
            strokeThickness: strokeThickness,
        }).setOrigin(1, 1);
        this.title = this.add.sprite(centerX, 20, 'title').setOrigin(0.5, 0);
        this.titleENTERbutton = this.add.sprite(screenWidth - 280, screenHeight, 'titleENTERbutton').setOrigin(1, 1).setScale(0.5, 0.5);
        this.team7credits = this.add.sprite(0, screenHeight, 'team7credits').setOrigin(0, 1);

        this.fadeInTitle = this.tweens.add( {
            targets: this.title,
            y: { from: screenHeight + 100, to:  20},
            scale: { from: 0, to: 1 },
            alpha: { from: 0, to: 1 },
            ease: 'Quart.easeIn',
            duration: 2500,
        });
        this.fadeInWords = this.tweens.add( {
            targets: [ this.title, this.titleENTERbutton, this.team7credits, this.continueText ],
            alpha: { from: 0, to: 1 },
            ease: 'Quart.easeIn',
            duration: 3500,
        });
        this.loadingText.destroy();
    }
    update() {
        // Go to menu scene
        if (Phaser.Input.Keyboard.JustDown(keyStart)) {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            buttonSound.play();
            this.time.delayedCall(500, function () {
                // this.scene.start('menuScene');
                this.scene.start('startCinematicScene');
            }, null, this);
        }
    }
}