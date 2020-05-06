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
        this.load.image('player', './assets/chara1.png');
        // Load audio assets
        this.load.audio('buttonsound', './assets/buttonsound.mp3');
        
    }

    create() {
        keyStart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

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
        // if (Phaser.Input.Keyboard.JustDown(keyStart)) {
            // this.sound.play('buttonsound');
            this.scene.start('menuScene');
        // }
    }
}