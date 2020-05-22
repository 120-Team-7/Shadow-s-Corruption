class Load extends Phaser.Scene {
    constructor() {
        super('loadScene');
    }

    preload() {
        this.loadingText = this.add.text(centerX, centerY, 'LOADING...', {
            fontFamily: 'Courier',
            fontSize: '50px',
            color: '#FFFFFF',
            align: 'center',
        }).setOrigin(0.5, 0.5);
        // Load image assets
        this.load.image('redPlayer', './assets/images/redPlayer.png');
        this.load.image('bluePlayer', './assets/images/bluePlayer.png');
        this.load.image('redObstacle', './assets/images/RedObstacle.png');
        this.load.image('blueObstacle', './assets/images/BlueObstacle.png');
        this.load.image('knife', './assets/images/knife.png');
        this.load.image('corruptKnife', './assets/images/corruptknife.png');
        this.load.image('orb', './assets/images/orb.png');
        this.load.image('corruptOrb', './assets/images/corruptorb.png');
        this.load.image('corruptionParticle', './assets/images/corruptionParticle.png');
        this.load.image('redSlimeball', './assets/images/redSlimeball.png');
        this.load.image('blueSlimeball', './assets/images/blueSlimeball.png');
        // Load audio assets
        this.load.audio('buttonSound', './assets/sounds/buttonsound.mp3');
        this.load.audio('knifeThrow', './assets/sounds/knife.mp3');
        this.load.audio('orbShoot', './assets/sounds/orb.mp3');
        this.load.audio('orbBlock', './assets/sounds/orbBlock.mp3');
        this.load.audio('playerDeath', './assets/sounds/demonDeath.mp3');
        this.load.audio('playerHurt1', './assets/sounds/hurt1.mp3');
        this.load.audio('playerHurt2', './assets/sounds/hurt2.mp3');
    }

    create() {
        keyStart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        knifeThrowSound = game.sound.add('knifeThrow', { 
            mute: false,
            volume: globalVolume,
            rate: 1,
            loop: false 
        });

        orbShootSound = game.sound.add('orbShoot', { 
            mute: false,
            volume: 0.5,
            rate: 1,
            loop: false 
        });

        this.loadingText.destroy();
        this.add.text(centerX, centerY, 'Press ENTER to start', {
            fontFamily: 'Courier',
            fontSize: '50px',
            color: '#FFFFFF',
            align: 'center',
        }).setOrigin(0.5, 0.5);

    }
    update() {
        // Go to menu scene
        if (Phaser.Input.Keyboard.JustDown(keyStart)) {
            // this.sound.play('buttonsound');
            this.scene.start('menuScene');
        }
    }
}