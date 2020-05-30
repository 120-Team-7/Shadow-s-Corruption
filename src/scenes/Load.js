class Load extends Phaser.Scene {
    constructor() {
        super('loadScene');
    }

    preload() {
        this.loadingText = this.add.text(screenWidth, screenHeight, 'LOADING...', {
            fontFamily: 'Courier',
            fontSize: '30px',
            color: '#8B008B',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 10,
        }).setOrigin(1, 1);
        // Load image assets
        this.load.image('titleSplash', './assets/images/titleSplash.png');
        this.load.image('title', './assets/images/title.png');
        this.load.image('titleENTERbutton', './assets/images/titleENTERbutton.png');
        this.load.image('team7credits', './assets/images/team7credits.png');

        this.load.image('shadowBackground', './assets/images/ShadowBackground.png');
        this.load.image('heart', './assets/images/heart.png');
        this.load.image('redPlayer', './assets/images/redPlayer.png');
        this.load.image('bluePlayer', './assets/images/bluePlayer.png');
        this.load.image('invisibleRed', './assets/images/invisibleRed.png');
        this.load.image('invisibleBlue', './assets/images/invisibleBlue.png');
        this.load.image('redObstacle', './assets/images/RedObstacle.png');
        this.load.image('blueObstacle', './assets/images/BlueObstacle.png');
        this.load.image('knife', './assets/images/knife.png');
        this.load.image('corruptKnife', './assets/images/corruptknife.png');
        this.load.image('orb', './assets/images/orb.png');
        this.load.image('corruptOrb', './assets/images/corruptorb.png');
        this.load.image('corruptionParticle', './assets/images/corruptionParticle.png');
        this.load.image('essCorruptionDim', './assets/images/essCorruptionDim.png');
        this.load.image('essCorruptionGlow', './assets/images/essCorruptionGlow.png');
        this.load.image('switchCD', './assets/images/switchCD.png');
        this.load.image('redChaser', './assets/images/redChaser.png');
        this.load.image('blueChaser', './assets/images/blueChaser.png');
        this.load.image('redSlimeball', './assets/images/redSlimeball.png');
        this.load.image('blueSlimeball', './assets/images/blueSlimeball.png');
        this.load.image('stunParticle', './assets/images/stunParticle.png');
        // Load audio assets
        this.load.audio('buttonSound', './assets/sounds/buttonsound.mp3');
        this.load.audio('knifeThrow', './assets/sounds/knife.mp3');
        
        this.load.audio('knifeHitmarker', './assets/sounds/knifeHitmarker.mp3');
        // this.load.audio('knifeHitmarker', './assets/sounds/knifeHitmarker1.mp3');
        // this.load.audio('knifeHitmarker', './assets/sounds/knifeStab.wav');

        this.load.audio('orbShoot', './assets/sounds/orb.mp3');
        this.load.audio('orbHitmarker', './assets/sounds/orbHitmarker.mp3');
        this.load.audio('orbBulletBlock', './assets/sounds/orbBulletBlock.mp3');
        this.load.audio('orbEnemyBlock', './assets/sounds/orbEnemyBlock.mp3');
        this.load.audio('playerDeath', './assets/sounds/demonDeath.mp3');
        this.load.audio('playerHurt1', './assets/sounds/hurt1.mp3');
        this.load.audio('playerHurt2', './assets/sounds/hurt2.mp3');
        this.load.audio('corruptionExpire', './assets/sounds/corruptionExpire.mp3');

        //tile maps
        // this.load.path = "./assets/tilemap/";
        this.load.tilemapTiledJSON("level","./assets/tilemap/temp6.json")
        this.load.tilemapTiledJSON("arenaTilemap", "./assets/tilemap/arenaTileMap.json")
        this.load.tilemapTiledJSON("tutorialTilemap", "./assets/tilemap/linearTutorial.json")
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


        // knifeThrowSound = game.sound.add('knifeThrow', { 
        //     mute: false,
        //     volume: globalVolume,
        //     rate: 1,
        //     loop: false 
        // });

        // orbShootSound = game.sound.add('orbShoot', { 
        //     mute: false,
        //     volume: 0.5,
        //     rate: 1,
        //     loop: false 
        // });

        this.loadingText.destroy();
        this.continueText = this.add.text(screenWidth, screenHeight, 'Press         to continue', {
            fontFamily: 'Courier',
            fontSize: '30px',
            color: '#8B008B',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 10,
        }).setOrigin(1, 1);
        this.title = this.add.sprite(centerX, 20, 'title').setOrigin(0.5, 0);
        this.titleENTERbutton = this.add.sprite(screenWidth - 210, screenHeight, 'titleENTERbutton').setOrigin(1, 1).setScale(0.5, 0.5);
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

    }
    update() {
        // Go to menu scene
        if (Phaser.Input.Keyboard.JustDown(keyStart)) {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            // this.sound.play('buttonsound');
            this.time.delayedCall(1000, function () {
                this.scene.start('menuScene');
            }, null, this);
        }
    }
}